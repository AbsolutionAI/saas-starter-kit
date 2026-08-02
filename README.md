# SaaS Starter Kit

**Launch your SaaS in days, not months.** Full-stack starter with React frontend, Node.js API, Stripe subscriptions, API key management, and Docker.

## Quick Start

```bash
# Install root tooling (concurrently)
npm install

# Backend
cd backend
cp .env.example .env
npm install
npx prisma db push
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Or from the repo root after both installs:

```bash
npm run dev
```

- Frontend: http://localhost:3000  
- API: http://localhost:4000  

Vite proxies `/api` → backend automatically.

## Architecture

```
frontend/     → React + Vite + Tailwind
  Login / Signup / Dashboard / Billing / API Keys / Settings
backend/      → Express + Prisma + Stripe + JWT
docker-compose.yml → Full stack with Postgres
```

## Features

- **Auth** — signup, login, JWT, protected routes, `/api/auth/me`
- **Subscriptions** — Stripe checkout, billing portal, webhooks
- **API keys** — generate, list, revoke
- **Dashboard** — plan status, key count, next steps
- **Docker** — full stack with Postgres
- **CI** — GitHub Actions

## Environment

See `backend/.env.example`. Stripe keys are optional for auth + API keys; required for live checkout.

## License

MIT
