/**
 * Navbar.js
 * 
 * Navigation bar component
 * Displays navigation links and user authentication status
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import '../styles/Navbar.css';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          🅿️ Parking System
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="navbar-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/entry" onClick={() => setIsMobileMenuOpen(false)}>
              Vehicle Entry
            </Link>
          </li>
          <li>
            <Link to="/exit" onClick={() => setIsMobileMenuOpen(false)}>
              Vehicle Exit
            </Link>
          </li>
          <li>
            <Link to="/floors" onClick={() => setIsMobileMenuOpen(false)}>
              Floors
            </Link>
          </li>
          <li>
            <Link to="/history" onClick={() => setIsMobileMenuOpen(false)}>
              History
            </Link>
          </li>
        </ul>

        {/* User Section */}
        <div className="navbar-user">
          {user ? (
            <>
              <span className="user-greeting">👤 {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/register" className="register-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
