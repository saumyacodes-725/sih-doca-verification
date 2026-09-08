import { Router } from 'express';
import Instrument from '../models/Instrument.js';
import Notification from '../models/Notification.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { nextId } from '../utils/ids.js';

const router = Router();

function today() {
  return new Date().toISOString().split('T')[0];
}

router.get('/', authenticate, async (req, res) => {
  const filter = req.user.role === 'business' ? { owner: req.user._id } : {};
  const instruments = await Instrument.find(filter).sort({ createdAt: -1 });
  return res.status(200).json(instruments);
});

router.get('/:id', authenticate, async (req, res) => {
  const instrument = await Instrument.findOne({
    $or: [{ _id: req.params.id }, { serialNumber: req.params.id }]
  });
  if (!instrument) return res.status(404).json({ error: 'Instrument not found' });
  return res.status(200).json(instrument);
});

router.post('/', authenticate, requireRole('business', 'admin'), async (req, res) => {
  const body = req.body || {};
  const id = await nextId(Instrument, 'INST-2026');
  const now = today();

  const instrument = await Instrument.create({
    _id: id,
    type: body.type || 'Electronic Retail Scale',
    category: body.category || 'Commercial Weighing',
    manufacturer: body.manufacturer || 'Standard Scale Mfg',
    model: body.model || 'Model-X',
    serialNumber: body.serialNumber || `SN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    maxCapacity: body.maxCapacity || '30 kg',
    minCapacity: body.minCapacity || '100 g',
    verificationInterval: body.verificationInterval || '5 g',
    accuracyClass: body.accuracyClass || 'Class III (Medium Accuracy)',
    owner: req.user._id,
    ownerName: body.ownerName || req.user.name,
    ownerTraderId: req.user._id.toString(),
    ownerEmail: body.ownerEmail || req.user.email,
    businessRegNo: body.businessRegNo || req.user.gstin || 'N/A',
    location: body.location || 'New Delhi, India',
    state: body.state || req.user.state || 'Delhi',
    district: body.district || req.user.district || 'South Delhi',
    latitude: body.latitude || '28.5355',
    longitude: body.longitude || '77.2710',
    registrationDate: now,
    patternApprovalNo: body.patternApprovalNo || `IND-LM-PA-2026-${Math.floor(100 + Math.random() * 900)}`
  });

  await Notification.create({
    userId: 'ALL_ADMIN',
    title: 'New Instrument Registered',
    message: `${instrument.ownerName} registered a new ${instrument.type} (${instrument.serialNumber}).`,
    type: 'info',
    link: '/admin/instruments'
  });

  return res.status(201).json(instrument);
});

router.put('/:id', authenticate, async (req, res) => {
  const instrument = await Instrument.findById(req.params.id);
  if (!instrument) return res.status(404).json({ error: 'Instrument not found' });

  const isOwner = instrument.owner && instrument.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not allowed to modify this instrument' });
  }

  Object.assign(instrument, req.body || {});
  await instrument.save();
  return res.status(200).json(instrument);
});

export default router;
