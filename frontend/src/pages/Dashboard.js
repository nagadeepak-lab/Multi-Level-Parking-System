/**
 * Dashboard.js
 * 
 * Main Dashboard Page
 * Displays parking system statistics and overview
 */

import React, { useState, useEffect } from 'react';
import { getSystemStats, getAllFloors } from '../utils/api';
import Card from '../components/Card';
import StatBox from '../components/StatBox';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';
import { TrendingUp, AlertCircle } from 'lucide-react';

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

    // Fetch data immediately and then every 5 seconds
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
        <h1>🅿️ Parking System Dashboard</h1>
        <p>Real-time parking management and monitoring</p>
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

      {/* Floors Overview */}
      <Card title="📍 Floors Overview" icon="🏢">
        <div className="floors-overview">
          {floors.map((floor) => (
            <div key={floor.floorNumber} className="floor-card">
              <div className="floor-header">
                <h3>Floor {floor.floorNumber}</h3>
                <span className="occupancy-badge">
                  {Math.round(floor.stats.occupancyRate)}%
                </span>
              </div>

              <div className="floor-stats">
                <div className="stat">
                  <span className="label">Total:</span>
                  <span className="value">{floor.stats.totalSlots}</span>
                </div>
                <div className="stat">
                  <span className="label">Occupied:</span>
                  <span className="value occupied">{floor.stats.occupiedSlots}</span>
                </div>
                <div className="stat">
                  <span className="label">Available:</span>
                  <span className="value available">{floor.stats.emptySlots}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${floor.stats.occupancyRate}%` }}
                ></div>
              </div>

              <div className="floor-vehicles">
                <div className="floor-vehicles-header">
                  <span>Vehicle History</span>
                  <span>{floor.slots.filter((slot) => slot.status === 'occupied').length} parked</span>
                </div>
                {floor.slots.filter((slot) => slot.status === 'occupied').length === 0 ? (
                  <p className="floor-vehicles-empty">No vehicles allocated on this floor.</p>
                ) : (
                  <div className="floor-vehicle-list">
                    {floor.slots
                      .filter((slot) => slot.status === 'occupied')
                      .map((slot) => (
                        <div key={slot.slotNo} className="floor-vehicle-row">
                          <span className="vehicle-slot">Slot {slot.slotNo}</span>
                          <span className="vehicle-number">{slot.vehicleNumber}</span>
                          <span className="vehicle-entry">{slot.entryTime ? new Date(slot.entryTime).toLocaleTimeString() : '-'}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* DSA Concepts Info */}
      <Card title="🧠 DSA Concepts Demonstrated" icon="💡">
        <div className="dsa-info">
          <div className="dsa-item">
            <span className="dsa-label">Arrays:</span>
            <span className="dsa-desc">
              Each floor uses an array to store parking slots
            </span>
          </div>
          <div className="dsa-item">
            <span className="dsa-label">Tree Structure:</span>
            <span className="dsa-desc">
              Multiple floors form a hierarchical tree structure
            </span>
          </div>
          <div className="dsa-item">
            <span className="dsa-label">Insertion:</span>
            <span className="dsa-desc">
              Adding vehicles to available slots
            </span>
          </div>
          <div className="dsa-item">
            <span className="dsa-label">Deletion:</span>
            <span className="dsa-desc">
              Removing vehicles and freeing slots
            </span>
          </div>
          <div className="dsa-item">
            <span className="dsa-label">Searching:</span>
            <span className="dsa-desc">
              Finding vehicles using hash maps (O(1) complexity)
            </span>
          </div>
          <div className="dsa-item">
            <span className="dsa-label">Traversal:</span>
            <span className="dsa-desc">
              In-order traversal of floors and slots
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
