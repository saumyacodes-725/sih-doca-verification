import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticate, requireRole, signToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role, ...profileFields } = req.body || {};

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'name, email, password and role are required' });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role, ...profileFields });

  return res.status(201).json({ token: signToken(user), user: user.toPublicJSON() });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  return res.status(200).json({ token: signToken(user), user: user.toPublicJSON() });
});

router.get('/me', authenticate, async (req, res) => {
  return res.status(200).json(req.user.toPublicJSON());
});

// Lists real field-officer accounts (LMO/GATC) so admin can assign
// applications to an actual MongoDB User instead of the legacy demo directory.
router.get('/officers', authenticate, requireRole('admin'), async (req, res) => {
  const officers = await User.find({ role: { $in: ['lmo', 'gatc'] } });
  return res.status(200).json(officers.map((officer) => officer.toPublicJSON()));
});

export default router;
