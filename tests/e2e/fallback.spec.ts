import { expect, test } from '@playwright/test';
import { BG_HEX, playgroundReady, task, typeInto } from './helpers';

for (const width of [768, 390]) {
  test(`${width}px shows the video and never fetches the engine`, async ({ page }) => {
    const fetched: string[] = [];
    page.on('request', (r) => {
      if (/\/playground\/(engine\/|forge\.html)/.test(r.url())) fetched.push(r.url());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('video.playground-video')).toBeVisible();
    await expect(page.locator('iframe.playground__frame')).toHaveCount(0);
    await expect(page.locator('.playground-note')).toContainText('computer');
    await page.waitForTimeout(1500);
    expect(fetched).toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
}

test('a missing engine falls back to the video on desktop', async ({ page }) => {
  await page.route('**/playground/engine/spec-lens.js', (route) => route.abort());
  await page.goto('/');
  await page.locator('.playground').scrollIntoViewIfNeeded();
  await expect(page.locator('video.playground-video')).toBeVisible({ timeout: 20_000 });
});

test('an iframe that is not the Forge page falls back to the video at once', async ({ page }) => {
  // What an SPA fallback does with a missing forge.html: some other page, no engine.
  await page.route('**/playground/forge.html', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>twiddle</title><p>not the forge</p>' }),
  );
  await page.goto('/');
  await page.locator('.playground').scrollIntoViewIfNeeded();
  await expect(page.locator('video.playground-video')).toBeVisible({ timeout: 3_000 });
});

test('the playground is wide at 1024px', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/');
  await expect(page.locator('iframe.playground__frame')).toHaveCount(1);
});

test('going narrow and wide again restarts the engine with nothing ticked', async ({ page }) => {
  const frame = await playgroundReady(page);
  await typeInto(page, frame, BG_HEX, 'FDE68A');
  await expect(task(page, 'colour')).toHaveAttribute('data-done', 'true');
  await page.setViewportSize({ width: 768, height: 1000 });
  await expect(page.locator('video.playground-video')).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('.playground__veil')).toHaveCount(1);
  await expect(page.locator('.playground__veil')).toHaveCount(0, { timeout: 15_000 });
  for (const id of ['space', 'colour', 'text', 'copy']) await expect(task(page, id)).not.toHaveAttribute('data-done', 'true');
});
