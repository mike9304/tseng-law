import { expect, test, type Locator, type Page } from '@playwright/test';

const shortcutModifier = 'ControlOrMeta';

async function firstVisibleNode(page: Page): Promise<Locator> {
  const node = page.locator('[data-node-id]:visible').first();
  await expect(node).toBeVisible();
  return node;
}

async function selectFirstNode(page: Page): Promise<Locator> {
  const node = await firstVisibleNode(page);
  await node.click({ position: { x: 12, y: 12 } });
  await expect(page.locator('[class*="resizeHandle"]')).toHaveCount(8);
  await expect(page.locator('[class*="rotationHandle"]').first()).toBeVisible();
  await expect(page.locator('[class*="nodeSizeLabel"]').first()).toContainText(/·/);
  return node;
}

async function closeModalOverlayIfPresent(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: /Close|닫기|취소|Cancel/ }).first();
  if ((await closeButton.count()) === 0 || !(await closeButton.isVisible())) return;
  await closeButton.click();
  await page.waitForTimeout(150);
}

test.describe('/ko/admin-builder desktop editor parity smoke', () => {
  test('covers Wix-like editor chrome, selection, shortcuts, panels, and publish gates', async ({ page }) => {
    await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });

    const topBar = page.locator('[class*="topBar"]').first();
    await expect(topBar).toBeVisible();
    await expect(topBar).toContainText('Publish');
    const topBarBox = await topBar.boundingBox();
    expect(topBarBox?.height).toBeGreaterThanOrEqual(30);
    expect(topBarBox?.height).toBeLessThanOrEqual(36);

    const rail = page.locator('[class*="iconRail"]').first();
    await expect(rail).toBeVisible();
    const railBox = await rail.boundingBox();
    expect(railBox?.width).toBeGreaterThanOrEqual(60);
    expect(railBox?.width).toBeLessThanOrEqual(68);

    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    await expect(page.getByTitle('사이트 발행')).toBeVisible();

    await page.getByTitle('Add').click();
    await expect(page.getByText('Catalog')).toBeVisible();
    await expect(page.getByText('Basic')).toBeVisible();

    const selectedNode = await selectFirstNode(page);
    await closeModalOverlayIfPresent(page);

    await selectedNode.click({ button: 'right', position: { x: 18, y: 18 } });
    await expect(page.locator('[role="menu"]').first()).toBeVisible();
    await expect(page.locator('[class*="contextMenuShortcut"]').first()).toBeVisible();
    await page.keyboard.press('Escape');

    await selectFirstNode(page);
    await closeModalOverlayIfPresent(page);
    await page.keyboard.press(`${shortcutModifier}+D`);
    await expect(page.getByText('Duplicated')).toBeVisible();
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expect(page.getByText(/Undid:/)).toBeVisible();

    await page.keyboard.press(`${shortcutModifier}+C`);
    await page.getByTitle('Pages').first().click();
    await expect(page.getByText('1개 요소 클립보드')).toBeVisible();

    await selectFirstNode(page);
    await closeModalOverlayIfPresent(page);
    const resizeHandle = page.locator('[class*="resizeHandleE"]:visible').first();
    await expect(resizeHandle).toHaveCSS('cursor', 'ew-resize');

    await page.getByTitle('현재 페이지 SEO').click();
    await expect(page.getByText('Google preview')).toBeVisible();
    await expect(page.getByText('OG image preview')).toBeVisible();
    await closeModalOverlayIfPresent(page);

    await closeModalOverlayIfPresent(page);
    await page.getByTitle('사이트 발행').click();
    await expect(page.getByText('Automatic preflight checklist')).toBeVisible();
    await expect(page.getByText('Images').first()).toBeVisible();
    await expect(page.getByText('Links').first()).toBeVisible();
    await expect(page.getByText('SEO').first()).toBeVisible();
    await expect(page.getByText('Forms').first()).toBeVisible();
    await closeModalOverlayIfPresent(page);

    await page.getByTitle('버전 히스토리').click();
    await expect(page.getByText('버전 히스토리')).toBeVisible();
    await expect(page.getByText('현재 Draft').first()).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
