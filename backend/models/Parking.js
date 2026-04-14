/**
 * Parking.js
 * MongoDB Schema to persist parking data
 * Stores vehicle entry/exit records
 */

import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema({
  // Vehicle information
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  vehicleType: {
    type: String,
    enum: ['bike', 'car', 'truck'],
    required: true
  },

  // Parking location
  floorNumber: {
    type: Number,
    required: true
  },

  slotNumber: {
    type: Number,
    required: true
  },

  // Time tracking
  entryTime: {
    type: Date,
    default: Date.now,
    required: true
  },

  exitTime: {
    type: Date,
    default: null
  },

  // Status
  status: {
    type: String,
    enum: ['parked', 'exited'],
    default: 'parked'
  },

  // Parking fee calculation
  parkingDuration: {
    type: Number, // in minutes
    default: null
  },

  parkingFee: {
    type: Number,
    default: null
  },

  // User information (if tracking which user parked vehicle)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Additional notes
  notes: {
    type: String,
    default: ''
  }

}, { timestamps: true });

/**
 * Index for faster queries
 */
parkingSchema.index({ vehicleNumber: 1, status: 1 });
parkingSchema.index({ entryTime: -1 });
parkingSchema.index({ floorNumber: 1, slotNumber: 1 });

/**
 * Calculate parking duration when exiting
 */
parkingSchema.pre('save', function(next) {
  if (this.exitTime && this.entryTime) {
    this.parkingDuration = Math.round((this.exitTime - this.entryTime) / (1000 * 60));
  }
  next();
});

const Parking = mongoose.model('Parking', parkingSchema);
export default Parking;
