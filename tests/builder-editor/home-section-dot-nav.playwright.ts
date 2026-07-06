import { expect, test } from '@playwright/test';

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

test('public home renders section dot navigation with the practice anchor', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto(`/ko?sectionDotNav=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });

  const dotNav = page.locator('nav.section-dots[aria-label="섹션 탐색"]');
  await expect(dotNav).toBeVisible();

  await expect.poll(async () => dotNav.locator('a.dot').evaluateAll((links) => (
    links.map((link) => link.getAttribute('href'))
  ))).toEqual(EXPECTED_HOME_SECTION_LINKS);

  const practiceDot = dotNav.locator('a.dot[data-section="practice"][href="#practice"]');
  await expect(practiceDot).toBeVisible();
  await practiceDot.click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#practice');
  await expect.poll(() => page.locator('#practice').evaluate((section) => {
    const top = section.getBoundingClientRect().top;
    return top >= 72 && top <= 180;
  })).toBe(true);
});
