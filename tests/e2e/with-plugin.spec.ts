import { chromium, expect, test, type Frame, type Page } from '@playwright/test';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { forge } from './helpers';

test.skip(process.env.PLUGIN !== '1', 'set PLUGIN=1 to run against the unpacked extension in ../twiddle/extension');

/** position | display | z-index | font-size | padding of the first match, per selector. */
function styles(target: Page | Frame, selectors: string[]) {
  return target.evaluate(
    (sels) =>
      sels.map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return `${sel}: missing`;
        const s = getComputedStyle(el);
        return `${sel}: ${[s.position, s.display, s.zIndex, s.fontSize, s.padding].join('|')}`;
      }),
    selectors,
  );
}

test('the installed plugin and the playground leave each other alone', async () => {
  const baseURL = test.info().project.use.baseURL;
  if (!baseURL) throw new Error('playwright.config.ts has no baseURL');
  const ext = mkdtempSync(join(tmpdir(), 'twiddle-ext-'));
  const profile = mkdtempSync(join(tmpdir(), 'twiddle-profile-'));
  let ctx: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | undefined;
  try {
    cpSync(resolve('../twiddle/extension'), ext, { recursive: true });
    const manifestPath = join(ext, 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    // The playground must run the build the plugin ships, or this test proves nothing.
    expect(manifest.version).toBe(readFileSync(resolve('public/playground/engine/VERSION'), 'utf8').trim());
    manifest.host_permissions = ['<all_urls>']; // activeTab needs a user gesture; the test has none
    writeFileSync(manifestPath, JSON.stringify(manifest));

    ctx = await chromium.launchPersistentContext(profile, {
      channel: 'chromium',
      viewport: { width: 1440, height: 1000 },
      args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
    });
    const sw = ctx.serviceWorkers()[0] ?? (await ctx.waitForEvent('serviceworker'));
    const page = ctx.pages()[0] ?? (await ctx.newPage());
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(new URL('/', baseURL).href);
    await page.locator('.playground').scrollIntoViewIfNeeded();
    await expect.poll(() => (forge(page) ? 1 : 0), { timeout: 15_000 }).toBe(1);
    await expect(page.locator('.playground__veil')).toHaveCount(0, { timeout: 15_000 });
    const frame = forge(page)!;

    const site = ['.playground-tasks', '.scene-stage--playground', '.playground-task'];
    const inFrame = ['section.card', '.sl-panel'];
    const siteBefore = await styles(page, site);
    const frameBefore = await styles(frame, inFrame);
    expect(frameBefore.join('\n')).not.toContain('missing');

    await sw.evaluate(async () => {
      const g = globalThis as unknown as {
        chrome: { tabs: { query(q: object): Promise<{ id: number }[]> } };
        toggleTab(id: number): Promise<void>;
      };
      const [tab] = await g.chrome.tabs.query({ active: true, currentWindow: true });
      await g.toggleTab(tab.id);
    });

    await expect(page.locator('.sl-fab-dock')).toHaveCount(1); // the real plugin, top frame only
    expect(await frame.evaluate(() => document.querySelectorAll('.sl-fab-dock').length)).toBe(1);
    expect(await frame.evaluate(() => (window as unknown as { Twiddle: { selectionCount(): number } }).Twiddle.selectionCount())).toBe(1);
    expect(await styles(page, site)).toEqual(siteBefore);
    expect(await styles(frame, inFrame)).toEqual(frameBefore);
    expect(errors).toEqual([]);
  } finally {
    await ctx?.close();
    rmSync(ext, { recursive: true, force: true });
    rmSync(profile, { recursive: true, force: true });
  }
});
