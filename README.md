# twiddle.tools

Marketing site for [Twiddle](https://twiddle.tools) — tell the agent exactly.

Chrome extension product lives in the Knowledge Base `projects/spec-lens` folder. This repo is the public site only.

## Stack

- Vite + React + TypeScript
- Marketing tokens: `--tw-*` (Onest + IBM Plex Mono)
- Staged Twiddle chrome: vendored `vendor/chrome/*.css` (not `spec-lens.js`)
- Host simulation: Relay mini-app with its own `--color-*` / `--space-*`

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Refresh chrome CSS after a product DS change:

```bash
npm run vendor:chrome -- "C:\Knowledge Base\projects\spec-lens"
```

## Deploy

**Live (2026-09-21):** [twiddle.tools](https://twiddle.tools) — Cloudflare Worker `twiddle-tools` serving `dist` as static assets (not Pages). Fallback: `https://twiddle-tools.caymnjke.workers.dev`.

- `/` → React landing
- `/privacy` → `privacy.html` (Chrome Web Store needs this URL — must stay 200)

First time on a machine: `npx wrangler login`. Then:

```bash
npm run deploy
```

That is `npm run build && wrangler deploy`. Config is `wrangler.jsonc` (custom domains `twiddle.tools` and `www.twiddle.tools`). After a deploy, open `/` and `/privacy` once.

KB (where/how, CWS notes): `projects/spec-lens/docs/MARKETING-SITE.md`.

## Claims

Copy follows `projects/spec-lens/docs/CWS-LISTING-PLAN.md`. Do not invent a sixth core feature. Do not claim unique token names, unique state forcing, MCP, or “no network”.
