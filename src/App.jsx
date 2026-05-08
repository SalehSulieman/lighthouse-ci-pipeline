// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Sidebar from './components/Sidebar';
import { UserProvider } from './context/UserContext'; // 1. Import the Provider
import './App.css';

// Helper component to protect the dashboard routes
const ProtectedLayout = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content" style={{ marginLeft: '260px', width: '100%' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <UserProvider> {/* 2. Wrap the Router with UserProvider */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Requires Login) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedLayout>
                <History />
              </ProtectedLayout>
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;