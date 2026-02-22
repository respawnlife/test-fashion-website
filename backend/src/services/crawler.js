import axios from 'axios';
import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';
import { models } from '../models/database.js';
import logger from '../middleware/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const CRAWLER_USER_AGENT = process.env.CRAWLER_USER_AGENT || 'Mozilla/5.0 (compatible; FashionBot/1.0)';
const CRAWLER_DELAY_MS = parseInt(process.env.CRAWLER_DELAY_MS) || 2000;

// Robots.txt cache
const robotsCache = new Map();

/**
 * Get robots.txt for a site
 */
async function getRobotsUrl(baseUrl) {
  if (robotsCache.has(baseUrl)) {
    return robotsCache.get(baseUrl);
  }

  try {
    const robotsUrl = new URL('/robots.txt', baseUrl).href;
    const response = await axios.get(robotsUrl, {
      timeout: 5000,
      headers: { 'User-Agent': CRAWLER_USER_AGENT }
    });
    
    const robots = robotsParser(robotsUrl, response.data);
    robotsCache.set(baseUrl, robots);
    return robots;
  } catch (error) {
    logger.warn(`Failed to fetch robots.txt for ${baseUrl}: ${error.message}`);
    // If no robots.txt, allow all
    const robots = robotsParser(`https://${baseUrl}/robots.txt`, 'User-agent: *\nAllow: /');
    robotsCache.set(baseUrl, robots);
    return robots;
  }
}

/**
 * Check if URL is allowed by robots.txt
 */
async function isAllowed(baseUrl, path) {
  const robots = await getRobotsUrl(baseUrl);
  return robots.isAllowed(CRAWLER_USER_AGENT, path);
}

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract product data from HTML
 * This is a generic extractor - customize per site
 */
function extractProductData($, url, siteConfig) {
  const products = [];
  
  // Generic extraction - should be customized per site
  $('.product-item, .product, .item, .goods-item').each((i, elem) => {
    try {
      const $elem = $(elem);
      
      const name = $elem.find('.product-name, .product-title, .name, .title').first().text().trim();
      const priceText = $elem.find('.price, .product-price, .current-price').first().text().trim();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      
      const imageEl = $elem.find('img').first();
      let image = imageEl.attr('data-src') || imageEl.attr('src') || '';
      
      // Make absolute URL
      if (image && !image.startsWith('http')) {
        image = new URL(image, url).href;
      }
      
      const linkEl = $elem.find('a').first();
      let link = linkEl.attr('href') || '';
      
      if (link && !link.startsWith('http')) {
        link = new URL(link, url).href;
      }

      if (name && price) {
        products.push({
          name,
          price,
          image: image || null,
          external_url: link || url,
          source_site: new URL(url).hostname
        });
      }
    } catch (error) {
      logger.warn(`Error extracting product: ${error.message}`);
    }
  });

  return products;
}

/**
 * Crawl a single URL
 */
async function crawlUrl(url, taskId, siteConfig = {}) {
  try {
    const baseUrl = new URL(url).origin;
    const pathname = new URL(url).pathname;

    // Check robots.txt
    const allowed = await isAllowed(baseUrl, pathname);
    if (!allowed) {
      logger.warn(`URL blocked by robots.txt: ${url}`);
      models.crawlerLog.create.run(taskId, 'warning', `URL blocked by robots.txt: ${url}`, null);
      return [];
    }

    // Fetch page
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': CRAWLER_USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });

    const $ = cheerio.load(response.data);
    const products = extractProductData($, url, siteConfig);

    logger.info(`Extracted ${products.length} products from ${url}`);
    models.crawlerLog.create.run(taskId, 'info', `Extracted ${products.length} products from ${url}`, null);

    return products;
  } catch (error) {
    logger.error(`Crawl error for ${url}: ${error.message}`);
    models.crawlerLog.create.run(taskId, 'error', `Crawl error: ${error.message}`, url);
    return [];
  }
}

/**
 * Save products to database
 */
function saveProducts(products, taskId) {
  let saved = 0;
  let skipped = 0;

  for (const product of products) {
    try {
      // Check for duplicates by URL
      const existing = models.db.prepare(
        'SELECT id FROM products WHERE external_url = ?'
      ).get(product.external_url);

      if (existing) {
        skipped++;
        continue;
      }

      models.product.create.run(
        product.name,
        product.description || null,
        product.category || 'women',
        product.subcategory || null,
        product.price,
        product.original_price || null,
        'CNY',
        product.brand || null,
        JSON.stringify(product.images || [product.image].filter(Boolean)),
        product.external_url,
        product.source_site,
        product.sku || null,
        'in_stock',
        product.rating || null,
        product.review_count || 0,
        JSON.stringify(product.tags || []),
        0,
        JSON.stringify({
          crawled_at: new Date().toISOString(),
          task_id: taskId
        })
      );
      saved++;
    } catch (error) {
      logger.error(`Error saving product: ${error.message}`);
    }
  }

  return { saved, skipped };
}

/**
 * Run crawler task
 */
export async function runCrawlerTask(taskId) {
  const task = models.crawlerTask.findById.get(taskId);
  
  if (!task) {
    logger.error(`Crawler task not found: ${taskId}`);
    return;
  }

  // Update task status
  models.crawlerTask.updateStatus.run('running', taskId);
  models.crawlerLog.create.run(taskId, 'info', `Starting crawl task: ${task.name}`, task.url);

  try {
    const siteConfig = task.site_config ? JSON.parse(task.site_config) : {};
    const urlsToCrawl = [task.url]; // Can be expanded to multiple URLs

    let totalProducts = 0;

    for (const url of urlsToCrawl) {
      const products = await crawlUrl(url, taskId, siteConfig);
      
      if (products.length > 0) {
        const result = saveProducts(products, taskId);
        totalProducts += result.saved;
        logger.info(`Saved ${result.saved} products, skipped ${result.skipped} duplicates`);
      }

      // Delay between requests
      await delay(CRAWLER_DELAY_MS);
    }

    // Update task status
    models.crawlerTask.update.run(
      'completed',
      new Date().toISOString(),
      null,
      totalProducts,
      null,
      taskId
    );

    models.crawlerLog.create.run(taskId, 'info', `Crawl completed. Found ${totalProducts} products.`, null);
    logger.info(`Crawler task completed: ${task.name}, found ${totalProducts} products`);

  } catch (error) {
    logger.error(`Crawler task failed: ${error.message}`);
    models.crawlerTask.update.run(
      'failed',
      new Date().toISOString(),
      null,
      0,
      error.message,
      taskId
    );
    models.crawlerLog.create.run(taskId, 'error', `Task failed: ${error.message}`, null);
  }
}

/**
 * Validate URL against robots.txt (for admin UI)
 */
export async function validateRobots(url) {
  try {
    const baseUrl = new URL(url).origin;
    const pathname = new URL(url).pathname;
    const allowed = await isAllowed(baseUrl, pathname);
    
    return {
      success: true,
      allowed,
      message: allowed ? 'URL is allowed by robots.txt' : 'URL is blocked by robots.txt'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// If run directly
if (process.argv[1]?.includes('crawler.js')) {
  const taskId = process.argv[2];
  if (taskId) {
    runCrawlerTask(parseInt(taskId));
  } else {
    console.log('Usage: node crawler.js <task_id>');
  }
}

export { crawlUrl, extractProductData, saveProducts };
