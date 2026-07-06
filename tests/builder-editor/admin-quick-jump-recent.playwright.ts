import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test('/ko/admin-builder quick jump normalizes cross-locale recent admin links', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 950 });
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
      { label: 'CMS', href: '/en/admin-builder/cms', sectionHeading: 'Edit' },
    ]));
  });

  await openBuilder(page, `/ko/admin-builder?quickJumpRecent=${Date.now().toString(36)}`);
  await page.locator('[data-builder-admin-quickjump-open="true"]').click();

  const modal = page.locator('[data-modal-shell="true"]').last();
  await expect(modal).toBeVisible();
  await expect(modal.getByText('/ko/admin-builder/apps')).toBeVisible();
  await expect(modal.getByText('/ko/admin-builder/bookings')).toBeVisible();
  await expect(modal.getByText('/ko/admin-builder/cms')).toBeVisible();
  await expect(modal.getByText('/en/admin-builder/apps/installations/live-chat/settings?tab=oauth#keys')).toHaveCount(0);
  await expect(modal.getByText('/zh-hant/admin-builder/bookings/dashboard?action=pending')).toHaveCount(0);
  await expect(modal.getByText('/en/admin-builder/cms')).toHaveCount(0);

  const appResult = modal.locator('button').filter({ hasText: '/ko/admin-builder/apps' }).first();
  await expect(appResult).toContainText('앱');
  await appResult.click();
  await expect(page).toHaveURL(/\/ko\/admin-builder\/apps(?:\?.*)?$/);
});

test('/ko/admin-builder mobile quick jump opens from the top bar without horizontal overflow', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });

  await openBuilder(page, `/ko/admin-builder?mobileQuickJump=${Date.now().toString(36)}`);
  const quickJumpButton = page.locator('[data-builder-admin-quickjump-open="true"]');
  await expect(quickJumpButton).toBeVisible();
  await quickJumpButton.click();

  const modal = page.locator('[data-modal-shell="true"]').last();
  await expect(modal).toBeVisible();
  await expect(modal.locator('input[type="search"]')).toBeVisible();
  await expect(
    page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
  ).resolves.toBe(true);
});
