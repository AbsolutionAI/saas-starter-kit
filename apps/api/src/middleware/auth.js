import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { prisma } from '../db.js';
import crypto from 'crypto';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || typeof key !== 'string') return res.status(401).json({ error: 'API key required' });
  const prefix = key.slice(0, 8);
  const candidates = await prisma.apiKey.findMany({ where: { prefix, revokedAt: null } });
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  const match = candidates.find((c) => c.keyHash === hash);
  if (!match) return res.status(401).json({ error: 'Invalid API key' });
  await prisma.apiKey.update({ where: { id: match.id }, data: { lastUsedAt: new Date() } });
  req.apiKey = match;
  req.user = { id: match.userId };
  next();
}
