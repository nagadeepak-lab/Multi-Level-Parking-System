/**
 * authRoutes.js
 * 
 * API Routes for Authentication
 */

import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile
} from '../controllers/authController.js';
import { verifyToken } from '../controllers/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/me', verifyToken, getCurrentUser);
router.put('/update', verifyToken, updateUserProfile);

export default router;
