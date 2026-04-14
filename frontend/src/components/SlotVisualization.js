/**
 * SlotVisualization.js
 * 
 * Component to visualize parking slots by floor
 * Shows empty (green) vs occupied (red) slots
 */

import React from 'react';
import '../styles/SlotVisualization.css';

const SlotVisualization = ({ slots = [] }) => {
  if (!slots || slots.length === 0) {
    return <div className="no-slots">No slots data available</div>;
  }

  return (
    <div className="slot-visualization">
      {slots.map((slot, index) => (
        <div
          key={index}
          className={`slot slot-${slot.status}`}
          title={`Slot ${slot.slotNo} - ${slot.vehicleType} - ${slot.status}${
            slot.vehicleNumber ? ` - ${slot.vehicleNumber}` : ''
          }`}
        >
          <div className="slot-number">{slot.slotNo}</div>
          <div className="slot-status-indicator"></div>
        </div>
      ))}
    </div>
  );
};

export default SlotVisualization;
