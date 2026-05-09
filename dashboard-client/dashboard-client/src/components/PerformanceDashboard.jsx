// src/components/PerformanceDashboard.jsx
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

  if (loading) return <div style={{ color: '#94a3b8', textAlign: 'center' }}>Loading data...</div>;
  if (!metrics.length) return <div style={{ color: '#94a3b8', textAlign: 'center' }}>No data available.</div>;

  const getColor = (fcpValue) => {
    if (fcpValue <= 1.8) return 'rgba(16, 185, 129, 0.8)'; // Green
    if (fcpValue <= 3.0) return 'rgba(245, 158, 11, 0.8)'; // Orange
    return 'rgba(239, 68, 68, 0.8)'; // Red
  };

  const chartData = {
    labels: metrics.map(m => m.commit_hash?.substring(0, 7) || 'N/A'),
    datasets: [
      {
        label: 'FCP (Seconds)',
        data: metrics.map(m => m.fcp),
        backgroundColor: metrics.map(m => getColor(m.fcp)),
        borderColor: metrics.map(m => getColor(m.fcp).replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Important for filling height
    plugins: {
      legend: { display: false },
      title: { display: false }, // Title is in the Dashboard parent
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      x: {
        ticks: { color: '#64748b' },
        grid: { display: false }
      }
    }
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default PerformanceDashboard;