/**
 * auth.js
 * 
 * Authentication utility functions
 */

/**
 * Save token to localStorage
 */
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Get token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Save user data to localStorage
 */
export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get user data from localStorage
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Logout user
 */
export const logout = () => {
  removeToken();
  localStorage.removeItem('user');
};
