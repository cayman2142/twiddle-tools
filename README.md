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

Cloudflare Pages, output `dist`:

- `/` → React landing
- `/privacy` → `privacy.html` (Chrome Web Store needs this URL)

Wrangler cannot deploy from this machine without `CLOUDFLARE_API_TOKEN`. In the Cloudflare dashboard:

1. Workers & Pages → Create → Pages → Connect the GitHub repo.
2. Build command `npm run build`, output `dist`.
3. Custom domain: attach the existing `twiddle.tools` zone (already on Cloudflare Registrar).
4. Confirm `https://twiddle.tools/privacy` returns 200 before the CWS listing.

## Claims

Copy follows `projects/spec-lens/docs/CWS-LISTING-PLAN.md`. Do not invent a sixth core feature. Do not claim unique token names, unique state forcing, MCP, or “no network”.
