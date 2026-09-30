import { expect, test } from '@playwright/test';
import { playgroundReady } from './helpers';

test('the wheel over the playground scrolls the landing', async ({ page }) => {
  await playgroundReady(page);
  const box = await page.locator('iframe.playground__frame').boundingBox();
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.move(box!.x + 200, box!.y + box!.height / 2);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 200);
});
