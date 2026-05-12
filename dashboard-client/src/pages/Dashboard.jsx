import React, {
  useState,
  useEffect,
  lazy,
  Suspense
} from 'react';

import {
  getMetrics,
  getTrendAnalysis,
  getAlerts
} from '../api';

import './Dashboard.css';

const PerformanceDashboard = lazy(() =>
  import('../components/PerformanceDashboard')
);

const Dashboard = () => {
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState('production');

  const [isHeavyContentLoaded, setIsHeavyContentLoaded] = useState(false);

  useEffect(() => {
    loadData();

    setIsHeavyContentLoaded(false);

    const timer = setTimeout(() => {
      setIsHeavyContentLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [selectedEnv]);

  const loadData = async () => {
    const data = await getMetrics(selectedEnv);

    if (data && data.length > 0) {
      setLatestMetrics(data[0]);
    }

    const trendData = await getTrendAnalysis(selectedEnv);

    if (trendData) {
      setTrends(trendData);
    }

    const alertData = await getAlerts(selectedEnv);

    if (alertData && alertData.length > 0) {
      setActiveAlerts(alertData[0].alerts || []);
    }
  };

  return (
    <div className="dashboard">

      {/* FAST INITIAL CONTENT (FCP) */}
      <header
        style={{
          padding: '1rem',
          marginBottom: '1rem'
        }}
      >
        <h1>CI/CD Telemetry Hub</h1>
        <p>Real-time performance regression monitoring</p>
      </header>

      {/* SMALL LIGHTWEIGHT PLACEHOLDER */}
      {!isHeavyContentLoaded ? (
        <div
          style={{
            width: '100%',
            height: '120px',
            backgroundColor: '#e2e8f0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontWeight: 'bold'
          }}
        >
          Loading telemetry visualizations...
        </div>
      ) : (
        <>
          {/* MASSIVE DELAYED IMAGE (LCP TARGET) */}
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

          {/* HEAVY ASYNC CONTENT */}
          <Suspense
            fallback={
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center'
                }}
              >
                Loading performance dashboard...
              </div>
            }
          >
            <PerformanceDashboard environment={selectedEnv} />
          </Suspense>
        </>
      )}
    </div>
  );
};

export default Dashboard;

