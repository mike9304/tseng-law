import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test('builder mobile header menu keeps public search and locale utilities', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });

  await openBuilder(page, `/ko/admin-builder?mobileHeaderUtilities=${Date.now().toString(36)}`);

  await page.locator('.builder-site-header .mobile-toggle').first().click();
  const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();

  await expect(mobileDrawer).toBeVisible();
  await expect(mobileDrawer.locator('[data-builder-mobile-nav-edit]').first()).toBeVisible();

  const utility = mobileDrawer.locator('.site-mobile-nav-utility').first();
  await utility.scrollIntoViewIfNeeded();
  await expect(mobileDrawer.getByRole('button', { name: '검색 열기' })).toBeVisible();
  await expect(mobileDrawer.getByRole('link', { name: 'KO' })).toBeVisible();
  await expect(mobileDrawer.getByRole('link', { name: '繁中' })).toBeVisible();
  await expect(mobileDrawer.getByRole('link', { name: 'EN' })).toBeVisible();

  const utilityBox = await utility.boundingBox();
  const inspectorBox = await page.locator('[class*="inspectorColumn"]').first().boundingBox();
  if (!utilityBox || !inspectorBox) {
    throw new Error('Expected the mobile menu utilities and inspector to have layout boxes.');
  }
  expect(utilityBox.y + utilityBox.height).toBeLessThanOrEqual(inspectorBox.y - 8);

  await mobileDrawer.getByRole('button', { name: '검색 열기' }).click();

  await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
  const searchDialog = page.getByRole('dialog', { name: '검색' });
  await expect(searchDialog).toBeVisible();
  await expect(searchDialog.getByRole('searchbox', { name: '어떻게 도와드릴까요?' })).toBeVisible();
});
