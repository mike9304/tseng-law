import { expect, test, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

async function expectEditorSurfaceIntact(page: Page) {
  await expect(page).toHaveURL(/\/ko\/admin-builder/);
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  await expect(page.locator('body')).toContainText('호정국제');
  await expect.poll(() => page.locator('[data-node-id]').count()).toBeGreaterThan(25);
}

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
    await expectEditorSurfaceIntact(page);
    await expect(archive).toBeVisible();
    await expect(page.locator('[data-node-id="home-insights-title"]').first()).toBeVisible();

    const previewLink = page.locator('[data-builder-insights-preview="true"] a[href]').first();
    if (await previewLink.isVisible().catch(() => false)) {
      await previewLink.click({ force: true });
      await expectEditorSurfaceIntact(page);
      await expect(archive).toBeVisible();
    }

    const image = page.locator('[data-node-id="home-hero-media-image"]').first();
    await image.scrollIntoViewIfNeeded();
    const assetDialog = page.getByRole('dialog', { name: 'Asset library' });
    await image.click({ position: { x: 20, y: 20 }, force: true });
    await expectEditorSurfaceIntact(page);
    await expect(image).toHaveAttribute('data-selected', 'true');
    if (!(await assetDialog.isVisible().catch(() => false))) {
      await image.click({ position: { x: 20, y: 20 }, force: true });
    }
    await expect(assetDialog).toBeVisible();
    await expect(assetDialog).toContainText('Select, upload, or remove builder images');
    await assetDialog.getByRole('button', { name: 'Close' }).click();
    await expect(assetDialog).toBeHidden();
    await expectEditorSurfaceIntact(page);
  });

  test('keeps revealed FAQ answer text visible while selecting other nodes', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?faqClickStability=${Date.now().toString(36)}`);
    await page.keyboard.press('Escape');

    const firstAnswer = page.locator('[data-node-id="home-faq-item-0-answer"]').first();
    const secondQuestion = page.locator('[data-node-id="home-faq-item-1-question-text"]').first();
    const secondAnswer = page.locator('[data-node-id="home-faq-item-1-answer"]').first();
    const heroTitle = page.locator('[data-node-id="home-hero-title"]').first();

    await firstAnswer.scrollIntoViewIfNeeded();
    await expect(firstAnswer).toBeVisible();
    await expect(secondAnswer).toBeHidden();

    await secondQuestion.click({ position: { x: 12, y: 12 }, force: true });
    await expect(secondAnswer).toBeVisible();
    await expect(firstAnswer).toBeVisible();

    await heroTitle.click({ position: { x: 12, y: 12 }, force: true });
    await expect(firstAnswer).toBeVisible();
    await expect(secondAnswer).toBeVisible();
  });
});
