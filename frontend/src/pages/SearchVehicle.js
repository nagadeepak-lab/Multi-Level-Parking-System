/**
 * SearchVehicle.js
 * 
 * Search Vehicle Page
 * Allows users to search for a parked vehicle (SEARCHING)
 */

import React, { useState } from 'react';
import { searchVehicle } from '../utils/api';
import Card from '../components/Card';
import '../styles/SearchVehicle.css';
import { AlertCircle, MapPin, Clock } from 'lucide-react';

const SearchVehicle = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSearched(false);

    if (!vehicleNumber.trim()) {
      setError('Please enter a vehicle number');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      // DSA OPERATION: SEARCHING (Hash Map - O(1))
      const response = await searchVehicle(vehicleNumber.toUpperCase());

      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-vehicle">
      <div className="search-header">
        <h1>🔍 Search Vehicle</h1>
        <p>Find the location of a parked vehicle in real-time</p>
      </div>

      <div className="search-content">
        {/* Search Form */}
        <Card title="Search by Vehicle Number" icon="🔎">
          <form onSubmit={handleSubmit} className="search-form">
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

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </form>
        </Card>

        {/* Search Result */}
        {result && (
          <Card title="✅ Vehicle Found" icon="📍">
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

              <div className="result-item highlight">
                <span className="label">
                  <MapPin size={18} />
                  Location:
                </span>
                <span className="value location">
                  Floor {result.floorNumber} · Slot {result.slotNumber}
                </span>
              </div>

              <div className="result-item">
                <span className="label">
                  <Clock size={18} />
                  Parked Duration:
                </span>
                <span className="value">{result.duration}m</span>
              </div>

              <div className="info-message success">
                <AlertCircle size={20} />
                <span>Found using O(1) hash map search algorithm</span>
              </div>
            </div>
          </Card>
        )}

        {/* No Result */}
        {error && searched && (
          <Card title="❌ Not Found" icon="❓">
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
          <h3>Searching Algorithm (DSA)</h3>
          <p>
            This search uses a <strong>Hash Map (Dictionary)</strong> data structure for O(1) constant-time lookup:
          </p>
          <ol>
            <li>Vehicle number is converted to uppercase</li>
            <li>System checks quick lookup hash map</li>
            <li>Returns floor and slot instantly (O(1))</li>
            <li>If vehicle not found, returns not found message</li>
          </ol>

          <div className="algo-comparison">
            <h4>Algorithm Complexity Comparison:</h4>
            <div className="comparison-row">
              <span>Linear Search (Array):</span>
              <span className="complexity-value">O(f × n)</span>
            </div>
            <div className="comparison-row optimal">
              <span>Hash Map Lookup (Used Here):</span>
              <span className="complexity-value">O(1) ✓</span>
            </div>
          </div>

          <p className="note">
            ℹ️ <strong>Hash Map:</strong> vehicleNumber → {'{'}floorNumber, slotNumber, vehicleType, entryTime{'}'}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SearchVehicle;
