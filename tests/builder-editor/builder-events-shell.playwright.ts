import { expect, test } from '@playwright/test';
import { getEventsCopy } from '@/components/builder/events/events-copy';

const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

const LOCALES = ['ko', 'zh-hant'] as const;

for (const locale of LOCALES) {
  const copy = getEventsCopy(locale);

  test(`/${locale}/admin-builder/events localizes its shell`, async ({ page }) => {
    await page.setExtraHTTPHeaders({ Authorization: authHeader });
    await page.goto(`/${locale}/admin-builder/events`, { waitUntil: 'domcontentloaded' });

    // Exact title, no brand suffix: f93807c1 removed the root layout's
    // `%s | 법무법인 호정` template (src/app/layout.tsx now sets a plain
    // string title), and the (builder) route group declares no title
    // template of its own, so buildSeoMetadata's bare page title renders as-is.
    await expect(page).toHaveTitle(copy.title);
    await expect(page.getByRole('heading', { name: copy.heading, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: copy.publicLink, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: copy.createHeading, exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: copy.createButton, exact: true })).toBeVisible();
  });
}
