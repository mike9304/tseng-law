import { expect, test, type Locator, type Page } from '@playwright/test';

const screenshotDir = '/tmp';
const preferredCanvasNodeIds = [
  'home-hero-subtitle',
  'home-hero-title',
  'home-hero-search-input',
  'home-insights-title',
  'home-insights-featured-title',
];

const baseNodeStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

function makePublicSectionTemplateDocument(token: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `section-template-${token}`,
    stageWidth: 1280,
    stageHeight: 860,
    nodes: [
      {
        id: 'home-faq-root',
        kind: 'container',
        rect: { x: 72, y: 96, width: 1136, height: 220 },
        style: baseNodeStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'home faq root',
          background: 'transparent',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          className: 'section section--gray',
          as: 'section',
          variant: 'glass',
        },
      },
      {
        id: `section-template-faq-item-${token}`,
        kind: 'container',
        parentId: 'home-faq-root',
        rect: { x: 0, y: 0, width: 1136, height: 96 },
        style: baseNodeStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'public faq item',
          background: '#ffffff',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 12,
          padding: 18,
          layoutMode: 'absolute',
          className: 'faq-item',
          as: 'article',
        },
      },
      {
        id: `section-template-faq-text-${token}`,
        kind: 'text',
        parentId: `section-template-faq-item-${token}`,
        rect: { x: 24, y: 24, width: 640, height: 32 },
        style: baseNodeStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Section template keeps content ${token}`,
          fontSize: 18,
          color: '#1f2937',
          fontWeight: 'medium',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
        },
      },
    ],
  };
}

type TestNavigationItem = {
  id: string;
  label: string | Record<string, string>;
  href: string;
  pageId?: string;
  children?: TestNavigationItem[];
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'design-pool';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function navigationHasPageId(items: TestNavigationItem[], pageId: string): boolean {
  return items.some((item) => (
    item.pageId === pageId ||
    (item.children ? navigationHasPageId(item.children, pageId) : false)
  ));
}

function findNavigationItemByPageId(items: TestNavigationItem[], pageId: string): TestNavigationItem | null {
  for (const item of items) {
    if (item.pageId === pageId) return item;
    if (item.children) {
      const nested = findNavigationItemByPageId(item.children, pageId);
      if (nested) return nested;
    }
  }
  return null;
}

async function findPageIdBySlug(page: Page, slug: string): Promise<string | null> {
  const response = await page.request.get('/api/builder/site/pages?locale=ko', {
    headers: mutationHeaders(slug),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return null;
  const payload = (await response.json()) as {
    pages?: Array<{ pageId?: string; slug?: string }>;
  };
  return payload.pages?.find((entry) => entry.slug === slug)?.pageId ?? null;
}

function makeSettingsReflectionDocument(token: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `site-settings-${token}`,
    stageWidth: 1280,
    stageHeight: 520,
    nodes: [
      {
        id: `settings-root-${token}`,
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 520 },
        style: baseNodeStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Site settings reflection root',
          background: '#ffffff',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'main',
        },
      },
      {
        id: `settings-title-${token}`,
        kind: 'text',
        parentId: `settings-root-${token}`,
        rect: { x: 84, y: 88, width: 740, height: 86 },
        style: { ...baseNodeStyle, borderRadius: 12 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Site settings reflection ${token}`,
          fontSize: 38,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'h1',
        },
      },
    ],
  };
}

function makeGlobalFooterDocument(token: string, text: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `global-footer-${token}`,
    stageWidth: 1280,
    stageHeight: 132,
    nodes: [
      {
        id: `global-footer-text-${token}`,
        kind: 'text',
        rect: { x: 84, y: 44, width: 760, height: 36 },
        style: { ...baseNodeStyle, borderRadius: 8 },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text,
          fontSize: 18,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.2,
          letterSpacing: 0,
          fontFamily: 'system-ui',
          verticalAlign: 'top',
          textTransform: 'none',
          as: 'p',
        },
      },
    ],
  };
}

function makeEmptyGlobalFooterDocument() {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: 'global-footer-test-cleanup',
    stageWidth: 1280,
    stageHeight: 240,
    nodes: [],
  };
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

async function openBuilder(page: Page): Promise<void> {
  await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-editor-shell]')).toBeVisible();
  await waitForEditorCss(page);
  await page.waitForTimeout(5_000);
}

async function selectLayerNode(page: Page, nodeId: string, kind: string): Promise<void> {
  let drawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Layers' }).first();
  if (!(await drawer.getByText('Layers').first().isVisible().catch(() => false))) {
    await page.getByRole('button', { name: 'Layers', exact: true }).click({ force: true });
    drawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Layers' }).first();
  }
  await expect(drawer.getByText('Layers').first()).toBeVisible();
  const row = drawer.locator(`[title="${kind} ${nodeId}"]`).first();
  await expect(row).toBeVisible({ timeout: 10_000 });
  await row.focus();
  await page.keyboard.press('Enter');
  if (!(await page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first().isVisible().catch(() => false))) {
    await row.click();
  }
  await expect(page.locator(`[data-node-id="${nodeId}"][class*="nodeSelected"]`).first()).toBeVisible({
    timeout: 10_000,
  });
}

async function selectFirstNode(page: Page): Promise<Locator> {
  const node = await topmostUnlockedNode(page);
  await expect(node).toBeVisible();
  await clickCanvasNode(node);
  const selectedNode = page.locator('[class*="nodeSelected"][data-node-id]:visible').last();
  await expect(selectedNode.locator('[class*="resizeHandle"]:visible')).toHaveCount(8);
  return selectedNode;
}

async function closeEditorOverlayIfPresent(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: /Close|닫기|취소|Cancel/ }).first();
  if ((await closeButton.count()) > 0 && await closeButton.isVisible()) {
    await closeButton.click();
    await page.waitForTimeout(150);
  }
}

async function visibleUnlockedNodes(page: Page): Promise<Locator> {
  const nodes = page
    .getByRole('application', { name: 'Canvas editor' })
    .locator('[data-node-id]:visible:not([class*="nodeLocked"]):not([data-node-id$="-root"]):not([data-node-id="html"])');
  await expect.poll(async () => nodes.count()).toBeGreaterThan(1);
  return nodes;
}

