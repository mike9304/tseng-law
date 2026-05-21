import { expect, test } from '@playwright/test';

const LOCALE = 'ko';
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('/ko/admin-builder/commerce/payments shows payment analytics and stays mobile safe', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`/${LOCALE}/admin-builder/commerce/payments`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-payment-analytics-page]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-summary]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="attempts"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-card="conversion"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-card="failed"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-card="refunds"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-source="orders"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-source="bookings"]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Orders' })).toHaveAttribute('href', `/${LOCALE}/admin-builder/commerce/orders`);
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).resolves.toBe(true);
});

test('/ko/admin-builder/commerce/orders links to payment analytics', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.goto(`/${LOCALE}/admin-builder/commerce/orders`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('link', { name: 'Payments' })).toHaveAttribute('href', `/${LOCALE}/admin-builder/commerce/payments`);
});

test('/ko/admin-builder/commerce/documents exposes compact payment analytics strip', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`/${LOCALE}/admin-builder/commerce/documents`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-payment-analytics]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="collected"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="balance-due"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="manual-pending"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="refunded"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="needs-review"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-mix]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-segment]')).toHaveCount(3);
  await expect(page.locator('[data-payment-analytics-attention]')).toBeVisible();
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).resolves.toBe(true);
});
