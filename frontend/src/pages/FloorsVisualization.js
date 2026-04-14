/**
 * FloorsVisualization.js
 * 
 * Floors Visualization Page
 * Visual representation of all parking floors and their slots (TRAVERSAL)
 */

import React, { useState, useEffect } from 'react';
import { getAllFloors } from '../utils/api';
import Card from '../components/Card';
import SlotVisualization from '../components/SlotVisualization';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/FloorsVisualization.css';
import { AlertCircle } from 'lucide-react';

const FloorsVisualization = () => {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        setLoading(true);
        const response = await getAllFloors();

        if (response.data.success) {
          setFloors(response.data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately and every 3 seconds
    fetchFloors();
    const interval = setInterval(fetchFloors, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner message="Loading floors..." />;

  if (error) {
    return (
      <div className="error-container">
        <AlertCircle size={48} color="var(--color-danger)" />
        <h2>Error Loading Floors</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="floors-visualization">
      <div className="floors-header">
        <h1>🏢 Parking Floors Visualization</h1>
        <p>Real-time visual layout of all parking floors with slot status</p>
      </div>

      {/* Floor Cards */}
      <div className="floors-grid">
        {floors.map((floor) => (
          <Card
            key={floor.floorNumber}
            title={`Floor ${floor.floorNumber}`}
            icon={`🏭`}
            className="floor-card"
          >
            {/* Floor Statistics */}
            <div className="floor-stats-mini">
              <div className="stat-mini">
                <span className="stat-label">Total:</span>
                <span className="stat-value">{floor.stats.totalSlots}</span>
              </div>
              <div className="stat-mini">
                <span className="stat-label">Occupied:</span>
                <span className="stat-value occupied">{floor.stats.occupiedSlots}</span>
              </div>
              <div className="stat-mini">
                <span className="stat-label">Available:</span>
                <span className="stat-value available">{floor.stats.emptySlots}</span>
              </div>
              <div className="stat-mini">
                <span className="stat-label">Usage:</span>
                <span className="stat-value">{Math.round(floor.stats.occupancyRate)}%</span>
              </div>
            </div>

            {/* Slot Visualization */}
            <SlotVisualization slots={floor.slots} />

            {/* Legend */}
            <div className="legend">
              <div className="legend-item">
                <div className="legend-color green"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-color red"></div>
                <span>Occupied</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* DSA Traversal Information */}
      <Card title="ℹ️ Traversal Algorithm (DSA)" icon="🌳">
        <div className="traversal-info">
          <h3>In-order Traversal</h3>
          <p>
            The floor visualization uses <strong>in-order tree traversal</strong> to display
            all floors and their slots in a structured manner.
          </p>

          <h4>Traversal Process:</h4>
          <ol>
            <li>Visit each floor node (tree node)</li>
            <li>For each floor, traverse all slots (array elements)</li>
            <li>Display slot number, type, and status</li>
            <li>Update in real-time every 3 seconds</li>
          </ol>

          <h4>Time Complexity:</h4>
          <p className="complexity-box">O(f × n) where f = number of floors, n = slots per floor</p>

          <h4>Space Complexity:</h4>
          <p className="complexity-box">O(f × n) for storing floor and slot data</p>

          <h3 style={{ marginTop: 'var(--spacing-lg)' }}>Data Structure Visualization</h3>
          <pre className="structure-display">{`
Parking System (Root)
├─ Floor 1 (Node)
│  ├─ Slot 1 ─→ Status: Occupied/Empty
│  ├─ Slot 2 ─→ Status: Occupied/Empty
│  └─ Slot N ─→ Status: Occupied/Empty
├─ Floor 2 (Node)
│  ├─ Slot 1 ─→ Status: Occupied/Empty
│  ├─ Slot 2 ─→ Status: Occupied/Empty
│  └─ Slot N ─→ Status: Occupied/Empty
└─ Floor N (Node)
   ├─ Slot 1 ─→ Status: Occupied/Empty
   ├─ Slot 2 ─→ Status: Occupied/Empty
   └─ Slot N ─→ Status: Occupied/Empty
          `}</pre>
        </div>
      </Card>
    </div>
  );
};

export default FloorsVisualization;
