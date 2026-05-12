const fs = require("fs");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("db.sqlite");

/* =========================
   DATABASE SETUP
========================= */

db.run(`
  CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commit_hash TEXT,
    branch TEXT,
    environment TEXT,
    fcp REAL,
    lcp REAL,
    tbt REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(commit_hash, environment)
  )
`);

db.run(`
  CREATE INDEX IF NOT EXISTS idx_environment
  ON metrics(environment)
`);

db.run(`
  CREATE INDEX IF NOT EXISTS idx_created_at
  ON metrics(created_at)
`);

/* =========================
   LIGHTHOUSE EXTRACTION
========================= */

function extractMetrics(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    return {
      fcp: Number(
        (data.audits["first-contentful-paint"].numericValue / 1000).toFixed(2),
      ),

      lcp: Number(
        (data.audits["largest-contentful-paint"].numericValue / 1000).toFixed(
          2,
        ),
      ),

      tbt: Number(data.audits["total-blocking-time"].numericValue.toFixed(2)),
    };
  } catch (error) {
    console.error("Error reading Lighthouse file:", error);

    return null;
  }
}

/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   ROOT ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("API is running");
});

/* =========================
   LIGHTHOUSE TEST ROUTE
========================= */

app.get("/test-lighthouse", (req, res) => {
  const metrics = extractMetrics("./lighthouse.json");

  res.json(metrics);
});

/* =========================
   STATUS + ALERT LOGIC
========================= */

function getStatus(metrics) {
  if (metrics.lcp >= 4 || metrics.fcp >= 3.0 || metrics.tbt >= 500) {
    return "Critical";
  }

  if (metrics.lcp >= 2.5 || metrics.fcp >= 2.0 || metrics.tbt >= 200) {
    return "Warning";
  }

  return "Excellent";
}

function checkPerformance(metrics) {
  const alerts = [];

  if (metrics.lcp >= 4) {
    alerts.push("LCP is too high (slow loading)");
  }

  if (metrics.fcp >= 3.0) {
    alerts.push("FCP is slower than expected");
  }

  if (metrics.tbt >= 500) {
    alerts.push("TBT indicates blocking issues");
  }

  return alerts;
}

/* =========================
   GET METRICS
========================= */

app.get("/metrics", (req, res) => {
  const { environment } = req.query;

  let query = "SELECT * FROM metrics";
  let params = [];

  if (environment) {
    query += " WHERE environment = ?";
    params.push(environment);
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    const results = rows.map((row) => ({
      ...row,
      tbt: Math.round(row.tbt),
      status: getStatus(row),
      alerts: checkPerformance(row),
    }));

    res.json(results);
  });
});

/* =========================
   CHART DATA
========================= */

app.get("/metrics/chart", (req, res) => {
  const { environment } = req.query;

  let query = "SELECT DATE(created_at) as date, fcp, lcp, tbt FROM metrics";

  let params = [];

  if (environment) {
    query += " WHERE environment = ?";
    params.push(environment);
  }

  query += " ORDER BY created_at ASC LIMIT 50";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(rows);
  });
});

/* =========================
   AVERAGE CHART DATA
========================= */

app.get("/metrics/chart/avg", (req, res) => {
  const { environment } = req.query;

  let query =
    "SELECT DATE(created_at) as date, AVG(fcp) as fcp, AVG(lcp) as lcp, AVG(tbt) as tbt FROM metrics";

  let params = [];

  if (environment) {
    query += " WHERE environment = ?";
    params.push(environment);
  }

  query += " GROUP BY DATE(created_at) ORDER BY date ASC";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(rows);
  });
});

/* =========================
   ALERTS ENDPOINT
========================= */

app.get("/metrics/alerts", (req, res) => {
  const { environment } = req.query;

  let query = "SELECT * FROM metrics";
  let params = [];

  if (environment) {
    query += " WHERE environment = ?";
    params.push(environment);
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    const results = rows.map((row) => ({
      ...row,
      alerts: checkPerformance(row),
    }));

    res.json(results);
  });
});

/* =========================
   STRUCTURED CHART DATA
========================= */

app.get("/metrics/chart/structured", (req, res) => {
  const { environment } = req.query;

  let query = "SELECT DATE(created_at) as date, fcp, lcp, tbt FROM metrics";

  let params = [];

  if (environment) {
    query += " WHERE environment = ?";
    params.push(environment);
  }

  query += " ORDER BY created_at ASC LIMIT 50";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json({
      labels: rows.map((r) => r.date),
      fcp: rows.map((r) => r.fcp),
      lcp: rows.map((r) => r.lcp),
      tbt: rows.map((r) => r.tbt),
    });
  });
});

/* =========================
   INSERT METRICS
========================= */

app.post("/metrics", (req, res) => {
  console.log("Incoming data:", req.body);

  const { commit_hash, branch, environment, fcp, lcp, tbt } = req.body;

  if (
    !commit_hash ||
    !branch ||
    !environment ||
    fcp == null ||
    lcp == null ||
    tbt == null
  ) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  if (
    typeof fcp !== "number" ||
    typeof lcp !== "number" ||
    typeof tbt !== "number"
  ) {
    return res.status(400).json({
      error: "Metrics must be numbers",
    });
  }

  if (fcp < 0 || lcp < 0 || tbt < 0) {
    return res.status(400).json({
      error: "Metrics cannot be negative",
    });
  }

  const query = `
    INSERT OR IGNORE INTO metrics
    (commit_hash, branch, environment, fcp, lcp, tbt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [commit_hash, branch, environment, fcp, lcp, tbt],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        id: this.lastID,
      });
    },
  );
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
