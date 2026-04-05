# WebhookDelivery

A reliable webhook delivery service that guarantees your webhooks are delivered even when your server is down. Built with Next.js, BullMQ, Redis, and PostgreSQL.

## The Problem

When a service like Stripe sends a webhook to your server and your server is down, the webhook is lost forever. WebhookDelivery acts as a reliable middleman — it receives the webhook, stores it safely, and keeps retrying delivery until your server comes back up.

## How It Works

1. You register your server's URL on the dashboard
2. You get a unique webhook URL to give to any service (Stripe, GitHub, etc.)
3. When a webhook arrives, it's instantly stored and queued for delivery
4. A background worker delivers it to your server
5. If delivery fails, it retries automatically with exponential backoff (1s, 2s, 4s, 8s, 16s)
6. After 5 failed attempts, the webhook moves to a dead letter queue
7. You can monitor all webhook events and delivery attempts from the dashboard

## Features

- **Reliable delivery** — webhooks are stored in PostgreSQL before any delivery attempt
- **Automatic retries** — exponential backoff with up to 5 retry attempts
- **Dead letter queue** — failed webhooks are preserved for inspection
- **Real-time dashboard** — monitor all events, payloads, and delivery attempts
- **Signing secrets** — each endpoint gets a unique secret for payload verification
- **Auto-refresh** — dashboard updates every 5 seconds automatically

## Tech Stack

- **Frontend & Backend** — Next.js 16, TypeScript, Tailwind CSS
- **Queue** — BullMQ with Redis
- **Database** — PostgreSQL (Neon) with Prisma ORM
- **Auth** — NextAuth.js with JWT
- **Deployment** — Vercel (app) + Railway (worker) + Upstash (Redis)

## Architecture
```
Sender (Stripe/GitHub) 
    → POST /api/webhook/:apiKey        (Next.js — receives & stores)
    → PostgreSQL (webhook_events)      (stored immediately)
    → BullMQ Queue (Redis)             (queued for delivery)
    → Worker Process                   (picks up job)
    → Your Server                      (delivered with retries)
    → PostgreSQL (delivery_attempts)   (attempt logged)
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Redis instance (Upstash recommended)

### Installation
```bash
git clone https://github.com/yourusername/webhook-delivery.git
cd webhook-delivery
npm install
```

### Environment Variables

Create a `.env` file:
```env
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password (optional for local)
```

### Run Locally

Start the Next.js app:
```bash
npm run dev
```

Start the worker in a separate terminal:
```bash
npm run worker
```

### Testing

Use a local test server to receive webhooks:
```bash
node test-server.js
```

Send a test webhook:
```bash
curl -X POST http://localhost:3000/api/webhook/YOUR_API_KEY \
  -H "Content-Type: application/json" \
  -d '{"event": "payment.success", "amount": 100}'
```

## Deployment

- **Next.js app** → [Vercel](https://vercel.com)
- **Worker** → [Railway](https://railway.app) with start command `npm run worker`
- **Redis** → [Upstash](https://upstash.com)
- **Database** → [Neon](https://neon.tech)

## Database Schema
```
users               — accounts with unique API keys
endpoints           — target delivery URL per user
webhook_events      — all incoming webhooks with status
delivery_attempts   — every delivery attempt with response status
```

## License

MIT
