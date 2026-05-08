// src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { getMetrics } from '../api';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getMetrics();
    if (data) {
      setHistory(data);
    }
  };

  const getPerformanceStatus = (fcp, lcp) => {
    if (fcp <= 1.8 && lcp <= 2.5) return { label: 'Excellent', class: 'status-excellent' };
    if (fcp <= 3.0 && lcp <= 4.0) return { label: 'Good', class: 'status-good' };
    return { label: 'Needs Work', class: 'status-poor' };
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Test History</h1>
        <p>Comprehensive log of all performance test runs</p>
      </div>

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              {/* Widths strictly sum to 100% */}
              <th style={{ width: '18%' }}>Date & Time</th>
              <th style={{ width: '12%' }}>Commit Hash</th>
              <th style={{ width: '15%' }}>Environment</th>
              <th style={{ width: '12%' }}>FCP (s)</th>
              <th style={{ width: '12%' }}>LCP (s)</th>
              <th style={{ width: '12%' }}>TBT (ms)</th>
              <th style={{ width: '19%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => {
              const status = getPerformanceStatus(item.fcp, item.lcp);
              return (
                // We pass the status class to the ROW, but apply styles to the FIRST TD
                <tr key={item.id} className={status.class}>
                  <td className="first-cell">
                    <span className="date-main">{new Date(item.created_at).toLocaleDateString()}</span>
                    <span className="date-sub">{new Date(item.created_at).toLocaleTimeString()}</span>
                  </td>
                  <td><code>{item.commit_hash?.substring(0, 7)}</code></td>
                  <td><span className="env-badge">{item.environment}</span></td>
                  <td className="metric-value">{item.fcp.toFixed(2)}</td>
                  <td className="metric-value">{item.lcp.toFixed(2)}</td>
                  <td className="metric-value">{item.tbt}</td>
                  <td><span className={`status-badge ${status.class}`}>{status.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {history.length === 0 && <div className="no-data">No history data found.</div>}
      </div>
    </div>
  );
};

export default History;