/**
 * api.js
 * 
 * Axios API client for making HTTP requests to the backend
 * Handles authentication and API configuration
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * PARKING API CALLS
 */

// Vehicle Entry - INSERTION
export const parkVehicle = (vehicleNumber, vehicleType) =>
  api.post('/parking/entry', { vehicleNumber, vehicleType });

// Vehicle Exit - DELETION
export const unparkVehicle = (vehicleNumber) =>
  api.delete(`/parking/exit/${vehicleNumber}`);

// Search Vehicle - SEARCHING
export const searchVehicle = (vehicleNumber) =>
  api.get(`/parking/search/${vehicleNumber}`);

// Get All Floors - TRAVERSAL
export const getAllFloors = () =>
  api.get('/parking/floors');

// Get Available Slots
export const getAvailableSlots = () =>
  api.get('/parking/available');

// Get System Statistics
export const getSystemStats = () =>
  api.get('/parking/stats');

// Get Parking History
export const getParkingHistory = (params) =>
  api.get('/parking/history', { params });

// Get Currently Parked Vehicles
export const getParkedVehicles = () =>
  api.get('/parking/parked');

// Get Floor Details
export const getFloorDetails = (floorNumber) =>
  api.get(`/parking/floor/${floorNumber}`);

// Get Database History
export const getDBParkingHistory = (limit, offset) =>
  api.get('/parking/db-history', { params: { limit, offset } });

/**
 * AUTHENTICATION API CALLS
 */

// Register User
export const registerUser = (email, password, name) =>
  api.post('/auth/register', { email, password, name });

// Login User
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

// Get Current User
export const getCurrentUser = () =>
  api.get('/auth/me');

// Update User Profile
export const updateUserProfile = (data) =>
  api.put('/auth/update', data);

export default api;
