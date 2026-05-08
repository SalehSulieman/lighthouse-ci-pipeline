// src/api.js

// USE THE DEPLOYED BACKEND URL
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

