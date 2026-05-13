import { expect, test } from '@playwright/test';

test('home services section exposes runtime dataset binding controls', async ({ page }) => {
  await page.goto('/ko/builder/home?mode=edit', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText('Structure controls')).toBeVisible({ timeout: 30_000 });
  await page.getByText('Structure controls').click();

  await page
    .locator('.builder-preview-section-card')
    .filter({ hasText: 'home.services' })
    .getByRole('button')
    .first()
    .click();

  await expect(page.getByText('Services list is backed by a persisted dataset contract.')).toBeVisible();
  await expect(page.getByText('home.services.list')).toBeVisible();
  await expect(page.getByText('service-areas', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '3 records' })).toBeVisible();
  await expect(page.getByRole('button', { name: '6 records' })).toBeVisible();
});
