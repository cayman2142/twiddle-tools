/**
 * Derive the playground host page from the promo demo.
 * Usage: node scripts/make-forge.mjs   →  public/playground/forge.html (+ fonts/)
 *
 * demo/index.html stays the promo source (it loads Google Fonts and lucide from
 * unpkg). The playground copy must make no third-party requests, must keep the
 * card clear of the engine's panel and toolbar, and must load the vendored
 * engine. Every edit asserts its anchor, so a changed demo fails loudly instead
 * of producing a half-converted page.
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as icons from 'lucide-react';

const SRC = resolve('demo/index.html');
const OUT_DIR = resolve('public/playground');
const FONT = 'inter-latin-wght-normal.woff2';

let html = readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');

function edit(label, from, to) {
  const hit = typeof from === 'string' ? html.includes(from) : from.test(html);
  if (!hit) throw new Error(`make-forge: anchor not found — ${label}`);
  html = html.replace(from, to);
}

// 1. No third-party fonts; Inter is served locally.
edit('google preconnect', /\n\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/>/, '');
edit('gstatic preconnect', /\n\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>/, '');
edit('google stylesheet', /\n\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*\/>/, '');
edit(
  'viewport meta',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <meta name="robots" content="noindex" />\n    <meta name="twiddle-playground" content="forge" />',
);
edit(
  'first style tag',
  '<style>\n',
  `<style>\n      @font-face {\n        font-family: "Inter";\n        src: url("fonts/${FONT}") format("woff2");\n        font-weight: 100 900;\n        font-display: swap;\n      }\n\n`,
);

// 2. The eye button swaps two inline icons instead of re-rendering through lucide.
edit(
  'eye icons',
  /<i data-lucide="eye" class="icon-sm"><\/i>/g,
  '<i data-lucide="eye" class="icon-sm eye__on"></i><i data-lucide="eye-off" class="icon-sm eye__off"></i>',
);
edit('lucide cdn script', /\n\s*<script src="https:\/\/unpkg\.com\/lucide[^"]*"><\/script>/, '');
edit(
  'paintIcons body',
  /function paintIcons\(\) \{\n\s*lucide\.createIcons\([^)]*\);\n\s*\}/,
  'function paintIcons() {}',
);
edit(
  'eye toggle',
  'button.querySelector("i").setAttribute("data-lucide", hidden ? "eye-off" : "eye");',
  'button.classList.toggle("is-shown", hidden);',
);

// 3. Playground layout: keep the card clear of the engine's 324px panel and its toolbar.
edit(
  'head end',
  '</head>',
  `  <style>
      /* Playground: the engine's panel (324px + gutters) sits right, its toolbar at the bottom. */
      .main {
        padding: var(--space-6) 356px 96px var(--space-6);
      }

      .footer {
        display: none;
      }

      .eye .eye__off,
      .eye.is-shown .eye__on {
        display: none;
      }

      .eye.is-shown .eye__off {
        display: inline;
      }
    </style>
  </head>`,
);

// 4. The engine: suppress its own first-run tour (the site coaches instead), then turn it on.
edit(
  'body end',
  /\n  <\/body>/,
  `
    <script>
      try {
        var raw = localStorage.getItem("twiddle-prefs");
        var prefs = raw ? JSON.parse(raw) : {};
        prefs.onboardingDone = true;
        localStorage.setItem("twiddle-prefs", JSON.stringify(prefs));
      } catch (_) {}
    </script>
    <link rel="stylesheet" href="engine/spec-lens.css" />
    <script src="engine/spec-lens.js"></script>
    <script>
      window.addEventListener("load", function () {
        if (window.Twiddle) window.Twiddle.on();
      });
    </script>
  </body>`,
);

// 5. Inline every lucide icon as static SVG.
const pascal = (name) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
html = html.replace(/<i data-lucide="([a-z0-9-]+)" class="([^"]*)"><\/i>/g, (_, name, cls) => {
  const Icon = icons[pascal(name)];
  if (!Icon) throw new Error(`make-forge: no lucide icon "${name}"`);
  return renderToStaticMarkup(createElement(Icon, { className: cls, strokeWidth: 2, 'aria-hidden': 'true' }));
});
if (html.includes('data-lucide')) throw new Error('make-forge: an icon was left un-inlined');

mkdirSync(resolve(OUT_DIR, 'fonts'), { recursive: true });
copyFileSync(resolve('node_modules/@fontsource-variable/inter/files', FONT), resolve(OUT_DIR, 'fonts', FONT));
writeFileSync(resolve(OUT_DIR, 'forge.html'), html);
console.log('Wrote public/playground/forge.html');
