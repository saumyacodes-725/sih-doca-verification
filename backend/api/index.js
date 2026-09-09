import app from '../app.js';
import { connectDb } from '../src/config/db.js';

// Vercel keeps a warm container between invocations, so cache the
// connection promise at module scope instead of reconnecting on every
// request — a fresh promise (and connection) is only created again after a
// cold start.
let dbConnection = null;
function ensureDb() {
  if (!dbConnection) dbConnection = connectDb();
  return dbConnection;
}

export default async function handler(req, res) {
  await ensureDb();
  return app(req, res);
}
