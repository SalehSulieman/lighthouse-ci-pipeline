import React, { useState, useEffect } from 'react';
import { getMetrics, getTrendAnalysis, getAlerts } from '../api'; 
import PerformanceDashboard from '../components/PerformanceDashboard'; 
import './Dashboard.css';

const Dashboard = () => {
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  
  // ADDED: Environment State for the dropdown filter
  const [selectedEnv, setSelectedEnv] = useState('production');

  // Trigger data load whenever the environment changes
  useEffect(() => {
    loadData();
  }, [selectedEnv]);

  const loadData = async () => {
    // Pass the selected environment to all API calls
    const data = await getMetrics(selectedEnv);
    if (data && data.length > 0) {
      setLatestMetrics(data[0]);
    } else {
      setLatestMetrics(null); // Clear data if empty
    }
    
    const trendData = await getTrendAnalysis(selectedEnv);
    if (trendData) setTrends(trendData);

    const alertData = await getAlerts(selectedEnv);
    if (alertData && alertData.length > 0) {
      setActiveAlerts(alertData[0].alerts || []);
    } else {
      setActiveAlerts([]);
    }
  };

  const formatSeconds = (seconds) => {
    if (!seconds) return '0.00';
    return seconds.toFixed(2);
  };

  const getSystemStatus = () => {
    if (!latestMetrics) return { text: "No Data", icon: "⚪", color: "#64748b", bg: "#f1f5f9" };
    
    if (activeAlerts.length === 0) {
      return { text: "Excellent", icon: "🟢", color: "#15803d", bg: "#dcfce7" }; 
    } else if (activeAlerts.length === 1) {
      return { text: "Warning", icon: "🟡", color: "#b45309", bg: "#fef3c7" }; 
    } else {
      return { text: "Critical", icon: "🔴", color: "#b91c1c", bg: "#fee2e2" }; 
    }
  };

  const status = getSystemStatus();

  const renderTrend = (metricKey) => {
    if (!trends || !trends.deltas || !trends.deltas[metricKey]) return null;
    const trend = trends.deltas[metricKey];
    const isGood = trend.isImprovement;
    
    const trendStyle = {
      color: isGood ? '#4ade80' : '#f87171', 
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
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="header-left">
          <h1>CI/CD Telemetry Hub</h1>
          <p>Real-time performance regression monitoring</p>
        </div>

        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* ENVIRONMENT DROPDOWN FILTER */}
            <select 
              value={selectedEnv} 
              onChange={(e) => setSelectedEnv(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', backgroundColor: 'white', color: '#0f172a', cursor: 'pointer', outline: 'none' }}
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
            </select>

            {/* DYNAMIC STATUS BADGE */}
            <div style={{ 
              backgroundColor: status.bg, 
              color: status.color, 
              padding: '8px 16px', 
              borderRadius: '9999px', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: `1px solid ${status.color}40`
            }}>
              {status.icon} {status.text}
            </div>

            <button className="sim-btn" style={{ fontWeight: 'bold', backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }} onClick={loadData}>
                Sync Data
            </button>
        </div>
      </header>

      {/* ACTIVE ALERTS PANEL */}
      {activeAlerts.length > 0 && (
        <div style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '1rem', marginBottom: '1.5rem', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#b45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ Active Performance Alerts
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e', fontSize: '0.9rem' }}>
            {activeAlerts.map((alert, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* CARDS GRID */}
      <div className="cards-grid">
        
        {/* ENVIRONMENT CARD */}
        <div className="card env" style={{ padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div className="card-title" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Environment</div>
          <div className="card-content" style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
            <div className="value-left" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>
                {latestMetrics ? latestMetrics.environment.toUpperCase() : 'NO DATA'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '8px' }}>
                Branch: <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{latestMetrics ? latestMetrics.branch : '-'}</span>
            </div>
          </div>
        </div>

        {/* FCP CARD */}
        <div className="card fcp" style={{ padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div className="card-title" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>First Contentful Paint</div>
          <div className="card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
            <div>
              <div className="value-left" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>{latestMetrics ? formatSeconds(latestMetrics.fcp) : '0.00'}s</div>
              {renderTrend('fcp')}
            </div>
            <div className="subtext-right" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Target: &lt;1.8s</div>
          </div>
        </div>

        {/* LCP CARD */}
        <div className="card lcp" style={{ padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div className="card-title" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Largest Contentful Paint</div>
          <div className="card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
            <div>
              <div className="value-left" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>{latestMetrics ? formatSeconds(latestMetrics.lcp) : '0.00'}s</div>
              {renderTrend('lcp')}
            </div>
            <div className="subtext-right" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Target: &lt;2.5s</div>
          </div>
        </div>

        {/* TBT CARD */}
        <div className="card tbt" style={{ padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div className="card-title" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Blocking Time</div>
          <div className="card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1rem' }}>
            <div>
              <div className="value-left" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>{latestMetrics ? Math.round(latestMetrics.tbt) : '0'}ms</div>
              {renderTrend('tbt')}
            </div>
            <div className="subtext-right" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Target: &lt;200ms</div>
          </div>
        </div>

      </div>

      {/* CHART SECTION */}
      <div className="chart-section" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <h3 className="chart-title" style={{ margin: '0 0 1.5rem 0', color: '#0f172a' }}>Performance Regression History</h3>
        <div style={{ flex: 1, width: '100%' }}>
            {/* Pass the selected environment down to the chart component */}
            <PerformanceDashboard environment={selectedEnv} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
