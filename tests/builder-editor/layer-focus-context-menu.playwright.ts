import { expect, test, type Page } from '@playwright/test';

async function ensureLayersPanelOpen(page: Page): Promise<ReturnType<Page['locator']>> {
  const layersPanel = page.locator('[data-builder-layers-panel="true"]');
  if (await layersPanel.isVisible().catch(() => false)) return layersPanel;
  await page.getByRole('button', { name: /Layers/i }).click();
  await expect(layersPanel).toBeVisible();
  return layersPanel;
}

async function selectedNodeHitTarget(page: Page, nodeId: string) {
  const node = page.locator(`[data-node-id="${nodeId}"][data-selected="true"]`).first();
  const box = await node.boundingBox();
  if (!box) return null;
  const point = {
    x: box.x + Math.min(12, box.width / 2),
    y: box.y + Math.min(12, box.height / 2),
  };
  const hitNodeId = await page.evaluate(({ x, y }) => {
    const element = document.elementFromPoint(x, y);
    return element instanceof HTMLElement
      ? element.closest('[data-node-id]')?.getAttribute('data-node-id') ?? null
      : null;
  }, point);
  return { hitNodeId, point };
}

test.describe('M67 layer focus context menu', () => {
  test('keeps a layer-selected node under the pointer for real right-click actions', async ({ page }) => {
    await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    await expect(page.locator('[data-editor-shell]')).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });

    await ensureLayersPanelOpen(page);
    await page.locator('[data-builder-layer-search="true"]').fill('home-hero-title');
    await page.locator('[data-builder-layer-row="home-hero-title"]').click();
    await expect(page.locator('[data-node-id="home-hero-title"][data-selected="true"]')).toBeVisible();

    await expect.poll(async () => (await selectedNodeHitTarget(page, 'home-hero-title'))?.hitNodeId).toBe('home-hero-title');
    const hitTarget = await selectedNodeHitTarget(page, 'home-hero-title');
    expect(hitTarget).not.toBeNull();

    await page.mouse.click(hitTarget!.point.x, hitTarget!.point.y, { button: 'right' });
    await expect(page.getByRole('menuitem', { name: /Duplicate/ })).toBeVisible();
  });
});
