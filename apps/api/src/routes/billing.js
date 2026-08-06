import { Router } from 'express';
import Stripe from 'stripe';
import express from 'express';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { requireAuth } from '../middleware/auth.js';

export const billingRouter = Router();
const stripe = config.stripeSecret ? new Stripe(config.stripeSecret) : null;

billingRouter.post('/checkout', requireAuth, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY.' });
  const plan = req.body?.plan === 'enterprise' ? 'enterprise' : 'pro';
  const priceId = config.prices[plan];
  if (!priceId) return res.status(400).json({ error: `Missing STRIPE_PRICE_${plan.toUpperCase()}` });

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${config.clientUrl}/billing?success=1`,
    cancel_url: `${config.clientUrl}/billing?canceled=1`,
    metadata: { userId: user.id, plan },
  });
  res.json({ url: session.url });
});

billingRouter.post('/portal', requireAuth, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe not configured' });
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user.stripeCustomerId) return res.status(400).json({ error: 'No Stripe customer' });
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${config.clientUrl}/billing`,
  });
  res.json({ url: session.url });
});

// raw body webhook mounted separately in index
export async function stripeWebhook(req, res) {
  if (!stripe) return res.status(503).end();
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripeWebhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan || 'pro';
    if (userId) {
      await prisma.user.update({ where: { id: userId }, data: { plan } });
      if (session.subscription) {
        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: session.subscription },
          update: { status: 'active', priceId: plan },
          create: {
            userId,
            stripeSubscriptionId: session.subscription,
            status: 'active',
            priceId: plan,
          },
        });
      }
    }
  }
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const row = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: sub.id } });
    if (row) {
      await prisma.subscription.update({ where: { id: row.id }, data: { status: 'canceled' } });
      await prisma.user.update({ where: { id: row.userId }, data: { plan: 'free' } });
    }
  }
  res.json({ received: true });
}
