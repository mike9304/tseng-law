import { expect, test, type Locator, type Page } from '@playwright/test';

const shortcutModifier = 'ControlOrMeta';

function isIgnoredBrowserError(message: string): boolean {
  return message === 'Invalid or unexpected token';
}

async function firstVisibleNode(page: Page): Promise<Locator> {
  const candidates = [
    page.locator('[data-node-id="home-hero-subtitle"]:visible').first(),
    page.locator('[data-node-id*="subtitle"]:visible').first(),
    page.locator('[data-node-id*="title"]:visible').first(),
    page.locator('[data-node-id*="copy"]:visible').first(),
    page.locator('[data-node-id]:visible').first(),
  ];
  for (const candidate of candidates) {
    if ((await candidate.count()) > 0) {
      await expect(candidate).toBeVisible();
      return candidate;
    }
  }
  const fallback = page.locator('[data-node-id]:visible').first();
  await expect(fallback).toBeVisible();
  return fallback;
}

async function expectSelectedNodeHandles(page: Page, node?: Locator): Promise<Locator> {
  let selectedNode = node ?? page
    .locator('[class*="nodeSelected"][data-node-id]:visible')
    .filter({ has: page.locator('[class*="rotationHandle"]') })
    .last();

  if (node) {
    const hasHandles = await node.locator('[class*="rotationHandle"]').first().isVisible().catch(() => false);
    if (!hasHandles) {
      const box = await node.boundingBox();
      await node.click({
        position: box
          ? {
              x: Math.max(1, Math.min(box.width - 1, box.width / 2)),
              y: Math.max(1, Math.min(box.height - 1, box.height / 2)),
            }
          : { x: 12, y: 12 },
        force: true,
      }).catch(() => undefined);
    }
  }

  const selectedVisible = await selectedNode.isVisible().catch(() => false);
  if (!selectedVisible) {
    const fallback = await firstVisibleNode(page);
    const fallbackBox = await fallback.boundingBox();
    await fallback.click({
      position: fallbackBox
        ? {
            x: Math.max(1, Math.min(fallbackBox.width - 1, fallbackBox.width / 2)),
            y: Math.max(1, Math.min(fallbackBox.height - 1, fallbackBox.height / 2)),
          }
        : { x: 12, y: 12 },
      force: true,
    });
    selectedNode = page
      .locator('[class*="nodeSelected"][data-node-id]:visible')
      .filter({ has: page.locator('[class*="rotationHandle"]') })
      .last();
  }

  await expect(selectedNode).toBeVisible();
  await expect(selectedNode.locator('[class*="resizeHandle"]:visible')).toHaveCount(8);
  await expect(selectedNode.locator('[class*="rotationHandle"]').first()).toBeVisible();
  await expect(selectedNode.locator('[class*="nodeSizeLabel"]').first()).toContainText(/·/);
  return selectedNode;
}

async function selectFirstNode(page: Page): Promise<Locator> {
  const node = await firstVisibleNode(page);
  const box = await node.boundingBox();
  await node.click({
    position: box
      ? {
          x: Math.max(1, Math.min(box.width - 1, box.width / 2)),
          y: Math.max(1, Math.min(box.height - 1, box.height / 2)),
        }
      : { x: 12, y: 12 },
    force: true,
  });
  return expectSelectedNodeHandles(page, node);
}

async function nodeCssSize(locator: Locator): Promise<{ width: number; height: number }> {
  return locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      width: Number.parseFloat(style.width),
      height: Number.parseFloat(style.height),
    };
  });
}

async function startPointerDrag(
  page: Page,
  locator: Locator,
  options: { pointerId?: number; shiftKey?: boolean } = {},
): Promise<{ pointerId: number; x: number; y: number; shiftKey: boolean }> {
  const box = await locator.boundingBox();
  expect(box).toBeTruthy();
  if (!box) throw new Error('Cannot drag an element without a bounding box');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const pointerId = options.pointerId ?? 7001;
  const shiftKey = options.shiftKey ?? false;
  await locator.evaluate((element, init) => {
    element.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      isPrimary: true,
      pointerType: 'mouse',
      button: 0,
      buttons: 1,
      ...init,
    }));
  }, { pointerId, clientX: x, clientY: y, shiftKey });
  return { pointerId, x, y, shiftKey };
}

async function movePointerDrag(
  page: Page,
  drag: { pointerId: number; x: number; y: number; shiftKey: boolean },
  deltaX: number,
  deltaY: number,
): Promise<void> {
  await page.evaluate((init) => {
    window.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      composed: true,
      isPrimary: true,
      pointerType: 'mouse',
      button: 0,
      buttons: 1,
      pointerId: init.pointerId,
      clientX: init.x + init.deltaX,
      clientY: init.y + init.deltaY,
      shiftKey: init.shiftKey,
    }));
  }, { ...drag, deltaX, deltaY });
}

