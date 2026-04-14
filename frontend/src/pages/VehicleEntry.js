/**
 * VehicleEntry.js
 * 
 * Vehicle Entry Page
 * Allows users to register a vehicle entering the parking system (INSERTION)
 */

import React, { useState } from 'react';
import { parkVehicle, getSystemStats } from '../utils/api';
import Card from '../components/Card';
import '../styles/VehicleEntry.css';
import { Check, AlertCircle } from 'lucide-react';

const VehicleEntry = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!vehicleNumber.trim()) {
      setError('Please enter a vehicle number');
      return;
    }

    try {
      setLoading(true);

      // DSA OPERATION: INSERTION
      const response = await parkVehicle(vehicleNumber.toUpperCase(), vehicleType);

      if (response.data.success) {
        setResult(response.data.data);
        setVehicleNumber('');
        setVehicleType('car');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error parking vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-entry">
      <div className="entry-header">
        <h1>🚗 Vehicle Entry</h1>
        <p>Register a vehicle entering the parking system</p>
      </div>

      <div className="entry-content">
        {/* Entry Form */}
        <Card title="Entry Registration" icon="➕">
          <form onSubmit={handleSubmit} className="entry-form">
            <div className="form-group">
              <label htmlFor="vehicleNumber">Vehicle Number *</label>
              <input
                type="text"
                id="vehicleNumber"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g., MH01AB1234"
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleType">Vehicle Type *</label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                disabled={loading}
                className="form-select"
              >
                <option value="bike">🏍️ Bike</option>
                <option value="car">🚗 Car</option>
                <option value="truck">🚚 Truck</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Processing...' : '✓ Park Vehicle'}
            </button>
          </form>
        </Card>

        {/* Success Result */}
        {result && (
          <Card title="✅ Vehicle Parked Successfully" icon="🎉">
            <div className="result-box success">
              <div className="result-item">
                <span className="label">Vehicle Number:</span>
                <span className="value">{result.vehicleNumber}</span>
              </div>

              <div className="result-item">
                <span className="label">Vehicle Type:</span>
                <span className="value">
                  {result.vehicleType === 'bike' && '🏍️'}
                  {result.vehicleType === 'car' && '🚗'}
                  {result.vehicleType === 'truck' && '🚚'}
                  {' '}{result.vehicleType.charAt(0).toUpperCase() + result.vehicleType.slice(1)}
                </span>
              </div>

              <div className="result-item">
                <span className="label">Allocated Floor:</span>
                <span className="value floor-badge">Floor {result.floorNumber}</span>
              </div>

              <div className="result-item">
                <span className="label">Slot Number:</span>
                <span className="value slot-badge">Slot {result.slotNumber}</span>
              </div>

              <div className="result-item">
                <span className="label">Entry Time:</span>
                <span className="value">{new Date(result.entryTime).toLocaleString()}</span>
              </div>

              <div className="info-message">
                <Check size={20} />
                <span>Slot successfully assigned using DSA insertion algorithm</span>
              </div>
            </div>
          </Card>
        )}

        {/* Error Alert */}
        {error && (
          <Card title="⚠️ Error" icon="❌">
            <div className="result-box error">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Information Section */}
      <Card title="ℹ️ How It Works" icon="📋">
        <div className="info-section">
          <h3>Insertion Process (DSA)</h3>
          <ol>
            <li>System traverses all floors</li>
            <li>Searches for empty slots matching vehicle type</li>
            <li>Allocates the first available slot</li>
            <li>Marks slot as occupied</li>
            <li>Records entry time</li>
            <li>Updates parking data structures</li>
          </ol>
          <p className="complexity">Time Complexity: O(f × n) where f = floors, n = slots per floor</p>
        </div>
      </Card>
    </div>
  );
};

export default VehicleEntry;
