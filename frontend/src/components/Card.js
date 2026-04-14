/**
 * Card.js
 * 
 * Reusable Card component
 */

import React from 'react';
import '../styles/Card.css';

const Card = ({ title, children, className = '', icon = null }) => {
  return (
    <div className={`card ${className}`}>
      {(title || icon) && (
        <div className="card-header">
          {icon && <span className="card-icon">{icon}</span>}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;
