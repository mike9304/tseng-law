import { expect, test } from '@playwright/test';

test('/ko/admin-builder/migrations localizes shell labels', async ({ page }) => {
  await page.goto('/ko/admin-builder/migrations', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: '스키마 마이그레이션' })).toBeVisible();
  await expect(page.locator('header')).toContainText('블롭 JSON 컬렉션 스키마 변경을 순서대로 적용하고 적용 이력을 검토합니다.');
  await expect(page.getByRole('button', { name: '새로고침' })).toBeVisible();
  await expect(page.getByRole('button', { name: /펜딩 .* 실행/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /펜딩/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /적용 이력/ })).toBeVisible();
});

test('/zh-hant/admin-builder/migrations localizes shell labels', async ({ page }) => {
  await page.goto('/zh-hant/admin-builder/migrations', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: '結構遷移' })).toBeVisible();
  await expect(page.locator('header')).toContainText('依序套用 Blob JSON 集合結構變更，並檢視套用紀錄。');
  await expect(page.getByRole('button', { name: '重新整理' })).toBeVisible();
  await expect(page.getByRole('button', { name: /執行/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /待處理/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /套用紀錄/ })).toBeVisible();
});
