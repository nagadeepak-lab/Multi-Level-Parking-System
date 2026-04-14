/**
 * StatBox.js
 * 
 * Component to display parking statistics
 */

import React from 'react';
import '../styles/StatBox.css';

const StatBox = ({ label, value, icon, color = 'blue' }) => {
  return (
    <div className={`stat-box stat-box-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatBox;
