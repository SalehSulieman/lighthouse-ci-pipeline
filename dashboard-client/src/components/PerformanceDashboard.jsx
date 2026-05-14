import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getMetrics } from '../api';

const PerformanceDashboard = ({ environment = 'production' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Re-fetch chart data whenever the environment dropdown changes
  useEffect(() => {
    loadChartData();
  }, [environment]);

  const loadChartData = async () => {
    setLoading(true);
    const metrics = await getMetrics(environment);
    if (metrics && metrics.length > 0) {
      const chartData = metrics.slice(0, 10).reverse().map(item => ({
        commit: item.commit_hash ? item.commit_hash.substring(0, 7) : 'N/A',
        FCP: item.fcp,
        LCP: item.lcp,
        TBT: Math.round(item.tbt) 
      }));
      setData(chartData);
    } else {
      setData([]); // Clear chart if no data for this environment
    }
    setLoading(false);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#1e293b', padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid #475569', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '4px' }}>Commit: {label}</p>
          {payload.map((entry, index) => {
            // Safely round FCP and LCP to 2 decimals. Leave TBT alone.
            const formattedValue = typeof entry.value === 'number' && !Number.isInteger(entry.value) 
              ? entry.value.toFixed(2) 
              : entry.value;

            return (
              <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '0.9rem', fontWeight: '500' }}>
                {entry.name}: {formattedValue}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading telemetry data...</div>;
  }

  if (!data || data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No telemetry data available for this environment.</div>;
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid
  strokeDasharray="3 3"
  vertical={false}
  stroke="rgba(255,255,255,0.08)"
/>

<XAxis
  dataKey="commit"
  tick={{ fill: '#94a3b8', fontSize: 12 }}
  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
  tickLine={false}
  dy={10}
/>

<YAxis
  yAxisId="left"
  tick={{ fill: '#94a3b8', fontSize: 12 }}
  axisLine={false}
  tickLine={false}
  dx={-10}
/>

<YAxis
  yAxisId="right"
  orientation="right"
  tick={{ fill: '#94a3b8', fontSize: 12 }}
  axisLine={false}
  tickLine={false}
  dx={10}
/>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          
          <Line yAxisId="left" type="monotone" dataKey="FCP" name="FCP (s)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6 }} />
          <Line yAxisId="left" type="monotone" dataKey="LCP" name="LCP (s)" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6 }} />
          <Line yAxisId="right" type="monotone" dataKey="TBT" name="TBT (ms)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceDashboard;
