# Travel Chinese

Practical Mandarin travel phrases for English-speaking visitors — Chinese, pinyin, English translation, and browser TTS pronunciation.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Free trial: first 80 phrases
- Full pack: 360 phrases across 13 scenes (each scene has a short free trial)
- Without Stripe env vars, **Unlock** runs in **demo mode** (local unlock on this device)

## Scripts

```bash
npm run dev          # local preview
npm run build        # production build
npm run generate:phrases   # regenerate content/phrases.json
```

## Stripe (optional)

Copy `.env.example` to `.env.local` and fill:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID` (one-time price, e.g. $7.99)
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_WEBHOOK_SECRET` (for `/api/webhook`)

## Deploy

Push to GitHub → import on [Vercel](https://vercel.com) → get a free `*.vercel.app` URL. No dedicated server required.

## Content

Phrases live in `content/phrases.json`. Edit or regenerate via `scripts/generate-phrases.mjs`.
