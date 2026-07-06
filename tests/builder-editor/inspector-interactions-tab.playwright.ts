import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

async function selectCanvasNode(page: import('@playwright/test').Page, nodeId: string): Promise<void> {
  const node = page.locator(`[data-node-id="${nodeId}"]:visible`).first();
  const selected = page.locator(
    `[data-node-id="${nodeId}"][data-selected="true"], [data-node-id="${nodeId}"][class*="nodeSelected"]`,
  ).first();
  await expect(node).toBeVisible({ timeout: 10_000 });
  await node.scrollIntoViewIfNeeded().catch(() => undefined);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (await selected.isVisible().catch(() => false)) return;
    await node.click({ position: { x: 16, y: 16 }, force: true });
    await page.waitForTimeout(150);
  }
  await expect(selected).toBeVisible({ timeout: 10_000 });
}

test('/ko/admin-builder edits click interactions from the Inspector tab', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 950 });
  await openBuilder(page);

  await selectCanvasNode(page, 'home-hero-search-button');

  await page.getByRole('button', { name: '인터랙션' }).click();
  const tab = page.locator('[data-builder-interactions-tab="true"]').first();
  await expect(tab).toBeVisible();

  const action = tab.locator('select[data-builder-interaction-action="link"]');
  const hrefInput = tab.locator('[data-builder-href-input="true"]').first();
  await expect(action).toHaveValue('page');
  const originalHref = await hrefInput.inputValue();

  await action.selectOption('anchor');
  await expect(hrefInput).toHaveValue(/^#/);

  await action.selectOption('popup');
  await expect(hrefInput).toHaveValue(/^popup:/);

  await action.selectOption('cookie');
  await expect(hrefInput).toHaveValue('cookie-consent:open');

  await hrefInput.fill(originalHref || '/ko/search');
  await expect(hrefInput).toHaveValue(originalHref || '/ko/search');
});
