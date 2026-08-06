# SaaS Starter Kit — React + Node.js + Stripe

Launch a SaaS in days. Full-stack starter with **auth**, **Stripe subscriptions**, **API keys**, and a polished **admin dashboard**.

## Stack
- **Web:** React + Vite + TypeScript + Tailwind (dark mode, charts, tables)
- **API:** Express + Prisma + JWT + Zod
- **Billing:** Stripe Checkout, Customer Portal, webhooks
- **API keys:** generate / list / revoke
- **Plans:** free · pro · enterprise
- **Docker:** Postgres + API + Web
- **CI:** GitHub Actions

## Quick start

```bash
cp .env.example .env
npm install
npm run db:push -w apps/api
npm run db:seed -w apps/api
npm run dev:api   # terminal 1 — http://localhost:4000
npm run dev:web   # terminal 2 — http://localhost:5173
```

Demo login after seed: `admin@example.com` / `password123`

## Stripe setup
1. Create products/prices in Stripe test mode
2. Put price IDs in `.env` (`STRIPE_PRICE_PRO`, `STRIPE_PRICE_ENTERPRISE`)
3. Forward webhooks: `stripe listen --forward-to localhost:4000/api/billing/webhook`

## Docker
```bash
docker compose up --build
```

## Project layout
```
apps/api   — Express API, Prisma, Stripe, API keys
apps/web   — React admin dashboard
```

## License
MIT — see LICENSE

## Aspen Grove
Standalone product package (**MIT**). Meta mesh: [aspen-grove](https://github.com/AbsolutionAI/aspen-grove).  
Third-party: `THIRD_PARTY.md`. Run `make smoke`.
