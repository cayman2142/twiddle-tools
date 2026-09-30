import { expect, test } from '@playwright/test';

const ORIGIN = 'http://localhost:4179';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 776 });
});

test('forge.html boots the vendored engine with no third-party requests', async ({ page }) => {
  const foreign: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (url.protocol !== 'data:' && url.origin !== ORIGIN) foreign.push(r.url());
  });
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/playground/forge.html');
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { Twiddle?: { isOn(): boolean } }).Twiddle?.isOn() ?? false))
    .toBe(true);

  const prefs = JSON.parse(await page.evaluate(() => localStorage.getItem('twiddle-prefs') ?? '{}'));
  expect(prefs.onboardingDone).toBe(true);
  expect(foreign).toEqual([]);
  expect(errors).toEqual([]);
});

test('icons are inline SVG, not a CDN script', async ({ page }) => {
  await page.goto('/playground/forge.html');
  await expect(page.locator('i[data-lucide]')).toHaveCount(0);
  expect(await page.locator('svg.lucide').count()).toBeGreaterThan(10);
});

test('the card clears the engine panel and toolbar, and the page does not scroll', async ({ page }) => {
  await page.goto('/playground/forge.html');
  const box = await page.locator('section.card').boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x + box!.width).toBeLessThanOrEqual(1100 - 340);
  expect(box!.y + box!.height).toBeLessThanOrEqual(776 - 80);
  const scrolls = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
  expect(scrolls).toBe(false);
});
