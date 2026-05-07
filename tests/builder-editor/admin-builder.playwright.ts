import { expect, test, type Locator, type Page } from '@playwright/test';

const shortcutModifier = 'ControlOrMeta';

function isIgnoredBrowserError(message: string): boolean {
  return message === 'Invalid or unexpected token';
}

function canvasEditor(page: Page): Locator {
  return page.getByRole('application', { name: 'Canvas editor' });
}

async function firstVisibleNode(page: Page): Promise<Locator> {
  const canvas = canvasEditor(page);
  await expect(canvas).toBeVisible();
  const candidates = [
    canvas.locator('[data-node-id="home-hero-subtitle"]:visible').first(),
    canvas.locator('[data-node-id*="subtitle"]:visible').first(),
    canvas.locator('[data-node-id*="title"]:visible').first(),
    canvas.locator('[data-node-id*="copy"]:visible').first(),
    canvas.locator('[data-node-id]:visible').first(),
  ];
  for (const candidate of candidates) {
    if ((await candidate.count()) > 0) {
      await expect(candidate).toBeVisible();
      return candidate;
    }
  }
  const fallback = canvas.locator('[data-node-id]:visible').first();
  await expect(fallback).toBeVisible();
  return fallback;
}

async function expectSelectedNodeHandles(page: Page, node?: Locator): Promise<Locator> {
  const canvas = canvasEditor(page);
  let selectedNode = node ?? page
    .locator('[role="application"][aria-label="Canvas editor"] [class*="nodeSelected"][data-node-id]:visible')
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
      .locator('[role="application"][aria-label="Canvas editor"] [class*="nodeSelected"][data-node-id]:visible')
      .filter({ has: page.locator('[class*="rotationHandle"]') })
      .last();
  }

  await expect(selectedNode).toBeVisible();
  const selectedHandleCount = await selectedNode.locator('[class*="resizeHandle"]:visible').count();
  if (selectedHandleCount !== 8) {
    const selectedWithHandles = canvas
      .locator('[class*="nodeSelected"][data-node-id]:visible')
      .filter({ has: page.locator('[class*="rotationHandle"]') })
      .last();
    const fallbackHandleCount = await selectedWithHandles
      .locator('[class*="resizeHandle"]:visible')
      .count()
      .catch(() => 0);
    if (fallbackHandleCount === 8) {
      selectedNode = selectedWithHandles;
    } else {
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
      selectedNode = canvas
        .locator('[class*="nodeSelected"][data-node-id]:visible')
        .filter({ has: page.locator('[class*="rotationHandle"]') })
        .last();
    }
  }
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

