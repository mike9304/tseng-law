import { expect, test } from '@playwright/test';

const LOCALE = 'ko';
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('admin can add a member, change their role, and remove them', async ({ page }) => {
  test.setTimeout(60_000);
  const unique = `playwright-${Date.now()}@example.com`;

  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.goto(`/${LOCALE}/admin-builder/workspace?tab=members`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-members-panel]')).toBeVisible();

  await page.locator('[data-members-panel] input[type="email"]').fill(unique);
  await page.locator('[data-members-add]').click();

  const row = page.locator(`[data-member-email="${unique}"]`);
  await expect(row).toBeVisible();

  await row.locator(`[data-member-role-select="${unique}"]`).selectOption('editor');
  await expect(row.locator(`[data-member-role-select="${unique}"]`)).toHaveValue('editor');

  await row.locator(`[data-member-remove="${unique}"]`).click();
  await expect(row).toHaveCount(0);
});