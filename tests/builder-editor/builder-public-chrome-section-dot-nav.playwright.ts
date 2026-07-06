import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

const EXPECTED_HOME_SECTION_LINKS = [
  '#hero',
  '#insights',
  '#practice',
  '#about',
  '#results',
  '#stats',
  '#faq',
  '#offices',
  '#contact',
] as const;

test('builder public chrome preview mirrors home section dot navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1365, height: 900 });

  await openBuilder(page, `/ko/admin-builder?sectionDotPreview=${Date.now().toString(36)}`);

  const publicChrome = page.locator('[data-builder-public-chrome="true"]').first();
  await expect(publicChrome).toBeVisible();

  const dotNav = publicChrome.locator('nav.section-dots[aria-label="섹션 탐색"]');
  await expect(dotNav).toBeVisible();
  await expect.poll(async () => dotNav.locator('a.dot').evaluateAll((links) => (
    links.map((link) => link.getAttribute('href'))
  ))).toEqual(EXPECTED_HOME_SECTION_LINKS);

  const scrollRoot = page.locator('[data-builder-canvas-scroll-root="true"]').first();
  await expect(scrollRoot).toBeVisible();
  await expect.poll(() => scrollRoot.evaluate((root) => root.scrollTop)).toBe(0);

  await dotNav.locator('a.dot[data-section="practice"][href="#practice"]').click();

  await expect.poll(() => scrollRoot.evaluate((root) => root.scrollTop)).toBeGreaterThan(200);
  await expect.poll(() => page.locator('#practice').evaluate((section) => {
    const scrollRoot = document.querySelector('[data-builder-canvas-scroll-root="true"]');
    if (!(scrollRoot instanceof HTMLElement)) return false;
    const rootTop = scrollRoot.getBoundingClientRect().top;
    const sectionTop = section.getBoundingClientRect().top - rootTop;
    return sectionTop >= 64 && sectionTop <= 220;
  })).toBe(true);
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('');
});

test('compact builder public chrome keeps section dots clear of shortcut controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await openBuilder(page, `/ko/admin-builder?compactSectionDotPreview=${Date.now().toString(36)}`);

  const publicChrome = page.locator('[data-builder-public-chrome="true"]').first();
  const dotNav = publicChrome.locator('nav.section-dots[aria-label="섹션 탐색"]');
  const eventButton = publicChrome.locator('[class*="publicChromeEventButton"]').first();
  const shortcutButton = publicChrome.locator('[class*="publicChromeShortcutButton"]').first();
  const inspector = page.locator('[class*="inspectorColumn"]').first();

  await expect(dotNav).toBeHidden();
  await expect(eventButton).toBeVisible();
  await expect(shortcutButton).toBeVisible();
  await expect(inspector).toBeVisible();

  const inspectorBox = await inspector.boundingBox();
  const eventBox = await eventButton.boundingBox();
  const shortcutBox = await shortcutButton.boundingBox();
  if (!inspectorBox || !eventBox || !shortcutBox) {
    throw new Error('Expected compact inspector and public chrome controls to have layout boxes.');
  }

  expect(eventBox.y + eventBox.height).toBeLessThanOrEqual(inspectorBox.y - 8);
  expect(shortcutBox.y + shortcutBox.height).toBeLessThanOrEqual(inspectorBox.y - 8);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('desktop builder public chrome stays clear of the inspector column', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });

  await openBuilder(page, `/ko/admin-builder?desktopPublicChromeBounds=${Date.now().toString(36)}`);

  const publicChrome = page.locator('[data-builder-public-chrome="true"]').first();
  const inspector = page.locator('[class*="inspectorColumn"]').first();
  const dotNav = publicChrome.locator('nav.section-dots[aria-label="섹션 탐색"]');
  const eventButton = publicChrome.locator('[class*="publicChromeEventButton"]').first();
  const shortcutButton = publicChrome.locator('[class*="publicChromeShortcutButton"]').first();

  await expect(publicChrome).toBeVisible();
  await expect(inspector).toBeVisible();
  await expect(dotNav).toBeVisible();
  await expect(eventButton).toBeVisible();
  await expect(shortcutButton).toBeVisible();

  const inspectorBox = await inspector.boundingBox();
  const chromeBoxes = await Promise.all([
    publicChrome.boundingBox(),
    dotNav.boundingBox(),
    eventButton.boundingBox(),
    shortcutButton.boundingBox(),
  ]);
  if (!inspectorBox || chromeBoxes.some((box) => !box)) {
    throw new Error('Expected public chrome and inspector boxes in desktop builder view.');
  }

  for (const box of chromeBoxes) {
    expect(box!.x + box!.width).toBeLessThanOrEqual(inspectorBox.x - 8);
  }
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
});

test('builder public chrome labels the page-first columns shortcut accurately', async ({ page }) => {
  await page.setViewportSize({ width: 1365, height: 900 });

  await openBuilder(page, `/ko/admin-builder?columnsShortcutLabel=${Date.now().toString(36)}`);

  const publicChrome = page.locator('[data-builder-public-chrome="true"]').first();
  const shortcutButton = publicChrome.locator('[class*="publicChromeShortcutButton"]').first();

  await expect(shortcutButton).toBeVisible();
  await expect(shortcutButton).toHaveText('칼럼');
  await expect(shortcutButton).not.toContainText('AI 상담');

  await shortcutButton.click();
  await expect(publicChrome.getByRole('button', { name: '칼럼 관리' })).toBeVisible();
});
