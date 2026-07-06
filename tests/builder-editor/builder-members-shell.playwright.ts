import { expect, test } from '@playwright/test';

test.describe('/admin-builder/members localization', () => {
  test('renders localized members admin shell in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/members', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/회원 관리자/);
    await expect(page.getByRole('heading', { name: '회원 관리' })).toBeVisible();
    await expect(page.getByRole('link', { name: '공개 계정 페이지 보기' })).toBeVisible();
    await expect(page.getByLabel('회원 요약')).toBeVisible();
    await expect(page.getByRole('heading', { name: '새 회원' })).toBeVisible();
    await expect(page.getByRole('button', { name: '회원 생성' })).toBeVisible();

    await page.goto('/zh-hant/admin-builder/members', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/會員管理員/);
    await expect(page.getByRole('heading', { name: '會員管理' })).toBeVisible();
    await expect(page.getByRole('link', { name: '查看公開帳戶頁' })).toBeVisible();
    await expect(page.getByLabel('會員摘要')).toBeVisible();
    await expect(page.getByRole('heading', { name: '新增會員' })).toBeVisible();
    await expect(page.getByRole('button', { name: '建立會員' })).toBeVisible();
  });
});
