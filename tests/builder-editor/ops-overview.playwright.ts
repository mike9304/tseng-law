import { expect, test } from '@playwright/test';

const LOCALE = 'ko';
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('/ko/admin-builder/ops shows the overview tab with KPI cards', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.goto(`/${LOCALE}/admin-builder/ops`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-ops-tabs="true"]')).toBeVisible();
  await expect(page.locator('[data-ops-overview="true"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Deploy"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Cache keys"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Backups"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Logs 24h"]')).toBeVisible();
  await expect(page.locator('[data-ops-kpi-card="Security 24h"]')).toBeVisible();

  await page.locator('[data-ops-overview-refresh="true"]').click();
  await expect(page.locator('[data-ops-overview-refresh="true"]')).toBeEnabled({ timeout: 15_000 });
});