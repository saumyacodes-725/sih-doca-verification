# SIH DoCA Verification Backend

Dependency-free Node.js REST API for the SIH DoCA / Legal Metrology verification demo.

## Run

```bash
npm run server
```

Backend URL:

```text
http://127.0.0.1:5000
```

Run frontend and backend together:

```bash
npm run dev:full
```

## Core Endpoints

```text
GET   /api/health
GET   /api/db
POST  /api/reset
GET   /api/stats
GET   /api/instruments
POST  /api/instruments
GET   /api/instruments/:id
GET   /api/applications
POST  /api/applications
PATCH /api/applications/:id/schedule
POST  /api/applications/:id/inspection
GET   /api/certificates
GET   /api/certificates/:id
PATCH /api/certificates/:id/revoke
GET   /api/stakeholders
GET   /api/notifications?userId=USR-BIZ-01
PATCH /api/notifications/:id/read
GET   /api/gatc-reports
POST  /api/gatc-reports
GET   /api/audit-logs
```

The backend stores demo data in `backend/db.json`, seeded from `src/data/mockData.js`.
