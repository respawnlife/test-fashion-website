import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAdminLogs
} from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private (Admin only)
 */
router.get('/', getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private (Admin only)
 */
router.get('/:id', getUserById);

/**
 * @route POST /api/users
 * @desc Create new user
 * @access Private (Admin only)
 */
router.post('/', createUser);

/**
 * @route PUT /api/users/:id
 * @desc Update user
 * @access Private (Admin only)
 */
router.put('/:id', updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 * @access Private (Admin only)
 */
router.delete('/:id', deleteUser);

/**
 * @route GET /api/users/logs/admin
 * @desc Get admin activity logs
 * @access Private (Admin only)
 */
router.get('/logs/admin', getAdminLogs);

export default router;
