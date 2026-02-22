import { models } from '../models/database.js';
import logger from '../middleware/logger.js';

/**
 * Get all products (with pagination and filters)
 */
export async function getProducts(req, res) {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search, 
      featured, 
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let products;
    let total;

    if (search) {
      const searchTerm = `%${search}%`;
      products = models.product.search.all(searchTerm, searchTerm, searchTerm);
      total = products.length;
      products = products.slice(offset, offset + parseInt(limit));
    } else if (category) {
      products = models.product.getByCategory.all(category);
      total = products.length;
      products = products.slice(offset, offset + parseInt(limit));
    } else if (featured === 'true') {
      products = models.product.getFeatured.all();
      total = products.length;
      products = products.slice(offset, offset + parseInt(limit));
    } else {
      // Get total count
      const countResult = models.db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get();
      total = countResult.count;
      
      // Get paginated products
      const stmt = models.db.prepare(`
        SELECT * FROM products 
        WHERE is_active = 1 
        ORDER BY ${sort} ${order.toUpperCase()}
        LIMIT ? OFFSET ?
      `);
      products = stmt.all(parseInt(limit), offset);
    }

    // Parse JSON fields
    products = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
      crawl_data: p.crawl_data ? JSON.parse(p.crawl_data) : null
    }));

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get product by ID
 */
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = models.product.findById.get(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Parse JSON fields
    const parsedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      crawl_data: product.crawl_data ? JSON.parse(product.crawl_data) : null
    };

    res.json({
      success: true,
      data: { product: parsedProduct }
    });
  } catch (error) {
    logger.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Create new product (admin only)
 */
export async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      price,
      original_price,
      currency,
      brand,
      images,
      external_url,
      source_site,
      sku,
      stock_status,
      rating,
      review_count,
      tags,
      is_featured,
      crawl_data
    } = req.body;

    // Validation
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required'
      });
    }

    const result = models.product.create.run(
      name,
      description || null,
      category,
      subcategory || null,
      parseFloat(price),
      original_price ? parseFloat(original_price) : null,
      currency || 'CNY',
      brand || null,
      images ? JSON.stringify(images) : '[]',
      external_url || null,
      source_site || null,
      sku || null,
      stock_status || 'in_stock',
      rating || null,
      review_count || 0,
      tags ? JSON.stringify(tags) : '[]',
      is_featured ? 1 : 0,
      crawl_data ? JSON.stringify(crawl_data) : null
    );

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'create_product',
      'product',
      result.lastInsertRowid,
      JSON.stringify({ name, category }),
      req.ip
    );

    logger.info(`Product created: ${name} by ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: { id: result.lastInsertRowid } }
    });
  } catch (error) {
    logger.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Update product (admin only)
 */
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      subcategory,
      price,
      original_price,
      brand,
      images,
      external_url,
      stock_status,
      rating,
      tags,
      is_featured,
      is_active
    } = req.body;

    // Check if product exists
    const existing = models.product.findById.get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    models.product.update.run(
      name || existing.name,
      description !== undefined ? description : existing.description,
      category || existing.category,
      subcategory !== undefined ? subcategory : existing.subcategory,
      price !== undefined ? parseFloat(price) : existing.price,
      original_price !== undefined ? parseFloat(original_price) : existing.original_price,
      brand !== undefined ? brand : existing.brand,
      images !== undefined ? JSON.stringify(images) : existing.images,
      external_url !== undefined ? external_url : existing.external_url,
      stock_status !== undefined ? stock_status : existing.stock_status,
      rating !== undefined ? rating : existing.rating,
      tags !== undefined ? JSON.stringify(tags) : existing.tags,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id
    );

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'update_product',
      'product',
      parseInt(id),
      JSON.stringify({ name }),
      req.ip
    );

    logger.info(`Product updated: ${id} by ${req.user.username}`);

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    logger.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Delete product (admin only)
 */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    // Check if product exists
    const existing = models.product.findById.get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    models.product.delete.run(id);

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'delete_product',
      'product',
      parseInt(id),
      JSON.stringify({ name: existing.name }),
      req.ip
    );

    logger.info(`Product deleted: ${id} by ${req.user.username}`);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    logger.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Toggle product active status (admin only)
 */
export async function toggleProductActive(req, res) {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const existing = models.product.findById.get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    models.product.toggleActive.run(is_active ? 1 : 0, id);

    logger.info(`Product ${is_active ? 'activated' : 'deactivated'}: ${id}`);

    res.json({
      success: true,
      message: `Product ${is_active ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    logger.error('Toggle product active error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Toggle product featured status (admin only)
 */
export async function toggleProductFeatured(req, res) {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;

    const existing = models.product.findById.get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    models.product.toggleFeatured.run(is_featured ? 1 : 0, id);

    logger.info(`Product ${is_featured ? 'featured' : 'unfeatured'}: ${id}`);

    res.json({
      success: true,
      message: `Product ${is_featured ? 'featured' : 'unfeatured'} successfully`
    });
  } catch (error) {
    logger.error('Toggle product featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
