import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

dashboardRouter.get('/stats', async (req, res) => {
  const userId = req.user.id;
  const [keys, activeKeys, user] = await Promise.all([
    prisma.apiKey.count({ where: { userId } }),
    prisma.apiKey.count({ where: { userId, revokedAt: null } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);
  res.json({
    plan: user?.plan || 'free',
    apiKeys: keys,
    activeApiKeys: activeKeys,
    // demo series for charts
    usage: [12, 19, 14, 22, 28, 31, 26],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  });
});
