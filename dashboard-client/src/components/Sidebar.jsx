// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react'; // 1. Import useState and useEffect
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, LogOut, Zap, Moon, Sun } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  
  // 2. Create a state variable to track the theme
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or default to 'dark'
    return localStorage.getItem('theme') || 'dark';
  });

  // 3. Apply the theme to the body whenever 'theme' state changes
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 4. Function to toggle the state
  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    updateUser(null);
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Zap size={28} className="logo-icon" />
        <h2>Web Vitals</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" className="nav-link"> 
              <LayoutDashboard size={20} /> <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className="nav-link">
              <History size={20} /> <span>History</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* SIMPLIFIED BOTTOM SECTION */}
      <div className="sidebar-bottom">
        
        {/* Theme Toggle Button */}
        <button onClick={handleThemeToggle} className="sidebar-action-btn">
            {/* 5. Use the state to decide which icon/text to show */}
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} className="logout-btn" style={{marginTop: '10px'}}>
            <LogOut size={18} /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;