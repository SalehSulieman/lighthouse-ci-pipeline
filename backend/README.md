# Web Performance Monitoring System

## Overview

This project automates web performance testing using Lighthouse CI and visualizes results in a dashboard.

The system runs performance tests on every code push, stores metrics in a backend API, and displays trends in a frontend dashboard.

---

## Architecture

* **CI/CD Pipeline**: GitHub Actions runs Lighthouse after each push
* **Backend API**: Node.js + Express (deployed on Render)
* **Frontend Dashboard**: React app (deployed on Vercel)

---

## Live Links

* Frontend:
  https://lighthouse-ci-pipeline.vercel.app

* Backend API:
  https://performance-api-1.onrender.com

---

## How It Works

1. Code is pushed to GitHub
2. GitHub Actions triggers Lighthouse CI
3. Lighthouse generates performance metrics
4. Metrics are sent to the backend API
5. Data is stored in the database
6. Frontend fetches and displays the data

---

## API Endpoints

### Get all metrics

GET /metrics

### Get chart data

GET /metrics/chart/structured

### Get performance alerts

GET /metrics/alerts

---

## Example Data

```
{
  "commit_hash": "abc123",
  "branch": "main",
  "environment": "production",
  "fcp": 0.76,
  "lcp": 0.76,
  "tbt": 5.5
}
```

---

## Notes

* Backend is deployed separately on Render
* The backend folder in this repo is for presentation purposes only
* Data updates automatically after each commit

---

## Technologies Used

* Node.js, Express
* SQLite
* React
* Chart.js
* Lighthouse CI
* GitHub Actions
* Vercel
* Render

---
