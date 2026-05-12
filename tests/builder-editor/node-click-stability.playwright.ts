import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test.describe('/ko/admin-builder node click stability', () => {
  test('does not move canvas nodes when a click has only pointer jitter', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?nodeClickStability=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const node = page.locator('[data-node-id="home-services-card-1-title"]').first();
    await node.scrollIntoViewIfNeeded();
    await expect(node).toBeVisible();

    const before = await node.boundingBox();
    expect(before).not.toBeNull();
    if (!before) throw new Error('Missing node bounds before jitter click.');

    await page.mouse.move(before.x + 12, before.y + 12);
    await page.mouse.down();
    await page.mouse.move(before.x + 14, before.y + 14);
    await page.mouse.up();

    await expect(node).toBeVisible();
    const after = await node.boundingBox();
    expect(after).not.toBeNull();
    if (!after) throw new Error('Missing node bounds after jitter click.');

    expect(Math.abs(after.x - before.x)).toBeLessThan(1);
    expect(Math.abs(after.y - before.y)).toBeLessThan(1);
  });

  test('keeps archive and image clicks inside the editor instead of blanking the canvas', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?nodeSurfaceStability=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const canvas = page.getByRole('application', { name: 'Canvas editor' });
    const archive = page.locator('[data-node-id="home-insights-list-wrap"]').first();
    await archive.scrollIntoViewIfNeeded();
    await archive.click({ position: { x: 20, y: 20 }, force: true });
    await expect(page).toHaveURL(/\/ko\/admin-builder/);
    await expect(canvas).toBeVisible();
    await expect(page.locator('[data-node-id="home-insights-title"]').first()).toBeVisible();

    const previewLink = page.locator('[data-builder-insights-preview="true"] a[href]').first();
    if (await previewLink.isVisible().catch(() => false)) {
      await previewLink.click({ force: true });
      await expect(page).toHaveURL(/\/ko\/admin-builder/);
      await expect(canvas).toBeVisible();
    }

    const image = page.locator('[data-node-id="home-hero-media-image"]').first();
    await image.scrollIntoViewIfNeeded();
    const assetDialog = page.getByRole('dialog', { name: 'Asset library' });
    await image.click({ position: { x: 20, y: 20 }, force: true });
    if (!(await assetDialog.isVisible().catch(() => false))) {
      await image.click({ position: { x: 20, y: 20 }, force: true });
    }
    await expect(assetDialog).toBeVisible();
    await expect(assetDialog).toContainText('Select, upload, or remove builder images');
    await assetDialog.getByRole('button', { name: 'Close' }).click();
    await expect(assetDialog).toBeHidden();
    await expect(canvas).toBeVisible();
  });
});
