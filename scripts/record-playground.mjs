/**
 * Record the narrow-screen fallback video from the real playground page.
 * Usage (two shells):
 *   npm run build && npx vite preview --port 4179 --strictPort
 *   npm run record:playground
 * Writes public/playground/demo.webm, demo.mp4, demo-poster.webp.
 * Needs Python with imageio-ffmpeg and Pillow (the promo tooling in ../twiddle uses the same).
 */
import { chromium } from '@playwright/test';
import { execFileSync, execSync } from 'node:child_process';
import { mkdtempSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:4179';
const SIZE = { width: 1100, height: 776 };
const OUT = resolve('public/playground');
const tmp = mkdtempSync(join(tmpdir(), 'twiddle-rec-'));

/* Playwright videos have no cursor. This one is marked data-sl-ignore so the engine skips it. */
function cursor() {
  addEventListener('DOMContentLoaded', () => {
    const c = document.createElement('div');
    c.setAttribute('data-sl-ignore', '');
    c.style.cssText =
      'position:fixed;left:0;top:0;width:22px;height:22px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px)';
    c.innerHTML =
      '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 2l16 10-7 1.5L9.5 21z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    document.documentElement.appendChild(c);
    addEventListener('mousemove', (e) => { c.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 2}px)`; }, true);
  });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: SIZE,
  recordVideo: { dir: tmp, size: SIZE },
  permissions: ['clipboard-read', 'clipboard-write'],
});
await ctx.addInitScript(cursor);
const recordStart = Date.now();
const page = await ctx.newPage();
await page.goto(`${BASE}/playground/forge.html`);
await page.waitForFunction(() => window.Twiddle?.isOn());
await page.waitForTimeout(500);
const trim = (Date.now() - recordStart) / 1000;

const box = async (sel) => {
  const target = page.locator(sel).first();
  await target.scrollIntoViewIfNeeded();
  const b = await target.boundingBox();
  if (!b) throw new Error(`record: no box for ${sel}`);
  return b;
};
const clickAt = async (x, y) => {
  await page.mouse.move(x, y, { steps: 18 });
  await page.waitForTimeout(150);
  await page.mouse.click(x, y);
};
const clickCenter = async (sel) => { const b = await box(sel); await clickAt(b.x + b.width / 2, b.y + b.height / 2); };
const clickEdge = async (sel) => { const b = await box(sel); await clickAt(b.x + 6, b.y + b.height / 2); };
const typeHex = async (sel, hex) => {
  await clickCenter(sel);
  await page.keyboard.press('Control+A');
  await page.keyboard.type(hex, { delay: 90 });
  await page.keyboard.press('Enter');
};
const BG_HEX = '.sl-panel input.sl-ed__hex[data-sl-edit="background-color"]';

await clickCenter('[aria-label="Edit mode"]');
await clickEdge('section.card');
await page.waitForTimeout(700);
await typeHex(BG_HEX, 'EEF2FF');
await page.waitForTimeout(700);
await clickCenter('#auth-title');
await page.waitForTimeout(400);
await clickCenter('.sl-text-edit-fab');
await page.keyboard.press('Control+A');
await page.keyboard.type('Welcome to Forge', { delay: 80 });
await page.keyboard.press('Enter');
await page.waitForTimeout(700);
await clickCenter('button.primary');
await page.waitForTimeout(600);
/* The button's background is bound to --primary, so the panel shows a token chip, not a hex field. */
await clickCenter('.sl-panel .sl-ed__tok-face[data-sl-edit="background-color"]');
await page.waitForTimeout(500);
await clickCenter('.sl-cp__tab[data-sl-cp-tab="custom"]');
await page.waitForTimeout(400);
await typeHex('.sl-cp__hex', '4F46E5');
await page.waitForTimeout(700);
await clickCenter('.sl-cp__close');
await page.waitForTimeout(500);
await clickCenter('.sl-panel__tab[data-sl-tab="changes"]');
await page.waitForTimeout(900);
await clickCenter('.sl-panel [data-sl-changes="copy"]');
await page.waitForTimeout(1600);
const posterPng = join(tmp, 'poster.png');
await page.screenshot({ path: posterPng });

const raw = await page.video().path();
await ctx.close();
await browser.close();

const ffmpeg = execSync('python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"').toString().trim();
const src = ['-y', '-ss', trim.toFixed(2), '-i', raw, '-an'];
execFileSync(ffmpeg, [...src, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '40', '-row-mt', '1', join(OUT, 'demo.webm')], { stdio: 'inherit' });
execFileSync(ffmpeg, [...src, '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(OUT, 'demo.mp4')], { stdio: 'inherit' });
execFileSync('python', ['-c', `from PIL import Image; Image.open(r"${posterPng}").save(r"${join(OUT, 'demo-poster.webp')}", quality=82)`]);

for (const f of ['demo.webm', 'demo.mp4', 'demo-poster.webp']) {
  console.log(f, `${(statSync(join(OUT, f)).size / 1024).toFixed(0)} KB`);
}
