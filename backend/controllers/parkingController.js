/**
 * parkingController.js
 * 
 * Handles all parking-related API requests
 * Implements DSA operations: Insertion, Deletion, Searching, Traversal
 */

import ParkingSystem from '../models/ParkingSystemDSA.js';
import Parking from '../models/Parking.js';

// Initialize global parking system (Data Structure)
const parkingSystem = new ParkingSystem(3, 10); // 3 floors, 10 slots per floor

/**
 * INSERTION: Vehicle Entry
 * POST /api/parking/entry
 * 
 * DSA Operation: INSERTION
 * - Adds vehicle to parking system
 * - Finds nearest available slot
 * - Updates data structures
 */
export const parkVehicle = async (req, res) => {
  try {
    const { vehicleNumber, vehicleType } = req.body;

    // Validate input
    if (!vehicleNumber || !vehicleType) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle number and type are required'
      });
    }

    if (!['bike', 'car', 'truck'].includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle type. Must be bike, car, or truck'
      });
    }

    // DSA INSERTION: Add vehicle to parking system
    const result = parkingSystem.parkVehicle(vehicleNumber, vehicleType);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Save to MongoDB for persistence
    try {
      await Parking.create({
        vehicleNumber,
        vehicleType,
        floorNumber: result.data.floorNumber,
        slotNumber: result.data.slotNumber,
        entryTime: result.data.entryTime,
        status: 'parked'
      });
    } catch (dbError) {
      // If duplicate entry in DB, still return success for DSA operation
      console.log('DB entry exists:', dbError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Vehicle parked successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Error parking vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error parking vehicle',
      error: error.message
    });
  }
};

/**
 * DELETION: Vehicle Exit
 * DELETE /api/parking/exit/:vehicleNumber
 * 
 * DSA Operation: DELETION
 * - Removes vehicle from parking system
 * - Frees up the slot
 * - Calculates parking fee
 */
export const unparkVehicle = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;

    // DSA DELETION: Remove vehicle from parking system
    const result = parkingSystem.unparkVehicle(vehicleNumber);

    if (!result.success) {
      return res.status(404).json(result);
    }

    // Update MongoDB record
    try {
      await Parking.updateOne(
        { vehicleNumber, status: 'parked' },
        {
          status: 'exited',
          exitTime: result.data.exitTime,
          parkingDuration: Math.round(
            (result.data.exitTime - result.data.entryTime) / (1000 * 60)
          ),
          parkingFee: result.data.parkingFee.replace('₹', '')
        }
      );
    } catch (dbError) {
      console.log('DB update error:', dbError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle removed successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Error removing vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing vehicle',
      error: error.message
    });
  }
};

/**
 * SEARCHING: Search Vehicle by Number
 * GET /api/parking/search/:vehicleNumber
 * 
 * DSA Operation: SEARCHING (Hash Map - O(1) time complexity)
 * - Quickly finds vehicle location
 * - Returns floor and slot information
 */
export const searchVehicle = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;

    // DSA SEARCHING: Find vehicle using hash map
    const result = parkingSystem.searchVehicle(vehicleNumber);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error searching vehicle:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching vehicle',
      error: error.message
    });
  }
};

/**
 * TRAVERSAL: Get All Floors with Slots
 * GET /api/parking/floors
 * 
 * DSA Operation: TRAVERSAL (In-order Traversal of Tree)
 * - Visits each floor (tree node)
 * - Visits each slot on that floor (array elements)
 * - Returns complete parking structure
 */
export const getAllFloors = async (req, res) => {
  try {
    // DSA TRAVERSAL: Get all floors and slots
    const floorsData = parkingSystem.getAllFloors();

    res.status(200).json({
      success: true,
      data: floorsData
    });

  } catch (error) {
    console.error('Error fetching floors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching floors',
      error: error.message
    });
  }
};

/**
 * Get All Available Slots
 * GET /api/parking/available
 * 
 * Returns empty slots across all floors
 */
export const getAvailableSlots = async (req, res) => {
  try {
    const available = parkingSystem.getAvailableSlots();

    res.status(200).json({
      success: true,
      data: available
    });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};

/**
 * Get System Statistics
 * GET /api/parking/stats
 */
export const getSystemStats = async (req, res) => {
  try {
    const stats = parkingSystem.getSystemStats();

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

/**
 * Get Currently Parked Vehicles
 * GET /api/parking/parked
 */
export const getParkedVehicles = async (req, res) => {
  try {
    const parkedVehicles = Object.entries(parkingSystem.vehicleLocations).map(
      ([vehicleNumber, location]) => ({
        vehicleNumber,
        vehicleType: location.vehicleType,
        floorNumber: location.floorNumber,
        slotNumber: location.slotNumber,
        entryTime: location.entryTime,
        parkedDurationMinutes: Math.round((new Date() - location.entryTime) / (1000 * 60))
      })
    );

    res.status(200).json({
      success: true,
      data: {
        total: parkedVehicles.length,
        vehicles: parkedVehicles
      }
    });
  } catch (error) {
    console.error('Error fetching parked vehicles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching parked vehicles',
      error: error.message
    });
  }
};

/**
 * Get Parking History
 * GET /api/parking/history
 */
export const getParkingHistory = async (req, res) => {
  try {
    const { vehicleNumber, vehicleType, limit = 50 } = req.query;

    const filter = {};
    if (vehicleNumber) filter.vehicleNumber = vehicleNumber;
    if (vehicleType) filter.vehicleType = vehicleType;

    const history = parkingSystem.getParkingHistory(filter).slice(0, limit);

    res.status(200).json({
      success: true,
      data: history,
      count: history.length
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: error.message
    });
  }
};

/**
 * Get Parking by Floor
 * GET /api/parking/floor/:floorNumber
 */
export const getFloorDetails = async (req, res) => {
  try {
    const { floorNumber } = req.params;
    const floorNum = parseInt(floorNumber);

    if (floorNum < 1 || floorNum > parkingSystem.floors.length) {
      return res.status(400).json({
        success: false,
        message: `Floor number must be between 1 and ${parkingSystem.floors.length}`
      });
    }

    const floor = parkingSystem.floors[floorNum - 1];
    const slots = floor.slots.map(slot => ({
      slotNo: slot.slotNo,
      vehicleType: slot.vehicleType,
      status: slot.status,
      vehicleNumber: slot.vehicleNumber,
      entryTime: slot.entryTime
    }));

    res.status(200).json({
      success: true,
      data: {
        floorNumber: floor.floorNumber,
        slots: slots,
        stats: floor.getFloorStats()
      }
    });

  } catch (error) {
    console.error('Error fetching floor details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching floor details',
      error: error.message
    });
  }
};

/**
 * Get Parking DB History
 * GET /api/parking/db-history
 */
export const getDBParkingHistory = async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const history = await Parking.find()
      .sort({ entryTime: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Parking.countDocuments();

    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Error fetching DB history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching database history',
      error: error.message
    });
  }
};
