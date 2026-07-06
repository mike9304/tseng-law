import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test('/ko/admin-builder drag preview follows both axes for full-size child nodes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await openBuilder(page, `/ko/admin-builder?dragAxis=${Date.now().toString(36)}`);

  const node = page.locator('[data-node-id="home-hero-title"]').first();
  await expect(node).toBeVisible();
  const before = await node.boundingBox();
  expect(before).not.toBeNull();
  if (!before) throw new Error('Missing home hero title bounds before drag.');

  const start = {
    x: before.x + before.width / 2,
    y: before.y + Math.min(24, before.height / 4),
  };

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 120, start.y + 80, { steps: 8 });
  await page.waitForTimeout(80);

  const preview = await page
    .locator('[data-builder-direct-move-preview="true"][data-node-id="home-hero-title"]')
    .first()
    .boundingBox();
  expect(preview).not.toBeNull();
  if (!preview) throw new Error('Missing home hero title direct move preview.');

  expect(preview.x - before.x).toBeGreaterThan(40);
  expect(preview.y - before.y).toBeGreaterThan(40);

  await page.mouse.up();
  await expect(page.locator('[data-builder-direct-move-preview="true"]')).toHaveCount(0);
});
