import { expect, test } from '@playwright/test';

test('/ko/admin-builder/domains localizes shell labels', async ({ page }) => {
  await page.goto('/ko/admin-builder/domains', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('사용자 지정 도메인');
  await expect(page.locator('header')).toContainText('도메인을 연결하면 TXT + CNAME 안내가 표시됩니다.');
  await expect(page.getByPlaceholder('example.com')).toBeVisible();
  await expect(page.getByRole('button', { name: '도메인 등록' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: '대기 중인 도메인 30초마다 자동 검증' })).toBeVisible();
});

test('/zh-hant/admin-builder/domains localizes shell labels', async ({ page }) => {
  await page.goto('/zh-hant/admin-builder/domains', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('自訂網域');
  await expect(page.locator('header')).toContainText('連結網域後會顯示 TXT + CNAME 指引。');
  await expect(page.getByPlaceholder('example.com')).toBeVisible();
  await expect(page.getByRole('button', { name: '註冊網域' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: '每 30 秒自動驗證待處理的網域' })).toBeVisible();
});
