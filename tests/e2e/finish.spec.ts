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

test('cutting the element is not a copy', async ({ page }) => {
  const frame = await playgroundReady(page);
  // The toolbar keeps focus where it was; with the page unfocused the write is refused and proves nothing.
  await frame.evaluate(() => window.focus());
  await mouseClick(page, frame, '[aria-label="Cut element"]');
  await expect(frame.locator('section.card')).toHaveCount(0);
  await page.waitForTimeout(1000);
  await expect(page.locator('.playground-finish')).toHaveCount(0);
  await expect(task(page, 'copy')).not.toHaveAttribute('data-done', 'true');
});

test('Ctrl+X on the pinned element is not a copy', async ({ page }) => {
  const frame = await playgroundReady(page);
  await frame.evaluate(() => window.focus());
  await page.keyboard.press('Control+X');
  await expect(frame.locator('section.card')).toHaveCount(0);
  await page.waitForTimeout(1000);
  await expect(page.locator('.playground-finish')).toHaveCount(0);
  await expect(task(page, 'copy')).not.toHaveAttribute('data-done', 'true');
});

test('a copy the browser refuses outright opens no card', async ({ page }) => {
  await page.addInitScript(() => {
    if (window === window.top) return;
    Clipboard.prototype.writeText = () => Promise.reject(new DOMException('Document is not focused.', 'NotAllowedError'));
    const exec = Document.prototype.execCommand;
    Document.prototype.execCommand = function execCommand(this: Document, id: string, ui?: boolean, value?: string) {
      return id.toLowerCase() === 'copy' ? false : exec.call(this, id, ui, value);
    };
  });
  const frame = await playgroundReady(page);
  await mouseClick(page, frame, '.sl-toolbar__copy-block');
  await page.waitForTimeout(1000);
  await expect(page.locator('.playground-finish')).toHaveCount(0);
  await expect(task(page, 'copy')).not.toHaveAttribute('data-done', 'true');
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
