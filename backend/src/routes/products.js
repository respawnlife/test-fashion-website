import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
  toggleProductFeatured
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

/**
 * @route GET /api/products
 * @desc Get all products with pagination and filters
 * @access Public (optional auth for featured tracking)
 */
router.get('/', optionalAuth, getProducts);

/**
 * @route GET /api/products/:id
 * @desc Get product by ID
 * @access Public
 */
router.get('/:id', getProductById);

/**
 * @route POST /api/products
 * @desc Create new product
 * @access Private (Admin only)
 */
router.post('/', authenticateToken, requireAdmin, createProduct);

/**
 * @route PUT /api/products/:id
 * @desc Update product
 * @access Private (Admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, updateProduct);

/**
 * @route DELETE /api/products/:id
 * @desc Delete product
 * @access Private (Admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

/**
 * @route PATCH /api/products/:id/active
 * @desc Toggle product active status
 * @access Private (Admin only)
 */
router.patch('/:id/active', authenticateToken, requireAdmin, toggleProductActive);

/**
 * @route PATCH /api/products/:id/featured
 * @desc Toggle product featured status
 * @access Private (Admin only)
 */
router.patch('/:id/featured', authenticateToken, requireAdmin, toggleProductFeatured);

export default router;
