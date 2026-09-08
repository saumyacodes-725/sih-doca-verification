import { INITIAL_MOCK_DATA } from '../data/mockData.js';

const STORAGE_KEY = 'emaap_metrology_db_v2';
const EVENT_NAME = 'emaap_db_updated';
const TOKEN_KEY = 'emaap_token';
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

function requestApi(method, path, body) {
  if (typeof window === 'undefined' || typeof XMLHttpRequest === 'undefined') {
    return null;
  }

  try {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_BASE_URL}${path}`, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body === undefined ? null : JSON.stringify(body));

    if (xhr.status >= 200 && xhr.status < 300) {
      return xhr.responseText ? JSON.parse(xhr.responseText) : null;
    }
  } catch (error) {
    console.warn('Backend API unavailable, using browser localStorage fallback.', error);
  }

  return null;
}

function broadcastChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

// Initialize DB
export function initDatabase() {
  const remoteDb = requestApi('GET', '/db');
  if (remoteDb) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteDb));
    return remoteDb;
  }

  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
    broadcastChange();
    return INITIAL_MOCK_DATA;
  }
  try {
    return JSON.parse(existing);
  } catch (e) {
    console.error('Resetting corrupt DB', e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
    broadcastChange();
    return INITIAL_MOCK_DATA;
  }
}

export function resetDatabase() {
  const remoteDb = requestApi('POST', '/reset');
  const nextDb = remoteDb || INITIAL_MOCK_DATA;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDb));
  broadcastChange();
  return nextDb;
}

export function getDb() {
  return initDatabase();
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  requestApi('PUT', '/db', db);
  broadcastChange();
}

export function subscribeToDbChanges(callback) {
  const handler = () => {
    callback(getDb());
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

// -----------------------------------------------------------------------
// MongoDB-backed resources (instruments, applications, certificates,
// notifications) go through the real REST API below, with JWT auth
// attached from whatever AuthContext last stored. Everything above this
// line, and the legacy stakeholders/GATC/audit-log helpers further down,
// still talk to the old db.json blob via requestApi().
// -----------------------------------------------------------------------

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? authHeaders() : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data;
}

// ----------------- AUTH -----------------
export function apiRegister(payload) {
  return apiFetch('/auth/register', { method: 'POST', body: payload, auth: false });
}

export function apiLogin(email, password) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password }, auth: false });
}

export function apiMe() {
  return apiFetch('/auth/me');
}

// Real LMO/GATC MongoDB accounts, for the admin assignment dropdown —
// distinct from the legacy demo getStakeholders() directory below.
export function getOfficers() {
  return apiFetch('/auth/officers');
}

// ----------------- INSTRUMENTS -----------------
export function getInstruments() {
  return apiFetch('/instruments');
}

export function getInstrumentById(id) {
  return apiFetch(`/instruments/${encodeURIComponent(id)}`);
}

export function addInstrument(instrumentData) {
  return apiFetch('/instruments', { method: 'POST', body: instrumentData });
}

export function updateInstrument(id, updateFields) {
  return apiFetch(`/instruments/${encodeURIComponent(id)}`, { method: 'PUT', body: updateFields });
}

// ----------------- APPLICATIONS -----------------
export function getApplications() {
  return apiFetch('/applications');
}

export function getApplicationById(id) {
  return apiFetch(`/applications/${encodeURIComponent(id)}`);
}

export function submitApplication(appData) {
  return apiFetch('/applications', { method: 'POST', body: appData });
}

export function assignAndScheduleApplication(appId, { officerId, scheduledDate, timeSlot, remarks }) {
  return apiFetch(`/applications/${encodeURIComponent(appId)}/assign`, {
    method: 'PUT',
    body: { officerId, scheduledDate, timeSlot, remarks }
  });
}

// ----------------- FIELD VERIFICATION & CERTIFICATE ISSUANCE -----------------
export function completeInspection(appId, inspectionResult) {
  return apiFetch(`/applications/${encodeURIComponent(appId)}/complete`, {
    method: 'PUT',
    body: inspectionResult
  });
}

// ----------------- CERTIFICATES -----------------
export function getCertificates() {
  return apiFetch('/certificates');
}

export function getCertificateById(idOrNumber) {
  return apiFetch(`/certificates/${encodeURIComponent(idOrNumber)}`);
}

// PUBLIC — no auth token attached. This is what the QR-scan result page and
// the public verification search call; matches GET /api/certificates/verify/:certId.
export function verifyCertificatePublic(idOrNumber) {
  return apiFetch(`/certificates/verify/${encodeURIComponent(idOrNumber)}`, { auth: false });
}

export function revokeCertificate(certId, reason) {
  return apiFetch(`/certificates/${encodeURIComponent(certId)}/revoke`, { method: 'PUT', body: { reason } });
}

// ----------------- NOTIFICATIONS -----------------
export function getNotifications(userId) {
  if (!userId) return Promise.resolve([]);
  return apiFetch(`/notifications/${encodeURIComponent(userId)}`);
}

export function markNotificationRead(id) {
  return apiFetch(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PUT' });
}

// -----------------------------------------------------------------------
// Legacy, file-backed collections (backend/db.json via backend/dataStore.js).
// Deliberately unmigrated this pass — see the migration plan. These still
// use the synchronous whole-blob path above (getDb/saveDb).
// -----------------------------------------------------------------------

// ----------------- GATC LAB TEST REPORTS -----------------
export function getGatcReports() {
  const db = getDb();
  return db.gatcReports || [];
}

export function submitGatcReport(reportData) {
  const db = getDb();
  const count = (db.gatcReports || []).length + 1;
  const repId = `GATC-REP-2026-${String(count).padStart(2, '0')}`;
  const now = new Date().toISOString().split('T')[0];

  const newReport = {
    id: repId,
    labCode: reportData.labCode || 'GATC-DL-001',
    labName: reportData.labName || 'National Metrology Standards Lab - GATC North',
    instrumentModel: reportData.instrumentModel || 'Precision Instrument',
    manufacturer: reportData.manufacturer || 'Manufacturer',
    serialNumber: reportData.serialNumber || 'SR-000',
    accuracyClass: reportData.accuracyClass || 'Class I (Special Precision)',
    testDate: now,
    standardWeightsUsed: reportData.standardWeightsUsed || 'E1/E2 Reference Mass Standards',
    temperature: reportData.temperature || '20.0 °C',
    humidity: reportData.humidity || '50 % RH',
    linearityError: reportData.linearityError || '0.03 mg (Within tolerance)',
    repeatabilityStdDev: reportData.repeatabilityStdDev || '0.01 mg',
    result: reportData.result || 'PASSED_CALIBRATION',
    officerRemarks: reportData.officerRemarks || 'Laboratory calibration conforms to Metrology Act 2009 Standards.',
    certificateUrl: '#',
    technician: reportData.technician || 'Dr. V. K. Ramanathan, Principal Metrologist'
  };

  db.gatcReports.unshift(newReport);

  addAuditLogEntry(db, {
    actor: newReport.labName,
    action: 'GATC_LAB_CALIBRATION_ISSUED',
    details: `GATC Calibration Report ${repId} generated for ${newReport.instrumentModel} (${newReport.serialNumber})`
  });

  saveDb(db);
  return newReport;
}

// ----------------- STAKEHOLDERS -----------------
export function getStakeholders() {
  const db = getDb();
  return db.stakeholders || [];
}

export function getSystemStats() {
  const db = getDb();
  const instruments = db.instruments || [];
  const applications = db.applications || [];
  const certificates = db.certificates || [];
  const auditLogs = db.auditLogs || [];

  return {
    instrumentsTotal: instruments.length,
    applicationsTotal: applications.length,
    certificatesTotal: certificates.length,
    auditLogsTotal: auditLogs.length,
    pendingReview: applications.filter((app) => app.status === 'PENDING_REVIEW').length,
    scheduledInspections: applications.filter((app) => app.status === 'SCHEDULED').length,
    completedApplications: applications.filter((app) => app.status === 'COMPLETED').length,
    verifiedInstruments: instruments.filter((instrument) => instrument.status === 'VERIFIED').length,
    validCertificates: certificates.filter((cert) => cert.status === 'VALID').length,
    expiringSoonCertificates: certificates.filter((cert) => cert.status === 'EXPIRING_SOON').length,
    expiredCertificates: certificates.filter((cert) => cert.status === 'EXPIRED').length,
    revokedCertificates: certificates.filter((cert) => cert.status === 'REVOKED').length
  };
}

// ----------------- AUDIT LOGS -----------------
export function getAuditLogs() {
  const db = getDb();
  return db.auditLogs || [];
}

function addAuditLogEntry(db, { actor, action, details }) {
  if (!db.auditLogs) db.auditLogs = [];
  const logId = `LOG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toLocaleString() + ' IST';
  const dummyHash = `SHA256:${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...`;

  db.auditLogs.unshift({
    id: logId,
    timestamp: now,
    actor: actor || 'System Service',
    action: action || 'AUDIT_EVENT',
    details: details || '',
    hash: dummyHash
  });
}
