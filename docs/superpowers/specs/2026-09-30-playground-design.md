# Playground: the real twiddle engine in the hero

Date: 2026-09-30. Status: approved in chat, awaiting spec review.

## Goal

Replace the hero's scripted React demo (`src/host/HeroDemo.tsx`) with a
playground where a visitor uses the **real** twiddle engine on a fake sign-in
page: change spacing, colours, radius, and text, then copy the result the way
they would for an agent. The copy is the finish line; it answers with the
visitor's own diff and the Chrome Web Store link.

Non-goals: changing the product repo, touching the sections below the hero
(How it works, the three scenes, Handoff, FAQ), analytics.

## Decisions (from the brainstorm)

| Question | Decision |
|---|---|
| Engine | The shipped build, not a React re-creation |
| Placement | In the hero, in place of `HeroDemo`, full content width |
| Start | Engine is already on when the playground appears, card pre-selected |
| Narrow screens (< 900px) | Looping video recorded from the playground + "open on desktop" note; the engine is never downloaded |
| Finish | Card with the visitor's copied payload + CTA |

## Architecture

### Vendored engine

`npm run vendor:engine` (new, `scripts/vendor-engine.mjs`) copies
`../twiddle/extension/spec-lens.js` and `spec-lens.css` into
`public/playground/engine/`, and writes `public/playground/engine/VERSION` with
the manifest version (0.1.6 today). The source path is an argument with that
default, like `vendor:chrome`.

No class renaming. Inside the iframe the engine's `sl-*` names live in their own
document, so they cannot meet the site's `twc-*` replicas or the visitor's
installed plugin. The product repo is not modified. Refreshing the playground
after a plugin release is one command plus a commit.

### Host page

`public/playground/forge.html`, derived from `demo/index.html` (the Forge
sign-in used for the promo video):

- Inter and the lucide icons are served locally (no Google Fonts, no CDN), so
  the playground makes no third-party requests.
- The card is sized to sit comfortably in a ~1100×680 frame next to the
  engine's 324px panel and above its toolbar.
- At the end of `<body>` it loads `engine/spec-lens.css`,
  `engine/spec-lens.js`, and calls `window.Twiddle.on()`.

The page works on its own when opened directly, which is how it is debugged.
`demo/index.html` stays as it is (promo tooling uses it).

### Site component

`src/playground/`:

- `Playground.tsx` — mounted in `Hero.tsx` where `HeroDemo` is today. Renders a
  `StageFrame` (URL `forge.dev/login`) containing the iframe, `Coach`, and
  `FinishCard`, plus the checklist under the frame. Below 900px it renders
  `PlaygroundVideo` instead and never creates the iframe.
- `bridge.ts` — the only code that reaches into the iframe (same origin). It:
  - waits for `window.Twiddle` (8s timeout → failure);
  - pre-selects the card and switches to Edit (see Start state);
  - observes the Forge DOM with `MutationObserver` and emits `change` events
    classified as `space`, `colour`, or `text`;
  - wraps the iframe window's `navigator.clipboard.writeText`,
    `navigator.clipboard.write`, and `document.execCommand('copy')`, calling
    through to the originals, and emits `copied { kind, text }`, where `kind`
    is `changes` or `block` depending on the control that started it (see How
    detection works);
  - resolves anchor rects for the coach (`rectOf(target)`), returning `null`
    when an element is missing.
- `Coach.tsx` — the floating hint (below).
- `Checklist.tsx` — the four tasks and the Reset button.
- `FinishCard.tsx` — the finish card (below).
- `PlaygroundVideo.tsx` — `<video autoplay muted loop playsinline>` with a
  poster, plus the "twiddle runs in desktop Chrome — open this page there to
  try it" note and the CTA.
- `playground.css` — site tokens (`--tw-*`) only; nothing here styles the
  engine.

The iframe is created lazily with `IntersectionObserver` (`rootMargin` ~200px),
so the first paint of the landing does not grow. On tall screens that still
means immediately, which matches "already on".

`HeroDemo.tsx` and `onboarding.css` are deleted once nothing imports them. The
Hero hint line ("Try it: click a box, then change the numbers") is replaced by
the checklist.

### How detection works

Established by reading `src/core/legacy.js` in the product repo:

- Style edits go through `applyEdit`, which writes inline styles with
  `!important` (`el.style.setProperty(prop, value, 'important')`). A `style`
  attribute mutation on a Forge element (anything outside `[data-sl-chrome]`)
  is diffed against its previous value to find the property:
  - `padding*`, `margin*`, `gap`, `border*-radius` → `space`
  - `color`, `background*`, `border*-color`, `fill`, `stroke` → `colour`
- Text edits use a temporary `contentEditable`; `characterData` / `childList`
  mutations inside Forge content → `text`.
