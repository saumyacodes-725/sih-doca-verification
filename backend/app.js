import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import authRoutes from './src/routes/auth.routes.js';
import instrumentsRoutes from './src/routes/instruments.routes.js';
import applicationsRoutes from './src/routes/applications.routes.js';
import verificationsRoutes from './src/routes/verifications.routes.js';
import certificatesRoutes from './src/routes/certificates.routes.js';
import notificationsRoutes from './src/routes/notifications.routes.js';
import statsRoutes from './src/routes/stats.routes.js';
import paymentsRoutes from './src/routes/payments.routes.js';

import {
  getCollection,
  getDb,
  replaceDatabase,
  resetDatabase,
  submitGatcReport
} from './dataStore.js';

// Local dev origins are always allowed. In production, the frontend and API
// are served from the same Vercel deployment (same-origin), so this list
// mainly matters for local `npm run dev:full` — an extra allowed origin can
// still be added via ALLOWED_ORIGIN if the frontend is ever hosted
// separately from the API.
const ALLOWED_ORIGINS = new Set(['http://127.0.0.1:5173', 'http://localhost:5173']);
if (process.env.ALLOWED_ORIGIN) ALLOWED_ORIGINS.add(process.env.ALLOWED_ORIGIN);

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.has(origin)) return callback(null, true);
      return callback(null, false);
    }
  })
);
app.use(express.json());

app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    name: 'SIH DoCA Verification API',
    status: 'running',
    endpoints: [
      'POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me',
      'GET /api/instruments', 'POST /api/instruments', 'GET /api/instruments/:id', 'PUT /api/instruments/:id',
      'GET /api/applications', 'POST /api/applications', 'GET /api/applications/:id',
      'PUT /api/applications/:id/assign', 'PUT /api/applications/:id/complete',
      'POST /api/verifications', 'GET /api/verifications/:id', 'GET /api/verifications/officer/:officerId',
      'GET /api/certificates', 'GET /api/certificates/verify/:certId (public)', 'GET /api/certificates/:id', 'PUT /api/certificates/:id/revoke',
      'GET /api/notifications/:userId', 'PUT /api/notifications/:id/read',
      'GET /api/stats',
      'GET /api/payments/status', 'POST /api/payments/create-order', 'POST /api/payments/verify',
      'GET /api/gatc-reports', 'POST /api/gatc-reports', 'GET /api/audit-logs', 'GET /api/stakeholders',
      'GET /api/db', 'PUT /api/db', 'POST /api/reset'
    ]
  });
});

app.get('/api/health', (req, res) => res.status(200).json({ ok: true, timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/instruments', instrumentsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/verifications', verificationsRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payments', paymentsRoutes);

// --- Legacy, file-backed routes (backend/db.json via dataStore.js) ---
// Deliberately unmigrated: GATC lab reports, audit logs, and the stakeholder
// directory. NOTE: on Vercel's serverless runtime, writes to db.json do not
// persist across invocations — these routes work locally but are read-mostly
// / unreliable once deployed there.
app.get('/api/db', async (req, res) => res.status(200).json(await getDb()));
app.put('/api/db', async (req, res) => res.status(200).json(await replaceDatabase(req.body)));
app.post('/api/reset', async (req, res) => res.status(200).json(await resetDatabase()));
app.get('/api/gatc-reports', async (req, res) => res.status(200).json(await getCollection('gatcReports')));
app.post('/api/gatc-reports', async (req, res) => res.status(201).json(await submitGatcReport(req.body)));
app.get('/api/audit-logs', async (req, res) => res.status(200).json(await getCollection('auditLogs')));
app.get('/api/stakeholders', async (req, res) => res.status(200).json(await getCollection('stakeholders')));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  // Mongoose duplicate key (e.g. a unique index like Instrument.serialNumber)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    return res.status(409).json({ error: `Duplicate value for field '${field}'`, details: error.keyValue });
  }

  // Mongoose schema validation
  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details });
  }

  // Mongoose cast error (e.g. malformed id)
  if (error.name === 'CastError') {
    return res.status(400).json({ error: `Invalid value for field '${error.path}'` });
  }

  const statusCode = error.statusCode || (error instanceof SyntaxError ? 400 : 500);
  if (statusCode >= 500) console.error(error);
  res.status(statusCode).json({ error: error.message || 'Internal server error', ...(error.details ? { details: error.details } : {}) });
});

export default app;