async function canvasNodeClickPosition(locator: Locator): Promise<{ x: number; y: number } | null> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const overlaySelector = [
      '[class*="globalRegionBadge"]',
      '[class*="canvasOverlay"]',
      '[class*="overlapPicker"]',
      '[data-modal-shell="true"]',
      'header[class*="topBar"]',
      '[role="menu"]',
    ].join(',');
    const points = [
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      { x: rect.left + Math.min(Math.max(rect.width * 0.25, 16), rect.width - 8), y: rect.top + rect.height / 2 },
      { x: rect.left + Math.min(Math.max(rect.width * 0.75, 16), rect.width - 8), y: rect.top + rect.height / 2 },
      { x: rect.left + rect.width / 2, y: rect.top + Math.min(Math.max(rect.height * 0.35, 12), rect.height - 6) },
      { x: rect.left + rect.width / 2, y: rect.top + Math.min(Math.max(rect.height * 0.65, 12), rect.height - 6) },
    ];

    for (const point of points) {
      if (point.x < 0 || point.y < 96 || point.x > window.innerWidth || point.y > window.innerHeight) continue;
      const hit = document.elementFromPoint(point.x, point.y);
      if (!hit || hit.closest(overlaySelector)) continue;
      const hitNode = hit.closest('[data-node-id]');
      if (hit === element || element.contains(hit) || (hitNode && (hitNode === element || element.contains(hitNode)))) {
        return {
          x: Math.max(1, Math.min(rect.width - 1, point.x - rect.left)),
          y: Math.max(1, Math.min(rect.height - 1, point.y - rect.top)),
        };
      }
    }

    return null;
  });
}

async function clickCanvasNode(locator: Locator, options: { button?: 'left' | 'right' } = {}): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  const position = await canvasNodeClickPosition(locator) ?? (box
    ? {
        x: Math.max(1, Math.min(box.width - 1, box.width / 2)),
        y: Math.max(1, Math.min(box.height - 1, box.height / 2)),
      }
    : { x: 12, y: 12 });
  await locator.click({
    button: options.button,
    position,
    force: true,
  });
}

