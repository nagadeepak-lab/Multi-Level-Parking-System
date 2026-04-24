/**
 * server.js
 * 
 * Main Backend Server File
 * Entry point for the parking system backend
 * Initializes Express.js, MongoDB connection, routes, and middleware
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import parkingRoutes from './routes/parkingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { hydrateParkingSystemFromDB } from './controllers/parkingController.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * MIDDLEWARE
 */

// CORS - Allow cross-origin requests from local development frontend
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// JSON body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * DATABASE CONNECTION
 */

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parking_system';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Connect to MongoDB and hydrate current parked vehicles
const initApp = async () => {
  await connectDB();
  await hydrateParkingSystemFromDB();
};

/**
 * ROUTES
 */

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Parking Routes
app.use('/api/parking', parkingRoutes);

// Authentication Routes
app.use('/api/auth', authRoutes);

/**
 * ERROR HANDLING
 */

// 404 - Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Error:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error : {}
  });
});

/**
 * START SERVER
 */

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Server is running on http://localhost:${PORT}`);
    console.log(`📊 Parking System API ready`);
    console.log(`🔗 CORS enabled for http://localhost:3000`);
  });
};

initApp().then(startServer).catch((error) => {
  console.error('Failed to initialize application:', error);
  process.exit(1);
});

export default app;
