# Backend Profile — SIH DoCA Verification (Trust Scale)

## Overview

Node.js/Express REST API backing the Legal Metrology instrument verification portal. Stores its core data in MongoDB Atlas via Mongoose, with JWT-based authentication. A handful of secondary features (GATC lab reports, audit logs, the stakeholder directory) remain on the original file-backed store (`backend/db.json`) and were deliberately left unmigrated.

## Stack

- **Runtime**: Node.js (ESM, `"type": "module"`)
- **Framework**: Express 5
- **Database**: MongoDB Atlas via Mongoose
- **Auth**: JWT (`jsonwebtoken`), passwords hashed with `bcryptjs`
- **Config**: `dotenv`, loaded explicitly from `backend/.env` regardless of the process's working directory

## Project layout

```
backend/
  server.js              # Express app entry point — mounts every router below
  dataStore.js           # Legacy file-backed store (backend/db.json)
  db.json                # Legacy seed data (GATC reports, audit logs, stakeholders)
  devFull.js             # Runs frontend + backend together (npm run dev:full)
  .env / .env.example    # MONGODB_URI, JWT_SECRET, PORT, HOST
  src/
    config/db.js         # mongoose.connect()
    models/              # User, Instrument, Application, Verification, Certificate, Notification
    middleware/auth.js    # authenticate (JWT verify), requireRole(...roles)
    routes/               # One router per resource (see API section)
    services/verificationService.js  # Shared logic: recording a field verdict + issuing a certificate on PASS
    utils/
      ids.js              # Human-readable ID generation (INST-2026-001 etc.), digital hash generation
      ApiError.js          # Throwable {statusCode, message, details} for route handlers
    seed.js               # Creates one demo login per role
```

## Environment variables (`backend/.env`)

| Key | Purpose |
|---|---|
| `MONGODB_URI` | Atlas connection string (git-ignored, never committed) |
| `JWT_SECRET` | Signs/verifies auth tokens — random 96-char hex, generated once |
| `PORT` | Default `5000` |
| `HOST` | Default `127.0.0.1` |

## Data models

All Mongoose schemas use `toJSON: { virtuals: true }` so every response includes both `_id` and an `id` string the frontend reads.

- **User** — `name, email (unique), passwordHash, role (business|lmo|gatc|admin)`, plus optional role-specific profile fields (`company`, `gstin`, `badgeNumber`, `zone`, `labName`, `labCode`, `department`, etc.)
- **Instrument** — human-readable string `_id` (`INST-2026-NNN`), `serialNumber` unique+sparse indexed, `owner` (ref User), `status` enum (`REGISTERED → APPLICATION_SUBMITTED → SCHEDULED → VERIFIED / REJECTED / EXPIRED`)
- **Application** — string `_id` (`APP-2026-NNN`), `applicant`/`assignedOfficer` (ref User), `status` enum (`PENDING_REVIEW → SCHEDULED → COMPLETED / REJECTED`), `history[]` audit trail, fee breakdown fields
- **Verification** — string `_id` (`VER-2026-NNN`), records one officer's field-inspection outcome (`verdict: PASS|FAIL`, checklist, test measurements/details, evidence photos)
- **Certificate** — string `_id` (`CERT-2026-NNN`), `digitalHash` (real SHA-256 over the certificate payload), `qrVerificationUrl`, `status` enum (`VALID|EXPIRING_SOON|EXPIRED|REVOKED`) — `EXPIRED` is also computed live at read time if `expiryDate` has passed, without mutating the stored value
- **Notification** — `userId` (string; a User's Mongo id, or `'ALL_ADMIN'`), `title`, `message`, `type`, `read`

## Auth flow

1. `POST /api/auth/register` or `/login` → bcrypt-hash/compare, issue JWT (`{id, role}`, 7-day expiry) alongside the user object (password hash stripped)
2. Frontend stores the token in `localStorage`, attaches `Authorization: Bearer <token>` on every subsequent call
3. `authenticate` middleware verifies the token and loads the full `User` document onto `req.user`
4. `requireRole(...roles)` middleware gates admin/LMO-only actions

## API endpoints

### Auth (`/api/auth`)
- `POST /register`, `POST /login`
- `GET /me` — auth required
- `GET /officers` — admin only; lists real LMO/GATC accounts for the assignment dropdown

### Instruments (`/api/instruments`) — all require auth
- `GET /`, `GET /:id`, `POST /`, `PUT /:id`

### Applications (`/api/applications`) — all require auth
- `GET /`, `GET /:id`, `POST /`
- `PUT /:id/assign` — admin only
- `PUT /:id/complete` — LMO/admin; records the Verification and, on PASS, issues the Certificate (via `verificationService.js`)

### Verifications (`/api/verifications`) — all require auth
- `POST /`, `GET /:id`, `GET /officer/:officerId`

### Certificates (`/api/certificates`)
- `GET /` — auth required
- `GET /verify/:certId` — **public, no auth** — the QR-scan / public-verification endpoint; matches by id, certificate number, stamping seal tag, serial number, or instrument id (case-insensitive)
- `GET /:id` — auth required
- `PUT /:id/revoke` — admin only

### Notifications (`/api/notifications`) — auth required
- `GET /:userId`, `PUT /:id/read`

### Misc
- `GET /api/health`, `GET /` / `GET /api` (endpoint listing), `GET /api/stats`

### Legacy, file-backed (`backend/dataStore.js`, no auth) — deliberately unmigrated
- `GET/PUT /api/db`, `POST /api/reset`
- `GET/POST /api/gatc-reports`
- `GET /api/audit-logs`
- `GET /api/stakeholders`

## Error handling

Centralized in `server.js`'s final middleware: Mongoose duplicate-key errors → `409` with the offending field, `ValidationError` → `400` with a message array, `CastError` → `400`, everything else → the error's own `statusCode` or `500`.

## Seeding

`npm run seed` (`backend/src/seed.js`) creates one account per role if it doesn't already exist:

| Role | Email | Password |
|---|---|---|
| business | business@demo.test | Password123! |
| lmo | lmo@demo.test | Password123! |
| gatc | gatc@demo.test | Password123! |
| admin | admin@demo.test | Password123! |

## Known gaps / deferred scope

- Complaints and AI/Anomaly endpoints from the original spec are not built
- GATC reports, audit logs, and the stakeholder directory still read/write the legacy `db.json` file, not MongoDB
- No rate limiting or refresh-token rotation on auth
