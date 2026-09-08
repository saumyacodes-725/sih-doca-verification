import { Router } from 'express';
import Instrument from '../models/Instrument.js';
import Application from '../models/Application.js';
import Certificate from '../models/Certificate.js';
import { getCollection } from '../../dataStore.js';

const router = Router();

router.get('/', async (req, res) => {
  const [instruments, applications, certificates, auditLogs] = await Promise.all([
    Instrument.find({}, 'status'),
    Application.find({}, 'status'),
    Certificate.find({}, 'status'),
    getCollection('auditLogs')
  ]);

  return res.status(200).json({
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
  });
});

export default router;
