import Verification from '../models/Verification.js';
import Certificate from '../models/Certificate.js';
import Notification from '../models/Notification.js';
import { nextId, digitalHashOf } from '../utils/ids.js';

function today() {
  return new Date().toISOString().split('T')[0];
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Records the officer's field-inspection outcome as a Verification, and on PASS
// issues the resulting Certificate. Shared by PUT /api/applications/:id/complete
// and POST /api/verifications so both entry points behave identically.
export async function recordVerification({ application, instrument, actor, body }) {
  const now = today();
  const nowTime = timeNow();

  const verificationId = await nextId(Verification, 'VER-2026', 3);
  const verification = await Verification.create({
    _id: verificationId,
    applicationId: application._id,
    instrumentId: application.instrumentId,
    officer: actor._id,
    officerId: actor._id.toString(),
    officerName: body.officerName || actor.name,
    verdict: body.outcome === 'PASS' ? 'PASS' : 'FAIL',
    checklist: body.checklist,
    testMeasurements: body.testMeasurements,
    testDetails: body.testDetails || [],
    summaryNotes: body.summaryNotes,
    rejectionReason: body.rejectionReason,
    evidencePhotos: body.evidencePhotos || []
  });

  if (verification.verdict !== 'PASS') {
    application.status = 'REJECTED';
    application.history.push({
      date: `${now} ${nowTime}`,
      event: `Field verification FAILED. Reason: ${body.rejectionReason || 'Exceeded Maximum Permissible Error (MPE) limit'}.`
    });
    await application.save();

    if (instrument) {
      instrument.status = 'REJECTED';
      await instrument.save();
    }

    await Notification.create({
      userId: application.applicantTraderId,
      title: 'Verification Failed',
      message: `Field verification failed for ${application.instrumentName}. ${body.rejectionReason || ''}`.trim(),
      type: 'danger',
      link: '/business/applications'
    });

    return { outcome: 'FAIL', application, verification, certificate: null };
  }

  const expDateObj = new Date();
  expDateObj.setFullYear(expDateObj.getFullYear() + 1);
  const expiryDate = expDateObj.toISOString().split('T')[0];
  const stateCode = instrument?.state === 'Delhi' ? 'DL' : instrument?.state === 'Tamil Nadu' ? 'TN' : 'MH';
  const certId = await nextId(Certificate, 'CERT-2026', 3);
  const certNumber = `IND-LM-2026-${stateCode}-${Math.floor(10000 + Math.random() * 90000)}`;
  const stampNumber = `LM-${stateCode}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  application.status = 'COMPLETED';
  application.history.push({
    date: `${now} ${nowTime}`,
    event: `Field verification PASSED. Seal Tag ${stampNumber} applied. Certificate ${certNumber} issued.`
  });
  await application.save();

  const certificatePayload = {
    _id: certId,
    certificateNumber: certNumber,
    applicationId: application._id,
    verificationId: verification._id,
    instrumentId: application.instrumentId,
    instrumentType: instrument?.type || application.instrumentType,
    manufacturer: instrument?.manufacturer || 'Verified Manufacturer',
    model: instrument?.model || 'Verified Model',
    serialNumber: instrument?.serialNumber || 'SN-VERIFIED',
    accuracyClass: instrument?.accuracyClass || 'Class III (Medium Accuracy)',
    capacity: instrument
      ? `Max: ${instrument.maxCapacity} | Min: ${instrument.minCapacity} | e: ${instrument.verificationInterval}`
      : 'Standard Capacity',
    ownerName: application.applicantName,
    businessRegNo: instrument?.businessRegNo || 'N/A',
    establishmentAddress: application.premiseAddress,
    issueDate: now,
    expiryDate,
    status: 'VALID',
    stampingSealNumber: stampNumber,
    verificationStandard: 'Legal Metrology (General) Rules, 2011 - Schedule VII & Standards of Weights and Measures',
    issuingOfficer: body.officerName || application.assignedOfficerName || actor.name,
    issuingOfficerId: actor._id.toString(),
    issuingOffice: `Office of Legal Metrology, ${instrument?.district || 'Central'} Division, ${instrument?.state || 'Govt of India'}`,
    testResultsSummary: body.summaryNotes || 'All test points within Maximum Permissible Error (MPE). Lead stamping seal applied.',
    testDetails: body.testDetails || [],
    evidencePhotos: body.evidencePhotos || [],
    qrVerificationUrl: `/certificate/${certId}`
  };
  certificatePayload.digitalHash = digitalHashOf(certificatePayload);

  const certificate = await Certificate.create(certificatePayload);

  if (instrument) {
    instrument.status = 'VERIFIED';
    instrument.activeCertificateId = certId;
    instrument.lastVerifiedDate = now;
    instrument.expiryDate = expiryDate;
    instrument.stampingNumber = stampNumber;
    await instrument.save();
  }

  await Notification.create({
    userId: application.applicantTraderId,
    title: 'Verification Passed — Certificate Issued',
    message: `Certificate ${certNumber} issued for ${application.instrumentName}.`,
    type: 'success',
    link: `/certificate/${certId}`
  });

  return { outcome: 'PASS', application, verification, certificate };
}
