/**
 * constants.js
 * 
 * Application-wide constants and configuration
 */

export const VEHICLE_TYPES = [
  { value: 'bike', label: '🏍️ Bike' },
  { value: 'car', label: '🚗 Car' },
  { value: 'truck', label: '🚚 Truck' }
];

export const SLOT_STATUS = {
  EMPTY: 'empty',
  OCCUPIED: 'occupied'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  OPERATOR: 'operator'
};

export const PARKING_RATES = {
  bike: 5,
  car: 10,
  truck: 20
};

export const COLORS = {
  green: '#10b981',
  red: '#ef4444',
  blue: '#3b82f6',
  yellow: '#f59e0b',
  gray: '#6b7280'
};
