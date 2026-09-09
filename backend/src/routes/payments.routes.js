import { Router } from 'express';
import Stripe from 'stripe';
import Instrument from '../models/Instrument.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { calculateFee } from '../utils/fee.js';

const router = Router();

function getStripeClient() {
  const { STRIPE_SECRET_KEY } = process.env;
  if (!STRIPE_SECRET_KEY) return null;
  return new Stripe(STRIPE_SECRET_KEY);
}

// Prefer an explicit override (useful if the frontend is ever hosted
// separately from the API); otherwise derive it from the incoming request so
// this works unmodified on any Vercel URL — production domain or per-branch
// preview deployment alike — without needing a redeploy to update it.
function frontendUrl(req) {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL;
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  return `${proto}://${req.get('host')}`;
}

// Whether the real gateway is wired up at all — the frontend uses this to
// decide between a real Stripe Checkout redirect or the simulated
// Bharatkosh modal fallback.
router.get('/status', (req, res) => {
  res.status(200).json({ configured: Boolean(getStripeClient()) });
});

router.post('/create-order', authenticate, requireRole('business', 'admin'), async (req, res) => {
  const stripe = getStripeClient();
  if (!stripe) {
    return res.status(503).json({ error: 'Payment gateway not configured. Set STRIPE_SECRET_KEY in backend/.env.' });
  }

  const { instrumentId } = req.body || {};
  const instrument = await Instrument.findById(instrumentId);
  if (!instrument) return res.status(400).json({ error: 'instrumentId does not reference a known instrument' });

  const fee = calculateFee(instrument);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          unit_amount: fee.total * 100, // paise
          product_data: {
            name: `Legal Metrology Verification Fee — ${instrument.type}`,
            description: `Statutory stamping & verification fee for ${instrument.model} (SN: ${instrument.serialNumber})`
          }
        },
        quantity: 1
      }
    ],
    metadata: {
      instrumentId: instrument._id,
      userId: req.user._id.toString()
    },
    success_url: `${frontendUrl(req)}/business/apply?payment=success&session_id={CHECKOUT_SESSION_ID}&instrumentId=${instrument._id}`,
    cancel_url: `${frontendUrl(req)}/business/apply?payment=cancelled&instrumentId=${instrument._id}`
  });

  return res.status(201).json({ url: session.url, sessionId: session.id, fee });
});

router.post('/verify', authenticate, async (req, res) => {
  const stripe = getStripeClient();
  if (!stripe) {
    return res.status(503).json({ error: 'Payment gateway not configured.' });
  }

  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== 'paid') {
    return res.status(400).json({ error: 'Payment not completed', verified: false });
  }

  return res.status(200).json({ verified: true, paymentId: session.payment_intent, sessionId: session.id });
});

export default router;
