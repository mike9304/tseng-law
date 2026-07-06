import { expect, test } from '@playwright/test';

test.describe('/admin-builder/search localization', () => {
  test('renders localized search admin shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/search', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/사이트 검색 관리자/);
    await expect(page.getByRole('heading', { name: '사이트 검색' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '인덱스 상태' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '검색 통계' })).toBeVisible();
    await expect(page.getByRole('button', { name: '인덱스 재빌드' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '쿼리' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '횟수' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '평균 결과수' })).toBeVisible();

    await page.goto('/zh-hant/admin-builder/search', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/站內搜尋管理/);
    await expect(page.getByRole('heading', { name: '站內搜尋' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '索引狀態' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '搜尋統計' })).toBeVisible();
    await expect(page.getByRole('button', { name: '重新建置索引' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '查詢' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '次數' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '平均結果數' })).toBeVisible();
  });
});
