import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { LayoutDashboard, History, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Web Vitals</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard"> <LayoutDashboard size={20} /> Dashboard </Link>
          </li>
          <li>
            <Link to="/history"> <History size={20} /> History </Link>
          </li>
          <li>
            <Link to="/settings"> <Settings size={20} /> Settings </Link>
          </li>
        </ul>
      </nav>
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;