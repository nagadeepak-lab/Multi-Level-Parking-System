/**
 * VehicleEntry.js
 * 
 * Vehicle Entry Page
 * Allows users to register a vehicle entering the parking system (INSERTION)
 */

import React, { useState, useEffect } from 'react';
import { parkVehicle, getAvailableSlots, getParkedVehicles } from '../utils/api';
import Card from '../components/Card';
import '../styles/VehicleEntry.css';
import { Check, AlertCircle } from 'lucide-react';

const VehicleEntry = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableFloors, setAvailableFloors] = useState([]);
  const [parkedVehicles, setParkedVehicles] = useState([]);
  const [parkedCount, setParkedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchAvailableSlots = async () => {
    try {
      const response = await getAvailableSlots();
      if (response.data.success) {
        setAvailableFloors(response.data.data);
      }
    } catch (err) {
      console.error('Unable to load available slots:', err);
    }
  };

  const fetchParkedVehicles = async () => {
    try {
      const response = await getParkedVehicles();
      if (response.data.success) {
        setParkedVehicles(response.data.data.vehicles);
        setParkedCount(response.data.data.total);
      }
    } catch (err) {
      console.error('Unable to load parked vehicles:', err);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
    fetchParkedVehicles();
  }, []);

  useEffect(() => {
    if (!selectedFloor) {
      setSelectedSlot('');
      return;
    }

    const selectedFloorData = availableFloors.find(
      (floor) => floor.floorNumber.toString() === selectedFloor
    );

    if (
      selectedSlot &&
      selectedFloorData &&
      !selectedFloorData.availableSlots.some((slot) => slot.slotNo.toString() === selectedSlot)
    ) {
      setSelectedSlot('');
    }
  }, [selectedFloor, availableFloors, selectedSlot]);

  const selectedFloorData = availableFloors.find(
    (floor) => floor.floorNumber.toString() === selectedFloor
  );

  const selectedSlotData = selectedFloorData?.availableSlots.find(
    (slot) => slot.slotNo.toString() === selectedSlot
  );

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
      const response = await parkVehicle(
        vehicleNumber.toUpperCase(),
        vehicleType,
        selectedFloor ? Number(selectedFloor) : null,
        selectedSlot ? Number(selectedSlot) : null
      );

      if (response.data.success) {
        setResult(response.data.data);
        setVehicleNumber('');
        setVehicleType('car');
        setSelectedFloor('');
        setSelectedSlot('');
        await fetchAvailableSlots();
        await fetchParkedVehicles();
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

            <div className="form-group">
              <label htmlFor="preferredFloor">Preferred Floor</label>
              <select
                id="preferredFloor"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                disabled={loading || availableFloors.length === 0}
                className="form-select"
              >
                <option value="">Auto select floor</option>
                {availableFloors.map((floor) => (
                  <option key={floor.floorNumber} value={floor.floorNumber}>
                    Floor {floor.floorNumber} ({floor.availableSlots.length} available)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preferredSlot">Preferred Slot</label>
              <select
                id="preferredSlot"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                disabled={loading || !selectedFloor}
                className="form-select"
              >
                <option value="">Auto select slot</option>
                {selectedFloorData?.availableSlots.map((slot) => (
                  <option
                    key={slot.slotNo}
                    value={slot.slotNo}
                    disabled={slot.vehicleType !== vehicleType}
                  >
                    Slot {slot.slotNo} ({slot.vehicleType})
                  </option>
                ))}
              </select>
              {selectedFloorData?.availableSlots.length === 0 && (
                <small className="hint-text">
                  No available slots on this floor. Choose auto allocation or another floor.
                </small>
              )}
              {selectedSlotData && selectedSlotData.vehicleType !== vehicleType && (
                <small className="hint-text">
                  Selected slot is reserved for {selectedSlotData.vehicleType}. Change vehicle type or pick another slot.
                </small>
              )}
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

        {/* Currently Allotted Vehicles */}
        <Card title="🚗 Currently Allotted Vehicles" icon="📋">
          <div className="parked-summary-header">
            <p>
              <strong>{parkedCount}</strong> vehicles are currently allotted in the parking system.
            </p>
            <p>Select any vehicle to view floor and slot details while entering a new vehicle.</p>
          </div>
          {parkedVehicles.length > 0 ? (
            <div className="parked-list">
              {parkedVehicles.map((vehicle) => (
                <div key={vehicle.vehicleNumber} className="parked-row">
                  <span>{vehicle.vehicleNumber}</span>
                  <span>{vehicle.vehicleType.toUpperCase()}</span>
                  <span>Floor {vehicle.floorNumber} · Slot {vehicle.slotNumber}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No vehicles are currently allocated.</p>
          )}
        </Card>

        {/* Error Alert */}
        {error && (
          <Card title="⚠️ Error" icon="❌">
            <div className="result-box error">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
          </Card>
        )}

        {/* Available Slots */}
        <Card title="📌 Available Slots" icon="🚗">
          {availableFloors.length === 0 ? (
            <p className="no-data">Loading available slots...</p>
          ) : (
            <div className="available-slots-grid">
              {availableFloors.map((floor) => (
                <div key={floor.floorNumber} className="floor-availability-card">
                  <div className="floor-availability-header">
                    <h3>Floor {floor.floorNumber}</h3>
                    <span>{floor.availableSlots.length} open</span>
                  </div>
                  <div className="slot-list">
                    {floor.availableSlots.length === 0 ? (
                      <span className="slot-empty">No available slots</span>
                    ) : (
                      floor.availableSlots.map((slot) => (
                        <span key={slot.slotNo} className={`slot-chip ${slot.vehicleType}`}>
                          {slot.slotNo} • {slot.vehicleType}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
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
