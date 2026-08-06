import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

const creds = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

function sign(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, plan: user.plan }, config.jwtSecret, { expiresIn: '7d' });
}

authRouter.post('/signup', async (req, res) => {
  const parsed = creds.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, name } });
  res.status(201).json({ token: sign(user), user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role } });
});

authRouter.post('/login', async (req, res) => {
  const parsed = creds.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid credentials' });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  res.json({ token: sign(user), user: { id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role } });
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ id: user.id, email: user.email, name: user.name, plan: user.plan, role: user.role });
});
