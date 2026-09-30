import { expect, test } from '@playwright/test';
import { MARGIN, forge, playgroundReady, typeInto } from './helpers';

test('the first hint is about spacing', async ({ page }) => {
  await playgroundReady(page);
  await expect(page.locator('.playground-hint[data-task="space"]')).toBeVisible();
});

test('the hint moves on once spacing is done', async ({ page }) => {
  const frame = await playgroundReady(page);
  await typeInto(page, frame, MARGIN, '8');
  await expect(page.locator('.playground-hint[data-task="colour"]')).toBeVisible();
});

test('Hide tips removes the hint and keeps the checklist', async ({ page }) => {
  await playgroundReady(page);
  await page.getByRole('button', { name: 'Hide tips' }).click();
  await expect(page.locator('.playground-hint')).toHaveCount(0);
  await expect(page.locator('.playground-tasks')).toBeVisible();
});

test('Hide tips stays hidden after twiddle is switched off and on, and after Reset', async ({ page }) => {
  const frame = await playgroundReady(page);
  await expect(page.locator('.playground-hint')).toBeVisible();
  await page.getByRole('button', { name: 'Hide tips' }).click();
  await expect(page.locator('.playground-hint')).toHaveCount(0);

  await frame.evaluate(() => (window as unknown as { Twiddle: { off(): void } }).Twiddle.off());
  await page.getByRole('button', { name: 'Turn it back on' }).click();
  await expect(page.locator('.playground__veil')).toHaveCount(0);
  await expect(frame.locator('.sl-panel')).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(page.locator('.playground-hint')).toHaveCount(0);

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('.playground__veil')).toHaveCount(0, { timeout: 15_000 });
  await expect(forge(page)!.locator('.sl-panel')).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(page.locator('.playground-hint')).toHaveCount(0);
  await expect(page.locator('.playground-tasks')).toBeVisible();
});

test('the hint does not cover what it points at', async ({ page }) => {
  await playgroundReady(page);
  const hint = await page.locator('.playground-hint').boundingBox();
  const frameBox = await page.locator('iframe.playground__frame').boundingBox();
  const anchor = await page.evaluate(() => {
    const frame = document.querySelector<HTMLIFrameElement>('iframe.playground__frame')!;
    const doc = frame.contentDocument!;
    for (const sel of ['.sl-panel [data-sl-edit="padding"]', '.sl-panel [data-sl-edit="border-radius"]', '.sl-panel [data-sl-edit="margin"]', '.sl-panel']) {
      const el = doc.querySelector(sel);
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width || r.height) return { x: r.left, y: r.top, w: r.width, h: r.height };
      }
    }
    return null;
  });
  expect(hint && frameBox && anchor).toBeTruthy();
  const ax = frameBox!.x + anchor!.x;
  const overlapX = Math.min(hint!.x + hint!.width, ax + anchor!.w) - Math.max(hint!.x, ax);
  expect(overlapX).toBeLessThanOrEqual(0);
});
