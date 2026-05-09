// src/components/Sidebar.jsx
import React from 'react'; // Removed useState, useEffect as we use Context now
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { LayoutDashboard, History, Settings, LogOut, Zap, User } from 'lucide-react';
import { useUser } from '../context/UserContext'; // Make sure this is imported

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser(); // Get the update function

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    
    // IMPORTANT: Clear the context state (memory)
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
          <li>
            <NavLink to="/settings" className="nav-link">
              <Settings size={20} /> <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* PROFILE SECTION - Bottom Left */}
      <div className="sidebar-bottom">
        <div className="sidebar-profile">
            <div className="profile-avatar">
                {/* 3. Conditionally render Image or Icon */}
                {user && user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                  />
                ) : (
                  <User size={18} />
                )}
            </div>
            <div className="profile-info">
                <h4>{user?.name || 'User'}</h4>
                <p>{user?.email || 'user@email.com'}</p>
            </div>
        </div>
        
        <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;