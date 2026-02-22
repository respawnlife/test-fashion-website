import { Router } from 'express';
import { login, getProfile, changePassword, logout } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * @route POST /api/auth/login
 * @desc Login and get token
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /api/auth/logout
 * @desc Logout
 * @access Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route PUT /api/auth/password
 * @desc Change password
 * @access Private
 */
router.put('/password', authenticateToken, changePassword);

export default router;