- Copy actions: all clipboard writes in the engine go through
  `navigator.clipboard.writeText`, `navigator.clipboard.write`, or
  `document.execCommand('copy')`. `kind` comes from the last chrome control
  clicked before the write:
  - `changes` — **Copy changes** is the `Copy all changes` button
    (`[data-sl-changes="copy"]`) in the panel's **Changes** tab
    (`.sl-panel__tab[data-sl-tab="changes"]`), or any copy inside `.sl-changes`.
    This is the product's main output and the playground's finish line.
  - `block` — the toolbar's `Copy as Agent MD` / `Copy as HTML` button
    (`.sl-toolbar__copy-block`), its format menu (`.sl-toolbar__copy-menu`),
    and `Copy element` (also Ctrl+C with no click). These copy the pinned
    element and its children, not the edits.
  - No recent chrome click (keyboard copy) → `block`.
  Screenshot writes an image (`navigator.clipboard.write`) and is ignored.
- Correction to the brainstorm: the toolbar's `Copy as Agent MD` is the block
  copy, not Copy changes. Copy changes lives in the Changes tab.

## Behaviour

### Start state

Before the engine script loads, `forge.html` merges `{"onboardingDone": true}`
into `localStorage['twiddle-prefs']`, so the engine's own first-run tour does
not start on top of the coach. (Playwright sets `navigator.webdriver`, which
also suppresses the tour, so tests cannot catch a regression here; check by
hand once in a normal browser.)

On `Twiddle` ready, the bridge switches to Edit mode (clicks the toolbar's
`Edit mode` button) and pins the card with a synthetic pointer click on its
padding edge, so the panel opens on `card` as in the reference screenshot. If
either step fails the playground still works, the visitor just starts from
Inspect.

### Checklist

Always visible under the frame; independent of the engine's layout.

1. Change spacing or radius — `space`
2. Recolour something — `colour`
3. Edit a line of text (double-click "Welcome back") — `text`
4. **Copy your changes for an agent** — `copied`

Tasks tick in any order. **Reset** reloads the iframe and clears the ticks.

### Coach

One floating hint inside the frame, for the first unticked task only, anchored
with `rectOf`:

1. a padding or radius field in the panel
2. a colour swatch in the panel
3. the card title
4. the panel's **Changes** tab while it is not selected, then its
   `Copy all changes` button, with a second line: "or copy the whole block as
   a brief: the copy button in the toolbar"

If the anchor is missing (the engine changed), the hint is not shown; the
checklist carries on. The hint has a close button; once closed, only the
checklist remains. After ~20s with no `change`, the current hint pulses once.
With `prefers-reduced-motion`, no pulse and no slide.

Copy is English like the rest of the site, and styled with site tokens so it
reads as the site talking, not the product.

### Finish card

Shown on `copied`, bottom-right over the frame; the iframe behind it dims.

- `changes`: "This is what your agent gets", the first ~12 lines of the
  copied text in mono with the Handoff section's was/want highlighting, then
  "Already in your clipboard — paste it into Claude Code, Cursor, anything."
- `block`: "You copied the whole block as a brief", with the first ~12 lines,
  and the same clipboard line.
- `changes` with no edits (the engine's button is disabled then, so this only
  happens if it copies an empty diff): "Nothing changed yet — tweak something,
  then copy."
- Actions: **Add to Chrome — it's free** (`CWS_URL`, new tab) and
  **Keep playing** (closes). Another copy updates and reopens it. The card
  appears only in answer to a copy.

## Failure handling

- The iframe fails to load, or `window.Twiddle` is absent after 8s →
  `PlaygroundVideo`.
- Engine errors stay inside the iframe; nothing is re-thrown into the site.
- Keyboard: Tab moves into the iframe and out again; Esc inside behaves as in
  the plugin.
- Wheel over the iframe when Forge cannot scroll must scroll the landing.
  Verify in Chrome; if it does not chain, make the Forge page exactly fit the
  frame and set `overscroll-behavior` accordingly.
- The visitor's installed plugin injects into the top frame only
  (`target: { tabId }`, no `allFrames`); if it ever reaches the iframe,
  `alreadyInstalled()` in `src/entry.js` stops a second copy from booting.

## Testing

Playwright, as for the previous site pass:

1. The playground loads, `Twiddle.isOn()` is true, the card is pinned, no
   console errors in the iframe.
2. A padding edit through the panel ticks 1; a colour edit ticks 2; a
   double-click and typing ticks 3.
3. Opening the Changes tab and clicking `Copy all changes` opens the finish card with the text that is
   actually in the clipboard; its CTA points at the CWS listing.
4. With the unpacked 0.1.6 plugin loaded and toggled on twiddle.tools: both run,
   the iframe gets no second copy, and neither the site nor the playground
   changes appearance.
5. 1440 and 1024 → playground; 768 and 390 → video, and the network log shows
   no request for `engine/spec-lens.js`.
6. The landing's initial transfer does not grow; the engine loads only when the
   playground is near the viewport.

The video is recorded with Playwright from the playground itself (a scripted
run of the four tasks), encoded to WebM + MP4 with a poster frame, kept small
(target < 1.5MB).

## Open risks

- The synthetic pin click may not land on the card on every layout; the
  fallback is starting in Inspect, which is acceptable.
- Toolbar `aria-label`s are the coupling point for coach anchors and copy
  kinds. They are pinned with the vendored version; a refresh must re-run
  test 3.
- Bundle size: ~810KB JS + ~240KB CSS uncompressed, loaded lazily, desktop
  only.
