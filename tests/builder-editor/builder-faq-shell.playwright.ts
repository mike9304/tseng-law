import { expect, test } from '@playwright/test';

test.describe('/admin-builder/faq localization', () => {
  test('renders localized FAQ admin shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/faq', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/FAQ 관리자/);
    await expect(page.getByRole('heading', { name: 'FAQ 관리자' })).toBeVisible();
    await expect(page.getByRole('link', { name: '공개 FAQ 보기' })).toBeVisible();
    await expect(page.getByLabel('FAQ 요약')).toBeVisible();
    await expect(page.getByRole('heading', { name: '새 질문' })).toBeVisible();
    await expect(page.getByLabel('FAQ 검색')).toBeVisible();
    await expect(page.getByRole('button', { name: 'FAQ 생성' })).toBeVisible();

    await page.goto('/zh-hant/admin-builder/faq', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/FAQ 管理員/);
    await expect(page.getByRole('heading', { name: 'FAQ 管理員' })).toBeVisible();
    await expect(page.getByRole('link', { name: '查看公開 FAQ' })).toBeVisible();
    await expect(page.getByLabel('FAQ 摘要')).toBeVisible();
    await expect(page.getByRole('heading', { name: '新增問題' })).toBeVisible();
    await expect(page.getByLabel('搜尋 FAQ')).toBeVisible();
    await expect(page.getByRole('button', { name: '建立 FAQ' })).toBeVisible();
  });
});
