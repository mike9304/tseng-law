import { expect, test } from '@playwright/test';

test.describe('/admin-builder/cms localization', () => {
  test('renders localized cms shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/cms', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/빌더 CMS/);
    const shellKo = page.locator('.builder-canvas-stage-meta strong').first();
    await expect(shellKo).toHaveText('콘텐츠 관리자');
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '빌더 관리 내비게이션');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('편집기로 돌아가기');
    await expect(page.getByRole('link', { name: '빌더 홈' })).toBeVisible();
    await expect(page.getByText('편집', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'M158 상태' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'F-레이어' })).toBeVisible();

    await page.goto('/zh-hant/admin-builder/cms', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/建構器 CMS/);
    const shellZh = page.locator('.builder-canvas-stage-meta strong').first();
    await expect(shellZh).toHaveText('內容管理器');
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '建構器管理導覽');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('返回編輯器');
    await expect(page.getByRole('link', { name: '建構器首頁' })).toBeVisible();
    await expect(page.getByText('編輯', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'M158 狀態' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'F-層' })).toBeVisible();
  });
});
