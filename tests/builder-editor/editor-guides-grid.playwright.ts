import { expect, test } from '@playwright/test';

const PREFS_KEY = 'tw_builder_editor_prefs_v1';

test.describe('M28 editor rulers, guides, and grid snap', () => {
  test.setTimeout(90_000);

  test('shows rulers, toggles grid snap, changes grid size, and creates a custom guide', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), PREFS_KEY);
    await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });

    const canvas = page.getByRole('application', { name: 'Canvas editor' });
    await expect(canvas).toBeVisible();
    await expect(page.locator('[data-builder-ruler="top"]').first()).toBeVisible();
    await expect(page.locator('[data-builder-ruler="left"]').first()).toBeVisible();

    await page.getByRole('button', { name: 'Grid' }).click();
    const grid = page.locator('[data-builder-grid="true"]').first();
    await expect(grid).toBeVisible();

    const gridSizeInput = page.getByLabel('Grid size');
    await gridSizeInput.fill('32');
    await expect(grid).toHaveCSS('background-size', '32px 32px');
    await gridSizeInput.evaluate((element) => (element as HTMLInputElement).blur());

    await page.keyboard.press('Shift+G');
    await expect(page.locator('[data-builder-grid="true"]')).toHaveCount(0);
    await page.keyboard.press('Shift+G');
    await expect(page.locator('[data-builder-grid="true"]').first()).toBeVisible();

    const topRuler = page.locator('[data-builder-ruler="top"]').first();
    const box = await topRuler.boundingBox();
    expect(box).toBeTruthy();
    await topRuler.click({ position: { x: Math.min(240, Math.max(12, box!.width / 3)), y: Math.min(6, Math.max(2, box!.height / 2)) } });
    await expect(page.locator('[data-builder-guide-axis="vertical"]').first()).toBeVisible();

    const prefs = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) || '{}'), PREFS_KEY) as {
      pixelGrid?: { enabled?: boolean; size?: number };
      referenceGuides?: unknown[];
    };
    expect(prefs.pixelGrid?.enabled).toBe(true);
    expect(prefs.pixelGrid?.size).toBe(32);
    expect(prefs.referenceGuides?.length).toBeGreaterThan(0);
  });
});
