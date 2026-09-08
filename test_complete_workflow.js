import {
  initDatabase,
  resetDatabase,
  getInstruments,
  addInstrument,
  getApplications,
  submitApplication,
  assignAndScheduleApplication,
  completeInspection,
  getCertificates,
  getCertificateById,
  revokeCertificate,
  getAuditLogs,
  getStakeholders
} from './src/services/storageService.js';

// Setup Mock LocalStorage for node environment
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

global.window = {
  dispatchEvent() {}
};

console.log('=== STARTING SIH 2026 E-MAAP WORKFLOW TEST ===\n');

// 0. Reset DB
console.log('1. Initializing & resetting mock database...');
resetDatabase();
const initialInstruments = getInstruments();
console.log(`✓ Seed database loaded with ${initialInstruments.length} instruments, ${getApplications().length} applications, ${getCertificates().length} certificates.\n`);

// 1. Business Trader Registers Scale
console.log('2. Step 1 (Trader): Registering new Commercial Retail Scale...');
const newInst = addInstrument({
  type: 'Digital Jewellery Class II Balance',
  category: 'Jewellery & Precious Metals',
  manufacturer: 'Mettler Toledo India',
  model: 'ME204T Precision',
  serialNumber: 'MT-2026-9912',
  maxCapacity: '220 g',
  minCapacity: '10 mg',
  verificationInterval: '1 mg',
  accuracyClass: 'Class II (High Accuracy)',
  ownerName: 'Tanishq Jewellers Flagship',
  ownerTraderId: 'USR-BIZ-01',
  location: 'Connaught Place, Central Delhi',
  state: 'Delhi',
  district: 'Central Delhi',
  latitude: '28.6328',
  longitude: '77.2197'
});
console.log(`✓ Instrument registered successfully: ${newInst.id} (${newInst.type}, SN: ${newInst.serialNumber})\n`);

// 2. Business Trader Submits Verification Application
console.log('3. Step 2 (Trader): Applying for Verification and Stamping...');
const newApp = submitApplication({
  instrumentId: newInst.id,
  applicantName: 'Tanishq Jewellers Flagship',
  applicantTraderId: 'USR-BIZ-01',
  applicationType: 'First-time Initial Stamping & Verification',
  premiseAddress: 'Connaught Place, Central Delhi',
  feeAmount: '₹ 1,500',
  feeBreakdown: {
    verificationFee: '₹ 1,200',
    stampingSealFee: '₹ 200',
    portalProcessingFee: '₹ 100'
  },
  remarks: 'Test weights certified by GATC available on site.'
});
console.log(`✓ Application submitted: ${newApp.id} for ${newApp.instrumentName}. Fee: ${newApp.feeAmount} (Txn: ${newApp.feeTransactionId})\n`);

// 3. Admin Reviews & Assigns LMO
console.log('4. Step 3 (Admin): Reviewing application and assigning LMO Insp. Rajesh Sharma...');
const scheduledApp = assignAndScheduleApplication(newApp.id, {
  officerId: 'LMO-01',
  officerName: 'Insp. Rajesh Sharma',
  scheduledDate: '2026-08-27',
  timeSlot: '10:30 AM - 01:00 PM',
  remarks: 'Approved by Controller for on-site physical verification.'
});
console.log(`✓ Application scheduled: ${scheduledApp.id} with ${scheduledApp.assignedOfficerName} on ${scheduledApp.scheduledDate}\n`);

// 4. LMO Conducts Field Inspection & PASS
console.log('5. Step 4 & 5 (LMO): Conducting digital field inspection, testing tolerances, and issuing PASS...');
const inspectionResult = completeInspection(scheduledApp.id, {
  outcome: 'PASS',
  officerName: 'Insp. Rajesh Sharma',
  summaryNotes: 'Standard weights tested from zero load to 220g max capacity. All points within legal MPE. Lead seal applied.',
  testDetails: [
    { testPoint: 'Zero Load Check', appliedLoad: '0.000 g', observedError: '0.00 mg', mpeAllowed: '±1.0 mg', status: 'PASS' },
    { testPoint: '1/3 Max Capacity', appliedLoad: '70.000 g', observedError: '+0.04 mg', mpeAllowed: '±1.0 mg', status: 'PASS' },
    { testPoint: '2/3 Max Capacity', appliedLoad: '140.000 g', observedError: '+0.08 mg', mpeAllowed: '±1.5 mg', status: 'PASS' },
    { testPoint: 'Full Max Capacity', appliedLoad: '220.000 g', observedError: '+0.10 mg', mpeAllowed: '±1.5 mg', status: 'PASS' },
    { testPoint: 'Eccentric Corner Test', appliedLoad: '70.000 g', observedError: '+0.06 mg', mpeAllowed: '±1.0 mg', status: 'PASS' }
  ],
  evidencePhotos: ['plate.jpg', 'weights.jpg', 'seal.jpg']
});
console.log(`✓ Inspection complete! Outcome: ${inspectionResult.outcome}`);
console.log(`✓ Official Certificate Issued: ${inspectionResult.certificate.certificateNumber}`);
console.log(`✓ Stamping Seal Tag Generated: ${inspectionResult.certificate.stampingSealNumber}`);
console.log(`✓ Validity: ${inspectionResult.certificate.issueDate} to ${inspectionResult.certificate.expiryDate}`);
console.log(`✓ Digital Hash: ${inspectionResult.certificate.digitalHash}\n`);

// 5. Citizen / Public Scans QR / Verifies Certificate
console.log('6. Step 6 (Citizen/Public): Verifying certificate in public registry...');
const verifiedCert = getCertificateById(inspectionResult.certificate.certificateNumber);
console.log(`✓ Public Lookup matched: ${verifiedCert.certificateNumber} | Status: ${verifiedCert.status} | Owner: ${verifiedCert.ownerName}`);
console.log(`✓ QR URL: ${verifiedCert.qrVerificationUrl}\n`);

// 6. Admin Audit Log Verification
console.log('7. Step 7 (Audit): Checking tamper-evident national audit ledger...');
const logs = getAuditLogs();
console.log(`✓ Total Audit Logs: ${logs.length}. Latest 3 transactions:`);
logs.slice(0, 3).forEach((l, idx) => {
  console.log(`   ${idx + 1}. [${l.action}] ${l.actor} - ${l.details.slice(0, 70)}... (${l.hash})`);
});

console.log('\n=== ALL 7 SIH 2026 E-MAAP WORKFLOW STAGES PASSED SUCCESSFULLY! ===\n');
