// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getMetrics, simulateTest } from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const [latestMetrics, setLatestMetrics] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getMetrics();
    if (data && data.length > 0) {
      setLatestMetrics(data[0]);
    }
  };

  const handleSimulate = async () => {
    await simulateTest();
    loadData();
  };

  // Helper to format time
  const formatSeconds = (seconds) => {
    if (!seconds) return '0.00';
    return seconds.toFixed(2);
  };

  // Logic to decide if the score is Good, Average, or Poor
  const getStatusClass = (type, value) => {
    if (!value) return '';
    
    if (type === 'fcp') {
      if (value <= 1.8) return 'status-good';
      if (value <= 3.0) return 'status-average';
      return 'status-poor';
    }
    if (type === 'lcp') {
      if (value <= 2.5) return 'status-good';
      if (value <= 4.0) return 'status-average';
      return 'status-poor';
    }
    if (type === 'tbt') {
      if (value <= 200) return 'status-good';
      if (value <= 600) return 'status-average';
      return 'status-poor';
    }
    return '';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Performance Overview</h1>
          <p>Real-time metrics from Lighthouse CI</p>
        </div>
        <button className="sim-btn" onClick={handleSimulate}>
          Run Simulation
        </button>
      </header>

      <div className="cards-grid">
        {/* Environment Card */}
        <div className="card env">
          <h3>Environment</h3>
          <div className="value env">
            {latestMetrics ? latestMetrics.environment : '...'}
          </div>
          <span className="unit">Branch: {latestMetrics ? latestMetrics.branch : '-'}</span>
        </div>

        {/* FCP Card - Dynamic Color */}
        <div className={`card fcp ${latestMetrics ? getStatusClass('fcp', latestMetrics.fcp) : ''}`}>
          <h3>First Contentful Paint</h3>
          <div className="value">
            {latestMetrics ? formatSeconds(latestMetrics.fcp) : '0.00'}
          </div>
          <span className="unit">Seconds</span>
        </div>

        {/* LCP Card - Dynamic Color */}
        <div className={`card lcp ${latestMetrics ? getStatusClass('lcp', latestMetrics.lcp) : ''}`}>
          <h3>Largest Contentful Paint</h3>
          <div className="value">
            {latestMetrics ? formatSeconds(latestMetrics.lcp) : '0.00'}
          </div>
          <span className="unit">Seconds</span>
        </div>

        {/* TBT Card - Dynamic Color */}
        <div className={`card tbt ${latestMetrics ? getStatusClass('tbt', latestMetrics.tbt) : ''}`}>
          <h3>Total Blocking Time</h3>
          <div className="value">
            {latestMetrics ? latestMetrics.tbt : '0'}
          </div>
          <span className="unit">Milliseconds</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;