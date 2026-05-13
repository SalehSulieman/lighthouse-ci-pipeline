# Connect Your Own Website

You can use this platform to automatically monitor the performance of any deployed website using Lighthouse CI, GitHub Actions, and the telemetry dashboard.

---

## Step 1 — Deploy Your Website

Deploy your application to a hosting provider such as:

* Vercel
* Netlify
* Render

Example:

https://my-app.vercel.app

---

## Step 2 — Add GitHub Actions Workflow

Inside your project, create:

.github/workflows/lighthouse.yml

Add the following workflow:

```yaml
name: Lighthouse Monitoring

on:
  push:
    branches: [main]

jobs:
  lighthouse-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install Lighthouse CLI
        run: npm install -g @lhci/cli

      - name: Wait For Deployment
        run: |
          echo "Waiting for deployment..."
          sleep 180

      - name: Run Lighthouse
        run: |
          lhci collect --url="https://your-app.vercel.app"

      - name: Extract Metrics And Send
        run: |
          JSON_FILE=$(ls .lighthouseci/lhr-*.json | head -n 1)

          FCP=$(jq '.audits["first-contentful-paint"].numericValue / 1000' $JSON_FILE)
          LCP=$(jq '.audits["largest-contentful-paint"].numericValue / 1000' $JSON_FILE)
          TBT=$(jq '.audits["total-blocking-time"].numericValue' $JSON_FILE)

          curl -X POST "https://performance-api-1.onrender.com/metrics" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer ${{ secrets.API_KEY }}" \
          -d '{
            "commit_hash": "'"${{ github.sha }}"'",
            "branch": "'"${{ github.ref_name }}"'",
            "environment": "production",
            "fcp": '"$FCP"',
            "lcp": '"$LCP"',
            "tbt": '"$TBT"'
          }'
```

---

## Step 3 — Configure GitHub Secret

Go to:

GitHub Repository
→ Settings
→ Secrets and Variables
→ Actions

Create a new repository secret:

Name:
API_KEY

Value:
Your monitoring backend API key

---

## Step 4 — Push Code

Every time you push code:

1. GitHub Actions automatically runs
2. Lighthouse audits your deployed website
3. Performance metrics are extracted
4. Telemetry is sent to the monitoring backend
5. The dashboard updates automatically

The monitoring dashboard tracks:

* First Contentful Paint (FCP)
* Largest Contentful Paint (LCP)
* Total Blocking Time (TBT)
* Performance trends
* Deployment regressions
* Environment telemetry
