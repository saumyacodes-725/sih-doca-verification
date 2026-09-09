import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INITIAL_MOCK_DATA } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addAuditLogEntry(db, { actor, action, details }) {
  if (!db.auditLogs) db.auditLogs = [];

  db.auditLogs.unshift({
    id: `LOG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: `${new Date().toLocaleString()} IST`,
    actor: actor || 'System Service',
    action: action || 'AUDIT_EVENT',
    details: details || '',
    hash: `SHA256:${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...`
  });
}

async function ensureDatabaseFile() {
  await mkdir(__dirname, { recursive: true });

  try {
    const file = await readFile(DB_PATH, 'utf8');
    return JSON.parse(file);
  } catch {
    const seed = clone(INITIAL_MOCK_DATA);
    await writeDatabase(seed);
    return seed;
  }
}

async function writeDatabase(db) {
  await writeFile(DB_PATH, `${JSON.stringify(db, null, 2)}\n`, 'utf8');
}

export async function getDb() {
  return ensureDatabaseFile();
}

export async function resetDatabase() {
  const seed = clone(INITIAL_MOCK_DATA);
  await writeDatabase(seed);
  return seed;
}

export async function replaceDatabase(db) {
  const requiredArrays = [
    'stakeholders',
    'instruments',
    'applications',
    'certificates',
    'gatcReports',
    'notifications',
    'auditLogs'
  ];

  const isValid = db && requiredArrays.every((key) => Array.isArray(db[key]));
  if (!isValid) {
    throw new Error('Invalid database payload');
  }

  await writeDatabase(db);
  return db;
}

export async function getCollection(name) {
  const db = await getDb();
  return db[name] || [];
}

export async function getInstrumentById(id) {
  const db = await getDb();
  return (db.instruments || []).find((item) => item.id === id || item.serialNumber === id) || null;
}

export async function addInstrument(instrumentData) {
  const db = await getDb();
  const count = (db.instruments || []).length + 1;
  const id = `INST-2026-${String(count).padStart(3, '0')}`;
  const now = today();

  const newInstrument = {
    id,
    type: instrumentData.type || 'Electronic Retail Scale',
    category: instrumentData.category || 'Commercial Weighing',
    manufacturer: instrumentData.manufacturer || 'Standard Scale Mfg',
    model: instrumentData.model || 'Model-X',
    serialNumber: instrumentData.serialNumber || `SN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    maxCapacity: instrumentData.maxCapacity || '30 kg',
    minCapacity: instrumentData.minCapacity || '100 g',
    verificationInterval: instrumentData.verificationInterval || '5 g',
    accuracyClass: instrumentData.accuracyClass || 'Class III (Medium Accuracy)',
    ownerName: instrumentData.ownerName || 'Apex Weighing & Logistics Ltd',
    ownerTraderId: instrumentData.ownerTraderId || 'USR-BIZ-01',
    ownerEmail: instrumentData.ownerEmail || 'compliance@apexlogistics.mock',
    businessRegNo: instrumentData.businessRegNo || 'GSTIN07AAACA1234F1Z5',
    location: instrumentData.location || 'New Delhi, India',
    state: instrumentData.state || 'Delhi',
    district: instrumentData.district || 'South Delhi',
    latitude: instrumentData.latitude || '28.5355',
    longitude: instrumentData.longitude || '77.2710',
    registrationDate: now,
    status: 'REGISTERED',
    activeCertificateId: null,
    lastVerifiedDate: null,
    expiryDate: null,
    stampingNumber: null,
    verificationFeePaid: false,
    patternApprovalNo: instrumentData.patternApprovalNo || `IND-LM-PA-2026-${Math.floor(100 + Math.random() * 900)}`,
    applicationId: null
  };

  db.instruments.unshift(newInstrument);
  addAuditLogEntry(db, {
    actor: instrumentData.ownerName || 'Trader',
    action: 'REGISTER_INSTRUMENT',
    details: `Registered new instrument ${newInstrument.type} (SN: ${newInstrument.serialNumber}, ID: ${id})`
  });

  await writeDatabase(db);
  return newInstrument;
}

export async function submitApplication(appData) {
  const db = await getDb();
  const count = (db.applications || []).length + 101;
  const appId = `APP-2026-${count}`;
  const now = today();
  const nowTime = timeNow();
  const instrument = db.instruments.find((item) => item.id === appData.instrumentId);

  const newApp = {
    id: appId,
    instrumentId: appData.instrumentId,
    instrumentName: instrument ? `${instrument.type} (${instrument.model})` : 'Weighing Instrument',
    instrumentType: instrument ? instrument.type : 'Commercial Scale',
    applicantName: appData.applicantName || instrument?.ownerName || 'Apex Logistics',
    applicantTraderId: appData.applicantTraderId || instrument?.ownerTraderId || 'USR-BIZ-01',
    applicantEmail: appData.applicantEmail || instrument?.ownerEmail || 'compliance@apexlogistics.mock',
    contactPhone: appData.contactPhone || '+91 98112 34567',
    applicationType: appData.applicationType || 'Periodic Annual Re-verification',
    accuracyClass: instrument?.accuracyClass || 'Class III (Medium Accuracy)',
    premiseAddress: appData.premiseAddress || instrument?.location || 'Trader Premise, Delhi',
    state: instrument?.state || 'Delhi',
    district: instrument?.district || 'South Delhi',
    submittedDate: now,
    status: 'PENDING_REVIEW',
    feeAmount: appData.feeAmount || '₹ 1,200',
    feeBreakdown: appData.feeBreakdown || {
      verificationFee: '₹ 1,000',
      stampingSealFee: '₹ 100',
      portalProcessingFee: '₹ 100'
    },
    feeTransactionId: `TXN-BHARATKOSH-${Math.floor(1000000 + Math.random() * 9000000)}`,
    paymentStatus: 'PAID',
    assignedOfficerId: null,
    assignedOfficerName: null,
    scheduledDate: null,
    scheduledTimeSlot: null,
    remarks: appData.remarks || 'Standard online application submitted with online Bharatkosh payment.',
    history: [{ date: `${now} ${nowTime}`, event: 'Application submitted online with fee payment receipt' }]
  };

  db.applications.unshift(newApp);

  if (instrument) {
    instrument.status = 'APPLICATION_SUBMITTED';
    instrument.applicationId = appId;
    instrument.verificationFeePaid = true;
  }

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}`,
    userId: 'USR-ADM-01',
    title: 'New Verification Application',
    message: `Application ${appId} submitted for ${newApp.instrumentName}. Needs admin review & scheduling.`,
    type: 'info',
    timestamp: `${now} ${nowTime}`,
    read: false,
    link: '/admin/applications'
  });

  addAuditLogEntry(db, {
    actor: newApp.applicantName,
    action: 'SUBMIT_VERIFICATION_APPLICATION',
    details: `Submitted application ${appId} for instrument ${appData.instrumentId}. Fee: ${newApp.feeAmount}`
  });

  await writeDatabase(db);
  return newApp;
}

export async function assignAndScheduleApplication(appId, payload) {
  const db = await getDb();
  const app = db.applications.find((item) => item.id === appId);
  if (!app) return null;

  const now = today();
  const nowTime = timeNow();
  const officer = (db.stakeholders || []).find((person) => person.id === payload.officerId);
  const officerName = payload.officerName || officer?.name || payload.officerId || 'Assigned LMO';

  app.status = 'SCHEDULED';
  app.assignedOfficerId = payload.officerId;
  app.assignedOfficerName = officerName;
  app.scheduledDate = payload.scheduledDate;
  app.scheduledTimeSlot = payload.timeSlot || payload.scheduledTimeSlot || '10:30 AM - 01:00 PM';
  if (payload.remarks) app.remarks = payload.remarks;
  app.history.push({
    date: `${now} ${nowTime}`,
    event: `Reviewed & scheduled for ${payload.scheduledDate} (${app.scheduledTimeSlot}) with ${officerName}`
  });

  const instrument = db.instruments.find((item) => item.id === app.instrumentId);
  if (instrument) instrument.status = 'SCHEDULED';

  db.notifications.unshift({
    id: `NOTIF-${Date.now()}-1`,
    userId: payload.officerId,
    title: 'New Field Verification Assigned',
    message: `You are scheduled to verify ${app.instrumentName} on ${payload.scheduledDate} (${app.scheduledTimeSlot}).`,
    type: 'primary',
    timestamp: `${now} ${nowTime}`,
    read: false,
    link: `/lmo/inspect/${appId}`
  });

  addAuditLogEntry(db, {
    actor: 'Legal Metrology Controller (Admin)',
    action: 'ASSIGN_AND_SCHEDULE_LMO',
    details: `Application ${appId} assigned to ${officerName} (${payload.officerId}) for date ${payload.scheduledDate}`
  });

  await writeDatabase(db);
  return app;
}

export async function completeInspection(appId, inspectionResult) {
  const db = await getDb();
  const app = db.applications.find((item) => item.id === appId);
  if (!app) return null;

  const instrument = db.instruments.find((item) => item.id === app.instrumentId);
  const now = today();
  const nowTime = timeNow();
  const expDateObj = new Date();
  expDateObj.setFullYear(expDateObj.getFullYear() + 1);
  const expiryDate = expDateObj.toISOString().split('T')[0];
  const stateCode = instrument?.state === 'Delhi' ? 'DL' : instrument?.state === 'Tamil Nadu' ? 'TN' : 'MH';
  const certId = `CERT-2026-${String((db.certificates || []).length + 1).padStart(3, '0')}`;
  const certNumber = `IND-LM-2026-${stateCode}-${Math.floor(10000 + Math.random() * 90000)}`;
  const stampNumber = `LM-${stateCode}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  if (inspectionResult.outcome === 'PASS') {
    app.status = 'COMPLETED';
    app.history.push({
      date: `${now} ${nowTime}`,
      event: `Field verification PASSED. Seal Tag ${stampNumber} applied. Certificate ${certNumber} issued.`
    });

    const certificate = {
      id: certId,
      certificateNumber: certNumber,
      instrumentId: app.instrumentId,
      instrumentType: instrument?.type || app.instrumentType,
      manufacturer: instrument?.manufacturer || 'Verified Manufacturer',
      model: instrument?.model || 'Verified Model',
      serialNumber: instrument?.serialNumber || 'SN-VERIFIED',
      accuracyClass: instrument?.accuracyClass || 'Class III (Medium Accuracy)',
      capacity: instrument ? `Max: ${instrument.maxCapacity} | Min: ${instrument.minCapacity} | e: ${instrument.verificationInterval}` : 'Standard Capacity',
      ownerName: app.applicantName,
      businessRegNo: instrument?.businessRegNo || 'GSTIN07AAACA1234F1Z5',
      establishmentAddress: app.premiseAddress,
      issueDate: now,
      expiryDate,
      status: 'VALID',
      stampingSealNumber: stampNumber,
      verificationStandard: 'Legal Metrology (General) Rules, 2011 - Schedule VII & Standards of Weights and Measures',
      issuingOfficer: inspectionResult.officerName || app.assignedOfficerName || 'Insp. Rajesh Sharma',
      issuingOfficerId: app.assignedOfficerId || 'LMO-01',
      issuingOffice: `Office of Legal Metrology, ${instrument?.district || 'Central'} Division, ${instrument?.state || 'Govt of India'}`,
      testResultsSummary: inspectionResult.summaryNotes || 'All test points within Maximum Permissible Error (MPE). Lead stamping seal applied.',
      testDetails: inspectionResult.testDetails || [],
      evidencePhotos: inspectionResult.evidencePhotos || [],
      digitalHash: `SHA256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      qrVerificationUrl: `/certificate/${certId}`,
      revocationReason: null,
      revokedAt: null
    };

    db.certificates.unshift(certificate);
    if (instrument) {
      instrument.status = 'VERIFIED';
      instrument.activeCertificateId = certId;
      instrument.lastVerifiedDate = now;
      instrument.expiryDate = expiryDate;
      instrument.stampingNumber = stampNumber;
    }

    addAuditLogEntry(db, {
      actor: certificate.issuingOfficer,
      action: 'FIELD_VERIFY_PASSED_CERTIFICATE_ISSUED',
      details: `Field audit PASSED for ${app.instrumentId}. Stamping Seal: ${stampNumber}, Certificate: ${certNumber}`
    });

    await writeDatabase(db);
    return { success: true, outcome: 'PASS', certificate, application: app };
  }

  app.status = 'REJECTED';
  app.history.push({
    date: `${now} ${nowTime}`,
    event: `Field verification FAILED. Reason: ${inspectionResult.rejectionReason || 'Exceeded Maximum Permissible Error (MPE) limit'}.`
  });
  if (instrument) instrument.status = 'REJECTED';

  addAuditLogEntry(db, {
    actor: inspectionResult.officerName || 'LMO Inspector',
    action: 'FIELD_VERIFY_FAILED_REJECTED',
    details: `Field audit FAILED for ${app.instrumentId}. Grounds: ${inspectionResult.rejectionReason || 'Not specified'}`
  });

  await writeDatabase(db);
  return { success: true, outcome: 'FAIL', application: app };
}

export async function getCertificateById(idOrNumber) {
  const db = await getDb();
  if (!idOrNumber) return null;
  const query = String(idOrNumber).trim().toUpperCase();
  return (db.certificates || []).find((cert) =>
    cert.id.toUpperCase() === query ||
    cert.certificateNumber.toUpperCase() === query ||
    cert.stampingSealNumber.toUpperCase() === query ||
    cert.instrumentId.toUpperCase() === query ||
    cert.serialNumber.toUpperCase() === query
  ) || null;
}

export async function revokeCertificate(certId, reason) {
  const db = await getDb();
  const cert = db.certificates.find((item) => item.id === certId || item.certificateNumber === certId);
  if (!cert) return null;

  cert.status = 'REVOKED';
  cert.revocationReason = reason || 'Revoked by Legal Metrology Controller due to consumer dispute / seal tampering.';
  cert.revokedAt = today();

  const instrument = db.instruments.find((item) => item.id === cert.instrumentId);
  if (instrument) instrument.status = 'EXPIRED';

  addAuditLogEntry(db, {
    actor: 'Legal Metrology Controller (Admin)',
    action: 'REVOKE_CERTIFICATE',
    details: `Certificate ${cert.certificateNumber} REVOKED. Grounds: ${cert.revocationReason}`
  });

  await writeDatabase(db);
  return cert;
}

export async function submitGatcReport(reportData) {
  const db = await getDb();
  const report = {
    id: `GATC-REP-2026-${String((db.gatcReports || []).length + 1).padStart(2, '0')}`,
    labCode: reportData.labCode || 'GATC-DL-001',
    labName: reportData.labName || 'National Metrology Standards Lab - GATC North',
    instrumentModel: reportData.instrumentModel || 'Precision Instrument',
    manufacturer: reportData.manufacturer || 'Manufacturer',
    serialNumber: reportData.serialNumber || 'SR-000',
    accuracyClass: reportData.accuracyClass || 'Class I (Special Precision)',
    testDate: today(),
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

  db.gatcReports.unshift(report);
  addAuditLogEntry(db, {
    actor: report.labName,
    action: 'GATC_LAB_CALIBRATION_ISSUED',
    details: `GATC Calibration Report ${report.id} generated for ${report.instrumentModel} (${report.serialNumber})`
  });

  await writeDatabase(db);
  return report;
}

export async function markNotificationRead(id) {
  const db = await getDb();
  const notification = (db.notifications || []).find((item) => item.id === id);
  if (!notification) return null;

  notification.read = true;
  await writeDatabase(db);
  return notification;
}

export async function getSystemStats() {
  const db = await getDb();
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
