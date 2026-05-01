import { useEffect, useState } from 'react';
import { getMetrics } from '../api';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getMetrics();
      setHistory(data);
    };
    loadData();
  }, []);

  return (
    <div className="history-page">
      <h1>Test History</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Environment</th>
            <th>FCP (s)</th>
            <th>LCP (s)</th>
            <th>TBT (ms)</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>{item.environment}</td>
              <td>{item.fcp.toFixed(2)}</td>
              <td>{item.lcp.toFixed(2)}</td>
              <td>{item.tbt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;