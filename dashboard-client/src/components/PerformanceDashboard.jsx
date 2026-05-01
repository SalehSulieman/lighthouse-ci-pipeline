import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Mahmoud's API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('https://performance-api-1.onrender.com/metrics');
        const data = await response.json();
        setMetrics(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching metrics:", error);
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div>Loading performance data...</div>;
  if (!metrics.length) return <div>No data available yet.</div>;

  const chartData = {
    labels: metrics.map(m => m.commit_hash.substring(0, 7)),
    datasets: [
      {
        label: 'First Contentful Paint (Seconds)',
        data: metrics.map(m => m.fcp),
        // Week 3 Alert: Turns bar Red if FCP is over 2.0s
        backgroundColor: metrics.map(m => 
          m.fcp > 2.0 ? 'rgba(255, 99, 132, 0.7)' : 'rgba(75, 192, 192, 0.7)'
        ),
        borderColor: metrics.map(m => 
          m.fcp > 2.0 ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Lighthouse FCP Scores by Commit' },
    },
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h2>CI/CD Performance Dashboard</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default PerformanceDashboard;