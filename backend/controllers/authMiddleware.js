/**
 * authMiddleware.js
 * 
 * Middleware for JWT authentication
 * Protects routes that require authentication
 */

import jwt from 'jsonwebtoken';

/**
 * Verify JWT Token
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

/**
 * Check Admin Role
 */
export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required'
    });
  }
  next();
};

/**
 * Check Operator Role
 */
export const isOperator = (req, res, next) => {
  if (req.userRole !== 'operator' && req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Operator privileges required'
    });
  }
  next();
};
