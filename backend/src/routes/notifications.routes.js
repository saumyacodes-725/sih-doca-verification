import { Router } from 'express';
import Notification from '../models/Notification.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;
  const orClauses = [{ userId }, { userId: 'ALL' }];
  if (req.user.role === 'admin') orClauses.push({ userId: 'ALL_ADMIN' });

  const notifications = await Notification.find({ $or: orClauses }).sort({ createdAt: -1 });
  return res.status(200).json(notifications);
});

router.put('/:id/read', authenticate, async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!notification) return res.status(404).json({ error: 'Notification not found' });
  return res.status(200).json(notification);
});

export default router;
