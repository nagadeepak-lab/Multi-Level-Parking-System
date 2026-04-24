/**
 * Dashboard.js
 *
 * City Parking Finder Dashboard
 * Floor occupancy and parking history overview
 */

import React, { useState, useEffect } from 'react';
import { getSystemStats, getAllFloors } from '../utils/api';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, floorsRes] = await Promise.all([
          getSystemStats(),
          getAllFloors()
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }

        if (floorsRes.data.success) {
          setFloors(floorsRes.data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={48} color="var(--color-danger)" />
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>🚗 Parking Dashboard</h1>
        <p>Monitor floor occupancy and current parking status</p>
      </div>

      {/* Statistics Grid */}
      {stats && (
        <div className="stats-grid">
          <StatBox
            label="Total Slots"
            value={stats.totalSlots}
            icon="🅿️"
            color="blue"
          />
          <StatBox
            label="Occupied Slots"
            value={stats.occupiedSlots}
            icon="🚗"
            color="red"
          />
          <StatBox
            label="Available Slots"
            value={stats.emptySlots}
            icon="✅"
            color="green"
          />
          <StatBox
            label="Occupancy Rate"
            value={`${Math.round(stats.occupancyRate)}%`}
            icon="📊"
            color="yellow"
          />
        </div>
      )}

      {/* Floor Overview */}
      <div className="floors-overview">
        {floors.map((floor) => {
          const occupiedSlots = floor.slots.filter((slot) => slot.status === 'occupied');

          return (
            <Card
              key={floor.floorNumber}
              title={`Floor ${floor.floorNumber}`}
              icon="🏢"
              className="floor-card"
            >
              <div className="floor-header">
                <h3>Floor {floor.floorNumber}</h3>
                <span className="occupancy-badge">
                  {Math.round(floor.stats.occupancyRate)}% occupied
                </span>
              </div>

              <div className="floor-stats">
                <div className="stat">
                  <span className="label">Total</span>
                  <span className="value">{floor.stats.totalSlots}</span>
                </div>
                <div className="stat">
                  <span className="label">Occupied</span>
                  <span className="value occupied">{floor.stats.occupiedSlots}</span>
                </div>
                <div className="stat">
                  <span className="label">Available</span>
                  <span className="value available">{floor.stats.emptySlots}</span>
                </div>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.round(floor.stats.occupancyRate)}%` }}
                />
              </div>

              <div className="floor-vehicles">
                <div className="floor-vehicles-header">
                  <span>Active vehicles</span>
                  <span>{occupiedSlots.length} occupied</span>
                </div>
                {occupiedSlots.length === 0 ? (
                  <p className="floor-vehicles-empty">No active vehicles on this floor.</p>
                ) : (
                  <div className="floor-vehicle-list">
                    {occupiedSlots.map((slot) => (
                      <div key={`${floor.floorNumber}-${slot.slotNo}`} className="floor-vehicle-row">
                        <span className="vehicle-slot">#{slot.slotNo}</span>
                        <span className="vehicle-number">{slot.vehicleNumber}</span>
                        <span className="vehicle-entry">
                          {slot.vehicleType} • {slot.entryTime ? new Date(slot.entryTime).toLocaleTimeString() : '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* DSA Concepts Info */}
      <Card title="🧠 System Architecture" icon="💡">
        <div className="dsa-info">
          <div className="dsa-item">
            <span className="dsa-label">Floor Traversal</span>
            <span className="dsa-desc">
              The dashboard displays all floors using traversal of the parking system structure.
            </span>
          </div>
          <div className="dsa-item">
            <span className="dsa-label">History Recording</span>
            <span className="dsa-desc">
              Recent parking actions are shown as registered history records for auditing.
            </span>
          </div>
          <div className="dsa-item">
            <span className="dsa-label">Occupancy Metrics</span>
            <span className="dsa-desc">
              Real-time slot occupancy is derived from the current floor state.
            </span>
          </div>
          <div className="dsa-item">
            <span className="dsa-label">Quick Lookup</span>
            <span className="dsa-desc">
              Vehicle locations and parking history use efficient lookup and traversal logic.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
