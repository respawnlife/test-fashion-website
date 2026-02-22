import bcrypt from 'bcryptjs';
import { models } from '../models/database.js';
import logger from '../middleware/logger.js';

/**
 * Get all users (admin only)
 */
export async function getAllUsers(req, res) {
  try {
    const users = models.user.getAll.all();

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get user by ID (admin only)
 */
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = models.user.findById.get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Create new user (admin only)
 */
export async function createUser(req, res) {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check if username exists
    const existing = models.user.findByUsername.get(username);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = models.user.create.run(
      username,
      passwordHash,
      email || null,
      role || 'user'
    );

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'create_user',
      'user',
      result.lastInsertRowid,
      JSON.stringify({ username, role }),
      req.ip
    );

    logger.info(`User created: ${username} by ${req.user.username}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: { id: result.lastInsertRowid } }
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Update user (admin only)
 */
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, role, is_active } = req.body;

    const existing = models.user.findById.get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    models.user.update.run(
      email !== undefined ? email : existing.email,
      role !== undefined ? role : existing.role,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id
    );

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'update_user',
      'user',
      parseInt(id),
      JSON.stringify({ email, role, is_active }),
      req.ip
    );

    logger.info(`User updated: ${id} by ${req.user.username}`);

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Delete user (admin only)
 */
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const existing = models.user.findById.get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    models.user.delete.run(id);

    // Log activity
    models.adminLog.create.run(
      req.user.id,
      'delete_user',
      'user',
      parseInt(id),
      JSON.stringify({ username: existing.username }),
      req.ip
    );

    logger.info(`User deleted: ${id} by ${req.user.username}`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get admin logs (admin only)
 */
export async function getAdminLogs(req, res) {
  try {
    const logs = models.adminLog.getAll.all();

    res.json({
      success: true,
      data: { logs }
    });
  } catch (error) {
    logger.error('Get admin logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
