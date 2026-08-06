import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';
import { keysRouter } from './routes/keys.js';
import { billingRouter, stripeWebhook } from './routes/billing.js';
import { dashboardRouter } from './routes/dashboard.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Stripe webhook needs raw body
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRouter);
app.use('/api/keys', keysRouter);
app.use('/api/billing', billingRouter);
app.use('/api/dashboard', dashboardRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`SaaS API on http://localhost:${config.port}`);
});

export default app;
