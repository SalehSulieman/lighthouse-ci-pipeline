import React, { useState, useEffect } from 'react';

import { getMetrics, getTrendAnalysis, getAlerts } from '../api'; 

import PerformanceDashboard from '../components/PerformanceDashboard'; 

import './Dashboard.css';



const Dashboard = () => {

  const [latestMetrics, setLatestMetrics] = useState(null);

  const [trends, setTrends] = useState(null);

  const [activeAlerts, setActiveAlerts] = useState([]);

  const [selectedEnv, setSelectedEnv] = useState('production');

  

  // ADDED: State to control the artificial delay

  const [isHeavyContentLoaded, setIsHeavyContentLoaded] = useState(false);



  useEffect(() => {

    loadData();



    // ADDED: Force the browser to wait 1.5 seconds before rendering the heavy stuff

    setIsHeavyContentLoaded(false);

    const timer = setTimeout(() => {

      setIsHeavyContentLoaded(true);

    }, 2500); // 2.5 seconds to ensure it triggers LCP



    return () => clearTimeout(timer);

  }, [selectedEnv]);



  const loadData = async () => {

    const data = await getMetrics(selectedEnv);

    if (data && data.length > 0) {

      setLatestMetrics(data[0]);

    } else {

      setLatestMetrics(null); 

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

    {/* HEADER */}
    <header
      className="dashboard-header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div className="header-left">
        <h1>CI/CD Telemetry Hub</h1>
        <p>
          Real-time performance regression monitoring
        </p>
      </div>
    </header>

    {/* HEAVY CONTENT SECTION */}
    <div style={{ marginTop: '1.5rem' }}>

      {!isHeavyContentLoaded ? (

        <div
          style={{
            width: '100%',
            height: '500px',
            backgroundColor: '#e2e8f0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontWeight: 'bold'
          }}
        >
          Generating telemetry visualizations...
        </div>

      ) : (

        <>
          {/* MASSIVE DELAYED IMAGE */}
          <div
            style={{
              width: '100%',
              height: '700px',
              overflow: 'hidden',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=100&w=4000&auto=format&fit=crop"
              alt="Telemetry Visualization"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* CHART */}
          <div
            className="chart-section"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow:
                '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3
              className="chart-title"
              style={{
                margin: '0 0 1.5rem 0',
                color: '#0f172a'
              }}
            >
              Performance Regression History
            </h3>

            <div style={{ flex: 1, width: '100%' }}>
              <PerformanceDashboard
                environment={selectedEnv}
              />
            </div>
          </div>
        </>

      )}
    </div>

    {/* MOVED CARDS GRID BELOW HEAVY CONTENT */}
    <div className="cards-grid">

      <div
        className="card env"
        style={{
          padding: '1.5rem',
          borderRadius: '8px'
        }}
      >
        <div className="card-title">
          Active Environment
        </div>

        <div className="card-content">
          <div className="value-left">
            {latestMetrics
              ? latestMetrics.environment.toUpperCase()
              : 'NO DATA'}
          </div>
        </div>
      </div>

      <div className="card fcp">
        <div className="card-title">
          First Contentful Paint
        </div>

        <div className="card-content">
          <div className="value-left">
            {latestMetrics
              ? formatSeconds(latestMetrics.fcp)
              : '0.00'}
            s
          </div>

          {renderTrend('fcp')}
        </div>
      </div>

      <div className="card lcp">
        <div className="card-title">
          Largest Contentful Paint
        </div>

        <div className="card-content">
          <div className="value-left">
            {latestMetrics
              ? formatSeconds(latestMetrics.lcp)
              : '0.00'}
            s
          </div>

          {renderTrend('lcp')}
        </div>
      </div>

      <div className="card tbt">
        <div className="card-title">
          Total Blocking Time
        </div>

        <div className="card-content">
          <div className="value-left">
            {latestMetrics
              ? Math.round(latestMetrics.tbt)
              : '0'}
            ms
          </div>

          {renderTrend('tbt')}
        </div>
      </div>

    </div>

  </div>
);


};

export default Dashboard;
