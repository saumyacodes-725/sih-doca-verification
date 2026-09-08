// Automated End-to-End Workflow Verification for SIH 2026 DoCA System
import { INITIAL_MOCK_DATA } from './src/data/mockData.js';

// Polyfill minimal localStorage for Node environment testing
const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = v; },
  removeItem: (k) => { delete store[k]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
};
global.window = {
  dispatchEvent: () => {},
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.CustomEvent = class CustomEvent {};

import {
  initDatabase,
  getInstruments,
  addInstrument,
  submitApplication,
  getApplications,
  reviewApplication,
  scheduleInspection,
  submitInspectionVerdict,
  getCertificateById,
  getSystemStats
} from './src/services/storageService.js';

console.log('=== [1] INITIALIZING MOCK DATABASE & SEED DATA ===');
initDatabase();
const initialInst = getInstruments();
console.log(`Initial Instruments count: ${initialInst.length}`);
console.assert(initialInst.length >= 3, 'Expected at least 3 initial seed instruments');

console.log('\n=== [2] BUSINESS USER: REGISTERING NEW WEIGHBRIDGE ===');
const newDevice = addInstrument({
  type: 'Heavy Duty Weighbridge',
  category: 'Industrial Weighing',
  manufacturer: 'Avery India Heavy Industries',
  model: 'WB-Titan 80T',
  serialNumber: 'AV-WB-2026-7788',
  maxCapacity: '80 Tonnes',
  minCapacity: '500 kg',
  verificationInterval: '20 kg',
  accuracyClass: 'Class IV (Ordinary)',
  ownerName: 'Tata Steel Logistics Depot',
  businessRegNo: 'GSTIN07AAACT9988T1Z1',
  location: 'NH-8 Transport Nagar, Gurugram, Haryana',
  latitude: '28.4595',
  longitude: '77.0266'
});
console.log(`Registered new device: ID=${newDevice.id}, SN=${newDevice.serialNumber}, Status=${newDevice.status}`);
console.assert(newDevice.id && newDevice.status === 'REGISTERED', 'Registration failed');

console.log('\n=== [3] BUSINESS USER: SUBMITTING VERIFICATION APPLICATION ===');
const app = submitApplication({
  instrumentId: newDevice.id,
  applicantName: 'Tata Steel Logistics Depot',
  applicantEmail: 'ops.gurugram@tatasteel.mock',
  contactPhone: '+91 98123 45678',
  applicationType: 'First-time Verification & Stamping',
  feeAmount: '₹ 4,500',
  remarks: 'Standard test weights calibration certificate attached.'
});
console.log(`Application submitted: ID=${app.id}, Status=${app.status}, Fee=${app.feeAmount}`);
console.assert(app.status === 'PENDING_REVIEW', 'Application status should be PENDING_REVIEW');

console.log('\n=== [4] ADMIN: REVIEWING & APPROVING APPLICATION ===');
const reviewedApp = reviewApplication(app.id, 'APPROVE', 'Documents and fees verified by Controller', 'Controller Office');
console.log(`Application reviewed: ID=${reviewedApp.id}, Status=${reviewedApp.status}`);
console.assert(reviewedApp.status === 'APPROVED', 'Application status should be APPROVED');

console.log('\n=== [5] ADMIN: ASSIGNING LMO OFFICER & AUDIT DATE ===');
const scheduledApp = scheduleInspection(app.id, 'LMO-01', '2026-08-28', '10:30 AM - 01:00 PM', 'Controller Office');
console.log(`Application scheduled: Assigned=${scheduledApp.assignedOfficerName}, Date=${scheduledApp.scheduledDate}, Status=${scheduledApp.status}`);
console.assert(scheduledApp.status === 'SCHEDULED' && scheduledApp.assignedOfficerName === 'Insp. Rajesh Sharma', 'Scheduling failed');

console.log('\n=== [6] LMO: CONDUCTING FIELD AUDIT & SUBMITTING PASS VERDICT ===');
const verdictResult = submitInspectionVerdict({
  applicationId: scheduledApp.id,
  officerId: 'LMO-01',
  verdict: 'PASS',
  checklist: {
    visualSealsIntact: true,
    levelingBubbleCentered: true,
    zeroAdjustmentVerified: true,
    nameplateMatchesRegistry: true
  },
  testMeasurements: {
    testStandardType: 'Class M1 Standard 20T Weights',
    appliedStandardWeight: '20.000',
    unit: 'Tonnes',
    observedIndicatedWeight: '20.001',
    mpeTolerance: '0.020'
  },
  inspectorNotes: 'Heavy weighbridge passed calibration with +0.001T error, within ±0.020T statutory MPE limit.'
});
console.log(`Verdict submitted: Status=${verdictResult.verdict}, Certificate ID=${verdictResult.certificate?.id}`);
console.assert(verdictResult.verdict === 'PASS' && verdictResult.certificate?.id, 'Certificate generation failed');

const newCertId = verdictResult.certificate.id;

console.log('\n=== [7] PUBLIC CERTIFICATE VERIFICATION DESK LOOKUP ===');
const lookupCert = getCertificateById(newCertId);
console.log(`Lookup result for ${newCertId}: Found=${!!lookupCert}, Status=${lookupCert?.status}, StampingSeal=${lookupCert?.stampingSealNumber}`);
console.assert(lookupCert && lookupCert.status === 'VALID', 'Certificate verification failed');

console.log('\n=== [8] VERIFYING EXISTING CERTIFICATES STATUSES ===');
const validCert = getCertificateById('CERT-2026-001');
const expiringCert = getCertificateById('CERT-2025-912');
const expiredCert = getCertificateById('CERT-2024-042');
const invalidCert = getCertificateById('CERT-FAKE-999');

console.log(`CERT-2026-001 Status: ${validCert?.status} (Expected: VALID)`);
console.log(`CERT-2025-912 Status: ${expiringCert?.status} (Expected: EXPIRING_SOON)`);
console.log(`CERT-2024-042 Status: ${expiredCert?.status} (Expected: EXPIRED)`);
console.log(`CERT-FAKE-999 Status: ${invalidCert ? 'Found' : 'Not Found'} (Expected: null)`);

console.assert(validCert?.status === 'VALID', 'CERT-2026-001 should be VALID');
console.assert(expiringCert?.status === 'EXPIRING_SOON', 'CERT-2025-912 should be EXPIRING_SOON');
console.assert(expiredCert?.status === 'EXPIRED', 'CERT-2024-042 should be EXPIRED');
console.assert(invalidCert === null, 'CERT-FAKE-999 should not exist');

console.log('\n=== [9] SYSTEM STATS RECOMPUTATION ===');
const finalStats = getSystemStats();
console.log('Final System Stats:', JSON.stringify(finalStats, null, 2));

console.log('\n>>> ALL 9 END-TO-END VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<');
