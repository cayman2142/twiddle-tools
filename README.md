# twiddle.tools

Marketing site for [Twiddle](https://twiddle.tools) — tell the agent exactly.

The Chrome extension lives in its own repo (`cayman2142/twiddle`, locally `../twiddle`). This repo is the public site only. Install link: [Chrome Web Store](https://chromewebstore.google.com/detail/twiddle/hfdioniicfkfefcmcllkfhgihcjblamn) (`src/links.ts`).

## Stack

- Vite + React + TypeScript
- Marketing tokens: `--tw-*` (Onest + IBM Plex Mono)
- Staged Twiddle chrome: vendored `vendor/chrome/*.css` (not `spec-lens.js`), renamed `sl-` → `twc-`
- Toolbar: `src/chrome/snapshots/*.html`, captured from a running 0.1.6 build
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
npm run vendor:chrome -- ../twiddle
```

The script renames every `sl-` class, `--sl-` token and `data-sl-` attribute to
`twc-`. **Do not hand-copy product CSS without it.** The extension injects its own
`spec-lens.css` into whatever page it runs on, twiddle.tools included. With shared
names, the live plugin's `position: fixed` rules grabbed the staged replicas, and
this site's copy restyled the live plugin. With `twc-`, the two never match.
Anything new under `src/chrome/` must use `twc-` too.

## Hero playground

The hero runs the real twiddle engine on a sample sign-in page
(`public/playground/forge.html`, generated from `demo/index.html` by
`npm run make:forge`) inside a same-origin iframe. `src/playground/bridge.ts`
is the only code that reaches into it.

- The engine is **not** in git. `npm run vendor:engine` (run automatically
  before `dev` and `build`) copies `spec-lens.js`/`.css` from
  `../twiddle/extension`; `public/playground/engine/VERSION` says which build
  is live. After a plugin release: rebuild the extension in the product repo,
  then `npm run build` here and run `npm run test:e2e`.
- Hints and copy detection read the engine's markup (`aria-label`s,
  `data-sl-*`, a few `.sl-*` classes). If a refresh breaks
  `tests/e2e/finish.spec.ts` or `coach.spec.ts`, update the selectors in
  `Coach.tsx` / `copyKind.ts` / `tests/e2e/helpers.ts`.
- Below 880px of stage width, or if the engine fails to load, a recording
  plays instead (`npm run record:playground`, with `vite preview` on 4179).
- `PLUGIN=1 npx playwright test tests/e2e/with-plugin.spec.ts` checks that an
  installed copy of the plugin and the playground leave each other alone.

Because `prebuild` runs `vendor:engine`, `npm run build` (and therefore
`npm run deploy`) needs the product repo checked out at `../twiddle` with a
built `extension/`.

## Deploy

**Live (2026-09-21):** [twiddle.tools](https://twiddle.tools) — Cloudflare Worker `twiddle-tools` serving `dist` as static assets (not Pages). Fallback: `https://twiddle-tools.caymnjke.workers.dev`.

- `/` → React landing
- `/privacy` → `privacy.html` (Chrome Web Store needs this URL — must stay 200)

First time on a machine: `npx wrangler login`. Then:

```bash
npm run deploy
```

That is `npm run build && wrangler deploy`. Config is `wrangler.jsonc` (custom domains `twiddle.tools` and `www.twiddle.tools`). After a deploy, open `/` and `/privacy` once.

Hosting notes and CWS copy rules: `../twiddle/docs/MARKETING-SITE.md` and `../twiddle/docs/CWS-LISTING-PLAN.md`.

## Claims

Copy follows `../twiddle/docs/CWS-LISTING-PLAN.md`. Do not invent a sixth core feature. Do not claim unique token names, unique state forcing, MCP, or “no network”.
