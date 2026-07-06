import { expect, test } from '@playwright/test';

test.describe('/admin-builder/services localization', () => {
  test('renders localized service source shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/서비스 소스 레코드/);
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '빌더 관리 내비게이션');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('편집기로 돌아가기');
    await expect(page.getByRole('heading', { name: '수명주기' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '콘텐츠' })).toBeVisible();
    await expect(page.getByRole('link', { name: '서비스 소스', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: '변호사 소스' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '칼럼 편집기' }).first()).toBeVisible();
    await expect(page.getByText('편집', { exact: true })).toBeVisible();

    await page.goto('/zh-hant/admin-builder/services', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/服務來源記錄/);
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '建構器管理導覽');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('返回編輯器');
    await expect(page.getByRole('heading', { name: '生命週期' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '內容' })).toBeVisible();
    await expect(page.getByRole('link', { name: '服務來源', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: '律師來源' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: '專欄編輯器' }).first()).toBeVisible();
    await expect(page.getByText('編輯', { exact: true })).toBeVisible();
  });
});
