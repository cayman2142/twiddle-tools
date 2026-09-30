import { expect, test, type Page } from '@playwright/test';

const step = (page: Page, n: number) => page.locator(`#how li.site-steps__item[data-step="${n}"]`);

function activeSteps(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll('#how li.site-steps__item[data-active="true"]')].map((li) => li.getAttribute('data-step') ?? ''),
  );
}

/** Steps whose scene has at least one running CSS animation. */
function animatingSteps(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll('#how li.site-steps__item')]
      .filter((li) =>
        (li.querySelector('.step-scene')?.getAnimations({ subtree: true }) ?? []).some((a) => a.playState === 'running'),
      )
      .map((li) => li.getAttribute('data-step') ?? ''),
  );
}

async function showSteps(page: Page) {
  await page.goto('/');
  await page.locator('#how .site-steps').evaluate((el) => el.scrollIntoView({ block: 'center' }));
}

test('the landing is Hero, How it works and FAQ: no feature scenes, no Handoff, no Features link', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#how')).toBeVisible();
  await expect(page.locator('#edit, #tokens, #adaptive, #handoff')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Copy sample' })).toHaveCount(0);
  await expect(page.locator('a[href="/#edit"]')).toHaveCount(0);
  await expect(page.locator('.site-notch a', { hasText: 'Features' })).toHaveCount(0);
  expect(await page.locator('#how').evaluate((el) => el.nextElementSibling?.id)).toBe('faq');
});

test('each step has a decorative scene with nothing focusable in it', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#how li.site-steps__item[data-step]')).toHaveCount(4);
  const scenes = page.locator('#how .step-scene');
  await expect(scenes).toHaveCount(4);
  for (const scene of await scenes.all()) {
    await expect(scene).toHaveAttribute('aria-hidden', 'true');
    await expect(scene.locator('a, button, input, [tabindex]')).toHaveCount(0);
  }
});

test('in view, one step plays at a time and the sequence moves on', async ({ page }) => {
  await showSteps(page);
  await expect.poll(() => activeSteps(page)).toHaveLength(1);
  const [first] = await activeSteps(page);
  await expect.poll(() => animatingSteps(page)).toEqual([first]);
  await expect.poll(() => activeSteps(page), { timeout: 6500 }).not.toEqual([first]);
  expect(await activeSteps(page)).toHaveLength(1);
  expect(await animatingSteps(page)).toEqual(await activeSteps(page));
});

test('scrolled away, nothing animates', async ({ page }) => {
  await showSteps(page);
  await expect.poll(() => animatingSteps(page)).toHaveLength(1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => animatingSteps(page)).toEqual([]);
});

test('hovering a step makes it the only one playing, and it keeps playing while hovered', async ({ page }) => {
  await showSteps(page);
  await step(page, 3).hover();
  await expect.poll(() => activeSteps(page)).toEqual(['3']);
  await page.waitForTimeout(5500);
  expect(await activeSteps(page)).toEqual(['3']);
  expect(await animatingSteps(page)).toEqual(['3']);
});

test('after the mouse leaves a step, the sequence moves on to the next one', async ({ page }) => {
  await showSteps(page);
  await step(page, 2).hover();
  await expect.poll(() => activeSteps(page)).toEqual(['2']);
  await page.mouse.move(5, 5);
  await expect.poll(() => activeSteps(page), { timeout: 6000 }).toEqual(['3']);
});

test('focusing a step with the keyboard makes it the one playing', async ({ page }) => {
  await showSteps(page);
  await step(page, 4).focus();
  await expect.poll(() => activeSteps(page)).toEqual(['4']);
});

test('the mouse passing over another step does not end a keyboard hold', async ({ page }) => {
  await showSteps(page);
  await step(page, 4).focus();
  await expect.poll(() => activeSteps(page)).toEqual(['4']);
  await step(page, 2).hover();
  await expect.poll(() => activeSteps(page)).toEqual(['2']);
  await page.mouse.move(5, 5);
  await expect.poll(() => activeSteps(page)).toEqual(['4']);
  await page.waitForTimeout(5500);
  expect(await activeSteps(page)).toEqual(['4']);
});

test.describe('stacked steps', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the step nearest the middle of the screen is the one playing', async ({ page }) => {
    await page.goto('/');
    await step(page, 2).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect.poll(() => activeSteps(page)).toEqual(['2']);
    await expect.poll(() => animatingSteps(page)).toEqual(['2']);
    await step(page, 4).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect.poll(() => activeSteps(page)).toEqual(['4']);
    await page.waitForTimeout(5500);
    expect(await activeSteps(page)).toEqual(['4']);
  });
});

test('with reduced motion, every scene shows its result and nothing animates or cycles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await showSteps(page);
  const counts = () =>
    page.locator('#how').evaluate((el) => {
      const all = [...el.querySelectorAll('.step-scene')].flatMap((scene) => scene.getAnimations({ subtree: true }));
      return { total: all.length, live: all.filter((a) => a.playState === 'running').length };
    });
  await expect.poll(async () => (await counts()).total).toBeGreaterThan(0);
  const seen = new Set<string>();
  for (let i = 0; i < 12; i += 1) {
    seen.add(JSON.stringify(await activeSteps(page)));
    expect((await counts()).live).toBe(0);
    await page.waitForTimeout(500);
  }
  expect([...seen]).toEqual(['[]']);
  const copied = page.locator('.step-scene[data-scene="4"] .step-scene__copy > b').last();
  await expect(copied).toHaveText('Copied');
  expect(await copied.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});
