import { Router } from 'express';
import Verification from '../models/Verification.js';
import Application from '../models/Application.js';
import Instrument from '../models/Instrument.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { recordVerification } from '../services/verificationService.js';

const router = Router();

// Same effect as PUT /api/applications/:id/complete (records the officer's
// inspection outcome and issues a Certificate on PASS) - exposed here too so
// an officer can record a verification directly against /api/verifications.
router.post('/', authenticate, requireRole('lmo', 'admin'), async (req, res) => {
  const body = req.body || {};
  const application = await Application.findById(body.applicationId);
  if (!application) return res.status(400).json({ error: 'applicationId does not reference a known application' });

  const instrument = await Instrument.findById(application.instrumentId);
  const result = await recordVerification({ application, instrument, actor: req.user, body });

  return res.status(201).json(result);
});

router.get('/officer/:officerId', authenticate, async (req, res) => {
  const verifications = await Verification.find({ officerId: req.params.officerId }).sort({ createdAt: -1 });
  return res.status(200).json(verifications);
});

router.get('/:id', authenticate, async (req, res) => {
  const verification = await Verification.findById(req.params.id);
  if (!verification) return res.status(404).json({ error: 'Verification not found' });
  return res.status(200).json(verification);
});

export default router;
