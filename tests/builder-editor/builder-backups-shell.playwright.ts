import { expect, test } from '@playwright/test';

const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('shows the localized backups shell in ko and zh-hant', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });

  await page.goto('/ko/admin-builder/backups', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/백업/);
  await expect(page.getByRole('heading', { name: '백업' })).toBeVisible();
  await expect(page.getByRole('button', { name: '지금 백업' })).toBeVisible();
  await expect(page.getByRole('button', { name: '새로고침' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '백업 ID' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '생성' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '트리거' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '엔트리' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '크기' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '작업' })).toBeVisible();

  await page.goto('/zh-hant/admin-builder/backups', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/備份/);
  await expect(page.getByRole('heading', { name: '備份' })).toBeVisible();
  await expect(page.getByRole('button', { name: '立即備份' })).toBeVisible();
  await expect(page.getByRole('button', { name: '重新整理' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '備份 ID' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '建立時間' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '觸發來源' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '項目' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '大小' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '操作' })).toBeVisible();
});
