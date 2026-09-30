import { expect, test } from '@playwright/test';
import { BG_HEX, MARGIN, editText, forge, mouseClick, playgroundReady, task, typeInto } from './helpers';

test('boots the real engine with the card pinned and nothing ticked', async ({ page }) => {
  const frame = await playgroundReady(page);
  expect(await frame.evaluate(() => (window as unknown as { Twiddle: { selectionCount(): number } }).Twiddle.selectionCount())).toBe(1);
  await expect(frame.locator('[aria-label="Edit mode"]')).toHaveAttribute('aria-pressed', 'true');
  for (const id of ['space', 'colour', 'text', 'copy']) await expect(task(page, id)).not.toHaveAttribute('data-done', 'true');
});

test('a margin edit ticks spacing', async ({ page }) => {
  const frame = await playgroundReady(page);
  await typeInto(page, frame, MARGIN, '8');
  await expect(task(page, 'space')).toHaveAttribute('data-done', 'true');
  await expect(task(page, 'colour')).not.toHaveAttribute('data-done', 'true');
});

test('a colour edit ticks colour', async ({ page }) => {
  const frame = await playgroundReady(page);
  await typeInto(page, frame, BG_HEX, 'FDE68A');
  await expect(task(page, 'colour')).toHaveAttribute('data-done', 'true');
  expect(await frame.locator('section.card').getAttribute('style')).toContain('background-color');
});

test('a text edit ticks text', async ({ page }) => {
  const frame = await playgroundReady(page);
  await editText(page, frame, 'Hello there');
  await expect(frame.locator('#auth-title')).toHaveText('Hello there');
  await expect(task(page, 'text')).toHaveAttribute('data-done', 'true');
});

test('previewing a hover state and going back to default ticks nothing', async ({ page }) => {
  const frame = await playgroundReady(page);
  const button = '.oauth button';
  await mouseClick(page, frame, button);
  await mouseClick(page, frame, '.sl-panel .sl-state[data-state="hover"]');
  await expect(frame.locator(button).first()).toHaveAttribute('data-sl-live-state', 'hover');
  expect(await frame.locator(button).first().getAttribute('style')).toContain('background');
  await mouseClick(page, frame, '.sl-panel .sl-state[data-state="default"]');
  await expect(frame.locator(button).first()).not.toHaveAttribute('data-sl-live-state', /.*/);
  await page.waitForTimeout(500);
  for (const id of ['space', 'colour', 'text', 'copy']) await expect(task(page, id)).not.toHaveAttribute('data-done', 'true');
});

test('Reset clears the ticks and reloads a clean page', async ({ page }) => {
  const frame = await playgroundReady(page);
  await typeInto(page, frame, BG_HEX, 'FDE68A');
  await expect(task(page, 'colour')).toHaveAttribute('data-done', 'true');
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(task(page, 'colour')).not.toHaveAttribute('data-done', 'true');
  await expect(page.locator('.playground__veil')).toHaveCount(0, { timeout: 15_000 });
  const fresh = forge(page)!;
  expect(await fresh.locator('section.card').getAttribute('style')).toBeNull();
});

test('a startup step that throws still leaves a working playground', async ({ page }) => {
  await page.addInitScript(() => {
    if (window === window.top) return;
    const query = Document.prototype.querySelector;
    Document.prototype.querySelector = function querySelector(this: Document, selector: string) {
      if (selector === 'section.card') throw new Error('pin failed');
      return query.call(this, selector);
    } as typeof query;
  });
  const frame = await playgroundReady(page);
  expect(await frame.evaluate(() => (window as unknown as { Twiddle: { isOn(): boolean } }).Twiddle.isOn())).toBe(true);
});

test('after the engine closes itself, Turn it back on starts a fresh one', async ({ page }) => {
  const frame = await playgroundReady(page);
  await mouseClick(page, frame, '[aria-label="Close Twiddle"]');
  await expect(page.locator('.playground__veil')).toContainText('twiddle is off.');
  await page.getByRole('button', { name: 'Turn it back on' }).click();
  await expect(page.locator('.playground__veil')).toHaveCount(0, { timeout: 15_000 });
  const fresh = forge(page)!;
  expect(await fresh.evaluate(() => (window as unknown as { Twiddle?: { isOn(): boolean } }).Twiddle?.isOn() ?? false)).toBe(true);
});

test('the page inside the iframe never renders a nested playground', async ({ page }) => {
  await page.goto('/');
  const nested = await page.evaluate(async () => {
    const probe = document.createElement('iframe');
    probe.src = '/';
    document.body.appendChild(probe);
    await new Promise((r) => probe.addEventListener('load', r, { once: true }));
    await new Promise((r) => setTimeout(r, 1500));
    return probe.contentDocument!.querySelectorAll('.playground iframe').length;
  });
  expect(nested).toBe(0);
});
