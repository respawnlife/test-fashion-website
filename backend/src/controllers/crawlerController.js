import { models } from '../models/database.js';
import { runCrawlerTask, validateRobots } from '../services/crawler.js';
import logger from '../middleware/logger.js';

/**
 * Get all crawler tasks
 */
export async function getCrawlerTasks(req, res) {
  try {
    const tasks = models.crawlerTask.getAll.all();
    
    const parsedTasks = tasks.map(t => ({
      ...t,
      site_config: t.site_config ? JSON.parse(t.site_config) : null
    }));

    res.json({
      success: true,
      data: { tasks: parsedTasks }
    });
  } catch (error) {
    logger.error('Get crawler tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get crawler task by ID
 */
export async function getCrawlerTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = models.crawlerTask.findById.get(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const parsedTask = {
      ...task,
      site_config: task.site_config ? JSON.parse(task.site_config) : null
    };

    res.json({
      success: true,
      data: { task: parsedTask }
    });
  } catch (error) {
    logger.error('Get crawler task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get crawler logs for a task
 */
export async function getCrawlerLogs(req, res) {
  try {
    const { id } = req.params;
    const logs = models.crawlerLog.getByTaskId.all(id);

    res.json({
      success: true,
      data: { logs }
    });
  } catch (error) {
    logger.error('Get crawler logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Create new crawler task
 */
export async function createCrawlerTask(req, res) {
  try {
    const { name, url, site_config, schedule } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        message: 'Name and URL are required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Check robots.txt compliance
    const robotsCheck = await validateRobots(url);
    
    const result = models.crawlerTask.create.run(
      name,
      url,
      site_config ? JSON.stringify(site_config) : null,
      schedule || null
    );

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'create_crawler_task',
      'crawler_task',
      result.lastInsertRowid,
      JSON.stringify({ name, url, robotsCheck }),
      req.ip
    );

    logger.info(`Crawler task created: ${name} by ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Crawler task created successfully',
      data: { 
        task: { id: result.lastInsertRowid },
        robotsCheck
      }
    });
  } catch (error) {
    logger.error('Create crawler task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Update crawler task
 */
export async function updateCrawlerTask(req, res) {
  try {
    const { id } = req.params;
    const { name, url, site_config, schedule, status } = req.body;

    const existing = models.crawlerTask.findById.get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const stmt = models.db.prepare(`
      UPDATE crawler_tasks SET 
        name = ?, 
        url = ?, 
        site_config = ?, 
        schedule = ?, 
        status = ?,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    stmt.run(
      name || existing.name,
      url || existing.url,
      site_config !== undefined ? JSON.stringify(site_config) : existing.site_config,
      schedule !== undefined ? schedule : existing.schedule,
      status !== undefined ? status : existing.status,
      id
    );

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'update_crawler_task',
      'crawler_task',
      parseInt(id),
      JSON.stringify({ name }),
      req.ip
    );

    logger.info(`Crawler task updated: ${id} by ${req.user.username}`);

    res.json({
      success: true,
      message: 'Crawler task updated successfully'
    });
  } catch (error) {
    logger.error('Update crawler task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Delete crawler task
 */
export async function deleteCrawlerTask(req, res) {
  try {
    const { id } = req.params;

    const existing = models.crawlerTask.findById.get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    models.crawlerTask.delete.run(id);

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'delete_crawler_task',
      'crawler_task',
      parseInt(id),
      JSON.stringify({ name: existing.name }),
      req.ip
    );

    logger.info(`Crawler task deleted: ${id} by ${req.user.username}`);

    res.json({
      success: true,
      message: 'Crawler task deleted successfully'
    });
  } catch (error) {
    logger.error('Delete crawler task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Run crawler task manually
 */
export async function runCrawlerTaskManual(req, res) {
  try {
    const { id } = req.params;

    const task = models.crawlerTask.findById.get(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Run task in background
    runCrawlerTask(parseInt(id));

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'run_crawler_task',
      'crawler_task',
      parseInt(id),
      JSON.stringify({ name: task.name }),
      req.ip
    );

    logger.info(`Crawler task started manually: ${id} by ${req.user.username}`);

    res.json({
      success: true,
      message: 'Crawler task started'
    });
  } catch (error) {
    logger.error('Run crawler task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Validate URL against robots.txt
 */
export async function checkRobots(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    const result = await validateRobots(url);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Check robots error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