async function topmostUnlockedNode(page: Page): Promise<Locator> {
  const canvas = page.getByRole('application', { name: 'Canvas editor' });
  const nodeId = await canvas
    .locator('[data-node-id]:visible:not([class*="nodeLocked"])')
    .evaluateAll((elements, preferredIds) => {
      const preferredRank = (element: Element) => {
        const id = element.getAttribute('data-node-id') ?? '';
        const index = preferredIds.indexOf(id);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
      };
      const nodeKind = (element: Element) => (
        element.querySelector('[class*="nodeBadge"] span')?.textContent
          ?? element.textContent
          ?? ''
      ).trim().toLowerCase();
      const isUsableNode = (element: Element) => {
        const id = element.getAttribute('data-node-id') ?? '';
        const kind = nodeKind(element);
        const rect = element.getBoundingClientRect();
        if (!id || id === 'html' || id.endsWith('-root')) return false;
        if (element.className.toString().includes('nodeLocked')) return false;
        if (kind === 'image' || kind.startsWith('image')) return false;
        if (rect.width < 24 || rect.height < 24 || rect.width > 900 || rect.height > 360) return false;
        return true;
      };
      const overlaySelector = [
        '[class*="globalRegionBadge"]',
        '[class*="canvasOverlay"]',
        '[class*="overlapPicker"]',
        '[data-modal-shell="true"]',
        'header[class*="topBar"]',
        '[role="menu"]',
      ].join(',');
      const candidates = [...elements]
        .filter(isUsableNode)
        .sort((a, b) => {
          const rankDelta = preferredRank(a) - preferredRank(b);
          if (rankDelta !== 0) return rankDelta;
          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          return (aRect.top - bRect.top) || (aRect.left - bRect.left);
        });
      const preferred = candidates.find((element) => preferredRank(element) !== Number.MAX_SAFE_INTEGER);
      if (preferred) return preferred.getAttribute('data-node-id');

      for (const element of candidates) {
        const text = element.textContent ?? '';
        if (text.startsWith('image')) continue;
        const rect = element.getBoundingClientRect();
        const points = [
          { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
          { x: rect.left + Math.min(Math.max(rect.width * 0.25, 16), rect.width - 8), y: rect.top + rect.height / 2 },
          { x: rect.left + Math.min(Math.max(rect.width * 0.75, 16), rect.width - 8), y: rect.top + rect.height / 2 },
          { x: rect.left + rect.width / 2, y: rect.top + Math.min(Math.max(rect.height * 0.35, 12), rect.height - 6) },
          { x: rect.left + rect.width / 2, y: rect.top + Math.min(Math.max(rect.height * 0.65, 12), rect.height - 6) },
        ];

        for (const point of points) {
          if (point.x < 0 || point.y < 96 || point.x > window.innerWidth || point.y > window.innerHeight) continue;
          const hit = document.elementFromPoint(point.x, point.y);
          if (!hit || hit.closest(overlaySelector)) continue;
          const hitNode = hit.closest('[data-node-id]');
          if (hit === element || element.contains(hit) || (hitNode && (hitNode === element || element.contains(hitNode)))) {
            return element.getAttribute('data-node-id');
          }
        }
      }
      return null;
    }, preferredCanvasNodeIds);
  expect(nodeId).toBeTruthy();
  return canvas.locator(`[data-node-id="${nodeId}"]`).first();
}

async function locatorBox(locator: Locator): Promise<NonNullable<Awaited<ReturnType<Locator['boundingBox']>>>> {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

async function openSiteSettings(page: Page): Promise<Locator> {
  await page.locator('header[class*="topBar"]').getByTitle('사이트 설정').click();
  const modal = page.locator('[data-modal-shell="true"][data-modal-nested="false"]').last();
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('사이트 설정');
  return modal;
}

test.describe('/ko/admin-builder design-pool browser coverage', () => {
  test.afterEach(async ({ page }) => {
    await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 });
  });

  test('covers editor shell density, theme, zoom, inspector states, color picker, and context submenus', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('builder:recent-colors', JSON.stringify(['#ff0000', '#00aa88', 'rgba(17, 109, 255, 0.6)']));
    });
    await openBuilder(page);

    const shell = page.locator('[data-editor-shell]');
    const status = page.getByLabel('Editor status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Viewport: desktop');
    await expect(status.getByRole('button', { name: 'cozy' })).toHaveAttribute('aria-pressed', 'true');

    await status.getByRole('button', { name: 'comfortable' }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await expect(shell).toHaveAttribute('data-editor-density', 'comfortable');
    await status.getByRole('button', { name: 'Light' }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await expect(shell).toHaveAttribute('data-editor-theme', 'dark');
    await page.screenshot({ path: `${screenshotDir}/design-pool-editor-dark.png` });
    await status.getByRole('button', { name: 'Dark' }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await expect(shell).toHaveAttribute('data-editor-theme', 'light');

    const zoomSlider = page.locator('input[class*="zoomSlider"]').first();
    await zoomSlider.fill('200');
    await expect(page.locator('[class*="zoomLabel"]').first()).toContainText('200%');
    await zoomSlider.fill('50');
    await expect(page.locator('[class*="zoomLabel"]').first()).toContainText('50%');
    await page.getByTitle('100%').click();
    await expect(page.locator('[class*="zoomLabel"]').first()).toContainText('100%');

    const inspectorColumn = page.locator('[class*="inspectorColumn"]').first();
    await page.keyboard.press('Escape');
    await expect(inspectorColumn).toBeVisible();
    await expect(page.locator('[data-builder-inspector-empty="true"]')).toBeVisible();
    await expect(inspectorColumn).toContainText('Select an element to edit');
    await page.screenshot({ path: `${screenshotDir}/design-pool-inspector-empty-or-initial.png` });
    await selectFirstNode(page);
    await closeEditorOverlayIfPresent(page);

    await page.getByRole('button', { name: /^layout$/i }).click();
    await expect(page.locator('.insp-row').first()).toBeVisible();
    await expect.poll(async () => page.locator('.insp-row').count()).toBeGreaterThan(4);
    const selectedForLayout = page.locator('[class*="nodeSelected"][data-node-id]:visible').last();
    const beforeWidth = (await locatorBox(selectedForLayout)).width;
    const widthInput = inspectorColumn.getByLabel('Width value').first();
    const widthValue = Number(await widthInput.inputValue());
    expect(Number.isFinite(widthValue)).toBe(true);
    const nextWidth = Math.round(widthValue + 24);
    await widthInput.fill(String(nextWidth));
    await widthInput.press('Enter');
    await expect(widthInput).toHaveValue(String(nextWidth));
    await expect.poll(async () => Math.round((await locatorBox(selectedForLayout)).width)).toBeGreaterThan(Math.round(beforeWidth) + 10);
    await page.keyboard.press('Escape');
    await expect(inspectorColumn).toBeVisible();
    await expect(page.locator('[data-builder-inspector-empty="true"]')).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/design-pool-inspector-layout.png` });
    await selectFirstNode(page);
    await closeEditorOverlayIfPresent(page);

    await page.getByRole('button', { name: /^style$/i }).click();
    await expect(page.locator('.insp-row').first()).toBeVisible();
    const colorPicker = page.locator('[data-color-picker-advanced]').first();
    await expect(colorPicker).toBeVisible();
    await colorPicker.getByRole('button').first().click();
    const colorDialog = page.getByRole('dialog', { name: 'Advanced color picker' });
    await expect(colorDialog).toBeVisible();
    await expect(colorDialog).toContainText('Theme palette');
    await expect(colorDialog).toContainText('Recent');
    await expect(colorDialog).toContainText(/EyeDropper|Contrast/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-color-picker.png` });
    await colorPicker.getByRole('button').first().click();
    await expect(colorDialog).toHaveCount(0);

    await page.getByRole('button', { name: /^content$/i }).click();
    await expect(page.locator('[data-inspector-content-adapter="true"]')).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/design-pool-inspector-content.png` });

    const contextNode = await topmostUnlockedNode(page);
    await expect(contextNode).toBeVisible();
    await clickCanvasNode(contextNode);
    await clickCanvasNode(contextNode, { button: 'right' });
    const contextMenu = page.locator('[role="menu"]').first();
    await expect(contextMenu).toBeVisible();
    await expect(contextMenu).toContainText('Hide on viewport');
    await expect(contextMenu).toContainText('Delete');
    await contextMenu.getByRole('menuitem', { name: /Hide on viewport/ }).evaluate((element) => {
      (element as HTMLElement).focus({ preventScroll: true });
    });
    await page.keyboard.press('ArrowRight');
    const submenu = page.locator('[class*="contextSubmenu"]').last();
    await expect(submenu).toBeVisible();
    await expect(submenu).toContainText('Hide on mobile');
    await page.screenshot({ path: `${screenshotDir}/design-pool-context-submenu.png` });
    await page.keyboard.press('Escape');
  });

  test('switches stateful home section template variants without replacing content', async ({ page }) => {
    await openBuilder(page);

    const pagesResponse = await page.request.get('/api/builder/site/pages?locale=ko');
    expect(pagesResponse.status()).toBe(200);
    const pagesPayload = (await pagesResponse.json()) as {
      pages?: Array<{ pageId?: string; isHomePage?: boolean }>;
    };
    const homePageId = pagesPayload.pages?.find((entry) => entry.isHomePage)?.pageId ?? null;
    expect(homePageId).toBeTruthy();

    await selectLayerNode(page, 'home-services-root', 'container');
    const servicesRoot = page.locator('[data-node-id="home-services-root"]').first();
    await servicesRoot.scrollIntoViewIfNeeded();
    await expect(servicesRoot).toHaveAttribute('data-builder-section-template', 'services');
    await expect(servicesRoot).toHaveAttribute('data-section-variant', 'flat');
    const servicesPanel = page.locator('[data-builder-section-template-panel="services"]').first();
    await expect(servicesPanel).toBeVisible();
    await expect(servicesPanel).toContainText('주요 서비스 template');
    await servicesPanel.getByRole('button', { name: 'Glass' }).click();
    await expect(servicesRoot).toHaveAttribute('data-section-variant', 'glass');
    await expect(servicesRoot).toContainText('주요 서비스');
    await expect(servicesRoot.locator('.services-detail-card').first()).toBeVisible();

    await selectLayerNode(page, 'home-faq-root', 'container');
    const faqRoot = page.locator('[data-node-id="home-faq-root"]').first();
    await faqRoot.scrollIntoViewIfNeeded();
    await expect(faqRoot).toHaveAttribute('data-builder-section-template', 'faq');
    const faqPanel = page.locator('[data-builder-section-template-panel="faq"]').first();
    await expect(faqPanel).toBeVisible();
    await faqPanel.getByRole('button', { name: 'Floating' }).click();
    await expect(faqRoot).toHaveAttribute('data-section-variant', 'floating');
    await expect(faqRoot).toContainText('FAQ');
    await expect(faqRoot.locator('.faq-item').first()).toBeVisible();

    await page.getByRole('button', { name: 'Design', exact: true }).click();
    const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Section design' }).first();
    await expect(designDrawer).toBeVisible();
    await expect(designDrawer).toContainText('FAQ의 글, 주소, 링크 데이터는 그대로');
    await designDrawer.getByRole('button', { name: /Elevated/ }).click();
    await expect(faqRoot).toHaveAttribute('data-section-variant', 'elevated');

    await expect.poll(async () => {
      const draftResponse = await page.request.get(`/api/builder/site/pages/${homePageId}/draft?locale=ko`);
      if (draftResponse.status() !== 200) return 'missing';
      const draftPayload = (await draftResponse.json()) as {
        document?: {
          nodes?: Array<{ id?: string; content?: { variant?: string } }>;
        };
      };
      const servicesVariant = draftPayload.document?.nodes?.find((node) => node.id === 'home-services-root')?.content?.variant;
      const faqVariant = draftPayload.document?.nodes?.find((node) => node.id === 'home-faq-root')?.content?.variant;
      return `${servicesVariant}:${faqVariant}`;
    }, { timeout: 20_000 }).toBe('glass:elevated');
  });

  test('publishes stateful section template variants to public pages', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-section-template-${token}`;
    let pageId: string | null = null;

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        headers: mutationHeaders(`section-template-${token}`),
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Section Template ${token}`,
          document: makePublicSectionTemplateDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        headers: mutationHeaders(`section-template-${token}`),
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      const publicHtmlResponse = await page.request.get(`/ko/${slug}`);
      expect(publicHtmlResponse.status()).toBe(200);
      const publicHtml = await publicHtmlResponse.text();
      expect(publicHtml).toContain('data-builder-section-template="faq"');
      expect(publicHtml).toContain('data-section-variant="glass"');
      expect(publicHtml).toContain("data-builder-section-template='faq'][data-section-variant='glass']");

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      const sectionRoot = page.locator('[data-node-id="home-faq-root"]').first();
      await expect(sectionRoot).toHaveAttribute('data-builder-section-template', 'faq');
      await expect(sectionRoot).toHaveAttribute('data-section-variant', 'glass');
      const faqItem = sectionRoot.locator('.faq-item').first();
      await expect(faqItem).toBeVisible();
      await expect(faqItem).toHaveCSS('backdrop-filter', /blur\(14px\)/);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(`section-template-${token}`),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('covers canvas direct-manipulation overlays for drag, resize, multi-select, and snap distance', async ({ page }) => {
    await openBuilder(page);

    const canvas = page.getByRole('application', { name: 'Canvas editor' });
    const primaryNode = await topmostUnlockedNode(page);

    await page.keyboard.press('Control+A');
    await expect(page.locator('[class*="canvasOverlayMultiBbox"]').first()).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/design-pool-canvas-multiselect.png` });
    await page.keyboard.press('Escape');
    await expect(page.locator('[class*="canvasOverlayMultiBbox"]')).toHaveCount(0);

    await clickCanvasNode(primaryNode);
    const dragBox = await locatorBox(primaryNode);
    await page.mouse.move(dragBox.x + 24, dragBox.y + 24);
    await page.mouse.down();
    await page.mouse.move(dragBox.x + 86, dragBox.y + 30, { steps: 8 });
    await expect(page.locator('[class*="canvasOverlayDragOrigin"]').first()).toBeVisible();
    await expect(page.locator('[class*="canvasOverlayDragGhost"]').first()).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/design-pool-canvas-drag-ghost.png` });
    await page.mouse.up();

    await clickCanvasNode(primaryNode);
    const resizeHandle = page.getByLabel(/Resize .* node se/).first();
    await expect(resizeHandle).toBeVisible();
    const resizeBox = await locatorBox(resizeHandle);
    await page.mouse.move(resizeBox.x + resizeBox.width / 2, resizeBox.y + resizeBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(resizeBox.x + 58, resizeBox.y + 44, { steps: 6 });
    const resizeReadout = page.locator('[class*="canvasOverlayResizeReadout"]').first();
    await expect(resizeReadout).toBeVisible();
    await expect(resizeReadout).toContainText(/\d+\s*x\s*\d+/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-canvas-resize-readout.png` });
    await page.mouse.up();

    const snapNode = canvas.locator('[data-node-id="home-hero-title"]:visible').first();
    await clickCanvasNode(snapNode);
    const snapBox = await locatorBox(snapNode);
    await page.mouse.move(snapBox.x + 24, snapBox.y + 24);
    await page.mouse.down();
    await page.mouse.move(snapBox.x + 29, snapBox.y + 24, { steps: 10 });
    const snapLabel = page.locator('[class*="canvasOverlaySnapDistance"]').first();
    await expect(snapLabel).toBeVisible();
    await expect(snapLabel).toContainText(/px/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-canvas-snap-distance.png` });
    await page.mouse.up();
  });

  test('covers Site Settings ModalShell tabs, brand apply, typography picker, validation, and PUT 200 contract', async ({ page }) => {
    let putPayload: unknown = null;
    await page.route('**/api/builder/site/settings**', async (route, request) => {
      if (request.method() !== 'PUT') {
        await route.continue();
        return;
      }
      putPayload = JSON.parse(request.postData() || '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          settings: (putPayload as { settings?: unknown }).settings,
          theme: (putPayload as { theme?: unknown }).theme,
          darkMode: (putPayload as { darkMode?: unknown }).darkMode,
        }),
      });
    });

    await openBuilder(page);
    let modal = await openSiteSettings(page);
    await expect(modal).toHaveAttribute('data-reduce-motion', /true|false/);
    await expect.poll(async () => modal.evaluate((node) => node.contains(document.activeElement))).toBe(true);
    await expect(modal).toContainText('기본 정보');

    await modal.locator('input[type="text"]').first().fill('호정 디자인 검증');
    await modal.getByRole('button', { name: '저장' }).click();
    await expect.poll(() => putPayload).not.toBeNull();
    expect(putPayload).toMatchObject({
      settings: {
        firmName: '호정 디자인 검증',
      },
    });
    await expect(page.locator('[data-modal-shell="true"]')).toHaveCount(0);

    modal = await openSiteSettings(page);
    await expect(modal).toContainText('기본 정보');

    await modal.getByRole('button', { name: /Brand kit/ }).click();
    await expect(modal).toContainText('Brand kit changes are site-wide');
    await expect(modal.locator('img')).toHaveCount(0);
    await modal.getByRole('button', { name: 'Apply brand kit' }).click();
    await expect(modal).toContainText('Brand kit을 현재 사이트 테마에 적용했습니다');

    await modal.getByRole('button', { name: /Typography/ }).click();
    await expect(modal.locator('[data-font-picker]').first()).toBeVisible();
    await modal.locator('[data-font-picker]').first().getByRole('button').click();
    const fontDialog = page.getByRole('dialog', { name: 'Advanced font picker' });
    await expect(fontDialog).toBeVisible();
    await fontDialog.getByPlaceholder('Search fonts').fill('Noto');
    await expect(fontDialog.getByLabel('Font preview text')).toHaveValue(/Aa/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-font-picker.png` });

    await modal.getByRole('button', { name: /Presets/ }).click();
    await expect(modal.getByRole('button', { name: 'Apply' })).toHaveCount(5);

    await modal.getByRole('button', { name: /Dark mode/ }).click();
    await expect(modal).toContainText('Light preview');
    await expect(modal).toContainText('Dark preview');
    await page.screenshot({ path: `${screenshotDir}/design-pool-site-settings-dark-tab.png` });

    await modal.getByRole('button', { name: /Advanced/ }).click();
    await modal.locator('input[type="text"]').first().fill('not-a-hex');
    await modal.getByRole('button', { name: '저장' }).click();
    await expect(modal).toContainText('#RRGGBB');
    await modal.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('[data-modal-shell="true"]')).toHaveCount(0);
  });

  test('persists Site Settings through the real API and reflects them in editor and published pages', async ({ page }) => {
    test.setTimeout(120_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-settings-${token}`;
    const firmName = `호정 설정 검증 ${token}`;
    const phone = `+886-2-${token.slice(-4).padStart(4, '0')}-0000`;
    const email = `settings-${token}@example.com`;
    const address = `서울 설정 검증로 ${token}`;
    const logoUrl = `https://example.com/g-editor-logo-${token}.png`;
    const faviconUrl = `https://example.com/g-editor-favicon-${token}.ico`;
    const primaryColor = '#0a7f5a';
    let pageId: string | null = null;
    let originalSettingsPayload: {
      settings?: Record<string, unknown>;
      theme?: Record<string, unknown>;
      darkMode?: Record<string, unknown>;
    } | null = null;
    let originalFooterDocument: unknown | null = null;

    try {
      const originalSettingsResponse = await page.request.get('/api/builder/site/settings?locale=ko');
      expect(originalSettingsResponse.status()).toBe(200);
      originalSettingsPayload = await originalSettingsResponse.json();
      const originalFooterResponse = await page.request.get('/api/builder/site/footer/draft?locale=ko', {
        failOnStatusCode: false,
      });
      if (originalFooterResponse.status() === 200) {
        const payload = (await originalFooterResponse.json()) as { document?: unknown };
        originalFooterDocument = payload.document ?? null;
      }
      await page.request.put('/api/builder/site/footer/draft?locale=ko', {
        data: {
          document: makeEmptyGlobalFooterDocument(),
        },
      });

      await openBuilder(page);

      let modal = await openSiteSettings(page);
      await modal.getByPlaceholder('예: 호정국제법률사무소').fill(firmName);
      await modal.getByPlaceholder('예: +886-2-1234-5678').fill(phone);
      await modal.getByPlaceholder('예: contact@example.com').fill(email);
      await modal.getByPlaceholder('사무소 주소').fill(address);
      await modal.getByPlaceholder('https://example.com/logo.png').fill(logoUrl);
      await modal.getByPlaceholder('https://example.com/favicon.ico').fill(faviconUrl);

      await modal.getByRole('button', { name: /Typography/ }).click();
      await modal.locator('[data-font-picker]').nth(1).getByRole('button').click();
      const fontDialog = page.getByRole('dialog', { name: 'Advanced font picker' });
      await expect(fontDialog).toBeVisible();
      await fontDialog.getByPlaceholder('Search fonts').fill('monospace');
      await fontDialog.getByRole('button', { name: /monospace/i }).first().click();
      await expect(fontDialog).toHaveCount(0);

      await modal.getByRole('button', { name: /Advanced/ }).click();
      await modal.locator('input[type="text"]').first().fill(primaryColor);

      const saveResponsePromise = page.waitForResponse((response) => (
        response.url().includes('/api/builder/site/settings')
        && response.request().method() === 'PUT'
      ));
      await modal.getByRole('button', { name: '저장' }).click();
      const saveResponse = await saveResponsePromise;
      expect(saveResponse.status()).toBe(200);
      await expect(page.locator('[data-modal-shell="true"]')).toHaveCount(0);

      const editorBrand = page.locator('[data-builder-site-brand="true"]').first();
      await expect(editorBrand.locator('strong')).toHaveText(firmName);
      await expect(editorBrand.locator('.site-header-logo-light')).toHaveAttribute('src', logoUrl);

      const settingsResponse = await page.request.get('/api/builder/site/settings?locale=ko');
      expect(settingsResponse.status()).toBe(200);
      const settingsPayload = (await settingsResponse.json()) as {
        ok?: boolean;
        settings?: Record<string, unknown>;
        theme?: {
          colors?: Record<string, string>;
          fonts?: Record<string, string>;
        };
      };
      expect(settingsPayload.ok).toBe(true);
      expect(settingsPayload.settings).toMatchObject({
        firmName,
        phone,
        email,
        address,
        logo: logoUrl,
        favicon: faviconUrl,
      });
      expect(settingsPayload.theme?.colors?.primary).toBe(primaryColor);
      expect(settingsPayload.theme?.fonts?.body).toBe('monospace');

      modal = await openSiteSettings(page);
      await modal.getByRole('button', { name: /General/ }).click();
      await expect(modal.getByPlaceholder('예: 호정국제법률사무소')).toHaveValue(firmName);
      await expect(modal.getByPlaceholder('https://example.com/logo.png')).toHaveValue(logoUrl);
      await modal.getByRole('button', { name: 'Close' }).click();
      await expect(page.locator('[data-modal-shell="true"]')).toHaveCount(0);

      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Settings ${token}`,
          document: makeSettingsReflectionDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      const publicHtmlResponse = await page.request.get(`/ko/${slug}`);
      expect(publicHtmlResponse.status()).toBe(200);
      const publicHtml = await publicHtmlResponse.text();
      expect(publicHtml).toContain(firmName);
      expect(publicHtml).toContain(logoUrl);
      expect(publicHtml).toContain(faviconUrl);

      const publicHeader = page.locator('header').filter({ has: page.locator('.site-header-logo-light') }).last();
      await expect(publicHeader.locator('strong').filter({ hasText: firmName }).first()).toBeVisible();
      await expect(publicHeader.locator('.site-header-logo-light')).toHaveAttribute('src', logoUrl);
      await expect(page.locator(`link[rel="icon"][href="${faviconUrl}"]`)).toHaveCount(1);
      const publicFooter = page.locator('footer').filter({ hasText: address }).first();
      await expect(publicFooter).toContainText(phone);
      await expect(publicFooter.locator('a[href^="mailto:"]').first()).toHaveCSS('color', 'rgb(10, 127, 90)');
      await expect(page.locator('.builder-pub-main')).toHaveCSS('font-family', /monospace/);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          failOnStatusCode: false,
        });
      }
      if (originalSettingsPayload) {
        await page.request.put('/api/builder/site/settings?locale=ko', {
          data: {
            settings: {
              firmName: '',
              phone: '',
              email: '',
              address: '',
              businessHours: '',
              businessRegNumber: '',
              logo: '',
              logoDark: '',
              favicon: '',
              ogImage: '',
              ...(originalSettingsPayload.settings ?? {}),
            },
            theme: originalSettingsPayload.theme,
            darkMode: originalSettingsPayload.darkMode,
          },
          failOnStatusCode: false,
        });
      }
      await page.request.put('/api/builder/site/footer/draft?locale=ko', {
        data: {
          document: originalFooterDocument ?? makeEmptyGlobalFooterDocument(),
        },
        failOnStatusCode: false,
      });
      await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 }).catch(() => undefined);
    }
  });

  test('persists Navigation edits through the real UI and reflects them in published headers', async ({ page }) => {
    test.setTimeout(120_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-nav-${token}`;
    const navLabel = `검증 메뉴 ${token}`;
    const navHref = `/ko/${slug}`;
    let pageId: string | null = null;
    let originalNavigation: Array<{
      id: string;
      label: string | Record<string, string>;
      href: string;
      pageId?: string;
    }> | null = null;

    try {
      const originalNavResponse = await page.request.get('/api/builder/site/navigation?locale=ko');
      expect(originalNavResponse.status()).toBe(200);
      const originalNavPayload = (await originalNavResponse.json()) as {
        navigation?: Array<{
          id: string;
          label: string | Record<string, string>;
          href: string;
          pageId?: string;
        }>;
      };
      originalNavigation = Array.isArray(originalNavPayload.navigation) ? originalNavPayload.navigation : [];
      expect(originalNavigation.length).toBeGreaterThan(0);
      const targetIndex = originalNavigation.findIndex((item) => item.id === 'nav-columns');
      const resolvedTargetIndex = targetIndex >= 0 ? targetIndex : Math.max(0, originalNavigation.length - 1);
      const targetItem = originalNavigation[resolvedTargetIndex];
      expect(targetItem?.id).toBeTruthy();
      const servicesIndex = originalNavigation.findIndex((item) => item.id === 'nav-services');
      const childLabel = `드롭다운 검증 ${token}`;
      const childHref = `/ko/${slug}#dropdown`;

      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Navigation ${token}`,
          document: makeSettingsReflectionDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish`, {
        data: {},
      });
      expect(publishResponse.status()).toBe(200);

      await openBuilder(page);
      await page.locator('[class*="iconRail"]').getByRole('button', { name: 'Navigation', exact: true }).click();
      const navDrawer = page.locator('[aria-hidden="false"]').first();
      await expect(navDrawer.getByText('Navigation').first()).toBeVisible();

      await navDrawer.getByTitle('편집').nth(resolvedTargetIndex).click();
      const labelInput = navDrawer.locator('input[type="text"]').nth(0);
      const hrefInput = navDrawer.locator('input[type="text"]').nth(1);
      await expect(labelInput).toBeVisible();
      await labelInput.fill(navLabel);
      await hrefInput.fill(navHref);

      const saveResponsePromise = page.waitForResponse((response) => (
        response.url().includes('/api/builder/site/navigation')
        && response.request().method() === 'PUT'
      ));
      await navDrawer.getByRole('button', { name: '저장' }).click();
      const saveResponse = await saveResponsePromise;
      expect(saveResponse.status()).toBe(200);
      await expect(navDrawer.getByText('저장 중...')).toHaveCount(0);

      const navResponse = await page.request.get('/api/builder/site/navigation?locale=ko');
      expect(navResponse.status()).toBe(200);
      const navPayload = (await navResponse.json()) as {
        navigation?: Array<{ id: string; label: string | Record<string, string>; href: string }>;
      };
      const persisted = navPayload.navigation?.find((item) => item.id === targetItem!.id);
      expect(persisted?.href).toBe(navHref);
      expect(typeof persisted?.label === 'string' ? persisted.label : persisted?.label.ko).toBe(navLabel);

      const editorHeaderLink = page.locator(`[data-builder-nav-item-id="${targetItem!.id}"]`).first();
      await expect(editorHeaderLink).toHaveText(navLabel);
      await expect(editorHeaderLink).toHaveAttribute('href', navHref);

      if (servicesIndex >= 0) {
        const addChildResponsePromise = page.waitForResponse((response) => (
          response.url().includes('/api/builder/site/navigation')
          && response.request().method() === 'PUT'
        ));
        await navDrawer.getByTitle('하위 메뉴 추가').nth(servicesIndex).click();
        expect((await addChildResponsePromise).status()).toBe(200);
        await expect(labelInput).toBeVisible();
        await labelInput.fill(childLabel);
        await hrefInput.fill(childHref);
        const saveChildResponsePromise = page.waitForResponse((response) => (
          response.url().includes('/api/builder/site/navigation')
          && response.request().method() === 'PUT'
        ));
        await navDrawer.getByRole('button', { name: '저장' }).click();
        expect((await saveChildResponsePromise).status()).toBe(200);
        await expect(navDrawer.getByText('저장 중...')).toHaveCount(0);

        const servicesLink = page.locator('[data-builder-nav-item-id="nav-services"]').first();
        await servicesLink.hover();
        await expect(page.locator('.builder-site-header .mega-panel.active').first()).toContainText(childLabel);

        const navWithChildResponse = await page.request.get('/api/builder/site/navigation?locale=ko');
        expect(navWithChildResponse.status()).toBe(200);
        const navWithChildPayload = (await navWithChildResponse.json()) as {
          navigation?: Array<{
            id: string;
            children?: Array<{ label: string | Record<string, string>; href: string }>;
          }>;
        };
        const servicesWithChild = navWithChildPayload.navigation?.find((item) => item.id === 'nav-services');
        expect(servicesWithChild?.children?.some((child) => (
          child.href === childHref
          && (typeof child.label === 'string' ? child.label : child.label.ko) === childLabel
        ))).toBe(true);

        const childRow = navDrawer
          .locator('[data-builder-nav-item-row^="nav-services-child-"]')
          .filter({ hasText: childLabel })
          .first();
        const deleteChildResponsePromise = page.waitForResponse((response) => (
          response.url().includes('/api/builder/site/navigation')
          && response.request().method() === 'PUT'
        ));
        await childRow.getByTitle('Mega 삭제').click();
        expect((await deleteChildResponsePromise).status()).toBe(200);
        await expect(navDrawer.getByText('저장 중...')).toHaveCount(0);

        const navAfterDeleteResponse = await page.request.get('/api/builder/site/navigation?locale=ko');
        expect(navAfterDeleteResponse.status()).toBe(200);
        const navAfterDeletePayload = (await navAfterDeleteResponse.json()) as {
          navigation?: Array<{
            id: string;
            children?: Array<{ href: string }>;
          }>;
        };
        const servicesAfterDelete = navAfterDeletePayload.navigation?.find((item) => item.id === 'nav-services');
        expect(servicesAfterDelete?.children?.some((child) => child.href === childHref)).toBe(false);
      }

      await expect.poll(async () => {
        const publicHtmlResponse = await page.request.get(`/ko/${slug}`);
        if (publicHtmlResponse.status() !== 200) return 'not-ready';
        const publicHtml = await publicHtmlResponse.text();
        return `${publicHtml.includes(navLabel)}:${publicHtml.includes(`href="${navHref}"`)}`;
      }, { timeout: 30_000 }).toBe('true:true');

      await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
      const publicHeaderLink = page.locator('header a').filter({ hasText: navLabel }).first();
      await expect(publicHeaderLink).toBeVisible();
      await expect(publicHeaderLink).toHaveAttribute('href', navHref);
    } finally {
      if (originalNavigation) {
        await page.request.put('/api/builder/site/navigation', {
          data: {
            locale: 'ko',
            navigation: originalNavigation,
          },
          failOnStatusCode: false,
        });
      }
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          failOnStatusCode: false,
        });
      }
      await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 }).catch(() => undefined);
    }
  });

  test('reflects a saved Global Footer canvas across published pages', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const footerText = `공유 푸터 검증 ${token}`;
    const slugs = [`g-editor-footer-a-${token}`, `g-editor-footer-b-${token}`];
    const pageIds: string[] = [];
    let originalFooterDocument: unknown | null = null;

    try {
      const originalFooterResponse = await page.request.get('/api/builder/site/footer/draft?locale=ko', {
        failOnStatusCode: false,
      });
      if (originalFooterResponse.status() === 200) {
        const payload = (await originalFooterResponse.json()) as { document?: unknown };
        originalFooterDocument = payload.document ?? null;
      }

      for (const slug of slugs) {
        const createResponse = await page.request.post('/api/builder/site/pages', {
          data: {
            locale: 'ko',
            slug,
            title: `G Editor Footer ${token}`,
            document: makeSettingsReflectionDocument(`${token}-${slug}`),
          },
        });
        expect(createResponse.status()).toBe(200);
        const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
        expect(created.success, created.error).toBe(true);
        expect(created.pageId).toBeTruthy();
        pageIds.push(created.pageId!);

        const publishResponse = await page.request.post(`/api/builder/site/pages/${created.pageId}/publish`, {
          data: {},
        });
        expect(publishResponse.status()).toBe(200);
      }

      const footerResponse = await page.request.put('/api/builder/site/footer/draft?locale=ko', {
        data: {
          document: makeGlobalFooterDocument(token, footerText),
        },
      });
      expect(footerResponse.status()).toBe(200);
      const savedFooter = (await footerResponse.json()) as {
        ok?: boolean;
        document?: { stageHeight?: number; nodes?: Array<{ content?: { text?: string } }> };
      };
      expect(savedFooter.ok).toBe(true);
      expect(savedFooter.document?.stageHeight).toBe(132);
      expect(savedFooter.document?.nodes?.some((node) => node.content?.text === footerText)).toBe(true);

      for (const slug of slugs) {
        await expect.poll(async () => {
          const response = await page.request.get(`/ko/${slug}`);
          if (response.status() !== 200) return 'not-ready';
          const html = await response.text();
          return String(html.includes(footerText));
        }, { timeout: 20_000 }).toBe('true');

        await page.goto(`/ko/${slug}`, { waitUntil: 'domcontentloaded' });
        const globalFooter = page.locator('footer[data-builder-global-section="footer"]').first();
        await expect(globalFooter).toBeVisible();
        await expect(globalFooter).toContainText(footerText);
      }
    } finally {
      await page.request.put('/api/builder/site/footer/draft?locale=ko', {
        data: {
          document: originalFooterDocument ?? makeEmptyGlobalFooterDocument(),
        },
        failOnStatusCode: false,
      });
      for (const pageId of pageIds) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          failOnStatusCode: false,
        });
      }
      await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 }).catch(() => undefined);
    }
  });

  test('creates a real blank page from the Pages template gallery', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-blank-${token}`;
    let pageId: string | null = null;

    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      await openBuilder(page);
      await page.locator('[class*="iconRail"]').getByRole('button', { name: 'Pages' }).click();
      await page.getByRole('button', { name: '+ New' }).click();

      const gallery = page.locator('[data-modal-shell="true"][data-modal-nested="false"]').last();
      await expect(gallery).toBeVisible();
      await gallery.getByRole('button', { name: /빈 페이지/ }).click();

      await page.getByPlaceholder('예: about, services, contact').fill(slug);
      await page.getByRole('button', { name: '생성' }).click();
      await expect(page.getByText(/Loaded page:/).last()).toBeVisible({ timeout: 20_000 });

      const canvas = page.getByRole('application', { name: 'Canvas editor' });
      await expect(canvas.getByText('요소를 드래그해서 추가하세요')).toBeVisible();
      await expect(canvas.locator('[data-node-id]:visible')).toHaveCount(0);

      pageId = await findPageIdBySlug(page, slug);
      expect(pageId).toBeTruthy();
      const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
        headers: mutationHeaders(slug),
      });
      expect(draftResponse.status()).toBe(200);
      const draftPayload = (await draftResponse.json()) as { document?: { nodes?: unknown[] } };
      expect(draftPayload.document?.nodes ?? null).toEqual([]);
    } finally {
      pageId ??= await findPageIdBySlug(page, slug);
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 }).catch(() => undefined);
    }
  });

  test('rejects duplicate page slugs without replacing the existing draft', async ({ page }) => {
    test.setTimeout(60_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-duplicate-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `Duplicate source ${token}`,
          blank: true,
        },
        headers: mutationHeaders(slug),
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { pageId?: string; success?: boolean; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      const duplicateResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `Duplicate rejected ${token}`,
          blank: true,
        },
        headers: mutationHeaders(`${slug}-dupe`),
        failOnStatusCode: false,
      });
      expect(duplicateResponse.status()).toBe(409);
      const duplicatePayload = (await duplicateResponse.json()) as {
        error?: string;
        pageId?: string;
        success?: boolean;
      };
      expect(duplicatePayload).toMatchObject({
        success: false,
        error: 'duplicate_slug',
        pageId,
      });

      const pagesResponse = await page.request.get('/api/builder/site/pages?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(pagesResponse.status()).toBe(200);
      const pagesPayload = (await pagesResponse.json()) as {
        pages?: Array<{ pageId?: string; slug?: string; title?: Record<string, string> }>;
      };
      const matchingPages = pagesPayload.pages?.filter((entry) => entry.slug === slug) ?? [];
      expect(matchingPages).toHaveLength(1);
      expect(matchingPages[0]?.pageId).toBe(pageId);

      const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
        headers: mutationHeaders(slug),
      });
      expect(draftResponse.status()).toBe(200);
      const draftPayload = (await draftResponse.json()) as { document?: { nodes?: unknown[] } };
      expect(draftPayload.document?.nodes ?? null).toEqual([]);
    } finally {
      pageId ??= await findPageIdBySlug(page, slug);
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('keeps active page slug and nested navigation in sync after rename and delete', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-page-sync-${token}`;
    const renamedSlug = `${slug}-renamed`;
    const title = `Page sync ${token}`;
    const renamedTitle = `Page sync renamed ${token}`;
    let pageId: string | null = null;
    let originalNavigation: TestNavigationItem[] | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title,
          blank: true,
        },
        headers: mutationHeaders(slug),
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { pageId?: string; success?: boolean; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      const originalNavResponse = await page.request.get('/api/builder/site/navigation?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(originalNavResponse.status()).toBe(200);
      const originalNavPayload = (await originalNavResponse.json()) as { navigation?: TestNavigationItem[] };
      originalNavigation = originalNavPayload.navigation ?? [];
      expect(originalNavigation.length).toBeGreaterThan(0);

      const parentId = originalNavigation.find((item) => item.id === 'nav-services')?.id ?? originalNavigation[0]!.id;
      const nestedChild: TestNavigationItem = {
        id: `nav-page-sync-child-${token}`,
        pageId,
        href: `/ko/${slug}`,
        label: {
          ko: `페이지 sync child ${token}`,
          'zh-hant': `頁面 sync child ${token}`,
          en: `Page sync child ${token}`,
        },
      };
      const navWithNestedPage = originalNavigation.map((item) => (
        item.id === parentId
          ? { ...item, children: [...(item.children ?? []), nestedChild] }
          : item
      ));
      const seedNavResponse = await page.request.put('/api/builder/site/navigation', {
        data: {
          locale: 'ko',
          navigation: navWithNestedPage,
        },
        headers: mutationHeaders(slug),
      });
      expect(seedNavResponse.status()).toBe(200);

      await openBuilder(page);
      await page.locator('[class*="iconRail"]').getByRole('button', { name: 'Pages', exact: true }).click();
      const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first();
      await expect(pagesDrawer.getByText('Pages').first()).toBeVisible();

      const initialRow = pagesDrawer.locator(`[data-builder-page-row="${pageId}"]`).first();
      await expect(initialRow).toBeVisible();
      await initialRow.getByRole('button').filter({ hasText: title }).click();
      const pageDropdown = page.locator('[class*="pageDropdownButton"]').first();
      await expect(pageDropdown).toContainText(`/${slug}`);

      await initialRow.hover();
      await initialRow.getByRole('button', { name: '페이지 메뉴' }).click();
      await pagesDrawer.getByRole('button', { name: '이름 변경' }).click();
      await initialRow.locator('input[type="text"]').nth(0).fill(renamedTitle);
      await initialRow.locator('input[type="text"]').nth(1).fill(renamedSlug);
      const renameResponsePromise = page.waitForResponse((response) => (
        response.url().includes(`/api/builder/site/pages/${pageId}`)
        && response.request().method() === 'PATCH'
      ));
      await initialRow.locator('input[type="text"]').nth(1).press('Enter');
      expect((await renameResponsePromise).status()).toBe(200);

      await expect(pageDropdown).toContainText(`/${renamedSlug}`);
      const renamedRow = pagesDrawer.locator(`[data-builder-page-row="${pageId}"]`).first();
      await expect(renamedRow).toHaveAttribute('data-builder-page-slug', renamedSlug);

      const pagesAfterRenameResponse = await page.request.get('/api/builder/site/pages?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(pagesAfterRenameResponse.status()).toBe(200);
      const pagesAfterRename = (await pagesAfterRenameResponse.json()) as {
        pages?: Array<{ pageId?: string; slug?: string; title?: Record<string, string> }>;
      };
      const renamedPage = pagesAfterRename.pages?.find((entry) => entry.pageId === pageId);
      expect(renamedPage?.slug).toBe(renamedSlug);
      expect(renamedPage?.title?.ko).toBe(renamedTitle);

      const navAfterRenameResponse = await page.request.get('/api/builder/site/navigation?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(navAfterRenameResponse.status()).toBe(200);
      const navAfterRenamePayload = (await navAfterRenameResponse.json()) as { navigation?: TestNavigationItem[] };
      const renamedNavItem = findNavigationItemByPageId(navAfterRenamePayload.navigation ?? [], pageId);
      expect(renamedNavItem?.href).toBe(`/ko/${renamedSlug}`);

      await renamedRow.hover();
      await renamedRow.getByRole('button', { name: '페이지 메뉴' }).click();
      page.once('dialog', (dialog) => {
        void dialog.accept();
      });
      const deleteResponsePromise = page.waitForResponse((response) => (
        response.url().includes(`/api/builder/site/pages/${pageId}`)
        && response.request().method() === 'DELETE'
      ));
      await pagesDrawer.getByRole('button', { name: '삭제' }).click();
      expect((await deleteResponsePromise).status()).toBe(200);

      await expect(pageDropdown).not.toContainText(`/${renamedSlug}`);
      await expect.poll(async () => findPageIdBySlug(page, renamedSlug), { timeout: 20_000 }).toBeNull();

      const navAfterDeleteResponse = await page.request.get('/api/builder/site/navigation?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(navAfterDeleteResponse.status()).toBe(200);
      const navAfterDeletePayload = (await navAfterDeleteResponse.json()) as { navigation?: TestNavigationItem[] };
      expect(navigationHasPageId(navAfterDeletePayload.navigation ?? [], pageId)).toBe(false);
    } finally {
      if (originalNavigation) {
        await page.request.put('/api/builder/site/navigation', {
          data: {
            locale: 'ko',
            navigation: originalNavigation,
          },
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      pageId ??= await findPageIdBySlug(page, slug);
      pageId ??= await findPageIdBySlug(page, renamedSlug);
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
      await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 }).catch(() => undefined);
    }
  });

  test('covers template gallery viewport, thumbnail renderer, hover card, and nested preview behavior', async ({ page }) => {
    await openBuilder(page);

    await page.locator('[class*="iconRail"]').getByRole('button', { name: 'Pages' }).click();
    await page.getByRole('button', { name: '+ New' }).click();

    const gallery = page.locator('[data-modal-shell="true"][data-modal-nested="false"]').last();
    await expect(gallery).toBeVisible();
    await expect(gallery).toContainText('프리미엄 템플릿 쇼룸');
    await expect(page.locator('[data-template-thumbnail-renderer="html-scaled-mock"]').first()).toBeVisible();
    await expect.poll(async () => page.locator('[data-template-thumbnail-renderer="html-scaled-mock"]').count()).toBeGreaterThan(20);

    const firstPreviewButton = gallery.getByRole('button', { name: /미리보기/ }).first();
    await firstPreviewButton.hover();
    await page.screenshot({ path: `${screenshotDir}/design-pool-template-gallery.png` });
    await firstPreviewButton.click();

    const nested = page.locator('[data-modal-shell="true"][data-modal-nested="true"]').last();
    await expect(nested).toBeVisible();
    await nested.getByRole('button', { name: 'tablet' }).click();
    await nested.getByRole('button', { name: 'mobile' }).click();
    await expect(nested).toContainText('CTA 목적');
    await page.screenshot({ path: `${screenshotDir}/design-pool-template-nested-preview.png` });

    await page.keyboard.press('Escape');
    if ((await page.locator('[data-modal-shell="true"][data-modal-nested="true"]').count()) > 0) {
      await nested.getByRole('button', { name: '닫기' }).click();
    }
    await expect(page.locator('[data-modal-shell="true"][data-modal-nested="true"]')).toHaveCount(0);
    await expect(gallery).toBeVisible();
    await gallery.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('[data-modal-shell="true"]')).toHaveCount(0);
  });

  test('covers public widgets under mobile, dark color scheme, and reduced motion', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.goto('/ko', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('body')).toBeVisible();
    await expect.poll(async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await expect.poll(async () => page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>('.builder-widget, [class*="Render"], [class*="section"]'));
      return elements.length;
    })).toBeGreaterThan(0);
    const motionDuration = await page.evaluate(() => {
      const candidate = document.querySelector<HTMLElement>('button, a, input, textarea');
      return candidate ? window.getComputedStyle(candidate).transitionDuration : '';
    });
    expect(motionDuration).not.toMatch(/[1-9]\d{2,}ms/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-public-mobile-dark-reduced.png`, fullPage: true });
  });
});
