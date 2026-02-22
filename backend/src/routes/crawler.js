import { Router } from 'express';
import {
  getCrawlerTasks,
  getCrawlerTaskById,
  getCrawlerLogs,
  createCrawlerTask,
  updateCrawlerTask,
  deleteCrawlerTask,
  runCrawlerTaskManual,
  checkRobots
} from '../controllers/crawlerController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * @route GET /api/crawler/robots
 * @desc Check if URL is allowed by robots.txt
 * @access Private (Admin only)
 */
router.get('/robots', authenticateToken, requireAdmin, checkRobots);

// All other routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route GET /api/crawler/tasks
 * @desc Get all crawler tasks
 * @access Private (Admin only)
 */
router.get('/tasks', getCrawlerTasks);

/**
 * @route GET /api/crawler/tasks/:id
 * @desc Get crawler task by ID
 * @access Private (Admin only)
 */
router.get('/tasks/:id', getCrawlerTaskById);

/**
 * @route GET /api/crawler/tasks/:id/logs
 * @desc Get crawler logs for a task
 * @access Private (Admin only)
 */
router.get('/tasks/:id/logs', getCrawlerLogs);

/**
 * @route POST /api/crawler/tasks
 * @desc Create new crawler task
 * @access Private (Admin only)
 */
router.post('/tasks', createCrawlerTask);

/**
 * @route PUT /api/crawler/tasks/:id
 * @desc Update crawler task
 * @access Private (Admin only)
 */
router.put('/tasks/:id', updateCrawlerTask);

/**
 * @route DELETE /api/crawler/tasks/:id
 * @desc Delete crawler task
 * @access Private (Admin only)
 */
router.delete('/tasks/:id', deleteCrawlerTask);

/**
 * @route POST /api/crawler/tasks/:id/run
 * @desc Run crawler task manually
 * @access Private (Admin only)
 */
router.post('/tasks/:id/run', runCrawlerTaskManual);

export default router;
