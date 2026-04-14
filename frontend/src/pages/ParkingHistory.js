/**
 * ParkingHistory.js
 * 
 * Parking History Page
 * Displays all vehicle parking history records
 */

import React, { useState, useEffect } from 'react';
import { getParkingHistory } from '../utils/api';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/ParkingHistory.css';
import { AlertCircle } from 'lucide-react';

const ParkingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getParkingHistory({ limit: 100 });

        if (response.data.success) {
          setHistory(response.data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <LoadingSpinner message="Loading history..." />;

  const filteredHistory = history.filter((item) =>
    filter === '' ||
    item.vehicleNumber.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="parking-history">
      <div className="history-header">
        <h1>📋 Parking History</h1>
        <p>Complete record of all vehicle parking activities</p>
      </div>

      {/* Filter */}
      <Card title="Filter Records" icon="🔎">
        <div className="filter-box">
          <input
            type="text"
            placeholder="Search by vehicle number..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
          <span className="result-count">{filteredHistory.length} record(s)</span>
        </div>
      </Card>

      {/* History Table */}
      <Card title="History Records" icon="📊">
        {error && (
          <div className="error-message">
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        )}

        {filteredHistory.length === 0 ? (
          <div className="no-records">
            <p>No parking history records found</p>
          </div>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Vehicle No.</th>
                  <th>Type</th>
                  <th>Floor</th>
                  <th>Slot</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Duration</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item, index) => (
                  <tr key={index} className={item.exitTime ? 'exited' : 'active'}>
                    <td className="vehicle-no">{item.vehicleNumber}</td>
                    <td className="vehicle-type">
                      {item.vehicleType === 'bike' && '🏍️'}
                      {item.vehicleType === 'car' && '🚗'}
                      {item.vehicleType === 'truck' && '🚚'}
                      {' '}{item.vehicleType}
                    </td>
                    <td>{item.floorNumber}</td>
                    <td>{item.slotNumber}</td>
                    <td className="time">
                      {new Date(item.entryTime).toLocaleString()}
                    </td>
                    <td className="time">
                      {item.exitTime ? new Date(item.exitTime).toLocaleString() : '-'}
                    </td>
                    <td className="duration">
                      {item.duration ? `${item.duration}m` : 'Active'}
                    </td>
                    <td className="fee">
                      {item.fee ? `₹${item.fee}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Statistics */}
      <Card title="📊 History Statistics" icon="📈">
        <div className="stats-grid-simple">
          <div className="stat-item">
            <span className="stat-title">Total Records</span>
            <span className="stat-value">{history.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Active (Parked)</span>
            <span className="stat-value">
              {history.filter((h) => !h.exitTime).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Exited (Completed)</span>
            <span className="stat-value">
              {history.filter((h) => h.exitTime).length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-title">Total Revenue</span>
            <span className="stat-value">
              ₹{history.reduce((sum, h) => sum + (h.fee || 0), 0)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ParkingHistory;
