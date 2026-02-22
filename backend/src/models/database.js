import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/fashion.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables immediately on module load
function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'user',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      subcategory TEXT,
      price REAL NOT NULL,
      original_price REAL,
      currency TEXT DEFAULT 'CNY',
      brand TEXT,
      images TEXT,
      external_url TEXT,
      source_site TEXT,
      sku TEXT,
      stock_status TEXT DEFAULT 'in_stock',
      rating REAL,
      review_count INTEGER DEFAULT 0,
      tags TEXT,
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      crawl_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crawler tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS crawler_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      site_config TEXT,
      status TEXT DEFAULT 'pending',
      schedule TEXT,
      last_run DATETIME,
      next_run DATETIME,
      products_found INTEGER DEFAULT 0,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crawler logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS crawler_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      level TEXT DEFAULT 'info',
      message TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES crawler_tasks(id)
    )
  `);

  // Admin activity logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id INTEGER,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create indexes
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_crawler_tasks_status ON crawler_tasks(status)`);

  console.log('Database initialized successfully');
}

// Initialize database immediately on module load
initializeDatabase();

// Helper functions
const models = {
  db,
  
  // User operations
  user: {
    create: db.prepare(`
      INSERT INTO users (username, password_hash, email, role) 
      VALUES (?, ?, ?, ?)
    `),
    findByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
    findById: db.prepare('SELECT id, username, email, role, is_active, created_at FROM users WHERE id = ?'),
    update: db.prepare(`
      UPDATE users SET email = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `),
    delete: db.prepare('DELETE FROM users WHERE id = ?'),
    getAll: db.prepare('SELECT id, username, email, role, is_active, created_at FROM users ORDER BY created_at DESC')
  },

  // Product operations
  product: {
    create: db.prepare(`
      INSERT INTO products (name, description, category, subcategory, price, original_price, 
        currency, brand, images, external_url, source_site, sku, stock_status, 
        rating, review_count, tags, is_featured, crawl_data) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    findById: db.prepare('SELECT * FROM products WHERE id = ?'),
    update: db.prepare(`
      UPDATE products SET name = ?, description = ?, category = ?, subcategory = ?, 
        price = ?, original_price = ?, brand = ?, images = ?, external_url = ?, 
        stock_status = ?, rating = ?, tags = ?, is_featured = ?, is_active = ?, 
        updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `),
    delete: db.prepare('DELETE FROM products WHERE id = ?'),
    getAll: db.prepare(`
      SELECT * FROM products ORDER BY created_at DESC
    `),
    getByCategory: db.prepare(`
      SELECT * FROM products WHERE category = ? AND is_active = 1 ORDER BY created_at DESC
    `),
    search: db.prepare(`
      SELECT * FROM products 
      WHERE (name LIKE ? OR description LIKE ? OR tags LIKE ?) AND is_active = 1
      ORDER BY created_at DESC
    `),
    getFeatured: db.prepare(`
      SELECT * FROM products WHERE is_featured = 1 AND is_active = 1 ORDER BY created_at DESC LIMIT 20
    `),
    toggleActive: db.prepare(`
      UPDATE products SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `),
    toggleFeatured: db.prepare(`
      UPDATE products SET is_featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `)
  },

  // Crawler task operations
  crawlerTask: {
    create: db.prepare(`
      INSERT INTO crawler_tasks (name, url, site_config, schedule) 
      VALUES (?, ?, ?, ?)
    `),
    findById: db.prepare('SELECT * FROM crawler_tasks WHERE id = ?'),
    update: db.prepare(`
      UPDATE crawler_tasks SET status = ?, last_run = ?, next_run = ?, 
        products_found = ?, error_message = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `),
    updateStatus: db.prepare(`
      UPDATE crawler_tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `),
    delete: db.prepare('DELETE FROM crawler_tasks WHERE id = ?'),
    getAll: db.prepare('SELECT * FROM crawler_tasks ORDER BY created_at DESC'),
    getPending: db.prepare(`
      SELECT * FROM crawler_tasks WHERE status = 'pending' OR status = 'running' 
      ORDER BY created_at ASC
    `),
    getScheduled: db.prepare(`
      SELECT * FROM crawler_tasks WHERE schedule IS NOT NULL AND status = 'active' 
      ORDER BY next_run ASC
    `)
  },

  // Crawler log operations
  crawlerLog: {
    create: db.prepare(`
      INSERT INTO crawler_logs (task_id, level, message, details) 
      VALUES (?, ?, ?, ?)
    `),
    getByTaskId: db.prepare(`
      SELECT * FROM crawler_logs WHERE task_id = ? ORDER BY created_at DESC LIMIT 100
    `),
    deleteOld: db.prepare(`
      DELETE FROM crawler_logs WHERE created_at < datetime('now', '-30 days')
    `)
  },

  // Admin log operations
  adminLog: {
    create: db.prepare(`
      INSERT INTO admin_logs (user_id, action, entity_type, entity_id, details, ip_address) 
      VALUES (?, ?, ?, ?, ?, ?)
    `),
    getAll: db.prepare(`
      SELECT al.*, u.username 
      FROM admin_logs al 
      LEFT JOIN users u ON al.user_id = u.id 
      ORDER BY al.created_at DESC LIMIT 100
    `)
  }
};

export { db, models, initializeDatabase };
