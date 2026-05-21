import { expect, test } from '@playwright/test';

const LOCALE = 'ko';
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('admin opens /admin-builder/workspace and sees the overview populated', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.goto(`/${LOCALE}/admin-builder/workspace`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-workspace-page]')).toBeVisible();
  await expect(page.locator('[data-workspace-tabs]')).toBeVisible();
  await expect(page.locator('[data-workspace-tab="overview"][data-active="true"]')).toBeVisible();
  await expect(page.locator('[data-overview-card="sites"]')).toBeVisible();
  await expect(page.locator('[data-overview-card="members"]')).toBeVisible();

  const siteCount = await page.locator('[data-overview-card="sites"]').textContent();
  expect(siteCount).toMatch(/\d+/);

  await page.locator('[data-workspace-tab="sites"]').click();
  await expect(page.locator('[data-sites-panel]')).toBeVisible();
  await expect(page.locator('[data-sites-list]')).toBeVisible();
});