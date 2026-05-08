// src/pages/Settings.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Palette, Trash2, Moon, Sun, Camera, Lock, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext'; // Import the hook
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Use global user state
  const { user, updateUser } = useUser();
  
  // Local state for form editing (copy of global user)
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, [user]);

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Handle Profile Picture
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the global context immediately
        const updatedUser = { ...user, avatar: reader.result };
        updateUser(updatedUser); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Update global context with form data
    const updatedUser = { ...user, name: formData.name, email: formData.email };
    updateUser(updatedUser);
    alert('Profile updated successfully!');
  };

  // Change Password Logic
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return alert("New passwords do not match!");
    }
    if (passwords.new.length < 6) {
      return alert("Password must be at least 6 characters.");
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);

    if (userIndex !== -1 && users[userIndex].password === passwords.current) {
      users[userIndex].password = passwords.new;
      localStorage.setItem('users', JSON.stringify(users));
      setPasswords({ current: '', new: '', confirm: '' });
      alert("Password changed successfully!");
    } else {
      alert("Current password is incorrect.");
    }
  };

  // Delete Account Logic
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users = users.filter(u => u.email !== user.email);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.removeItem('currentUser');
      updateUser(null); // Clear context
      navigate('/');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-layout">
        
        {/* LEFT COLUMN */}
        <div className="settings-main">
          
          {/* PROFILE SECTION */}
          <div className="settings-card">
            <div className="card-header">
              <User size={20} />
              <h3>Profile Information</h3>
            </div>
            
            <div className="profile-picture-section">
              <div className="avatar-wrapper" onClick={handleImageClick}>
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="profile-avatar-img" />
                ) : (
                  <div className="avatar-placeholder"><User size={40} /></div>
                )}
                <div className="avatar-overlay">
                  <Camera size={20} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
                accept="image/*"
              />
              <p className="avatar-hint">Click to change photo</p>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>
              <button type="submit" className="save-btn">Save Profile</button>
            </form>
          </div>

          {/* SECURITY SECTION */}
          <div className="settings-card">
            <div className="card-header">
              <Lock size={20} />
              <h3>Change Password</h3>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••" 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="••••••••" 
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="••••••••" 
                  />
                </div>
              </div>
              <button type="submit" className="save-btn secondary">Update Password</button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="settings-sidebar">
          
          {/* APPEARANCE */}
          <div className="settings-card small">
            <div className="card-header">
              <Palette size={20} />
              <h3>Appearance</h3>
            </div>
            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                <span className="toggle-desc">Switch between themes</span>
              </div>
              <div className="toggle-switch" onClick={handleThemeChange}>
                <div className={`toggle-knob ${theme}`}>
                  {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                </div>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="settings-card small">
            <div className="card-header">
              <Bell size={20} />
              <h3>Notifications</h3>
            </div>
            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-title">Performance Alerts</span>
                <span className="toggle-desc">Email alerts for poor metrics</span>
              </div>
              <div className={`custom-checkbox ${notifications ? 'active' : ''}`} onClick={() => setNotifications(!notifications)}>
                ✓
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="settings-card danger-zone">
            <div className="card-header">
              <AlertTriangle size={20} />
              <h3>Danger Zone</h3>
            </div>
            <p className="danger-text">Once you delete your account, there is no going back. Please be certain.</p>
            <button onClick={handleDeleteAccount} className="delete-btn">
              <Trash2 size={16} /> Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;