// src/api.js

// We define the backend address here
const API_URL = "http://localhost:3000";

export const getMetrics = async () => {
  try {
    const response = await fetch(`${API_URL}/metrics`);
    return response.json();
  } catch (error) {
    console.error("Failed to fetch metrics", error);
    return [];
  }
};

export const simulateTest = async () => {
  try {
    const response = await fetch(`${API_URL}/simulate`);
    return response.json();
  } catch (error) {
    console.error("Simulation failed", error);
    return null;
  }
};