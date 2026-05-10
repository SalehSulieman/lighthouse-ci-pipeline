import React, { useState, useEffect } from 'react';
import { getMetrics, getTrendAnalysis } from '../api'; // ADDED: getTrendAnalysis
import PerformanceDashboard from '../components/PerformanceDashboard'; 
import './Dashboard.css';

const Dashboard = () => {
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [trends, setTrends] = useState(null); // ADDED: State to hold our delta calculations

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // 1. Fetch standard metrics
    const data = await getMetrics();
    if (data && data.length > 0) {
      setLatestMetrics(data[0]);
    }
    // 2. Fetch the advanced trend analysis
    const trendData = await getTrendAnalysis();
    if (trendData) {
      setTrends(trendData);
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

  // --- ENTERPRISE UPGRADE: Delta Visualizer ---
  const renderTrend = (metricKey) => {
    if (!trends || !trends.deltas || !trends.deltas[metricKey]) return null;
    
    const trend = trends.deltas[metricKey];
    const isGood = trend.isImprovement; // Decrease in time = Faster = Good
    
    // Inline styling for immediate visual impact without needing new CSS classes
    const trendStyle = {
      color: isGood ? '#10b981' : '#ef4444', // Emerald Green vs Red
      fontSize: '0.9rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      marginTop: '4px'
    };

    return (
      <div style={trendStyle} title="Change since previous commit">
        {isGood ? '▼' : '▲'} {Math.abs(trend.percent)}%
      </div>
    );
  };

  return (
    <div className="dashboard">
      
      {/* HEADER SECTION */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>CI/CD Telemetry Hub</h1>
          <p>Real-time performance regression monitoring</p>
        </div>

        <div className="header-right">
            <button className="sim-btn" style={{ fontWeight: 'bold', backgroundColor: '#2563eb', color: 'white' }} onClick={loadData}>
                Sync Latest Pipeline Data
            </button>
        </div>
      </header>

      {/* CARDS GRID - UPGRADED WITH TREND DATA */}
      <div className="cards-grid">
        
        {/* ENVIRONMENT CARD */}
        <div className="card env" style={{ borderLeft: '4px solid #64748b' }}>
          <div className="card-title">Active Environment</div>
          <div className="card-divider"></div>
          <div className="card-content" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="value-left" style={{ fontSize: '1.2rem' }}>
                {latestMetrics ? latestMetrics.environment.toUpperCase() : '...'}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                Branch: {latestMetrics ? latestMetrics.branch : '-'}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
                Commit: {latestMetrics ? latestMetrics.commit_hash.substring(0, 7) : '-'}
            </div>
          </div>
        </div>

        {/* FCP CARD */}
        <div className={`card fcp ${latestMetrics ? getStatusClass('fcp', latestMetrics.fcp) : ''}`}>
          <div className="card-title">First Contentful Paint</div>
          <div className="card-divider"></div>
          <div className="card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="value-left">{latestMetrics ? formatSeconds(latestMetrics.fcp) : '0.00'}s</div>
              {renderTrend('fcp')}
            </div>
            <div className="subtext-right" style={{ opacity: 0.7 }}>Target: &lt;1.8s</div>
          </div>
        </div>

        {/* LCP CARD */}
        <div className={`card lcp ${latestMetrics ? getStatusClass('lcp', latestMetrics.lcp) : ''}`}>
          <div className="card-title">Largest Contentful Paint</div>
          <div className="card-divider"></div>
          <div className="card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="value-left">{latestMetrics ? formatSeconds(latestMetrics.lcp) : '0.00'}s</div>
              {renderTrend('lcp')}
            </div>
            <div className="subtext-right" style={{ opacity: 0.7 }}>Target: &lt;2.5s</div>
          </div>
        </div>

        {/* TBT CARD */}
        <div className={`card tbt ${latestMetrics ? getStatusClass('tbt', latestMetrics.tbt) : ''}`}>
          <div className="card-title">Total Blocking Time</div>
          <div className="card-divider"></div>
          <div className="card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="value-left">{latestMetrics ? latestMetrics.tbt : '0'}ms</div>
              {renderTrend('tbt')}
            </div>
            <div className="subtext-right" style={{ opacity: 0.7 }}>Target: &lt;200ms</div>
          </div>
        </div>

      </div>

      {/* CHART SECTION */}
      <div className="chart-section" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h3 className="chart-title" style={{ marginBottom: '1rem', color: '#1e293b' }}>Performance Regression History</h3>
        <div style={{ flex: 1, width: '100%' }}>
            <PerformanceDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
