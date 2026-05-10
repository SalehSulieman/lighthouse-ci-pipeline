// src/api.js

// Using the deployed backend URL
const API_URL = "https://performance-api-1.onrender.com";

export const getMetrics = async () => {
  try {
    const response = await fetch(`${API_URL}/metrics`);
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return [];
  }
};

export const getAlerts = async () => {
  try {
    const response = await fetch(`${API_URL}/metrics/alerts`);
    if (!response.ok) throw new Error("Failed to fetch alerts");
    return response.json();
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
};

// --- ENTERPRISE UPGRADE: Trend Analytics Engine ---
export const getTrendAnalysis = async () => {
  try {
    const metrics = await getMetrics();
    // We need at least 2 data points to calculate a trend
    if (!metrics || metrics.length < 2) return null;

    const current = metrics[0];
    const previous = metrics[1];

    const calculateDelta = (curr, prev) => {
      const diff = curr - prev;
      let percent;
      
      // Safely handle divide-by-zero if the previous score was perfect (0)
      if (prev === 0) {
        percent = curr > 0 ? "100" : "0.0";
      } else {
        percent = ((diff / prev) * 100).toFixed(1);
      }

      return { 
        rawDiff: diff.toFixed(2), 
        percent: percent, 
        isImprovement: diff <= 0 // <= 0 means it got faster or stayed the same
      }; 
    };

    return {
      latestCommit: current.commit_hash,
      deltas: {
        fcp: calculateDelta(current.fcp, previous.fcp),
        lcp: calculateDelta(current.lcp, previous.lcp),
        tbt: calculateDelta(current.tbt, previous.tbt)
      }
    };
  } catch (error) {
    console.error("Error calculating trends:", error);
    return null;
  }
};