async function finishPointerDrag(
  page: Page,
  drag: { pointerId: number; x: number; y: number; shiftKey: boolean },
  deltaX: number,
  deltaY: number,
): Promise<void> {
  await page.evaluate((init) => {
    window.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      composed: true,
      isPrimary: true,
      pointerType: 'mouse',
      button: 0,
      buttons: 0,
      pointerId: init.pointerId,
      clientX: init.x + init.deltaX,
      clientY: init.y + init.deltaY,
      shiftKey: init.shiftKey,
    }));
  }, { ...drag, deltaX, deltaY });
}

async function navLabelFromApi(page: Page, itemId: string): Promise<string | null> {
  const response = await page.request.get('/api/builder/site/navigation?locale=ko');
  if (!response.ok()) return null;
  const payload = (await response.json()) as {
    navigation?: Array<{ id: string; label: string | Record<string, string> }>;
  };
  const item = payload.navigation?.find((candidate) => candidate.id === itemId);
  if (!item) return null;
  if (typeof item.label === 'string') return item.label;
  return item.label.ko ?? item.label.en ?? item.label['zh-hant'] ?? null;
}

async function expectUndoChip(page: Page): Promise<void> {
  await expect(page.getByText(/Undid:/).first()).toBeVisible();
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

async function recoverFromDevChunkOverlay(page: Page): Promise<void> {
  const overlay = page.getByText(/Unhandled Runtime Error|ChunkLoadError/).first();
  if (!(await overlay.isVisible().catch(() => false))) return;
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForEditorCss(page);
}

test.describe('/ko/admin-builder desktop editor parity smoke', () => {
  test('covers Wix-like editor chrome, selection, shortcuts, panels, and publish gates', async ({ page }) => {
    const shellResponse = await page.request.get('/ko/admin-builder');
    expect(shellResponse.status()).toBe(200);
    const shellHtml = await shellResponse.text();
    const runtimeChunk = shellHtml.match(/\/_next\/static\/chunks\/webpack-[^"]+\.js/)?.[0];
    if (runtimeChunk) {
      const runtimeResponse = await page.request.get(runtimeChunk);
      expect(runtimeResponse.status()).toBe(200);
      expect(runtimeResponse.headers()['content-type']).toContain('application/javascript');
    } else {
      expect(shellHtml, 'dev editor shell should still include Next app chunks').toContain('/_next/static/chunks/');
    }
    const columnsResponse = await page.request.get('/api/builder/columns?locale=ko');
    expect(columnsResponse.status()).toBe(200);
    const columnsPayload = (await columnsResponse.json()) as {
      columns?: Array<{ slug: string }>;
    };
    expect(columnsPayload.columns?.length ?? 0).toBeGreaterThan(0);
    const firstColumnSlug = columnsPayload.columns?.[0]?.slug;
    expect(firstColumnSlug).toBeTruthy();
    const firstColumnEditorResponse = await page.request.get(
      `/ko/admin-builder/columns/${encodeURIComponent(firstColumnSlug || '')}/edit`,
    );
    expect(firstColumnEditorResponse.status()).toBe(200);

    const browserErrors: string[] = [];
    page.on('console', (message) => {
      const text = message.text();
      if (message.type() === 'error' && !isIgnoredBrowserError(text)) browserErrors.push(text);
    });
    page.on('pageerror', (error) => {
      if (!isIgnoredBrowserError(error.message)) browserErrors.push(error.message);
    });

    await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });

    const topBar = page.locator('header[class*="topBar"]').first();
    await expect(topBar).toBeVisible();
    await expect(topBar).toContainText('Publish');
    await waitForEditorCss(page);
    await recoverFromDevChunkOverlay(page);
    await expect.poll(async () => (await topBar.boundingBox())?.height ?? 999).toBeLessThanOrEqual(36);
    const topBarBox = await topBar.boundingBox();
    expect(topBarBox?.height).toBeGreaterThanOrEqual(30);
    await expect(page.locator('[class*="zoomLabel"]').first()).toContainText('100%');

    const rail = page.locator('[class*="iconRail"]').first();
    await expect(rail).toBeVisible();
    const railBox = await rail.boundingBox();
    expect(railBox?.width).toBeGreaterThanOrEqual(60);
    expect(railBox?.width).toBeLessThanOrEqual(68);

    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    await expect.poll(() => browserErrors, { timeout: 1_000 }).toEqual([]);
    await expect(page.locator('[data-node-id]').first()).toBeVisible();
    await expect(page.getByTitle('사이트 발행')).toBeVisible();
    const stageBox = await page.getByRole('application', { name: 'Canvas editor' }).boundingBox();
    expect(stageBox?.y ?? 9999).toBeLessThan(130);
    await expect(page.locator('[data-node-id="home-insights-title"]').first()).toContainText('칼럼 아카이브');
    await expect(page.locator('[data-node-id="home-insights-featured-title"]').first()).toContainText(/\S/);
    await expect(page.locator('[data-node-id="home-insights-featured-link"]').first()).toContainText(/자세히|Read|閱讀/);
    await expect(page.getByRole('navigation').getByRole('link', { name: '칼럼' })).toBeVisible();
    const headerRegion = page.locator('[class*="globalHeaderRegion"]').first();
    const editableMenuItem = headerRegion.locator('[data-builder-nav-item-id]').filter({ hasText: /업무분야|호정소개|칼럼|Home|About|Services/ }).first();
    await expect(editableMenuItem).toBeVisible();
    await editableMenuItem.click();
    const navDrawer = page.locator('[aria-hidden="false"]').first();
    await expect(navDrawer.getByText('Navigation').first()).toBeVisible();
    const headerEditMenuButton = headerRegion.getByRole('button', { name: 'Edit menu' });
    await expect(headerEditMenuButton).toBeVisible();
    await page.mouse.move(28, 220);
    await expect(headerEditMenuButton).toBeVisible();
    const menuItemId = await editableMenuItem.getAttribute('data-builder-nav-item-id');
    expect(menuItemId).toBeTruthy();
    const navLabelInput = navDrawer.locator('input').first();
    await expect(navLabelInput).toHaveValue(/\S+/);
    const originalNavLabel = (await navLabelInput.inputValue()).replace(/\s+Test$/, '');
    const temporaryNavLabel = `${originalNavLabel} Test`;
    const editableMenuItemById = headerRegion.locator(`[data-builder-nav-item-id="${menuItemId}"]`).first();
    try {
      await navLabelInput.fill(temporaryNavLabel);
      await navDrawer.getByRole('button', { name: '저장' }).click();
      await expect.poll(() => navLabelFromApi(page, menuItemId || '')).toBe(temporaryNavLabel);
      await expect(editableMenuItemById).toHaveText(temporaryNavLabel);
    } finally {
      await editableMenuItemById.click();
      await navDrawer.locator('input').first().fill(originalNavLabel);
      await navDrawer.getByRole('button', { name: '저장' }).click();
      await expect.poll(() => navLabelFromApi(page, menuItemId || '')).toBe(originalNavLabel);
      await expect(editableMenuItemById).toHaveText(originalNavLabel);
    }

    await page.getByTitle('Add').click();
    await expect(page.getByText('Catalog')).toBeVisible();
    await expect(page.getByText('Basic')).toBeVisible();

    const canvasColumn = page.locator('[class*="canvasColumn"]').first();
    await canvasColumn.evaluate((element) => { element.scrollTop = 500; });
    await expect.poll(() => canvasColumn.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
    await rail.getByRole('button', { name: 'Columns', exact: true }).click();
    const columnsDrawer = page.locator('[aria-hidden="false"]').first();
    await expect(columnsDrawer.getByRole('button', { name: '칼럼 페이지로 이동' })).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: '글 추가/수정' })).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: '새 글 쓰기' })).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: '공개 칼럼 보기' })).toBeVisible();
    await expect(columnsDrawer.getByText(/개 칼럼 연결됨/)).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: /대만 화장품 시장 진출|대만 회사설립/ }).first()).toBeVisible();
    await expect(page.locator('[data-node-id="columns-page-title"]').first()).toContainText(/칼럼|Columns/);
    await expect.poll(() => canvasColumn.evaluate((element) => element.scrollTop)).toBe(0);

    await headerRegion.click({ position: { x: 360, y: 16 }, force: true });
    await expect(page.locator('[aria-hidden="false"]').getByText('Navigation').first()).toBeVisible();
    await rail.getByRole('button', { name: 'Navigation', exact: true }).click();

    const selectedNode = await selectFirstNode(page);
    await closeModalOverlayIfPresent(page);

    await selectedNode.click({ button: 'right', position: { x: 18, y: 18 }, force: true });
    const contextMenu = page.locator('[role="menu"]').first();
    await expect(contextMenu).toBeVisible();
    await expect(page.locator('[class*="contextMenuShortcut"]').first()).toBeVisible();
    await contextMenu.getByRole('menuitem', { name: /Hide on viewport/ }).focus();
    await page.keyboard.press('ArrowRight');
    const contextSubmenu = page.locator('[class*="contextSubmenu"]').last();
    await expect(contextSubmenu).toBeVisible();
    await expect(contextSubmenu).toContainText('Hide on mobile');
    await page.keyboard.press('Escape');

    await selectFirstNode(page);
    await closeModalOverlayIfPresent(page);
    await page.keyboard.press(`${shortcutModifier}+D`);
    await expect(page.getByText('Duplicated')).toBeVisible();
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expectUndoChip(page);

    await page.keyboard.press(`${shortcutModifier}+C`);
    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    await expect(page.getByText('1개 요소 클립보드')).toBeVisible();
    const pagesDrawerForPaste = page.locator('[aria-hidden="false"]').first();
    await pagesDrawerForPaste.getByRole('button', { name: /호정 소개|About Hovering/ }).first().click();
    await expect(page.getByText(/Loaded page:/)).toBeVisible();
    await page.keyboard.press(`${shortcutModifier}+V`);
    await expect(page.getByText(/Pasted 1 item/).first()).toBeVisible();
    await expectSelectedNodeHandles(page);
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expectUndoChip(page);
    await pagesDrawerForPaste.getByRole('button', { name: /홈|Home/ }).first().click();
    await expect(page.getByText(/Loaded page:/)).toBeVisible();
    await expect(page.locator('[data-node-id="home-hero-subtitle"]').first()).toBeVisible();
    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);

    await closeModalOverlayIfPresent(page);
    const resizeTarget = page.locator('[data-node-id="home-hero-search-button"]:visible').first();
    await expect(resizeTarget).toBeVisible();
    await resizeTarget.scrollIntoViewIfNeeded();
    await resizeTarget.click({ position: { x: 12, y: 12 }, force: true });
    const cursorNode = await expectSelectedNodeHandles(page, resizeTarget);
    await expect(page.locator('[class*="inspectorColumn"]:visible').first()).toBeVisible();
    await page.waitForTimeout(250);
    const resizeHandle = cursorNode.locator('[class*="resizeHandleE"]:visible').first();
    await expect(resizeHandle).toHaveCSS('cursor', 'ew-resize');

    const resizeNode = cursorNode;
    const resizeNodeId = await resizeNode.getAttribute('data-node-id');
    const resizeBefore = await nodeCssSize(resizeNode);
    const resizeCorner = resizeNode.locator('[class*="resizeHandleSE"]:visible').first();
    await expect(resizeCorner).toHaveCSS('cursor', 'nwse-resize');
    const resizeDrag = await startPointerDrag(page, resizeCorner, { shiftKey: true });
    await expect(page.locator('[data-canvas-interaction="resize"]')).toBeVisible();
    await movePointerDrag(page, resizeDrag, 82, 36);
    await expect(page.locator('[class*="canvasOverlayResizeReadout"]').first()).toContainText(/\d+\s*x\s*\d+/);
    await finishPointerDrag(page, resizeDrag, 82, 36);
    const resizedNodeTarget = resizeNodeId
      ? page.locator(`[data-node-id="${resizeNodeId}"]`).first()
      : undefined;
    if (resizedNodeTarget) {
      await resizedNodeTarget.click({ position: { x: 12, y: 12 }, force: true }).catch(() => undefined);
    }
    const resizedNode = await expectSelectedNodeHandles(page, resizedNodeTarget);
    const resizeAfter = await nodeCssSize(resizedNode);
    const sizeDelta = Math.max(
      Math.abs(resizeAfter.width - resizeBefore.width),
      Math.abs(resizeAfter.height - resizeBefore.height),
    );
    expect(sizeDelta).toBeGreaterThan(2);
    const beforeRatio = resizeBefore.width / resizeBefore.height;
    const afterRatio = resizeAfter.width / resizeAfter.height;
    expect(Math.abs(afterRatio - beforeRatio)).toBeLessThan(0.25);
    await expect(page.getByText(/Saving|Saved/).first()).toBeVisible({ timeout: 5_000 });

    const rotateNode = resizedNode;
    const rotationHandle = rotateNode.locator('[class*="rotationHandle"]').first();
    const rotateBox = await rotateNode.boundingBox();
    const rotationHandleBox = await rotationHandle.boundingBox();
    expect(rotateBox).toBeTruthy();
    expect(rotationHandleBox).toBeTruthy();
    if (rotateBox && rotationHandleBox) {
      const targetX = rotateBox.x + rotateBox.width + 96;
      const targetY = rotateBox.y + 12;
      const rotationDrag = await startPointerDrag(page, rotationHandle, { pointerId: 7002, shiftKey: true });
      await movePointerDrag(page, rotationDrag, targetX - rotationDrag.x, targetY - rotationDrag.y);
      const rotationReadout = page.locator('[class*="rotationReadout"]').first();
      await expect(rotationReadout).toBeVisible();
      const readoutText = (await rotationReadout.textContent())?.trim() ?? '';
      await finishPointerDrag(page, rotationDrag, targetX - rotationDrag.x, targetY - rotationDrag.y);
      const degrees = Number((readoutText ?? '').replace(/[^0-9.-]/g, ''));
      expect(Number.isFinite(degrees)).toBe(true);
      expect(Math.abs(degrees % 15)).toBe(0);
      await page.keyboard.press(`${shortcutModifier}+Z`);
      await expectUndoChip(page);
    }

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
    await expect(page.getByText('Office sync')).toBeVisible();
    await expect(page.getByText('사무소 프리셋')).toBeVisible();
    const mapAddressInput = page.locator('textarea').first();
    await expect(mapAddressInput).not.toHaveValue('');
    const originalMapAddress = await mapAddressInput.inputValue();
    const temporaryMapAddress = originalMapAddress.includes('承德路')
      ? '臺中市北區館前路19號樓之1'
      : '台北市大同區承德路一段35號7樓之2';
    const officeCardAddress = page.locator('[data-node-id="home-offices-layout-0-card-address"]').first();
    const officeMapUrlInput = page.getByLabel('Office map URL');
    const originalMapUrl = await officeMapUrlInput.inputValue();
    const mapFrame = officeMap.locator('iframe[title="Google Maps"]').first();
    try {
      await mapAddressInput.fill(temporaryMapAddress);
      await expect(mapAddressInput).toHaveValue(temporaryMapAddress);
      await expect(officeCardAddress).toContainText(temporaryMapAddress);
      await expect.poll(async () => {
        const src = await mapFrame.getAttribute('src');
        return src ? new URL(src).searchParams.get('q') : '';
      }).toBe(temporaryMapAddress);
      const temporaryMapUrl = `https://www.google.com/maps/search/${encodeURIComponent(temporaryMapAddress)}`;
      await officeMapUrlInput.fill(temporaryMapUrl);
      await expect(officeMapUrlInput).toHaveValue(temporaryMapUrl);
    } finally {
      await mapAddressInput.fill(originalMapAddress);
      await officeMapUrlInput.fill(originalMapUrl);
      await expect(mapAddressInput).toHaveValue(originalMapAddress);
    }

    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    const pagesDrawerForColumns = page.locator('[aria-hidden="false"]').first();
    await expect(pagesDrawerForColumns.getByLabel('칼럼 빠른 이동')).toBeVisible();
    await expect(pagesDrawerForColumns.getByText(/posts|칼럼 연결/).first()).toBeVisible();
    await expect(pagesDrawerForColumns.getByRole('link', { name: '글 추가/수정' })).toBeVisible();
    await expect(pagesDrawerForColumns.getByRole('link', { name: '새 글 쓰기' })).toBeVisible();
    const columnsPageButton = pagesDrawerForColumns.getByRole('button', { name: /칼럼|Columns/ }).first();
    await expect(columnsPageButton).toBeVisible();
    await columnsPageButton.click();
    await expect(page.getByText(/Loaded page:/)).toBeVisible();
    await expect(page.locator('[data-node-id="columns-page-title"]').first()).toContainText(/칼럼|Columns/);
    const columnsFeedNode = page.locator('[data-node-id="columns-feed"]').first();
    await expect(columnsFeedNode).toBeVisible();
    await expect(columnsFeedNode).toContainText(/대만 화장품 시장 진출|대만 회사설립/, { timeout: 10_000 });
    await columnsFeedNode.click({ position: { x: 24, y: 24 }, force: true });
    const selectedColumnsFeed = page.locator('[data-node-id="columns-feed"][class*="nodeSelected"]').first();
    await expect(selectedColumnsFeed.getByRole('button', { name: '글 추가/수정' })).toBeVisible();
    await selectedColumnsFeed.getByRole('button', { name: '글 추가/수정' }).click();
    await expect(page).toHaveURL(/\/ko\/admin-builder\/columns$/);
    await expect(page.getByText(/대만 회사설립|대만 화장품 시장 진출/).first()).toBeVisible();
    await page.goto('/ko/admin-builder/columns?new=1', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('dialog', { name: '새 칼럼 만들기' })).toBeVisible();
    await expect(page.getByPlaceholder('예: 대만 투자 계약 분쟁 대응')).toBeVisible();
  });
});
