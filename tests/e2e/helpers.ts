import { expect, type Frame, type Page } from '@playwright/test';

type TwiddleWindow = Window & { Twiddle?: { isOn(): boolean; selectionCount(): number } };

export const FORGE = /\/playground\/forge\.html$/;

export function forge(page: Page): Frame | undefined {
  return page.frames().find((frame) => FORGE.test(frame.url()));
}

/** Load the landing and wait until the playground's engine is on and the veil is gone. */
export async function playgroundReady(page: Page): Promise<Frame> {
  await page.goto('/');
  await page.locator('.playground').scrollIntoViewIfNeeded();
  await expect.poll(() => (forge(page) ? 1 : 0), { timeout: 15_000 }).toBe(1);
  const frame = forge(page)!;
  await expect
    .poll(() => frame.evaluate(() => (window as TwiddleWindow).Twiddle?.isOn() ?? false), { timeout: 15_000 })
    .toBe(true);
  await expect(page.locator('.playground__veil')).toHaveCount(0, { timeout: 15_000 });
  return frame;
}

/** Click with the real mouse: the engine's hover blocker swallows locator clicks. */
export async function mouseClick(page: Page, frame: Frame, selector: string, at: 'center' | 'edge' = 'center') {
  const target = frame.locator(selector).first();
  await target.evaluate((el) => el.scrollIntoView({ block: 'nearest' }));
  const box = await target.boundingBox();
  if (!box) throw new Error(`no box for ${selector}`);
  const x = at === 'edge' ? box.x + 6 : box.x + box.width / 2;
  await page.mouse.click(x, box.y + box.height / 2);
}

export async function typeInto(page: Page, frame: Frame, selector: string, value: string) {
  await mouseClick(page, frame, selector);
  await page.keyboard.press('Control+A');
  await page.keyboard.type(value);
  await page.keyboard.press('Enter');
}

export const task = (page: Page, id: string) => page.locator(`.playground-task[data-task="${id}"]`);

export const MARGIN = '.sl-panel input.sl-ed__num[data-sl-edit="margin"]';
export const BG_HEX = '.sl-panel input.sl-ed__hex[data-sl-edit="background-color"]';

export async function editText(page: Page, frame: Frame, value: string) {
  await mouseClick(page, frame, '#auth-title');
  await expect(frame.locator('.sl-text-edit-fab')).toBeVisible();
  await mouseClick(page, frame, '.sl-text-edit-fab');
  await page.keyboard.press('Control+A');
  await page.keyboard.type(value);
  await page.keyboard.press('Enter');
}