async function expectRedoChip(page: Page): Promise<void> {
  await expect(page.getByText(/Redid:/).first()).toBeVisible();
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
  test.afterEach(async ({ page }) => {
    await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 });
  });

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
    const publicHomeResponse = await page.request.get('/ko');
    expect(publicHomeResponse.status()).toBe(200);
    const publicHomeHtml = await publicHomeResponse.text();
    expect(publicHomeHtml).toContain('hero-search-bar overlap');
    expect(publicHomeHtml).not.toContain('builder-pub-node');
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
    const zoomText = await page.locator('[class*="zoomLabel"]').first().innerText();
    const zoomPercent = Number(zoomText.replace('%', '').trim());
    expect(zoomPercent).toBeGreaterThanOrEqual(50);
    expect(zoomPercent).toBeLessThanOrEqual(100);
    const editorLayout = await page.evaluate(() => {
      const rectFor = (selector: string) => document.querySelector(selector)?.getBoundingClientRect() ?? null;
      const styleFor = (selector: string) => {
        const element = document.querySelector(selector);
        return element ? window.getComputedStyle(element) : null;
      };
      const siteFooterRect = rectFor('footer:not([aria-label="Editor status"])');
      const statusRect = rectFor('footer[aria-label="Editor status"]');
      return {
        canvasOverflowY: styleFor('div[class*="canvasColumn"]')?.overflowY ?? '',
        stageViewportHeight: rectFor('div[class*="stageViewport"]')?.height ?? 0,
        stageViewportLeft: rectFor('div[class*="stageViewport"]')?.left ?? 0,
        stageViewportRight: rectFor('div[class*="stageViewport"]')?.right ?? 0,
        stageTransformLeft: rectFor('div[class*="stageTransform"]')?.left ?? 0,
        stageTransformRight: rectFor('div[class*="stageTransform"]')?.right ?? 0,
        stageTransformTransition: styleFor('div[class*="stageTransform"]')?.transitionProperty ?? '',
        siteFooterTop: siteFooterRect?.top ?? 0,
        statusTop: statusRect?.top ?? 0,
        viewportHeight: window.innerHeight,
      };
    });
    expect(editorLayout.canvasOverflowY).toBe('auto');
    expect(editorLayout.stageViewportHeight).toBeGreaterThanOrEqual(Math.max(700, editorLayout.viewportHeight - 100));
    expect(editorLayout.stageTransformLeft).toBeGreaterThanOrEqual(editorLayout.stageViewportLeft - 2);
    expect(editorLayout.stageTransformRight).toBeLessThanOrEqual(editorLayout.stageViewportRight + 2);
    expect(editorLayout.stageTransformTransition).toBe('none');
    expect(editorLayout.siteFooterTop).toBeGreaterThanOrEqual(editorLayout.statusTop - 4);

    const rail = page.locator('[class*="iconRail"]').first();
    await expect(rail).toBeVisible();
    const railBox = await rail.boundingBox();
    expect(railBox?.width).toBeGreaterThanOrEqual(60);
    expect(railBox?.width).toBeLessThanOrEqual(68);
    const designRailButton = rail.getByTitle('Design');
    const designRailLabel = designRailButton.locator('[class*="railButtonLabel"]').first();
    await designRailButton.hover();
    await expect(designRailLabel).toContainText('Design');
    await expect(designRailLabel).toHaveCSS('opacity', '1');
    await designRailButton.click();
    const designDrawer = page.locator('aside[aria-hidden="false"]').first();
    await expect(designDrawer).toBeVisible();
    await expect.poll(async () => (await designDrawer.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(300);
    await expect(designDrawer).toContainText('Site settings');

    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    await expect.poll(() => browserErrors, { timeout: 1_000 }).toEqual([]);
    await expect(page.locator('[data-node-id]').first()).toBeVisible();
    await expect(page.getByTitle('사이트 발행')).toBeVisible();
    const stageBox = await page.getByRole('application', { name: 'Canvas editor' }).boundingBox();
    expect(stageBox?.y ?? 9999).toBeLessThan(130);
    const builderHeader = page.locator('.builder-site-header').first();
    await expect(builderHeader).toBeVisible();
    await expect(builderHeader.locator('.utility-nav')).toContainText('연락처');
    await expect(builderHeader.locator('.nav-list')).toContainText('업무분야');
    await expect(builderHeader.locator('.nav-list')).toContainText('변호사소개');
    await expect(builderHeader.locator('.nav-list')).toContainText('호정칼럼');
    await expect(builderHeader.locator('.header-search-btn')).toBeVisible();
    await builderHeader.locator('[data-builder-header-action="search"]').click();
    const headerSearchDialog = page.getByRole('dialog', { name: /검색|Search|搜尋/ });
    await expect(headerSearchDialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(headerSearchDialog).toBeHidden();
    await expect(page.locator('[data-node-id="home-insights-title"]').first()).toContainText('칼럼 아카이브');
    await expect(page.locator('[data-node-id="home-insights-featured-title"]').first()).toContainText(/\S/);
    await expect(page.locator('[data-node-id="home-insights-featured-link"]').first()).toContainText(/자세히|Read|閱讀/);
    await expect(page.locator('[data-node-id="home-insights-page-indicator"]').first()).toContainText(/1 \/ [2-9]/);
    await expect(page.locator('[data-node-id="home-insights-item-2-title"]').first()).toContainText(/\S/);
    await expect(page.locator('[data-node-id="home-insights-item-3-title"]')).toHaveCount(0);
    const insightsFlow = await page.evaluate(() => {
      const insights = document.querySelector('[data-node-id="home-insights-root"]')?.getBoundingClientRect();
      const services = document.querySelector('[data-node-id="home-services-root"]')?.getBoundingClientRect();
      const lateItem = document.querySelector('[data-node-id="home-insights-item-2-title"]')?.getBoundingClientRect();
      if (!insights || !services || !lateItem) return null;
      return {
        insightsBottom: insights.bottom,
        servicesTop: services.top,
        lateItemTop: lateItem.top,
        lateItemBottom: lateItem.bottom,
      };
    });
    expect(insightsFlow).toBeTruthy();
    expect(insightsFlow?.servicesTop ?? 0).toBeGreaterThanOrEqual((insightsFlow?.insightsBottom ?? 0) - 4);
    expect(insightsFlow?.lateItemBottom ?? 0).toBeLessThanOrEqual((insightsFlow?.insightsBottom ?? 0) + 4);
    await expect(page.locator('[data-node-id="home-services-root"] section#practice.section--light').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-hero-search-placeholder"]')).toHaveCount(0);
    const heroSearchForm = page.locator('[data-node-id="home-hero-search-bar"] form.hero-search-bar.overlap').first();
    await expect(heroSearchForm).toBeVisible();
    await expect(heroSearchForm).toHaveAttribute('method', 'get');
    await expect(heroSearchForm).toHaveAttribute('action', /\/ko\/search$/);
    await expect(page.locator('[data-node-id="home-hero-search-input"] input.hero-search-input[type="search"][name="q"]').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-hero-search-button"] button.hero-search-btn[type="submit"]').first()).toBeVisible();
    const heroSearchGeometry = await page.evaluate(() => {
      const hero = document.querySelector('[data-node-id="home-hero-root"]')?.getBoundingClientRect();
      const form = document.querySelector('[data-node-id="home-hero-search-bar"] form')?.getBoundingClientRect();
      if (!hero || !form) return null;
      return {
        heroBottom: hero.bottom,
        formCenterY: form.top + form.height / 2,
        formLeft: form.left,
        heroLeft: hero.left,
      };
    });
    expect(heroSearchGeometry).toBeTruthy();
    expect(Math.abs((heroSearchGeometry?.formCenterY ?? 0) - (heroSearchGeometry?.heroBottom ?? 9999))).toBeLessThanOrEqual(48);
    expect((heroSearchGeometry?.formLeft ?? 0) - (heroSearchGeometry?.heroLeft ?? 0)).toBeGreaterThanOrEqual(24);
    expect((heroSearchGeometry?.formLeft ?? 0) - (heroSearchGeometry?.heroLeft ?? 0)).toBeLessThanOrEqual(72);
    const heroQuickMenu = page.locator('[data-node-id="home-hero-quick-menu"] nav.hero-quick-menu').first();
    await expect(heroQuickMenu).toBeHidden();
    await page.locator('[data-node-id="home-hero-search-wrap"]').first().hover();
    await expect(heroQuickMenu).toBeVisible();
    await expect(heroQuickMenu).toContainText('업무분야');
    await expect(heroQuickMenu).toContainText('칼럼');
    await expect(heroQuickMenu).toContainText('연락처');
    await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-faq-item-0-answer"]').first()).toBeVisible();
    const hoverIndicatorNode = page.locator('[data-node-id="home-hero-subtitle"]:visible').first();
    await hoverIndicatorNode.hover();
    await expect.poll(async () => hoverIndicatorNode.evaluate((element) => (
      window.getComputedStyle(element).outlineWidth
    ))).toBe('1px');
    await expect.poll(async () => hoverIndicatorNode.evaluate((element) => (
      window.getComputedStyle(element).outlineColor
    ))).toMatch(/17,\s*109,\s*255/);
    const hoverNodeBadge = hoverIndicatorNode.locator('[class*="nodeBadge"]').first();
    await expect(hoverNodeBadge).toHaveCSS('opacity', '1');
    await expect(hoverNodeBadge).toContainText(/\d+×\d+/);
    await expect(page.getByRole('navigation').getByRole('link', { name: '칼럼' })).toBeVisible();
    const headerRegion = page.locator('[class*="globalHeaderRegion"]').first();
    const editableMenuItem = headerRegion.locator('[data-builder-nav-item-id]').filter({ hasText: /업무분야|호정소개|칼럼|Home|About|Services/ }).first();
    await expect(editableMenuItem).toBeVisible();
    const headerEditMenuButton = headerRegion.getByRole('button', { name: 'Edit menu' });
    await expect(headerEditMenuButton).toBeVisible();
    await editableMenuItem.hover();
    const editMenuBox = await headerEditMenuButton.boundingBox();
    expect(editMenuBox).toBeTruthy();
    await page.mouse.move(
      (editMenuBox?.x ?? 0) + (editMenuBox?.width ?? 0) / 2,
      (editMenuBox?.y ?? 0) + (editMenuBox?.height ?? 0) / 2,
      { steps: 8 },
    );
    await expect(headerEditMenuButton).toBeVisible();
    await headerEditMenuButton.click();
    const navDrawer = page.locator('[aria-hidden="false"]').first();
    await expect(navDrawer.getByText('Navigation').first()).toBeVisible();
    await editableMenuItem.hover();
    const servicesMegaPanel = builderHeader.locator('.mega-panel.active').first();
    await expect(servicesMegaPanel).toContainText('투자·법인설립');
    await expect(builderHeader.locator('[data-builder-nav-item-id="nav-services-investment"]').first()).toBeVisible();
    await expect(navDrawer.getByText('Mega').first()).toBeVisible();
    await expect(navDrawer.getByText('투자·법인설립')).toBeVisible();
    await page.mouse.move(28, 220);
    await expect(headerEditMenuButton).toBeVisible();
    const menuItemId = await editableMenuItem.getAttribute('data-builder-nav-item-id');
    expect(menuItemId).toBeTruthy();
    await editableMenuItem.click();
    const navLabelInput = navDrawer.locator('input[type="text"]').first();
    await expect(navLabelInput).toBeVisible();
    const originalNavLabel = await navLabelFromApi(page, menuItemId || '');
    expect(originalNavLabel).toBeTruthy();
    await expect(navLabelInput).toHaveValue(originalNavLabel || '');
    await editableMenuItem.hover();
    await builderHeader.locator('[data-builder-nav-item-id="nav-services-investment"]').first().click();
    await expect(navLabelInput).toHaveValue('투자·법인설립');

    await page.getByTitle('Add').click();
    await expect(page.getByText('Catalog')).toBeVisible();
    await expect(page.getByText('Basic')).toBeVisible();

    const canvasColumn = page.locator('[class*="canvasColumn"]').first();
    const stageViewport = page.locator('[class*="stageViewport"]').first();
    const stageTransform = page.locator('[class*="stageTransform"]').first();
    await expect.poll(() => canvasColumn.evaluate((element) => element.scrollHeight - element.clientHeight)).toBeGreaterThan(300);
    await stageViewport.hover();
    await page.mouse.wheel(0, 520);
    await expect.poll(() => canvasColumn.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
    await expect.poll(() => stageTransform.evaluate((element) => (
      new DOMMatrixReadOnly(window.getComputedStyle(element).transform).m42
    ))).toBeGreaterThanOrEqual(-2);
    await rail.getByRole('button', { name: 'Columns', exact: true }).click();
    const columnsDrawer = page.locator('[aria-hidden="false"]').first();
    await expect(columnsDrawer.getByRole('button', { name: '칼럼 페이지로 이동' })).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: '칼럼 관리' })).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: '새 글 쓰기' })).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: '공개 칼럼 보기' })).toBeVisible();
    await expect(columnsDrawer.getByText(/개 칼럼 연결됨/)).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: /수정 · .*?(대만 화장품 시장 진출|대만 회사설립|제목 없는 글)/ }).first()).toBeVisible();
    await expect(page.locator('[data-node-id="columns-page-title"]').first()).toContainText(/칼럼|Columns/);
    await expect.poll(() => stageTransform.evaluate((element) => (
      new DOMMatrixReadOnly(window.getComputedStyle(element).transform).m42
    ))).toBeGreaterThanOrEqual(-2);

    await headerRegion.click({ position: { x: 360, y: 16 }, force: true });
    await expect(page.locator('[aria-hidden="false"]').getByText('Navigation').first()).toBeVisible();
    await rail.getByRole('button', { name: 'Navigation', exact: true }).click();

    const selectedNode = await selectFirstNode(page);
    await closeModalOverlayIfPresent(page);

    await selectedNode.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      element.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2,
        clientX: rect.left + Math.min(30, Math.max(10, rect.width / 2)),
        clientY: rect.top + Math.min(30, Math.max(10, rect.height / 2)),
      }));
    });
    const contextMenu = page.locator('[role="menu"]').first();
    await expect(contextMenu).toBeVisible();
    await expect(contextMenu).toHaveCSS('background-color', /rgba?\(255,\s*255,\s*255/);
    await expect(contextMenu).toHaveCSS('border-radius', '8px');
    await expect(page.locator('[class*="contextMenuShortcut"]').first()).toBeVisible();
    await expect(contextMenu.locator('[class*="contextMenuDivider"]').first()).toBeVisible();
    const firstContextAction = contextMenu.getByRole('menuitem').first();
    await firstContextAction.hover();
    await expect.poll(async () => firstContextAction.evaluate((element) => (
      window.getComputedStyle(element).backgroundColor
    ))).toMatch(/190,\s*24,\s*93/);
    await expect.poll(async () => firstContextAction.evaluate((element) => (
      window.getComputedStyle(element).color
    ))).toMatch(/190,\s*24,\s*93/);
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
    await page.keyboard.press(`${shortcutModifier}+Shift+Z`);
    await expectRedoChip(page);
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expectUndoChip(page);

    await page.keyboard.press(`${shortcutModifier}+C`);
    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    await expect(page.getByText('1개 요소 클립보드')).toBeVisible();
    const pagesDrawerForPaste = page.locator('[aria-hidden="false"]').first();
    await pagesDrawerForPaste.getByRole('button', { name: /호정 소개|About Hovering/ }).first().click();
    await expect(page.getByText(/Loaded page:/).last()).toBeVisible();
    await page.keyboard.press(`${shortcutModifier}+V`);
    await expect(page.getByText(/Pasted 1 item/).first()).toBeVisible();
    await expectSelectedNodeHandles(page);
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expectUndoChip(page);
    await pagesDrawerForPaste.getByRole('button', { name: /홈|Home/ }).first().click();
    await expect(page.getByText(/Loaded page:/).last()).toBeVisible();
    await expect(page.locator('[data-node-id="home-hero-subtitle"]').first()).toBeVisible();
    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);

    await closeModalOverlayIfPresent(page);
    const snapTarget = page.locator('[data-node-id="home-hero-subtitle"]:visible').first();
    await expect(snapTarget).toBeVisible();
    await snapTarget.click({ position: { x: 18, y: 18 }, force: true });
    const snapNode = await expectSelectedNodeHandles(page, snapTarget);
    const snapDrag = await startPointerDrag(page, snapNode, { pointerId: 7003 });
    await movePointerDrag(page, snapDrag, 5, 0);
    await expect(page.locator('[data-canvas-interaction="move"]')).toBeVisible();
    await expect(
      page.locator('[data-alignment-guide-line][data-alignment-guide-tone="alignment"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('[data-alignment-guide-chip][data-alignment-guide-tone="spacing"]').first(),
    ).toContainText(/\d+px/);
    await finishPointerDrag(page, snapDrag, 5, 0);

    const resizeTarget = page.locator('[data-node-id="home-hero-search-input"]:visible').first();
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
    const resizeDeltaX = resizeBefore.width > 540 ? -64 : 64;
    const resizeDeltaY = resizeBefore.width > 540 ? -16 : 16;
    await movePointerDrag(page, resizeDrag, resizeDeltaX, resizeDeltaY);
    await expect(page.locator('[class*="canvasOverlayResizeReadout"]').first()).toContainText(/\d+\s*x\s*\d+/);
    await finishPointerDrag(page, resizeDrag, resizeDeltaX, resizeDeltaY);
    const savingChip = page.locator('[data-save-status-chip="saving"]').first();
    await expect(savingChip).toBeVisible({ timeout: 2_000 });
    await expect(savingChip).toContainText('Saving…');
    await expect(savingChip.locator('[data-save-status-glyph]')).toHaveCSS('background-color', 'rgb(148, 163, 184)');
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
    const savedChip = page.locator('[data-save-status-chip="saved"]').first();
    await expect(savedChip).toBeVisible({ timeout: 5_000 });
    await expect(savedChip).toContainText('Saved');
    await expect(savedChip.locator('[data-save-status-glyph]')).toHaveCSS('background-color', 'rgb(34, 197, 94)');

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
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expectUndoChip(page);

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
    const mapQuickEdit = officeMap.locator('[class*="nodeMapQuickEdit"]').first();
    await expect(mapQuickEdit).toBeVisible();
    await expect(mapQuickEdit).toContainText('위치 편집');
    await mapQuickEdit.getByRole('button', { name: '타이베이' }).click();
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-title"]').first()).toContainText('타이베이');
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-address"]').first()).toContainText('承德路');
    await mapQuickEdit.getByRole('button', { name: '타이중' }).click();
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-title"]').first()).toContainText('타이중');
    await page.getByRole('button', { name: 'content' }).click();
    await expect(page.getByText('Office sync')).toBeVisible();
    await expect(page.getByText('사무소 프리셋')).toBeVisible();
    const mapAddressInput = page.getByLabel('Office address synced value');
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
      if (!(await mapAddressInput.isVisible().catch(() => false))) {
        await officeMap.scrollIntoViewIfNeeded();
        await officeMap.click({ position: { x: 24, y: 24 }, force: true });
        await page.getByRole('button', { name: 'content' }).click({ force: true });
        await expect(page.getByText('Office sync')).toBeVisible();
      }
      await page.getByLabel('Office address synced value').fill(originalMapAddress);
      await page.getByLabel('Office map URL').fill(originalMapUrl);
      await expect(page.getByLabel('Office address synced value')).toHaveValue(originalMapAddress);
    }

    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    const pagesDrawerForColumns = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first();
    await expect(pagesDrawerForColumns.getByLabel('칼럼 빠른 이동')).toBeVisible();
    await expect(pagesDrawerForColumns.getByText(/posts|칼럼 연결/).first()).toBeVisible();
    await expect(pagesDrawerForColumns.getByRole('link', { name: '칼럼 관리' })).toBeVisible();
    await expect(pagesDrawerForColumns.getByRole('link', { name: '새 글 쓰기' })).toHaveAttribute(
      'href',
      '/ko/admin-builder/columns?new=1',
    );
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
  });
});
