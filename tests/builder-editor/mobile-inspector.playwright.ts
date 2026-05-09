import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

async function selectLayerNode(page: import('@playwright/test').Page, nodeId: string, kind: string): Promise<void> {
  await page.getByRole('button', { name: 'Layers', exact: true }).click({ force: true });
  const drawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Layers' }).first();
  await expect(drawer.getByText('Layers').first()).toBeVisible();
  const row = drawer.locator(`[title="${kind} ${nodeId}"]`).first();
  await expect(row).toBeVisible({ timeout: 10_000 });
  await row.click();
  await expect(page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first()).toBeVisible({
    timeout: 10_000,
  });
}

test.describe('/ko/admin-builder mobile inspector overrides', () => {
  test('syncs inspector viewport controls with top bar and creates removable overrides', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?mobileInspector=${Date.now().toString(36)}`);
    await selectLayerNode(page, 'home-services-title', 'text');

    await page.locator('[data-builder-inspector-panel="true"]').getByRole('button', { name: 'layout', exact: true }).click();
    const viewportControl = page.locator('[data-builder-mobile-inspector-viewport="true"]').first();
    await expect(viewportControl).toBeVisible();

    await viewportControl.locator('[data-builder-inspector-viewport-option="mobile"]').click();
    await expect(page.locator('[data-builder-topbar-viewport="mobile"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(viewportControl).toHaveAttribute('data-builder-viewport-override-state', 'created');
    await expect(page.locator('[data-builder-viewport-override-banner="created"]').first()).toContainText('Override created');

    const widthInput = page.getByLabel('Width value').first();
    const originalWidth = Number(await widthInput.inputValue());
    await widthInput.fill(String(Math.max(160, originalWidth - 24)));
    await widthInput.blur();
    await expect(viewportControl).toHaveAttribute('data-builder-viewport-override-state', 'created');
    await expect(page.locator('[data-builder-viewport-override-banner="created"]').first()).toContainText('Override created');

    const fontSizeInput = page.getByLabel('Font size value').first();
    await expect(fontSizeInput).toBeVisible();
    await fontSizeInput.fill('24');
    await fontSizeInput.blur();
    await expect(page.locator('[data-builder-viewport-override-banner="created"]').first()).toBeVisible();

    await page.getByRole('button', { name: /Mobile에서 보임/ }).click();
    await expect(page.locator('[data-builder-viewport-hidden-override="true"]').first()).toBeVisible();

    await page.getByRole('button', { name: 'Reset mobile' }).click();
    await expect(viewportControl).toHaveAttribute('data-builder-viewport-override-state', 'inherited');
    await expect(page.locator('[data-builder-viewport-override-banner="inherited"]').first()).toBeVisible();

    await viewportControl.locator('[data-builder-inspector-viewport-option="tablet"]').click();
    await expect(page.locator('[data-builder-topbar-viewport="tablet"]')).toHaveAttribute('aria-pressed', 'true');
  });
});
