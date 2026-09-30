import { expect, test } from '@playwright/test';
import { BG_HEX, mouseClick, playgroundReady, task, typeInto } from './helpers';

const CWS = 'https://chromewebstore.google.com/detail/twiddle/hfdioniicfkfefcmcllkfhgihcjblamn';

test('Copy all changes opens the finish card with the real payload', async ({ page }) => {
  const frame = await playgroundReady(page);
  await typeInto(page, frame, BG_HEX, 'FDE68A');
  await mouseClick(page, frame, '.sl-panel__tab[data-sl-tab="changes"]');
  await mouseClick(page, frame, '.sl-panel [data-sl-changes="copy"]');

  const card = page.locator('.playground-finish');
  await expect(card).toBeVisible();
  await expect(card.getByRole('heading')).toHaveText('This is what your agent gets');
  await expect(card.locator('pre')).toContainText('background-color');
  await expect(card.locator('pre')).not.toContainText('Agent — how to apply');

  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toContain('1. card');

  const cta = card.getByRole('link', { name: /Add to Chrome/ });
  await expect(cta).toHaveAttribute('href', CWS);
  await expect(cta).toHaveAttribute('target', '_blank');
  await expect(task(page, 'copy')).toHaveAttribute('data-done', 'true');
});

test('the toolbar block copy says it copied the block', async ({ page }) => {
  const frame = await playgroundReady(page);
  await mouseClick(page, frame, '.sl-toolbar__copy-block');
  await expect(page.locator('.playground-finish').getByRole('heading')).toHaveText('You copied the whole block as a brief');
});

test('Keep playing closes the card; the next copy reopens it', async ({ page }) => {
  const frame = await playgroundReady(page);
  await mouseClick(page, frame, '.sl-toolbar__copy-block');
  await page.getByRole('button', { name: 'Keep playing' }).click();
  await expect(page.locator('.playground-finish')).toHaveCount(0);
  await mouseClick(page, frame, '.sl-toolbar__copy-block');
  await expect(page.locator('.playground-finish')).toBeVisible();
});

test('Escape closes the card', async ({ page }) => {
  const frame = await playgroundReady(page);
  await mouseClick(page, frame, '.sl-toolbar__copy-block');
  await expect(page.locator('.playground-finish')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.playground-finish')).toHaveCount(0);
});

test('Escape still closes the card when the clipboard refuses late', async ({ page }) => {
  // The engine answers a refused writeText with an execCommand copy that focuses a textarea in the iframe.
  await page.addInitScript(() => {
    if (window === window.top) return;
    Clipboard.prototype.writeText = () =>
      new Promise((_, reject) => setTimeout(() => reject(new DOMException('Document is not focused.', 'NotAllowedError')), 300));
  });
  const frame = await playgroundReady(page);
  await mouseClick(page, frame, '.sl-toolbar__copy-block');
  await expect(page.locator('.playground-finish')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('playground-finish-title');
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');
  await expect(page.locator('.playground-finish')).toHaveCount(0);
});
