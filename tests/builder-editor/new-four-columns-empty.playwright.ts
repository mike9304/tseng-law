import { expect, test } from '@playwright/test';
import { guidanceContent } from '@/data/international-guidance-content';

/**
 * WO-G19 empty corpus: no src/content/columns-vi files in this worktree.
 * /vi/columns must stay the guidance index (now `GuidancePageBody` inside the
 * shared site chrome, so exactly one header/language switcher); a slug 404s.
 */
test('WO-G19: /vi/columns stays guidance index when untranslated; detail is localized 404', async ({
  page,
}) => {
  const pack = guidanceContent.vi;
  const index = await page.goto('/vi/columns', { waitUntil: 'domcontentloaded' });
  expect(index?.status(), '/vi/columns').toBe(200);
  await expect(page.locator('[data-guidance-shell="true"]')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(pack.pages.columns.title);
  await expect(page.locator('.columns-grid')).toHaveCount(0);
  await expect(page.locator('[data-columns-original-language="true"]')).toBeVisible();
  // O14 chrome: the site header owns the language switcher; the page body must
  // not render a second one (the old in-component guidance dropdown).
  await expect(
    page.locator('header[data-public-site-header] .header-utility .locale-flag-switcher'),
  ).toHaveCount(1);
  await expect(page.locator('[data-guidance-shell="true"] .locale-flag-switcher')).toHaveCount(0);

  const detail = await page.goto('/vi/columns/taiwan-gym-injury-lawsuit', {
    waitUntil: 'domcontentloaded',
  });
  expect(detail?.status(), '/vi/columns/taiwan-gym-injury-lawsuit').toBe(404);
  await expect(page.locator('[data-guidance-shell="true"]')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(pack.notFoundTitle);
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  expect(robots?.toLowerCase()).toMatch(/noindex/);
});
