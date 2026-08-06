import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

export const keysRouter = Router();
keysRouter.use(requireAuth);

keysRouter.get('/', async (req, res) => {
  const keys = await prisma.apiKey.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, prefix: true, createdAt: true, lastUsedAt: true, revokedAt: true },
  });
  res.json({ keys });
});

keysRouter.post('/', async (req, res) => {
  const name = (req.body?.name || 'default').toString().slice(0, 64);
  const raw = `sk_live_${crypto.randomBytes(24).toString('hex')}`;
  const prefix = raw.slice(0, 8);
  const keyHash = crypto.createHash('sha256').update(raw).digest('hex');
  const row = await prisma.apiKey.create({
    data: { userId: req.user.id, name, prefix, keyHash },
  });
  res.status(201).json({ id: row.id, name: row.name, prefix: row.prefix, key: raw, createdAt: row.createdAt });
});

keysRouter.delete('/:id', async (req, res) => {
  const key = await prisma.apiKey.findFirst({ where: { id: req.params.id, userId: req.user.id } });
  if (!key) return res.status(404).json({ error: 'Not found' });
  await prisma.apiKey.update({ where: { id: key.id }, data: { revokedAt: new Date() } });
  res.json({ ok: true });
});
