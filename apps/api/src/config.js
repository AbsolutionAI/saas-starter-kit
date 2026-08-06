export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  stripeSecret: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  prices: {
    pro: process.env.STRIPE_PRICE_PRO || '',
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE || '',
  },
};
