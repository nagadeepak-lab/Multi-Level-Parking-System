/**
 * VehicleExit.js
 * 
 * Vehicle Exit Page
 * Allows users to remove a vehicle from the parking system (DELETION)
 */

import React, { useEffect, useState } from 'react';
import { getParkedVehicles, unparkVehicle } from '../utils/api';
import Card from '../components/Card';
import '../styles/VehicleExit.css';
import { AlertCircle, Clock, DollarSign } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const VehicleExit = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [parkedVehicles, setParkedVehicles] = useState([]);
  const [parkedCount, setParkedCount] = useState(0);

  const fetchParkedVehicles = async () => {
    try {
      const response = await getParkedVehicles();
      if (response.data.success) {
        setParkedVehicles(response.data.data.vehicles);
        setParkedCount(response.data.data.total);
      }
    } catch (err) {
      console.warn('Unable to fetch parked vehicles', err);
    }
  };

  useEffect(() => {
    fetchParkedVehicles();
  }, []);

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

      // DSA OPERATION: DELETION
      const response = await unparkVehicle(vehicleNumber.toUpperCase());

      if (response.data.success) {
        setResult(response.data.data);
        setVehicleNumber('');
        setShowPayment(true);
        fetchParkedVehicles();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing vehicle');
    } finally {
      setLoading(false);
    }
  };

  const parsedParkingFee = result ? Number(String(result.parkingFee).replace(/[^0-9.]/g, '')) : 0;
  const formattedParkingFee = !Number.isNaN(parsedParkingFee) ? `₹${parsedParkingFee.toFixed(2)}` : result?.parkingFee;

  return (
    <div className="vehicle-exit">
      <div className="exit-header">
        <h1>🚪 Vehicle Exit</h1>
        <p>Remove a vehicle from the parking system and calculate fees</p>
      </div>

      <div className="exit-content">
        <Card title="Currently Parked Vehicles" icon="🚗">
          <div className="parked-summary-header">
            <p>
              <strong>{parkedCount}</strong> vehicles are currently allotted in the parking lot.
            </p>
            <p>Select any vehicle below, or use the direct exit button to exit easily.</p>
          </div>

          {parkedVehicles.length > 0 ? (
            <div className="parked-list">
              {parkedVehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicleNumber}
                  className={`parked-row ${selectedVehicle === vehicle.vehicleNumber ? 'parked-row--selected' : ''}`}
                >
                  <div
                    className="parked-row-details"
                    onClick={() => {
                      setVehicleNumber(vehicle.vehicleNumber);
                      setSelectedVehicle(vehicle.vehicleNumber);
                    }}
                  >
                    <span>{vehicle.vehicleNumber}</span>
                    <span>{vehicle.vehicleType.toUpperCase()}</span>
                    <span>Floor {vehicle.floorNumber} · Slot {vehicle.slotNumber}</span>
                  </div>
                  <button
                    type="button"
                    className="exit-button"
                    onClick={() => {
                      setVehicleNumber(vehicle.vehicleNumber);
                      setSelectedVehicle(vehicle.vehicleNumber);
                      handleSubmit({ preventDefault: () => {} });
                    }}
                  >
                    Exit Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No vehicles are currently parked.</p>
          )}
        </Card>

        {/* Exit Form */}
        <Card title="Exit Processing" icon="➖">
          <form onSubmit={handleSubmit} className="exit-form">
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
              {loading ? 'Processing...' : '✓ Process Exit'}
            </button>
          </form>
        </Card>

        {/* Success Result */}
        {result && (
          <Card title="✅ Vehicle Exit Processed" icon="🎉">
            <div className="result-box success">
              <div className="result-item">
                <span className="label">Vehicle Number:</span>
                <span className="value">{result.vehicleNumber}</span>
              </div>

              <div className="result-item">
                <span className="label">Entry Time:</span>
                <span className="value">{new Date(result.entryTime).toLocaleString()}</span>
              </div>

              <div className="result-item">
                <span className="label">Exit Time:</span>
                <span className="value">{new Date(result.exitTime).toLocaleString()}</span>
              </div>

              <div className="result-item">
                <span className="label">
                  <Clock size={16} />
                  Parking Duration:
                </span>
                <span className="value duration">{result.parkingDuration}</span>
              </div>

              <div className="result-item">
                <span className="label">
                  <DollarSign size={16} />
                  Parking Fee:
                </span>
                <span className="value fee">{formattedParkingFee}</span>
              </div>

              <div className="info-message success">
                <AlertCircle size={20} />
                <span>Vehicle successfully removed using DSA deletion algorithm</span>
              </div>
            </div>
          </Card>
        )}

        {showPayment && result && (
          <Card title="💳 Payment" icon="💰">
            <div className="payment-section">
              <div className="payment-info">
                <h3>Complete Payment</h3>
                <div className="payment-details">
                  <div className="payment-item">
                    <span className="label">Vehicle</span>
                    <span className="value">{result.vehicleNumber}</span>
                  </div>
                  <div className="payment-item">
                    <span className="label">Amount</span>
                    <span className="value amount">{formattedParkingFee}</span>
                  </div>
                  <div className="payment-item">
                    <span className="label">Payment Type</span>
                    <span className="value">UPI / QR Scan</span>
                  </div>
                </div>
              </div>

              <div className="qr-section">
                <h4>Scan to Pay</h4>
                <div className="qr-container">
                  <QRCodeCanvas
                    value={`upi://pay?pa=merchant@upi&pn=ParkingSystem&am=${parsedParkingFee.toFixed(2)}&cu=INR&tn=ParkingFee_${result.vehicleNumber}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="qr-instruction">
                  Scan this QR code with any UPI app to complete payment.
                </p>
                <button
                  className="payment-done-btn"
                  type="button"
                  onClick={() => setShowPayment(false)}
                >
                  ✓ Payment Completed
                </button>
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
          <h3>Deletion Process (DSA)</h3>
          <ol>
            <li>System searches for vehicle using vehicle number</li>
            <li>Finds vehicle in quick lookup hash map</li>
            <li>Calculates parking duration</li>
            <li>Computes parking fee based on duration</li>
            <li>Marks slot as empty</li>
            <li>Removes vehicle from quick lookup</li>
            <li>Updates parking history</li>
          </ol>
          <p className="complexity">Time Complexity: O(1) - Hash map-based lookup</p>

          <h3 style={{ marginTop: 'var(--spacing-lg)' }}>Pricing Structure</h3>
          <div className="pricing-table">
            <div className="pricing-row">
              <span>🏍️ Bike</span>
              <span>₹5/hour</span>
            </div>
            <div className="pricing-row">
              <span>🚗 Car</span>
              <span>₹10/hour</span>
            </div>
            <div className="pricing-row">
              <span>🚚 Truck</span>
              <span>₹20/hour</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VehicleExit;
