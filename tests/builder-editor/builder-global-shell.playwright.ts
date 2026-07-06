import { expect, test } from '@playwright/test';

test.describe('/admin-builder/global canvas localization', () => {
  test('records recent admin surfaces across direct navigation', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/apps', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.localStorage.removeItem('builder:recent-admin-nav'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '빌더 관리 내비게이션');

    await page.goto('/ko/admin-builder/ops', { waitUntil: 'domcontentloaded' });

    const recentNav = page.locator('[data-builder-admin-recent-nav="true"]');
    await expect(recentNav).toBeVisible();
    const appsButton = recentNav.getByRole('button', { name: /앱.*워크스페이스/ });
    await expect(appsButton).toBeVisible();

    await appsButton.click();
    await expect(page).toHaveURL(/\/ko\/admin-builder\/apps$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ko/admin-builder/ops', { waitUntil: 'domcontentloaded' });
    const menuToggle = page.locator('[data-builder-admin-rail-toggle="true"]');
    await menuToggle.click();
    const toggleBox = await menuToggle.boundingBox();
    const backLinkBox = await page.locator('[data-builder-admin-rail-back="true"]').boundingBox();
    if (!toggleBox || !backLinkBox) throw new Error('Mobile admin rail controls must be measurable.');
    expect(backLinkBox.y).toBeGreaterThan(toggleBox.y + toggleBox.height + 6);
  });

  test('normalizes stored deep-link recent destinations into parent admin surfaces', async ({ page }) => {
    test.setTimeout(60_000);

    await page.addInitScript(() => {
      window.localStorage.setItem('builder:recent-admin-nav', JSON.stringify([
        {
          label: 'Live chat settings',
          href: '/en/admin-builder/apps/installations/live-chat/settings?tab=oauth#keys',
          sectionHeading: 'Workspace',
        },
        {
          label: 'Bookings dashboard',
          href: '/zh-hant/admin-builder/bookings/dashboard?action=pending',
          sectionHeading: 'Business',
        },
      ]));
    });

    await page.goto('/ko/admin-builder/ops', { waitUntil: 'domcontentloaded' });

    const recentNav = page.locator('[data-builder-admin-recent-nav="true"]');
    await expect(recentNav.getByRole('button', { name: /앱.*워크스페이스/ })).toBeVisible();
    await expect(recentNav.getByRole('button', { name: /예약.*비즈니스/ })).toBeVisible();
    await expect(recentNav).not.toContainText('/apps/installations/live-chat/settings');
    await expect(recentNav).not.toContainText('/bookings/dashboard');

    await recentNav.getByRole('button', { name: /앱.*워크스페이스/ }).click();
    await expect(page).toHaveURL(/\/ko\/admin-builder\/apps$/);
  });

  test('renders localized header and footer editors in ko and zh-hant', async ({ page }) => {
    test.setTimeout(60_000);

    await page.goto('/ko/admin-builder/header', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/글로벌 헤더 편집기/);
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '빌더 관리 내비게이션');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('편집기로 돌아가기');
    await expect(page.getByText('헤더 슬롯', { exact: false })).toBeVisible();
    await expect(page.locator('[data-global-canvas-drawer-button="add"]')).toBeVisible();
    await expect(page.locator('[data-global-canvas-drawer-button="layers"]')).toBeVisible();

    await page.goto('/zh-hant/admin-builder/header', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/全域頁首編輯器/);
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '建構器管理導覽');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('返回編輯器');
    await expect(page.getByText('頁首區塊', { exact: false })).toBeVisible();
    await expect(page.locator('[data-global-canvas-drawer-button="add"]')).toBeVisible();
    await expect(page.locator('[data-global-canvas-drawer-button="layers"]')).toBeVisible();

    await page.goto('/ko/admin-builder/footer', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/글로벌 푸터 편집기/);
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '빌더 관리 내비게이션');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('편집기로 돌아가기');
    await expect(page.getByText('푸터 슬롯', { exact: false })).toBeVisible();
    await expect(page.locator('[data-global-canvas-drawer-button="add"]')).toBeVisible();
    await expect(page.locator('[data-global-canvas-drawer-button="layers"]')).toBeVisible();

    await page.goto('/zh-hant/admin-builder/footer', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/全域頁尾編輯器/);
    await expect(page.locator('[data-builder-admin-nav-rail="true"]')).toHaveAttribute('aria-label', '建構器管理導覽');
    await expect(page.locator('[data-builder-admin-rail-back="true"]')).toContainText('返回編輯器');
    await expect(page.getByText('頁尾區塊', { exact: false })).toBeVisible();
    await expect(page.locator('[data-global-canvas-drawer-button="add"]')).toBeVisible();
    await expect(page.locator('[data-global-canvas-drawer-button="layers"]')).toBeVisible();
  });
});
