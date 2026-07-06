import { expect, test } from '@playwright/test';

const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('shows the localized webhooks shell in ko and zh-hant', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });

  await page.goto('/ko/admin-builder/webhooks', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/웹훅/);
  await expect(page.getByRole('heading', { name: '웹훅' })).toBeVisible();
  await expect(page.getByRole('button', { name: '+ 새 webhook' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'URL' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '이벤트' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '상태' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '생성일' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '액션' })).toBeVisible();

  await page.goto('/zh-hant/admin-builder/webhooks', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Webhook/);
  await expect(page.getByRole('heading', { name: 'Webhook' })).toBeVisible();
  await expect(page.getByRole('button', { name: '+ 新增 webhook' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'URL' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '事件' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '狀態' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '建立時間' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '操作' })).toBeVisible();
});
