import { chromium, expect, test } from '@playwright/test';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { forge } from './helpers';

test.skip(!process.env.PLUGIN, 'set PLUGIN=1 to run against the unpacked extension in ../twiddle/extension');

test('the installed plugin and the playground leave each other alone', async () => {
  const ext = mkdtempSync(join(tmpdir(), 'twiddle-ext-'));
  cpSync(resolve('../twiddle/extension'), ext, { recursive: true });
  const manifestPath = join(ext, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.host_permissions = ['<all_urls>']; // activeTab needs a user gesture; the test has none
  writeFileSync(manifestPath, JSON.stringify(manifest));

  const ctx = await chromium.launchPersistentContext(mkdtempSync(join(tmpdir(), 'twiddle-profile-')), {
    channel: 'chromium',
    viewport: { width: 1440, height: 1000 },
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
  });
  try {
    const sw = ctx.serviceWorkers()[0] ?? (await ctx.waitForEvent('serviceworker'));
    const page = ctx.pages()[0] ?? (await ctx.newPage());
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:4179/');
    await page.locator('.playground').scrollIntoViewIfNeeded();
    await expect.poll(() => (forge(page) ? 1 : 0), { timeout: 15_000 }).toBe(1);
    await expect(page.locator('.playground__veil')).toHaveCount(0, { timeout: 15_000 });

    const look = () =>
      page.evaluate(() => {
        const pick = (sel: string) => {
          const s = getComputedStyle(document.querySelector(sel)!);
          return [s.position, s.display, s.fontSize, s.padding, s.zIndex].join('|');
        };
        return [pick('.playground-tasks'), pick('.scene-stage--playground'), pick('.playground-task')];
      });
    const before = await look();

    await sw.evaluate(async () => {
      const g = globalThis as unknown as {
        chrome: { tabs: { query(q: object): Promise<{ id: number }[]> } };
        toggleTab(id: number): Promise<void>;
      };
      const [tab] = await g.chrome.tabs.query({ active: true, currentWindow: true });
      await g.toggleTab(tab.id);
    });

    await expect(page.locator('.sl-fab-dock')).toHaveCount(1); // the real plugin, top frame only
    const frame = forge(page)!;
    expect(await frame.evaluate(() => document.querySelectorAll('.sl-fab-dock').length)).toBe(1);
    expect(await frame.evaluate(() => (window as unknown as { Twiddle: { selectionCount(): number } }).Twiddle.selectionCount())).toBe(1);
    expect(await look()).toEqual(before);
    expect(errors).toEqual([]);
  } finally {
    await ctx.close();
  }
});
