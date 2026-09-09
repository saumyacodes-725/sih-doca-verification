import { Router } from 'express';
import Stripe from 'stripe';
import Application from '../models/Application.js';
import Instrument from '../models/Instrument.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { nextId } from '../utils/ids.js';
import { recordVerification } from '../services/verificationService.js';
import { calculateFee, formatRupees } from '../utils/fee.js';

const router = Router();

function today() {
  return new Date().toISOString().split('T')[0];
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

router.get('/', authenticate, async (req, res) => {
  const filter = {};
  if (req.user.role === 'business') filter.applicant = req.user._id;
  if (req.user.role === 'lmo') filter.assignedOfficer = req.user._id;
  const applications = await Application.find(filter).sort({ createdAt: -1 });
  return res.status(200).json(applications);
});

router.get('/:id', authenticate, async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ error: 'Application not found' });
  return res.status(200).json(application);
});

router.post('/', authenticate, requireRole('business', 'admin'), async (req, res) => {
  const body = req.body || {};
  const instrument = await Instrument.findById(body.instrumentId);
  if (!instrument) return res.status(400).json({ error: 'instrumentId does not reference a known instrument' });

  // When the Stripe gateway is configured, a real, verified payment is
  // mandatory — re-fetch and re-check the Checkout Session here rather than
  // trusting a prior /api/payments/verify call, since that response never
  // touches this route otherwise. Without gateway keys configured, fall
  // back to the original simulated Bharatkosh receipt so the app still
  // works out of the box.
  const gatewayConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
  let feeTransactionId;
  let paymentStatus;
  const fee = calculateFee(instrument);

  if (gatewayConfigured) {
    const { stripe_session_id } = body;
    if (!stripe_session_id) {
      return res.status(402).json({ error: 'Payment required: missing Stripe session confirmation' });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(stripe_session_id);
    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment verification failed' });
    }
    if (session.metadata?.instrumentId !== instrument._id) {
      return res.status(402).json({ error: 'Payment session does not match this instrument' });
    }
    feeTransactionId = session.payment_intent;
    paymentStatus = 'PAID';
  } else {
    feeTransactionId = `TXN-BHARATKOSH-${Math.floor(1000000 + Math.random() * 9000000)}`;
    paymentStatus = 'PAID';
  }

  const id = await nextId(Application, 'APP-2026', 3);
  const now = today();
  const nowTime = timeNow();

  const application = await Application.create({
    _id: id,
    instrumentId: instrument._id,
    instrumentName: `${instrument.type} (${instrument.model})`,
    instrumentType: instrument.type,
    applicant: req.user._id,
    applicantName: body.applicantName || instrument.ownerName || req.user.name,
    applicantTraderId: instrument.ownerTraderId,
    applicantEmail: body.applicantEmail || req.user.email,
    contactPhone: body.contactPhone || '+91 98112 34567',
    applicationType: body.applicationType || 'Periodic Annual Re-verification',
    accuracyClass: instrument.accuracyClass,
    premiseAddress: body.premiseAddress || instrument.location,
    state: instrument.state,
    district: instrument.district,
    submittedDate: now,
    feeAmount: formatRupees(fee.total),
    feeBreakdown: {
      verificationFee: formatRupees(fee.verification),
      stampingSealFee: formatRupees(fee.seal),
      portalProcessingFee: formatRupees(fee.portal)
    },
    feeTransactionId,
    paymentStatus,
    remarks: body.remarks || 'Standard online application submitted with online Bharatkosh payment.',
    history: [{ date: `${now} ${nowTime}`, event: 'Application submitted online with fee payment receipt' }]
  });

  instrument.status = 'APPLICATION_SUBMITTED';
  instrument.applicationId = id;
  instrument.verificationFeePaid = true;
  await instrument.save();

  await Notification.create({
    userId: 'ALL_ADMIN',
    title: 'New Verification Application',
    message: `Application ${id} submitted for ${application.instrumentName}. Needs admin review & scheduling.`,
    type: 'info',
    link: '/admin/applications'
  });

  return res.status(201).json(application);
});

router.put('/:id/assign', authenticate, requireRole('admin'), async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ error: 'Application not found' });

  const { officerId, scheduledDate, timeSlot, remarks } = req.body || {};
  const officer = await User.findById(officerId);
  if (!officer) return res.status(400).json({ error: 'officerId does not reference a known officer' });

  const now = today();
  const nowTime = timeNow();

  application.status = 'SCHEDULED';
  application.assignedOfficer = officer._id;
  application.assignedOfficerId = officer._id.toString();
  application.assignedOfficerName = officer.name;
  application.scheduledDate = scheduledDate;
  application.scheduledTimeSlot = timeSlot || '10:30 AM - 01:00 PM';
  if (remarks) application.remarks = remarks;
  application.history.push({
    date: `${now} ${nowTime}`,
    event: `Reviewed & scheduled for ${scheduledDate} (${application.scheduledTimeSlot}) with ${officer.name}`
  });
  await application.save();

  const instrument = await Instrument.findById(application.instrumentId);
  if (instrument) {
    instrument.status = 'SCHEDULED';
    await instrument.save();
  }

  await Notification.create({
    userId: officer._id.toString(),
    title: 'New Field Verification Assigned',
    message: `You are scheduled to verify ${application.instrumentName} on ${scheduledDate} (${application.scheduledTimeSlot}).`,
    type: 'primary',
    link: `/lmo/inspect/${application._id}`
  });

  return res.status(200).json(application);
});

router.put('/:id/complete', authenticate, requireRole('lmo', 'admin'), async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ error: 'Application not found' });

  const instrument = await Instrument.findById(application.instrumentId);
  const result = await recordVerification({ application, instrument, actor: req.user, body: req.body || {} });

  return res.status(200).json({ success: true, ...result });
});

export default router;
