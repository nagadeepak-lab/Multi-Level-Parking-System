/**
 * App.js
 * 
 * Main App Component
 * Routes and main structure for the parking system application
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import VehicleEntry from './pages/VehicleEntry';
import VehicleExit from './pages/VehicleExit';
import SearchVehicle from './pages/SearchVehicle';
import FloorsVisualization from './pages/FloorsVisualization';
import ParkingHistory from './pages/ParkingHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import { isAuthenticated, getUser } from './utils/auth';
import './styles/global.css';
import './styles/variables.css';

/**
 * Protected Route Component
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App() {
  const user = getUser();

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard - No auth required for demo */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/entry" element={<VehicleEntry />} />
            <Route path="/exit" element={<VehicleExit />} />
            <Route path="/search" element={<SearchVehicle />} />
            <Route path="/floors" element={<FloorsVisualization />} />
            <Route path="/history" element={<ParkingHistory />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
