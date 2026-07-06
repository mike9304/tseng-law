import { expect, test } from '@playwright/test';

test.describe('/admin-builder/seo localization', () => {
  test('renders localized SEO dashboard shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/seo', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/SEO 대시보드/);
    await expect(page.getByRole('heading', { name: 'SEO 대시보드' })).toBeVisible();
    await expect(page.getByRole('link', { name: '리디렉션' })).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: '빌더', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SEO 체크리스트' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SEO 설정' })).toBeVisible();
    await expect(page.getByRole('button', { name: '페이지별 편집' })).toBeVisible();
    await expect(page.getByRole('button', { name: '도구' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SEO 체크리스트' })).toBeVisible();
    await expect(page.getByLabel('비즈니스 이름')).toBeVisible();
    await expect(page.getByLabel('키워드')).toBeVisible();
    await page.getByRole('button', { name: 'SEO 설정' }).click();
    await expect(page.getByRole('heading', { name: '주요 페이지 SEO 설정' })).toBeVisible();
    await expect(page.getByLabel('제목 태그 패턴')).toBeVisible();
    await page.getByRole('button', { name: '페이지별 편집' }).click();
    await expect(page.getByRole('heading', { name: '페이지별 편집' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '페이지' })).toBeVisible();
    await page.getByRole('button', { name: '도구' }).click();
    await expect(page.getByRole('heading', { name: '기술 SEO 도구' })).toBeVisible();

    await page.goto('/zh-hant/admin-builder/seo', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/SEO 儀表板/);
    await expect(page.getByRole('heading', { name: 'SEO 儀表板' })).toBeVisible();
    await expect(page.getByRole('link', { name: '重新導向' })).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: '建構器', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SEO 檢查清單' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SEO 設定' })).toBeVisible();
    await expect(page.getByRole('button', { name: '按頁面編輯' })).toBeVisible();
    await expect(page.getByRole('button', { name: '工具' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SEO 檢查清單' })).toBeVisible();
    await expect(page.getByLabel('商家名稱')).toBeVisible();
    await expect(page.getByLabel('關鍵字')).toBeVisible();
    await page.getByRole('button', { name: 'SEO 設定' }).click();
    await expect(page.getByRole('heading', { name: '主要頁面 SEO 設定' })).toBeVisible();
    await expect(page.getByLabel('標題標籤樣式')).toBeVisible();
    await page.getByRole('button', { name: '按頁面編輯' }).click();
    await expect(page.getByRole('heading', { name: '按頁面編輯' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '頁面' })).toBeVisible();
    await page.getByRole('button', { name: '工具' }).click();
    await expect(page.getByRole('heading', { name: '技術 SEO 工具' })).toBeVisible();
  });
});
