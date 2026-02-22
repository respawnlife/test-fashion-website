import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cron from 'node-cron';

// Import modules
import { initializeDatabase, models } from './models/database.js';
import { requestLogger, errorLogger } from './middleware/logger.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import crawlerRoutes from './routes/crawler.js';
import { runCrawlerTask } from './services/crawler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initializeDatabase();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit auth attempts
  message: {
    success: false,
    message: 'Too many login attempts, please try again later'
  }
});

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crawler', crawlerRoutes);

// Serve admin panel (built files)
const adminPath = path.join(__dirname, '../admin/dist');
app.use('/admin', express.static(adminPath));

// Admin panel fallback
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'));
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Fashion Website Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Login',
        'POST /api/auth/logout': 'Logout',
        'GET /api/auth/profile': 'Get profile',
        'PUT /api/auth/password': 'Change password'
      },
      products: {
        'GET /api/products': 'List products',
        'GET /api/products/:id': 'Get product',
        'POST /api/products': 'Create product (admin)',
        'PUT /api/products/:id': 'Update product (admin)',
        'DELETE /api/products/:id': 'Delete product (admin)',
        'PATCH /api/products/:id/active': 'Toggle active (admin)',
        'PATCH /api/products/:id/featured': 'Toggle featured (admin)'
      },
      users: {
        'GET /api/users': 'List users (admin)',
        'GET /api/users/:id': 'Get user (admin)',
        'POST /api/users': 'Create user (admin)',
        'PUT /api/users/:id': 'Update user (admin)',
        'DELETE /api/users/:id': 'Delete user (admin)',
        'GET /api/users/logs/admin': 'Get admin logs (admin)'
      },
      crawler: {
        'GET /api/crawler/tasks': 'List crawler tasks (admin)',
        'GET /api/crawler/tasks/:id': 'Get task (admin)',
        'GET /api/crawler/tasks/:id/logs': 'Get task logs (admin)',
        'POST /api/crawler/tasks': 'Create task (admin)',
        'PUT /api/crawler/tasks/:id': 'Update task (admin)',
        'DELETE /api/crawler/tasks/:id': 'Delete task (admin)',
        'POST /api/crawler/tasks/:id/run': 'Run task (admin)',
        'GET /api/crawler/robots': 'Check robots.txt (admin)'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use(errorLogger);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Scheduled crawler tasks
cron.schedule('*/30 * * * *', async () => {
  // Run every 30 minutes
  try {
    const scheduledTasks = models.crawlerTask.getScheduled.all();
    const now = new Date();
    
    for (const task of scheduledTasks) {
      if (task.next_run && new Date(task.next_run) <= now) {
        console.log(`Running scheduled task: ${task.name}`);
        runCrawlerTask(task.id);
        
        // Update next run time (simple implementation)
        const nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next day
        models.db.prepare(`
          UPDATE crawler_tasks SET next_run = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(nextRun.toISOString(), task.id);
      }
    }
  } catch (error) {
    console.error('Scheduled task error:', error);
  }
});

// Clean old logs weekly
cron.schedule('0 0 * * 0', () => {
  try {
    models.crawlerLog.deleteOld.run();
    console.log('Cleaned old crawler logs');
  } catch (error) {
    console.error('Log cleanup error:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║         Fashion Website Backend Server                 ║
╠════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}              ║
║  Admin panel: http://localhost:${PORT}/admin              ║
║  API docs: http://localhost:${PORT}/api                   ║
║  Environment: ${process.env.NODE_ENV || 'development'}                          ║
╚════════════════════════════════════════════════════════╝
  `);
});

export default app;
