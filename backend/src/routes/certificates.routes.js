import { Router } from 'express';
import Certificate from '../models/Certificate.js';
import Notification from '../models/Notification.js';
import Instrument from '../models/Instrument.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

function today() {
  return new Date().toISOString().split('T')[0];
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Certificates aren't flipped to EXPIRED by any background job — this computes
// it from today's date at read time, without touching the stored document
// (REVOKED stays REVOKED regardless of date).
function withComputedStatus(certificate) {
  const plain = certificate.toObject();
  const isPastExpiry = plain.expiryDate && new Date(plain.expiryDate) < new Date();
  if (plain.status === 'VALID' && isPastExpiry) {
    plain.status = 'EXPIRED';
  }
  return plain;
}

router.get('/', authenticate, async (req, res) => {
  const certificates = await Certificate.find().sort({ createdAt: -1 });
  return res.status(200).json(certificates.map(withComputedStatus));
});

// PUBLIC — this is what a QR-code scan on a physical certificate calls. No auth.
router.get('/verify/:certId', async (req, res) => {
  const raw = String(req.params.certId || '').trim();
  if (!raw) return res.status(400).json({ error: 'certId is required' });
  const pattern = `^${escapeRegex(raw)}$`;

  const certificate = await Certificate.findOne({
    $or: [
      { _id: { $regex: pattern, $options: 'i' } },
      { certificateNumber: { $regex: pattern, $options: 'i' } },
      { stampingSealNumber: { $regex: pattern, $options: 'i' } },
      { serialNumber: { $regex: pattern, $options: 'i' } },
      { instrumentId: { $regex: pattern, $options: 'i' } }
    ]
  });

  if (!certificate) return res.status(404).json({ error: 'No certificate found for this identifier' });
  return res.status(200).json(withComputedStatus(certificate));
});

router.get('/:id', authenticate, async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
  return res.status(200).json(withComputedStatus(certificate));
});

router.put('/:id/revoke', authenticate, requireRole('admin'), async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

  certificate.status = 'REVOKED';
  certificate.revocationReason = req.body?.reason || 'Revoked by Legal Metrology Controller due to consumer dispute / seal tampering.';
  certificate.revokedAt = today();
  await certificate.save();

  const instrument = await Instrument.findById(certificate.instrumentId);
  if (instrument) {
    instrument.status = 'EXPIRED';
    await instrument.save();
  }

  await Notification.create({
    userId: 'ALL_ADMIN',
    title: 'Certificate Revoked',
    message: `Certificate ${certificate.certificateNumber} was revoked. Reason: ${certificate.revocationReason}`,
    type: 'danger',
    link: `/admin/certificates`
  });

  return res.status(200).json(certificate);
});

export default router;
