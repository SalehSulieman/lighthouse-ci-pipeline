import React, { useState, useEffect } from 'react';
import { getMetrics } from '../api';
import PerformanceDashboard from '../components/PerformanceDashboard'; 
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

  const formatSeconds = (seconds) => {
    if (!seconds) return '0.00';
    return seconds.toFixed(2);
  };

  const getStatusClass = (type, value) => {
    if (!value) return '';
    if (type === 'fcp') return value <= 1.8 ? 'status-good' : value <= 3.0 ? 'status-average' : 'status-poor';
    if (type === 'lcp') return value <= 2.5 ? 'status-good' : value <= 4.0 ? 'status-average' : 'status-poor';
    if (type === 'tbt') return value <= 200 ? 'status-good' : value <= 600 ? 'status-average' : 'status-poor';
    return '';
  };

  return (
    <div className="dashboard">
      
      {/* HEADER SECTION */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard Overview</h1>
          <p>Real-time performance monitoring</p>
        </div>

        <div className="header-right">
            <button className="sim-btn" onClick={loadData}>
                Refresh Data
            </button>
        </div>
      </header>

      {/* CARDS GRID - NEW LAYOUT */}
      <div className="cards-grid">
        
        {/* ENVIRONMENT CARD */}
        <div className="card env">
          <div className="card-title">Environment</div>
          <div className="card-divider"></div>
          <div className="card-content">
            <div className="value-left">{latestMetrics ? latestMetrics.environment : '...'}</div>
            <div className="subtext-right"> {latestMetrics ? latestMetrics.branch : '-'}</div>
          </div>
        </div>

        {/* FCP CARD */}
        <div className={`card fcp ${latestMetrics ? getStatusClass('fcp', latestMetrics.fcp) : ''}`}>
          <div className="card-title">First Contentful Paint</div>
          <div className="card-divider"></div>
          <div className="card-content">
            <div className="value-left">{latestMetrics ? formatSeconds(latestMetrics.fcp) : '0.00'}</div>
            <div className="subtext-right">Seconds</div>
          </div>
        </div>

        {/* LCP CARD */}
        <div className={`card lcp ${latestMetrics ? getStatusClass('lcp', latestMetrics.lcp) : ''}`}>
          <div className="card-title">Largest Contentful Paint</div>
          <div className="card-divider"></div>
          <div className="card-content">
            <div className="value-left">{latestMetrics ? formatSeconds(latestMetrics.lcp) : '0.00'}</div>
            <div className="subtext-right">Seconds</div>
          </div>
        </div>

        {/* TBT CARD */}
        <div className={`card tbt ${latestMetrics ? getStatusClass('tbt', latestMetrics.tbt) : ''}`}>
          <div className="card-title">Total Blocking Time</div>
          <div className="card-divider"></div>
          <div className="card-content">
            <div className="value-left">{latestMetrics ? latestMetrics.tbt : '0'}</div>
            <div className="subtext-right">Milliseconds</div>
          </div>
        </div>

      </div>

      {/* CHART SECTION */}
      <div className="chart-section">
        <h3 className="chart-title">Performance History</h3>
        <div style={{ flex: 1, width: '100%' }}>
            <PerformanceDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;