import { expect, test } from '@playwright/test';

test.describe('/admin-builder/lightboxes localization', () => {
  test('renders localized lightbox admin shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/lightboxes', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/라이트박스 관리자/);
    await expect(page.getByRole('heading', { name: '라이트박스 관리자' })).toBeVisible();
    await expect(page.getByText('버튼 클릭으로 열리는 라이트박스를 관리합니다. href: lightbox:<slug>로 트리거하세요.')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ 새 라이트박스' })).toBeVisible();
    await expect(page.getByPlaceholder('이름')).toBeVisible();
    await expect(page.getByPlaceholder('Slug (예: contact-form)')).toBeVisible();

    await page.goto('/zh-hant/admin-builder/lightboxes', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/燈箱管理員/);
    await expect(page.getByRole('heading', { name: '燈箱管理員' })).toBeVisible();
    await expect(page.getByText('管理按鈕開啟的燈箱。使用 href: lightbox:<slug> 來觸發。')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ 新增燈箱' })).toBeVisible();
    await expect(page.getByPlaceholder('名稱')).toBeVisible();
    await expect(page.getByPlaceholder('Slug（例如：contact-form）')).toBeVisible();
  });
});
