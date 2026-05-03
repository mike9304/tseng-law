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

async function waitForEditorCss(page: Page): Promise<void> {
  const isStyled = async () => page.locator('header[class*="topBar"]').first().evaluate((element) => {
    const style = window.getComputedStyle(element);
    return style.display === 'grid' && Number.parseFloat(style.height) <= 36;
  }).catch(() => false);

  try {
    await expect.poll(isStyled, { timeout: 15_000 }).toBe(true);
  } catch {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect.poll(isStyled, { timeout: 15_000 }).toBe(true);
  }
}

test.describe('/ko/admin-builder desktop editor parity smoke', () => {
  test('covers Wix-like editor chrome, selection, shortcuts, panels, and publish gates', async ({ page }) => {
    await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });

    const topBar = page.locator('header[class*="topBar"]').first();
    await expect(topBar).toBeVisible();
    await expect(topBar).toContainText('Publish');
    await waitForEditorCss(page);
    await expect.poll(async () => (await topBar.boundingBox())?.height ?? 999).toBeLessThanOrEqual(36);
    const topBarBox = await topBar.boundingBox();
    expect(topBarBox?.height).toBeGreaterThanOrEqual(30);

    const rail = page.locator('[class*="iconRail"]').first();
    await expect(rail).toBeVisible();
    const railBox = await rail.boundingBox();
    expect(railBox?.width).toBeGreaterThanOrEqual(60);
    expect(railBox?.width).toBeLessThanOrEqual(68);

    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    await expect(page.getByTitle('사이트 발행')).toBeVisible();
    const stageBox = await page.getByRole('application', { name: 'Canvas editor' }).boundingBox();
    expect(stageBox?.y ?? 9999).toBeLessThan(130);
    await expect(page.getByRole('navigation').getByRole('link', { name: '칼럼' })).toBeVisible();

    await page.getByTitle('Add').click();
    await expect(page.getByText('Catalog')).toBeVisible();
    await expect(page.getByText('Basic')).toBeVisible();

    await rail.getByRole('button', { name: 'Columns', exact: true }).click();
    await expect(page.getByText('Open columns admin')).toBeVisible();
    await expect(page.getByText('View public columns')).toBeVisible();

    await page.locator('[class*="globalHeaderRegion"]').click({ position: { x: 360, y: 16 }, force: true });
    await expect(page.locator('[aria-hidden="false"]').getByText('Navigation').first()).toBeVisible();

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
    await page.getByRole('button', { name: 'Social share' }).click();
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
    await closeModalOverlayIfPresent(page);

    const officeMap = page.locator('[data-node-id="home-offices-layout-0-map"]').first();
    await expect(officeMap).toBeVisible();
    await officeMap.scrollIntoViewIfNeeded();
    await officeMap.click({ position: { x: 24, y: 24 } });
    await page.getByRole('button', { name: 'content' }).click();
    await expect(page.getByText('사무소 프리셋')).toBeVisible();
    await expect(page.locator('textarea').first()).toHaveValue(/臺中市北區館前路19號樓之1/);
  });
});
