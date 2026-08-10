# Travel Chinese MVP — Design Spec

**Date:** 2026-08-10  
**Status:** Approved for implementation  
**Product:** Single-course learning site for travelers learning Mandarin Chinese

## Goals

- Help English-speaking travelers learn practical spoken Chinese for trips to China.
- Ship a minimal “listen + read + practice” loop with subtitle (Chinese), pinyin, English translation, and TTS pronunciation.
- Validate willingness to pay via a one-time unlock (Stripe), not ads or a multi-course platform.

**90-day success:** Organic/content acquisition produces at least one paid unlock.

## Non-goals (V1)

- Multi-language platform, Daily Life course, AI chat coach
- Spaced-repetition algorithm, ASR scoring
- Subscriptions, ads, social features

## Users

- Primary: English-speaking travelers preparing for or currently in China
- UI language: English
- Content: Simplified Chinese + pinyin + natural English

## Information architecture

1. **Landing (`/`)** — Value proposition, free trial CTA, price
2. **Course (`/learn`)** — Scene list (Airport, Taxi/Metro, Hotel, Restaurant, Shopping, Emergency, Small Talk)
3. **Phrase practice (`/learn/[scene]` or in-page cards)** — zh / pinyin / en, Play, Slow, Bookmark, Next
4. **Progress** — Learned / bookmarked counts; remaining free phrases (client UI)
5. **Checkout success (`/success`)** — Confirm unlock entitlement

## Content model

File: `content/phrases.json`

```ts
type Phrase = {
  id: string;       // e.g. "airport-001"
  scene: string;    // airport | taxi | hotel | restaurant | shopping | emergency | smalltalk
  zh: string;
  pinyin: string;
  en: string;
  order: number;
  free: boolean;    // first ~80 marked free for trial
};
```

Initial pack: ~200–300 phrases across 7 scenes. Target later: ~800.

## Learning UX

- Phrase card shows Chinese prominently, pinyin under it, English below.
- **Play** uses Web Speech API (`zh-CN`); **Slow** reduces rate (~0.7).
- Optional record-and-playback (MediaRecorder) for self-listen; no auto-scoring in V1.
- Bookmark + “studied” flags in `localStorage`.
- Free users can open free-marked phrases only; paid users unlock all.

## Monetization

- Free: ~80 phrases (`free: true`)
- Paid: one-time Unlock Full Course via Stripe Checkout ($9.9–$14.9; default $12.99)
- After payment: webhook (or client success + session verify) sets entitlement
- Entitlement storage V1: email + unlock flag in a simple JSON/KV file or cookie + server session keyed by Stripe session; MVP uses signed cookie / localStorage unlock token verified via Stripe session retrieval on `/success`

## Tech stack

| Layer | Choice |
| --- | --- |
| App | Next.js App Router + TypeScript + Tailwind |
| Content | Static JSON |
| TTS | Web Speech API (`zh-CN`) |
| Progress | `localStorage` |
| Payments | Stripe Checkout + webhook |
| Hosting | Vercel |
| Analytics | Optional GA4/Plausible placeholder |

## Security / legal (MVP)

- English Privacy Policy + Refund Policy pages
- No scraping of copyrighted phrasebooks; original/AI-drafted + curated content
- Stripe secrets only in server env

## Ops / acquisition (post-ship)

- SEO landing + scene pages targeting long-tail queries
- Short-form video “1 phrase/day”
- Helpful Reddit posts (not hard sell)
- Content calendar in `docs/ops/content-launch.md`

## Open follow-ups (post-MVP)

- Azure/OpenAI TTS swap
- Magic-link accounts
- Daily Life course
- Human voice recordings
