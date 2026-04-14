/**
 * parkingRoutes.js
 * 
 * API Routes for Parking Operations
 * Implements DSA operations through REST endpoints
 */

import express from 'express';
import {
  parkVehicle,
  unparkVehicle,
  searchVehicle,
  getAllFloors,
  getAvailableSlots,
  getSystemStats,
  getParkedVehicles,
  getParkingHistory,
  getFloorDetails,
  getDBParkingHistory
} from '../controllers/parkingController.js';
import { verifyToken } from '../controllers/authMiddleware.js';

const router = express.Router();

/**
 * Public Routes (No Authentication Required)
 */

// INSERTION: Vehicle Entry - POST /api/parking/entry
router.post('/entry', parkVehicle);

// DELETION: Vehicle Exit - DELETE /api/parking/exit/:vehicleNumber
router.delete('/exit/:vehicleNumber', unparkVehicle);

// SEARCHING: Search Vehicle - GET /api/parking/search/:vehicleNumber
router.get('/search/:vehicleNumber', searchVehicle);

// TRAVERSAL: Get All Floors - GET /api/parking/floors
router.get('/floors', getAllFloors);

// Get Available Slots - GET /api/parking/available
router.get('/available', getAvailableSlots);

// Get System Statistics - GET /api/parking/stats
router.get('/stats', getSystemStats);

// Get Currently Parked Vehicles - GET /api/parking/parked
router.get('/parked', getParkedVehicles);

// Get Parking History - GET /api/parking/history
router.get('/history', getParkingHistory);

// Get Floor Details - GET /api/parking/floor/:floorNumber
router.get('/floor/:floorNumber', getFloorDetails);

/**
 * Protected Routes (Requires Authentication)
 */

// Get Database Parking History - GET /api/parking/db-history
router.get('/db-history', verifyToken, getDBParkingHistory);

export default router;
