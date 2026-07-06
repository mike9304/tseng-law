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
        id: 'home-faq-item-1',
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
        parentId: 'home-faq-item-1',
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

function makeComponentDesignPresetDocument(token: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `component-preset-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: `component-card-${token}`,
        kind: 'container',
        rect: { x: 96, y: 96, width: 420, height: 220 },
        style: baseNodeStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Component preset card',
          background: '#ffffff',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 12,
          padding: 24,
          layoutMode: 'absolute',
          as: 'article',
          variant: 'flat',
        },
      },
      {
        id: `component-button-${token}`,
        kind: 'button',
        rect: { x: 128, y: 148, width: 180, height: 48 },
        style: baseNodeStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: '상담 예약',
          href: '/ko/contact',
          style: 'primary-solid',
        },
      },
      {
        id: `component-form-${token}`,
        kind: 'form',
        rect: { x: 600, y: 96, width: 430, height: 260 },
        style: baseNodeStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          name: `component-preset-form-${token}`,
          submitTo: 'storage',
          successMessage: '감사합니다.',
          method: 'POST',
          layoutMode: 'absolute',
          captcha: 'none',
        },
      },
      {
        id: `component-field-${token}`,
        kind: 'form-input',
        parentId: `component-form-${token}`,
        rect: { x: 24, y: 28, width: 320, height: 78 },
        style: baseNodeStyle,
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          name: 'email',
          label: 'Email',
          placeholder: 'client@example.com',
          type: 'email',
          required: true,
          variant: 'default',
        },
      },
      {
        id: `component-submit-${token}`,
        kind: 'form-submit',
        parentId: `component-form-${token}`,
        rect: { x: 24, y: 128, width: 180, height: 48 },
        style: baseNodeStyle,
        zIndex: 4,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Send',
          style: 'primary',
          fullWidth: false,
          loadingLabel: 'Sending...',
        },
      },
    ],
  };
}

function makeEmptyComponentAuditDocument(token: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `empty-component-audit-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
  };
}

function makeFormOnlyComponentAuditDocument(token: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `form-only-component-audit-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: `form-only-form-${token}`,
        kind: 'form',
        rect: { x: 96, y: 96, width: 440, height: 260 },
        style: baseNodeStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          name: `form-only-${token}`,
          submitTo: 'storage',
          successMessage: '감사합니다.',
          method: 'POST',
          layoutMode: 'absolute',
          captcha: 'none',
        },
      },
      {
        id: `form-only-field-${token}`,
        kind: 'form-input',
        parentId: `form-only-form-${token}`,
        rect: { x: 24, y: 28, width: 320, height: 78 },
        style: baseNodeStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          name: 'email',
          label: 'Email',
          placeholder: 'client@example.com',
          type: 'email',
          required: true,
          variant: 'default',
        },
      },
      {
        id: `form-only-submit-${token}`,
        kind: 'form-submit',
        parentId: `form-only-form-${token}`,
        rect: { x: 24, y: 128, width: 180, height: 48 },
        style: baseNodeStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Send',
          style: 'ghost',
          fullWidth: false,
          loadingLabel: 'Sending...',
        },
      },
    ],
  };
}

function makeCardOnlyComponentAuditDocument(token: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `card-only-component-audit-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: `card-only-card-${token}`,
        kind: 'container',
        rect: { x: 120, y: 96, width: 420, height: 220 },
        style: baseNodeStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Card-only audit card',
          background: '#ffffff',
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 12,
          padding: 24,
          layoutMode: 'absolute',
          as: 'article',
          variant: 'flat',
        },
      },
    ],
  };
}

function makeButtonOnlyComponentAuditDocument(token: string) {
  const now = new Date().toISOString();
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: `button-only-component-audit-${token}`,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: `button-only-button-${token}`,
        kind: 'button',
        rect: { x: 120, y: 96, width: 180, height: 48 },
        style: baseNodeStyle,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: '상담 예약',
          href: '/ko/contact',
          style: 'primary-ghost',
        },
      },
    ],
  };
}

function makeSyncedFormOnlyComponentAuditDocument(token: string) {
  const document = makeFormOnlyComponentAuditDocument(token);
  return {
    ...document,
    updatedBy: `synced-form-only-component-audit-${token}`,
    nodes: document.nodes.map((node) => {
      if (node.id === `form-only-field-${token}`) {
        return {
          ...node,
          content: {
            ...node.content,
            variant: 'filled',
          },
        };
      }
      if (node.id === `form-only-submit-${token}`) {
        return {
          ...node,
          content: {
            ...node.content,
            style: 'primary',
          },
        };
      }
      return node;
    }),
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
  const isStyled = async () => page.evaluate(() => {
    const shell = document.querySelector<HTMLElement>('[data-editor-shell]');
    const topBar = document.querySelector<HTMLElement>('header[class*="topBar"]');
    if (!shell || !topBar || shell.dataset.editorReady !== 'true') return false;
    const style = window.getComputedStyle(topBar);
    const height = Number.parseFloat(style.height);
    return style.display === 'grid' && height >= 48 && height <= 80;
  }).catch(() => false);

  try {
    await expect.poll(isStyled, { timeout: 15_000 }).toBe(true);
  } catch {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect.poll(isStyled, { timeout: 15_000 }).toBe(true);
  }
}

async function openBuilder(page: Page, path = '/ko/admin-builder'): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-editor-shell]')).toBeVisible();
  await waitForEditorCss(page);
  await page.waitForTimeout(5_000);
}

async function selectLayerNode(page: Page, nodeId: string, kind: string): Promise<void> {
  let drawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Layers|레이어/ }).first();
  if (!(await drawer.getByText(/Layers|레이어/).first().isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /^Layers$|^레이어$/ }).click({ force: true });
    drawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Layers|레이어/ }).first();
  }
  await expect(drawer.getByText(/Layers|레이어/).first()).toBeVisible();
  const row = drawer.locator(`[title="${kind} ${nodeId}"], [title$=" ${nodeId}"]`).first();
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
  const closeButton = page.getByRole('button', { name: /^Close$|^닫기$|^취소$|^Cancel$/ }).first();
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
    const status = page.locator('footer[class*="statusBar"]');
    await expect(status).toBeVisible();
    await expect(status).toContainText(/Viewport: desktop|뷰포트: desktop/);
    await expect(status.getByRole('button', { name: /^cozy$|^보통$/ })).toHaveAttribute('aria-pressed', 'true');

    await status.getByRole('button', { name: /^comfortable$|^넓게$/ }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await expect(shell).toHaveAttribute('data-editor-density', 'comfortable');
    await status.getByRole('button', { name: /^Light$|^라이트$/ }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });
    await expect(shell).toHaveAttribute('data-editor-theme', 'dark');
    await page.screenshot({ path: `${screenshotDir}/design-pool-editor-dark.png` });
    await status.getByRole('button', { name: /^Dark$|^다크$/ }).evaluate((button) => {
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
    await expect(inspectorColumn).toContainText(/Select an element to edit|편집할 요소를 선택하세요/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-inspector-empty-or-initial.png` });
    await selectFirstNode(page);
    await closeEditorOverlayIfPresent(page);

    await page.getByRole('button', { name: /^layout$|^레이아웃$/i }).click();
    await expect(page.locator('.insp-row').first()).toBeVisible();
    await expect.poll(async () => page.locator('.insp-row').count()).toBeGreaterThan(4);
    const selectedForLayout = page.locator('[class*="nodeSelected"][data-node-id]:visible').last();
    const beforeWidth = (await locatorBox(selectedForLayout)).width;
    const widthInput = inspectorColumn.getByLabel(/Width value|너비 값/).first();
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

    await page.getByRole('button', { name: /^style$|^스타일$/i }).click();
    await expect(page.locator('.insp-row').first()).toBeVisible();
    const colorPicker = page.locator('[data-color-picker-advanced]').first();
    await expect(colorPicker).toBeVisible();
    await colorPicker.getByRole('button').first().click();
    const colorDialog = page.getByRole('dialog', { name: /Advanced color picker|고급 색상 선택기/ });
    await expect(colorDialog).toBeVisible();
    await expect(colorDialog).toContainText(/Theme palette|테마 팔레트/);
    await expect(colorDialog).toContainText(/Recent|최근 색상/);
    await expect(colorDialog).toContainText(/EyeDropper|Contrast|스포이드|대비/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-color-picker.png` });
    await colorPicker.getByRole('button').first().click();
    await expect(colorDialog).toHaveCount(0);

    await page.getByRole('button', { name: /^content$|^콘텐츠$/i }).click();
    await expect(page.locator('[data-inspector-content-adapter="true"]')).toBeVisible();
    await page.screenshot({ path: `${screenshotDir}/design-pool-inspector-content.png` });

    const contextNode = await topmostUnlockedNode(page);
    await expect(contextNode).toBeVisible();
    await clickCanvasNode(contextNode);
    await clickCanvasNode(contextNode, { button: 'right' });
    const contextMenu = page.locator('[role="menu"]').first();
    await expect(contextMenu).toBeVisible();
    await expect(contextMenu).toContainText(/Hide on viewport|기기별 숨김/);
    await expect(contextMenu).toContainText(/Delete|삭제/);
    await contextMenu.getByRole('menuitem', { name: /Hide on viewport|기기별 숨김/ }).evaluate((element) => {
      (element as HTMLElement).focus({ preventScroll: true });
    });
    await page.keyboard.press('ArrowRight');
    const submenu = page.locator('[class*="contextSubmenu"]').last();
    await expect(submenu).toBeVisible();
    await expect(submenu).toContainText(/Hide on mobile|모바일에서 숨김/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-context-submenu.png` });
    await page.keyboard.press('Escape');
  });

  test('traps focus in advanced color and font picker popovers', async ({ page }) => {
    test.setTimeout(60_000);

    await openBuilder(page, `/ko/admin-builder?pickerFocus=${Date.now().toString(36)}`);
    await selectFirstNode(page);
    await closeEditorOverlayIfPresent(page);

    await page.getByRole('button', { name: /^style$|^스타일$/i }).click();
    await expect(page.locator('.insp-row').first()).toBeVisible();
    const colorPicker = page.locator('[data-color-picker-advanced]').first();
    await expect(colorPicker).toBeVisible();
    const colorTrigger = colorPicker.getByRole('button').first();
    await colorTrigger.click();
    const colorDialog = page.getByRole('dialog', { name: /Advanced color picker|고급 색상 선택기/ });
    await expect(colorDialog).toBeVisible();
    const colorTextInput = colorDialog.getByPlaceholder(/#123b63/);
    const nativeColorInput = colorDialog.getByLabel(/Native color value|기본 색상 값/);
    await expect(colorTextInput).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(nativeColorInput).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(colorTextInput).toBeFocused();

    await page.evaluate(() => {
      const outsideButton = document.createElement('button');
      outsideButton.type = 'button';
      outsideButton.dataset.builderColorPickerOutsideFocusProbe = 'true';
      outsideButton.textContent = 'outside color picker focus probe';
      document.body.appendChild(outsideButton);
      outsideButton.focus();
    });
    await expect(colorTextInput).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(colorDialog).toHaveCount(0);
    await expect(colorTrigger).toBeFocused();

    const modal = await openSiteSettings(page);
    await modal.getByRole('button', { name: /Typography|타이포그래피/ }).click();
    const fontPicker = modal.locator('[data-font-picker]').first();
    await expect(fontPicker).toBeVisible();
    const fontTrigger = fontPicker.getByRole('button').first();
    await fontTrigger.click();
    const fontDialog = page.getByRole('dialog', { name: /Fonts|글꼴/ });
    await expect(fontDialog).toBeVisible();
    const fontSearch = fontDialog.getByPlaceholder(/Search fonts|글꼴 검색/);
    await expect(fontSearch).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(fontDialog.getByRole('button').last()).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(fontSearch).toBeFocused();

    await page.evaluate(() => {
      const outsideButton = document.createElement('button');
      outsideButton.type = 'button';
      outsideButton.dataset.builderFontPickerOutsideFocusProbe = 'true';
      outsideButton.textContent = 'outside font picker focus probe';
      document.body.appendChild(outsideButton);
      outsideButton.focus();
    });
    await expect(fontSearch).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(fontDialog).toHaveCount(0);
    await expect(fontTrigger).toBeFocused();
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
    await expect(servicesPanel).toContainText('Icon glass rows');
    await servicesPanel.getByRole('button', { name: /glass/i }).click();
    await expect(servicesRoot).toHaveAttribute('data-section-variant', 'glass');
    await expect(servicesRoot).toContainText('주요 서비스');
    await expect(servicesRoot.locator('.services-detail-card').first()).toBeVisible();
    await expect(servicesRoot.locator('[data-node-id="home-services-card-1"]').first()).toHaveCSS('left', '28px');

    await selectLayerNode(page, 'home-faq-root', 'container');
    const faqRoot = page.locator('[data-node-id="home-faq-root"]').first();
    await faqRoot.scrollIntoViewIfNeeded();
    await expect(faqRoot).toHaveAttribute('data-builder-section-template', 'faq');
    const faqPanel = page.locator('[data-builder-section-template-panel="faq"]').first();
    await expect(faqPanel).toBeVisible();
    await expect(faqPanel).toContainText('Split rows');
    await faqPanel.getByRole('button', { name: 'Split rows' }).click();
    await expect(faqRoot).toHaveAttribute('data-section-variant', 'floating');
    await expect(faqRoot).toContainText('FAQ');
    await expect(faqRoot.locator('.faq-item').first()).toBeVisible();

    await page.getByRole('button', { name: /^Design$|^디자인$/ }).click();
    const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Section design|섹션 디자인/ }).first();
    await expect(designDrawer).toBeVisible();
    await expect(designDrawer).toContainText('이 섹션의 텍스트, URL, 링크 데이터는 유지한 채');
    await expect(designDrawer.locator('[data-builder-section-template-option="faq:elevated"]')).toContainText('Boxed answers');
    await designDrawer.getByRole('button', { name: 'Boxed answers' }).click();
    await expect(faqRoot).toHaveAttribute('data-section-variant', 'elevated');
    await expect(faqRoot.locator('[data-node-id="home-faq-item-1"]').first()).toHaveCSS('left', '36px');

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
      await expect(sectionRoot.locator('[data-node-id="home-faq-item-1"]').first()).toHaveCSS('left', '36px');
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
    // Snap distance labels need a sibling within 64px of the dragged node —
    // a live-document geometry condition. Verify contents only when shown.
    const snapLabel = page.locator('[class*="canvasOverlaySnapDistance"]').first();
    if (await snapLabel.isVisible().catch(() => false)) {
      await expect(snapLabel).toContainText(/px/);
    }
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

    await modal.getByRole('button', { name: /Brand kit|브랜드 키트/ }).click();
    await expect(modal).toContainText(/Brand kit changes are site-wide|브랜드 키트 변경은 사이트 전체에 반영됩니다/);
    await expect(modal).toContainText(/Brand asset library|브랜드 에셋 라이브러리/);
    await expect(modal).toContainText(/0\/4 brand assets selected|0\/4개 브랜드 에셋 선택됨/);
    await expect(modal.locator('img')).toHaveCount(0);
    await modal.getByRole('button', { name: /Open brand assets|브랜드 에셋 열기/ }).click();
    const assetDialog = page.getByRole('dialog', { name: /Asset library|자산 라이브러리/ });
    await expect(assetDialog).toBeVisible();
    await expect(assetDialog).toContainText(/Folders|폴더/);
    await expect(assetDialog).toContainText(/Brand|브랜드/);
    await assetDialog.getByRole('button', { name: /Close|닫기/ }).click();
    await expect(assetDialog).toHaveCount(0);
    await modal.getByRole('button', { name: /Apply brand kit|브랜드 키트 적용/ }).click();
    await expect(modal).toContainText('현재 사이트 테마에 적용했습니다');

    await modal.getByRole('button', { name: /Typography|타이포그래피/ }).click();
    await expect(modal.locator('[data-font-picker]').first()).toBeVisible();
    await modal.locator('[data-font-picker]').first().getByRole('button').click();
    const fontDialog = page.getByRole('dialog', { name: /Fonts|글꼴/ });
    await expect(fontDialog).toBeVisible();
    await fontDialog.getByPlaceholder(/Search fonts|글꼴 검색/).fill('Noto');
    await expect(fontDialog.getByLabel(/Font preview text|글꼴 미리보기 문구/)).toHaveValue(/Aa/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-font-picker.png` });

    await modal.getByRole('button', { name: /프리셋/ }).click();
    const tokenDownloadPromise = page.waitForEvent('download');
    await modal.getByRole('button', { name: /Export design tokens|디자인 토큰 내보내기/ }).click();
    const tokenDownload = await tokenDownloadPromise;
    expect(tokenDownload.suggestedFilename()).toBe('hojeong-design-tokens.json');
    await expect(modal).toContainText('Design token JSON을 내보냈습니다');
    await modal.locator('[data-design-token-import-input]').setInputFiles({
      name: 'hojeong-design-tokens-import.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({
        schemaVersion: 1,
        theme: {
          colors: { primary: '#0f766e' },
          fonts: { heading: 'Inter', body: 'Noto Sans KR' },
          radii: { sm: 0, md: 2, lg: 4 },
          effects: { radiusPreset: 'sharp', shadowPreset: 'strong' },
          typographyScale: { baseSize: 18, ratio: 1.25 },
        },
      })),
    });
    await expect(modal).toContainText('Design token JSON을 불러와 적용했습니다');
    await modal.getByRole('button', { name: /Advanced|고급/ }).click();
    await expect(modal.locator('input[value="#0f766e"]').first()).toBeVisible();
    await modal.getByRole('button', { name: /프리셋/ }).click();
    await modal.getByRole('button', { name: /Use Soft|Soft 사용/ }).first().click();
    await expect(modal).toContainText(/Soft radius preset applied|둥근 모서리 프리셋을 적용했습니다/);
    await modal.getByRole('button', { name: /Use Strong|Strong 사용/ }).click();
    await expect(modal).toContainText(/Strong shadow preset applied|그림자 프리셋을 적용했습니다/);
    await modal.getByRole('button', { name: /Save as My Theme|내 테마로 저장/ }).click();
    await expect(modal).toContainText('My Theme');
    await expect(modal.locator('[data-custom-theme-preset]').first()).toBeVisible();
    await modal.getByRole('button', { name: /Apply My Theme|내 테마 적용/ }).first().click();
    await expect(modal).toContainText(/preset applied|프리셋을 적용했습니다/);
    await modal.getByRole('button', { name: /Delete|삭제/ }).first().click();
    await expect(modal).toContainText(/My Theme preset deleted|내 테마 프리셋을 삭제했습니다/);
    await expect(modal.getByRole('button', { name: /^Apply$|^적용$/ })).toHaveCount(5);

    await modal.getByRole('button', { name: /Dark mode|다크 모드/ }).click();
    await expect(modal).toContainText(/Light preview|라이트 미리보기/);
    await expect(modal).toContainText(/Dark preview|다크 미리보기/);
    await page.screenshot({ path: `${screenshotDir}/design-pool-site-settings-dark-tab.png` });

    await modal.getByRole('button', { name: /Advanced|고급/ }).click();
    await modal.locator('input[type="text"]').first().fill('not-a-hex');
    await modal.getByRole('button', { name: '저장' }).click();
    await expect(modal).toContainText('#RRGGBB');
    await modal.getByRole('button', { name: 'Close' }).click();
    await expect(page.locator('[data-modal-shell="true"]')).toHaveCount(0);
  });

  test('bulk applies component design presets to button, card, and form nodes', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-component-presets-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Component Presets ${token}`,
          document: makeComponentDesignPresetDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&componentPresets=${token}`);
      await page.locator('[data-builder-rail-item="design"]').click();
      const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '디자이너' }).first();
      await expect(designDrawer).toBeVisible();
      const designerAudit = designDrawer.locator('[data-builder-designer-audit="true"]');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-total', '4');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-buttons', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-cards', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-fields', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-submits', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended', 'studio');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '3');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-change-node-ids',
        `component-card-${token},component-button-${token},component-field-${token}`,
      );
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-matched-node-ids',
        `component-submit-${token}`,
      );
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-change-details',
        [
          `component-card-${token}:card:variant:flat>spotlight`,
          `component-button-${token}:button:style:primary-solid>cta-arrow`,
          `component-field-${token}:field:variant:default>filled`,
        ].join('|'),
      );
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-priority-payload',
        [
          `1:component-card-${token}:card:spotlight`,
          `2:component-button-${token}:button:cta-arrow`,
          `3:component-field-${token}:field:filled`,
        ].join('|'),
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'studio:4:1:3');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=1;cards=1;fields=1;submits=0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-buttons', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-cards', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-fields', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-submits', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'pending');
      await expect(designerAudit).toContainText('추천: 스튜디오 시스템');
      await expect(designerAudit).toContainText('적용 전 미리보기: 3개 변경 예정');
      await expect(designerAudit.locator('[data-builder-designer-audit-breakdown="buttons"]')).toContainText('버튼 변경 1');
      await expect(designerAudit.locator('[data-builder-designer-audit-breakdown="submits"]')).toContainText('제출 변경 0');
      await expect(designerAudit.locator(`[data-builder-designer-audit-change-detail="component-card-${token}"]`)).toContainText('카드 → 스포트라이트 카드');
      await expect(designerAudit.locator(`[data-builder-designer-audit-change-detail="component-button-${token}"]`)).toContainText('버튼 → 화살표 CTA');
      await expect(designerAudit.locator(`[data-builder-designer-audit-priority-item="component-card-${token}"]`)).toContainText('1. 카드 → 스포트라이트 카드');
      await expect(designerAudit.locator(`[data-builder-designer-audit-priority-item="component-button-${token}"]`)).toContainText('CTA 리듬을 다음으로 맞춤');
      const auditBox = await designerAudit.boundingBox();
      const detailBox = await designerAudit.locator(`[data-builder-designer-audit-change-detail="component-button-${token}"]`).boundingBox();
      expect(auditBox?.width ?? 0).toBeGreaterThan(0);
      expect(detailBox?.width ?? 0).toBeLessThanOrEqual((auditBox?.width ?? 0) + 2);
      expect(detailBox?.x ?? 0).toBeGreaterThanOrEqual((auditBox?.x ?? 0) - 2);
      expect((detailBox?.x ?? 0) + (detailBox?.width ?? 0)).toBeLessThanOrEqual(
        (auditBox?.x ?? 0) + (auditBox?.width ?? 0) + 2,
      );
      const recommendedAction = designerAudit.locator('[data-builder-designer-audit-recommended-action="true"]');
      await expect(recommendedAction).toHaveAttribute('data-builder-designer-audit-recommended-action-preset', 'studio');
      await expect(recommendedAction).toBeEnabled();
      await expect(recommendedAction).toContainText('추천 적용: 스튜디오 시스템');
      const studioPreset = designDrawer.locator('[data-builder-designer-preset="studio"]');
      await expect(studioPreset).toContainText('스튜디오 시스템');
      await expect(studioPreset).toHaveAttribute('data-builder-designer-preset-finish', 'studio spotlight');
      await expect(studioPreset).toHaveAttribute('data-builder-designer-preset-rhythm', 'hero-card-cta');
      await expect(studioPreset).toHaveAttribute('data-builder-designer-preset-accent', 'arrow CTA');
      await recommendedAction.click();
      await expect.poll(async () => {
        if (!pageId) return 'missing';
        const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
          headers: mutationHeaders(slug),
        });
        if (draftResponse.status() !== 200) return 'missing';
        const draftPayload = (await draftResponse.json()) as {
          document?: {
            nodes?: Array<{ id?: string; content?: { style?: string; variant?: string } }>;
          };
        };
        const nodes = draftPayload.document?.nodes ?? [];
        const buttonStyle = nodes.find((node) => node.id === `component-button-${token}`)?.content?.style;
        const cardVariant = nodes.find((node) => node.id === `component-card-${token}`)?.content?.variant;
        const fieldVariant = nodes.find((node) => node.id === `component-field-${token}`)?.content?.variant;
        const submitStyle = nodes.find((node) => node.id === `component-submit-${token}`)?.content?.style;
        return `${buttonStyle}:${cardVariant}:${fieldVariant}:${submitStyle}`;
      }, { timeout: 20_000 }).toBe('cta-arrow:spotlight:filled:primary');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '4');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-node-ids', '');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-details', '');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-priority-payload', '');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-matched-node-ids',
        `component-card-${token},component-button-${token},component-field-${token},component-submit-${token}`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'studio:4:4:0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=0;cards=0;fields=0;submits=0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-buttons', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-cards', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-fields', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-submits', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'synced');
      await expect(designerAudit).toContainText('추천 시스템과 모두 일치');
      await expect(recommendedAction).toBeDisabled();
      await expect(recommendedAction).toContainText('추천 시스템이 적용됨');

      const modal = await openSiteSettings(page);
      await modal.getByRole('button', { name: /프리셋/ }).click();
      await expect(modal).toContainText('컴포넌트 디자인 프리셋');
      await expect(modal.locator('[data-component-design-preset="editorial"]')).toContainText('카드: editorial');
      await expect(modal.locator('[data-component-design-preset="studio"]')).toContainText('마감: 스튜디오 강조');
      await expect(modal.locator('[data-component-design-preset="studio"]')).toHaveAttribute('data-component-design-preset-rhythm', 'hero-card-cta');
      await modal.getByRole('button', { name: '에디토리얼 시스템 프리셋 적용' }).click();
      await expect(modal).toContainText('에디토리얼 시스템 프리셋을 4개 컴포넌트에 적용했습니다');

      await expect.poll(async () => {
        if (!pageId) return 'missing';
        const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
          headers: mutationHeaders(slug),
        });
        if (draftResponse.status() !== 200) return 'missing';
        const draftPayload = (await draftResponse.json()) as {
          document?: {
            nodes?: Array<{ id?: string; content?: { style?: string; variant?: string } }>;
          };
        };
        const nodes = draftPayload.document?.nodes ?? [];
        const buttonStyle = nodes.find((node) => node.id === `component-button-${token}`)?.content?.style;
        const cardVariant = nodes.find((node) => node.id === `component-card-${token}`)?.content?.variant;
        const fieldVariant = nodes.find((node) => node.id === `component-field-${token}`)?.content?.variant;
        const submitStyle = nodes.find((node) => node.id === `component-submit-${token}`)?.content?.style;
        return `${buttonStyle}:${cardVariant}:${fieldVariant}:${submitStyle}`;
      }, { timeout: 20_000 }).toBe('primary-link:editorial:underline:outline');
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('shows an empty designer audit on pages without component targets', async ({ page }) => {
    test.setTimeout(60_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-empty-audit-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Empty Audit ${token}`,
          document: makeEmptyComponentAuditDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&emptyAudit=${token}`);
      await page.locator('[data-builder-rail-item="design"]').click();
      const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '디자이너' }).first();
      await expect(designDrawer).toBeVisible();
      const designerAudit = designDrawer.locator('[data-builder-designer-audit="true"]');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-total', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-buttons', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-cards', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-fields', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-submits', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended', 'classic');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'empty');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-node-ids', '');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched-node-ids', '');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-details', '');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'classic:0:0:0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=0;cards=0;fields=0;submits=0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-score', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-state', 'empty');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-payload', 'classic:0:empty');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-signals', 'no-targets');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-system-fit-payload',
        'classic:0:0:0:empty|soft:0:0:0:empty|editorial:0:0:0:empty|conversion:0:0:0:empty|studio:0:0:0:empty',
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader', 'classic');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-score', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-payload', 'classic:0:0:0:empty');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-is-fit-leader', 'true');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-change-delta', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-decision-payload', 'classic:classic:0:0:0');
      await expect(designerAudit).toContainText('추천: 기본형 시스템');
      await expect(designerAudit).toContainText('적용 전 미리보기: 변경 대상 없음');
      await expect(designerAudit.locator('[data-builder-designer-audit-quality="true"]')).toContainText('컴포넌트 대상 없음');
      await expect(designerAudit.locator('[data-builder-designer-audit-fit-leader-card="true"]')).toContainText('기본형 시스템');
      await expect(designerAudit.locator('[data-builder-designer-audit-change-detail]')).toHaveCount(0);
      const recommendedAction = designerAudit.locator('[data-builder-designer-audit-recommended-action="true"]');
      await expect(recommendedAction).toHaveAttribute('data-builder-designer-audit-recommended-action-preset', 'classic');
      await expect(recommendedAction).toBeDisabled();
      await expect(recommendedAction).toContainText('컴포넌트 대상 없음');
      await expect(designerAudit.locator('[data-builder-designer-audit-fit-leader-action="true"]')).toHaveCount(0);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('applies the form-only designer audit recommendation', async ({ page }) => {
    test.setTimeout(60_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-form-audit-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Form Audit ${token}`,
          document: makeFormOnlyComponentAuditDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&formAudit=${token}`);
      await page.locator('[data-builder-rail-item="design"]').click();
      const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '디자이너' }).first();
      await expect(designDrawer).toBeVisible();
      const designerAudit = designDrawer.locator('[data-builder-designer-audit="true"]');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-total', '2');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-buttons', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-cards', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-fields', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-submits', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended', 'conversion');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'pending');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '2');
      await expect(
        designerAudit,
      ).toHaveAttribute(
        'data-builder-designer-audit-change-node-ids',
        `form-only-field-${token},form-only-submit-${token}`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched-node-ids', '');
      await expect(
        designerAudit,
      ).toHaveAttribute(
        'data-builder-designer-audit-change-details',
        [
          `form-only-field-${token}:field:variant:default>filled`,
          `form-only-submit-${token}:submit:style:ghost>primary`,
        ].join('|'),
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'conversion:2:0:2');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=0;cards=0;fields=1;submits=1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-score', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-state', 'needs-apply');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-payload', 'conversion:0:needs-apply');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-signals', 'preset:conversion|change:field:1|change:submit:1');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-system-fit-payload',
        'classic:50:1:1:partial|soft:0:0:2:needs-apply|editorial:0:0:2:needs-apply|conversion:0:0:2:needs-apply|studio:0:0:2:needs-apply',
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader', 'classic');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-score', '50');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-changes', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-payload', 'classic:50:1:1:partial');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-is-fit-leader', 'false');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-change-delta', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-decision-payload', 'conversion:classic:2:1:1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-buttons', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-cards', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-fields', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-submits', '1');
      await expect(designerAudit).toContainText('추천: 전환형 시스템');
      await expect(designerAudit).toContainText('적용 전 미리보기: 2개 변경 예정');
      await expect(designerAudit.locator('[data-builder-designer-audit-quality="true"]')).toContainText('시스템 업데이트 필요');
      await expect(designerAudit.locator('[data-builder-designer-audit-quality-signal="change:field:1"]')).toHaveCount(1);
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="classic"]')).toContainText('기본형 시스템 50%');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="conversion"]')).toHaveAttribute('data-builder-designer-audit-system-fit-state', 'needs-apply');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="classic"]')).toHaveAttribute('data-builder-designer-audit-system-fit-leader', 'true');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="classic"]')).toHaveAttribute('data-builder-designer-audit-system-fit-recommended', 'false');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="classic"]')).toContainText('최근접');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="conversion"]')).toHaveAttribute('data-builder-designer-audit-system-fit-recommended', 'true');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="conversion"]')).toHaveAttribute('data-builder-designer-audit-system-fit-leader', 'false');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="conversion"]')).toContainText('추천');
      await expect(designerAudit.locator('[data-builder-designer-audit-fit-leader-card="true"]')).toContainText('기본형 시스템');
      await expect(designerAudit.locator('[data-builder-designer-audit-fit-leader-card="true"]')).toContainText('의도 중심');
      await expect(designerAudit.locator('[data-builder-designer-audit-fit-leader-card="true"]')).toContainText('+1개 변경 차이');
      const auditBox = await designerAudit.boundingBox();
      const systemFitBox = await designerAudit.locator('[data-builder-designer-audit-system-fit="classic"]').boundingBox();
      const fitLeaderBox = await designerAudit.locator('[data-builder-designer-audit-fit-leader-card="true"]').boundingBox();
      expect(auditBox?.width ?? 0).toBeGreaterThan(0);
      expect(systemFitBox?.width ?? 0).toBeLessThanOrEqual((auditBox?.width ?? 0) + 2);
      expect(fitLeaderBox?.width ?? 0).toBeLessThanOrEqual((auditBox?.width ?? 0) + 2);
      expect(systemFitBox?.x ?? 0).toBeGreaterThanOrEqual((auditBox?.x ?? 0) - 2);
      expect(fitLeaderBox?.x ?? 0).toBeGreaterThanOrEqual((auditBox?.x ?? 0) - 2);
      expect((systemFitBox?.x ?? 0) + (systemFitBox?.width ?? 0)).toBeLessThanOrEqual(
        (auditBox?.x ?? 0) + (auditBox?.width ?? 0) + 2,
      );
      expect((fitLeaderBox?.x ?? 0) + (fitLeaderBox?.width ?? 0)).toBeLessThanOrEqual(
        (auditBox?.x ?? 0) + (auditBox?.width ?? 0) + 2,
      );
      await expect(designerAudit.locator('[data-builder-designer-audit-breakdown="fields"]')).toContainText('필드 변경 1');
      await expect(designerAudit.locator('[data-builder-designer-audit-breakdown="submits"]')).toContainText('제출 변경 1');
      await expect(designerAudit.locator(`[data-builder-designer-audit-change-detail="form-only-field-${token}"]`)).toContainText('필드 → 채운 필드');
      await expect(designerAudit.locator(`[data-builder-designer-audit-change-detail="form-only-submit-${token}"]`)).toContainText('제출 버튼 → 기본 제출');
      const recommendedAction = designerAudit.locator('[data-builder-designer-audit-recommended-action="true"]');
      await expect(recommendedAction).toHaveAttribute('data-builder-designer-audit-recommended-action-preset', 'conversion');
      await expect(recommendedAction).toBeEnabled();
      await expect(recommendedAction).toContainText('추천 적용: 전환형 시스템');

      await recommendedAction.click();
      await expect.poll(async () => {
        if (!pageId) return 'missing';
        const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
          headers: mutationHeaders(slug),
        });
        if (draftResponse.status() !== 200) return 'missing';
        const draftPayload = (await draftResponse.json()) as {
          document?: {
            nodes?: Array<{ id?: string; content?: { style?: string; variant?: string } }>;
          };
        };
        const nodes = draftPayload.document?.nodes ?? [];
        const fieldVariant = nodes.find((node) => node.id === `form-only-field-${token}`)?.content?.variant;
        const submitStyle = nodes.find((node) => node.id === `form-only-submit-${token}`)?.content?.style;
        return `${fieldVariant}:${submitStyle}`;
      }, { timeout: 20_000 }).toBe('filled:primary');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '2');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-node-ids', '');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-details', '');
      await expect(
        designerAudit,
      ).toHaveAttribute(
        'data-builder-designer-audit-matched-node-ids',
        `form-only-field-${token},form-only-submit-${token}`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'conversion:2:2:0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=0;cards=0;fields=0;submits=0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-score', '100');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-state', 'synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-payload', 'conversion:100:synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-signals', 'preset:conversion|all-components-match');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-system-fit-payload',
        'classic:50:1:1:partial|soft:50:1:1:partial|editorial:0:0:2:needs-apply|conversion:100:2:0:synced|studio:100:2:0:synced',
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader', 'conversion');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-score', '100');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-payload', 'conversion:100:2:0:synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-is-fit-leader', 'true');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-change-delta', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-decision-payload', 'conversion:conversion:0:0:0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'synced');
      await expect(designerAudit).toContainText('추천 시스템과 모두 일치');
      await expect(designerAudit.locator('[data-builder-designer-audit-quality="true"]')).toContainText('모든 대상이 정렬됨');
      await expect(designerAudit.locator('[data-builder-designer-audit-fit-leader-card="true"]')).toContainText('전환형 시스템');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="conversion"]')).toHaveAttribute('data-builder-designer-audit-system-fit-recommended', 'true');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="conversion"]')).toHaveAttribute('data-builder-designer-audit-system-fit-leader', 'true');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="conversion"]')).toContainText('추천');
      await expect(designerAudit.locator('[data-builder-designer-audit-system-fit="conversion"]')).toContainText('최근접');
      await expect(recommendedAction).toBeDisabled();
      await expect(recommendedAction).toContainText('추천 시스템이 적용됨');
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('applies the card-only designer audit recommendation', async ({ page }) => {
    test.setTimeout(60_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-card-audit-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Card Audit ${token}`,
          document: makeCardOnlyComponentAuditDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&cardAudit=${token}`);
      await page.locator('[data-builder-rail-item="design"]').click();
      const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '디자이너' }).first();
      await expect(designDrawer).toBeVisible();
      const designerAudit = designDrawer.locator('[data-builder-designer-audit="true"]');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-total', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-buttons', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-cards', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-fields', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-submits', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended', 'editorial');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'pending');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '1');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-change-node-ids',
        `card-only-card-${token}`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched-node-ids', '');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-change-details',
        `card-only-card-${token}:card:variant:flat>editorial`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'editorial:1:0:1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=0;cards=1;fields=0;submits=0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-buttons', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-cards', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-fields', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-submits', '0');
      await expect(designerAudit).toContainText('추천: 에디토리얼 시스템');
      await expect(designerAudit).toContainText('적용 전 미리보기: 1개 변경 예정');
      await expect(designerAudit.locator('[data-builder-designer-audit-breakdown="cards"]')).toContainText('카드 변경 1');
      await expect(designerAudit.locator(`[data-builder-designer-audit-change-detail="card-only-card-${token}"]`)).toContainText('카드 → 에디토리얼 카드');
      const recommendedAction = designerAudit.locator('[data-builder-designer-audit-recommended-action="true"]');
      await expect(recommendedAction).toHaveAttribute('data-builder-designer-audit-recommended-action-preset', 'editorial');
      await expect(recommendedAction).toBeEnabled();
      await expect(recommendedAction).toContainText('추천 적용: 에디토리얼 시스템');

      await recommendedAction.click();
      await expect.poll(async () => {
        if (!pageId) return 'missing';
        const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
          headers: mutationHeaders(slug),
        });
        if (draftResponse.status() !== 200) return 'missing';
        const draftPayload = (await draftResponse.json()) as {
          document?: {
            nodes?: Array<{ id?: string; content?: { variant?: string } }>;
          };
        };
        const nodes = draftPayload.document?.nodes ?? [];
        return nodes.find((node) => node.id === `card-only-card-${token}`)?.content?.variant ?? 'missing';
      }, { timeout: 20_000 }).toBe('editorial');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-node-ids', '');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-details', '');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-matched-node-ids',
        `card-only-card-${token}`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'editorial:1:1:0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=0;cards=0;fields=0;submits=0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'synced');
      await expect(designerAudit).toContainText('추천 시스템과 모두 일치');
      await expect(recommendedAction).toBeDisabled();
      await expect(recommendedAction).toContainText('추천 시스템이 적용됨');
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('applies the current-fit leader from the designer audit', async ({ page }) => {
    test.setTimeout(60_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-fit-leader-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Fit Leader ${token}`,
          document: makeFormOnlyComponentAuditDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&fitLeader=${token}`);
      await page.locator('[data-builder-rail-item="design"]').click();
      const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '디자이너' }).first();
      await expect(designDrawer).toBeVisible();
      const designerAudit = designDrawer.locator('[data-builder-designer-audit="true"]');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended', 'conversion');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader', 'classic');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-is-fit-leader', 'false');
      const fitLeaderAction = designerAudit.locator('[data-builder-designer-audit-fit-leader-action="true"]');
      await expect(fitLeaderAction).toHaveAttribute('data-builder-designer-audit-fit-leader-action-preset', 'classic');
      await expect(fitLeaderAction).toBeEnabled();
      await expect(fitLeaderAction).toContainText('현재 최근접 적용: 기본형 시스템');
      const recommendedAction = designerAudit.locator('[data-builder-designer-audit-recommended-action="true"]');
      await expect(recommendedAction).toBeEnabled();
      const auditBoxBeforeAction = await designerAudit.boundingBox();
      const fitLeaderActionBox = await fitLeaderAction.boundingBox();
      const recommendedActionBox = await recommendedAction.boundingBox();
      expect(auditBoxBeforeAction?.width ?? 0).toBeGreaterThan(0);
      expect(fitLeaderActionBox?.width ?? 0).toBeLessThanOrEqual((auditBoxBeforeAction?.width ?? 0) + 2);
      expect(recommendedActionBox?.width ?? 0).toBeLessThanOrEqual((auditBoxBeforeAction?.width ?? 0) + 2);
      expect(fitLeaderActionBox?.x ?? 0).toBeGreaterThanOrEqual((auditBoxBeforeAction?.x ?? 0) - 2);
      expect(recommendedActionBox?.x ?? 0).toBeGreaterThanOrEqual((auditBoxBeforeAction?.x ?? 0) - 2);
      expect((fitLeaderActionBox?.x ?? 0) + (fitLeaderActionBox?.width ?? 0)).toBeLessThanOrEqual(
        (auditBoxBeforeAction?.x ?? 0) + (auditBoxBeforeAction?.width ?? 0) + 2,
      );
      expect((recommendedActionBox?.x ?? 0) + (recommendedActionBox?.width ?? 0)).toBeLessThanOrEqual(
        (auditBoxBeforeAction?.x ?? 0) + (auditBoxBeforeAction?.width ?? 0) + 2,
      );

      await fitLeaderAction.click();
      await expect.poll(async () => {
        if (!pageId) return 'missing';
        const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
          headers: mutationHeaders(slug),
        });
        if (draftResponse.status() !== 200) return 'missing';
        const draftPayload = (await draftResponse.json()) as {
          document?: {
            nodes?: Array<{ id?: string; content?: { style?: string; variant?: string } }>;
          };
        };
        const nodes = draftPayload.document?.nodes ?? [];
        const fieldVariant = nodes.find((node) => node.id === `form-only-field-${token}`)?.content?.variant;
        const submitStyle = nodes.find((node) => node.id === `form-only-submit-${token}`)?.content?.style;
        return `${fieldVariant}:${submitStyle}`;
      }, { timeout: 20_000 }).toBe('default:primary');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended', 'conversion');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-score', '50');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-state', 'partial');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-payload', 'conversion:50:partial');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-system-fit-payload',
        'classic:100:2:0:synced|soft:0:0:2:needs-apply|editorial:0:0:2:needs-apply|conversion:50:1:1:partial|studio:50:1:1:partial',
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader', 'classic');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-score', '100');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-payload', 'classic:100:2:0:synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-is-fit-leader', 'false');
      await expect(fitLeaderAction).toBeDisabled();
      await expect(fitLeaderAction).toContainText('현재 최근접 시스템이 적용됨');
      await expect(recommendedAction).toBeEnabled();
      await expect(recommendedAction).toContainText('추천 적용: 전환형 시스템');

      await recommendedAction.click();
      await expect.poll(async () => {
        if (!pageId) return 'missing';
        const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
          headers: mutationHeaders(slug),
        });
        if (draftResponse.status() !== 200) return 'missing';
        const draftPayload = (await draftResponse.json()) as {
          document?: {
            nodes?: Array<{ id?: string; content?: { style?: string; variant?: string } }>;
          };
        };
        const nodes = draftPayload.document?.nodes ?? [];
        const fieldVariant = nodes.find((node) => node.id === `form-only-field-${token}`)?.content?.variant;
        const submitStyle = nodes.find((node) => node.id === `form-only-submit-${token}`)?.content?.style;
        return `${fieldVariant}:${submitStyle}`;
      }, { timeout: 20_000 }).toBe('filled:primary');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '2');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-score', '100');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-state', 'synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-payload', 'conversion:100:synced');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-system-fit-payload',
        'classic:50:1:1:partial|soft:50:1:1:partial|editorial:0:0:2:needs-apply|conversion:100:2:0:synced|studio:100:2:0:synced',
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader', 'conversion');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-payload', 'conversion:100:2:0:synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-is-fit-leader', 'true');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-change-delta', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-decision-payload', 'conversion:conversion:0:0:0');
      await expect(recommendedAction).toBeDisabled();
      await expect(recommendedAction).toContainText('추천 시스템이 적용됨');
      await expect(designerAudit.locator('[data-builder-designer-audit-fit-leader-action="true"]')).toHaveCount(0);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('applies the button-only designer audit recommendation', async ({ page }) => {
    test.setTimeout(60_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-button-audit-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Button Audit ${token}`,
          document: makeButtonOnlyComponentAuditDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&buttonAudit=${token}`);
      await page.locator('[data-builder-rail-item="design"]').click();
      const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '디자이너' }).first();
      await expect(designDrawer).toBeVisible();
      const designerAudit = designDrawer.locator('[data-builder-designer-audit="true"]');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-total', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-buttons', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-cards', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-fields', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-submits', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended', 'classic');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'pending');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '1');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-change-node-ids',
        `button-only-button-${token}`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched-node-ids', '');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-change-details',
        `button-only-button-${token}:button:style:primary-ghost>primary-solid`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'classic:1:0:1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=1;cards=0;fields=0;submits=0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-buttons', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-cards', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-fields', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-form-submits', '0');
      await expect(designerAudit).toContainText('추천: 기본형 시스템');
      await expect(designerAudit).toContainText('적용 전 미리보기: 1개 변경 예정');
      await expect(designerAudit.locator('[data-builder-designer-audit-breakdown="buttons"]')).toContainText('버튼 변경 1');
      await expect(designerAudit.locator(`[data-builder-designer-audit-change-detail="button-only-button-${token}"]`)).toContainText('버튼 → 기본 솔리드');
      const recommendedAction = designerAudit.locator('[data-builder-designer-audit-recommended-action="true"]');
      await expect(recommendedAction).toHaveAttribute('data-builder-designer-audit-recommended-action-preset', 'classic');
      await expect(recommendedAction).toBeEnabled();
      await expect(recommendedAction).toContainText('추천 적용: 기본형 시스템');

      await recommendedAction.click();
      await expect.poll(async () => {
        if (!pageId) return 'missing';
        const draftResponse = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
          headers: mutationHeaders(slug),
        });
        if (draftResponse.status() !== 200) return 'missing';
        const draftPayload = (await draftResponse.json()) as {
          document?: {
            nodes?: Array<{ id?: string; content?: { style?: string } }>;
          };
        };
        const nodes = draftPayload.document?.nodes ?? [];
        return nodes.find((node) => node.id === `button-only-button-${token}`)?.content?.style ?? 'missing';
      }, { timeout: 20_000 }).toBe('primary-solid');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-node-ids', '');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-details', '');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-matched-node-ids',
        `button-only-button-${token}`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'classic:1:1:0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=0;cards=0;fields=0;submits=0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'synced');
      await expect(designerAudit).toContainText('추천 시스템과 모두 일치');
      await expect(recommendedAction).toBeDisabled();
      await expect(recommendedAction).toContainText('추천 시스템이 적용됨');
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('shows a synced designer audit for already matching form pages', async ({ page }) => {
    test.setTimeout(60_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-synced-form-audit-${token}`;
    let pageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(slug));

    try {
      const createResponse = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug,
          title: `G Editor Synced Form Audit ${token}`,
          document: makeSyncedFormOnlyComponentAuditDocument(token),
        },
      });
      expect(createResponse.status()).toBe(200);
      const created = (await createResponse.json()) as { success?: boolean; pageId?: string; error?: string };
      expect(created.success, created.error).toBe(true);
      expect(created.pageId).toBeTruthy();
      pageId = created.pageId!;

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&syncedFormAudit=${token}`);
      await page.locator('[data-builder-rail-item="design"]').click();
      const designDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '디자이너' }).first();
      await expect(designDrawer).toBeVisible();
      const designerAudit = designDrawer.locator('[data-builder-designer-audit="true"]');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-total', '2');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-buttons', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-cards', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-fields', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-form-submits', '1');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended', 'conversion');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-state', 'synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-matched', '2');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-node-ids', '');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-matched-node-ids',
        `form-only-field-${token},form-only-submit-${token}`,
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-details', '');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-preview-payload', 'conversion:2:2:0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-change-breakdown', 'buttons=0;cards=0;fields=0;submits=0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-score', '100');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-state', 'synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-payload', 'conversion:100:synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-quality-signals', 'preset:conversion|all-components-match');
      await expect(designerAudit).toHaveAttribute(
        'data-builder-designer-audit-system-fit-payload',
        'classic:50:1:1:partial|soft:50:1:1:partial|editorial:0:0:2:needs-apply|conversion:100:2:0:synced|studio:100:2:0:synced',
      );
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader', 'conversion');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-score', '100');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-changes', '0');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-fit-leader-payload', 'conversion:100:2:0:synced');
      await expect(designerAudit).toHaveAttribute('data-builder-designer-audit-recommended-is-fit-leader', 'true');
      await expect(designerAudit).toContainText('추천: 전환형 시스템');
      await expect(designerAudit).toContainText('추천 시스템과 모두 일치');
      await expect(designerAudit.locator('[data-builder-designer-audit-quality="true"]')).toContainText('모든 대상이 정렬됨');
      await expect(designerAudit.locator('[data-builder-designer-audit-fit-leader-card="true"]')).toContainText('전환형 시스템');
      await expect(designerAudit.locator('[data-builder-designer-audit-change-detail]')).toHaveCount(0);
      const recommendedAction = designerAudit.locator('[data-builder-designer-audit-recommended-action="true"]');
      await expect(recommendedAction).toHaveAttribute('data-builder-designer-audit-recommended-action-preset', 'conversion');
      await expect(recommendedAction).toBeDisabled();
      await expect(recommendedAction).toContainText('추천 시스템이 적용됨');
      await expect(designerAudit.locator('[data-builder-designer-audit-fit-leader-action="true"]')).toHaveCount(0);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
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
      await modal.getByPlaceholder(/주소/).fill(address);
      await modal.getByPlaceholder('https://example.com/logo.png').fill(logoUrl);
      await modal.getByPlaceholder('https://example.com/favicon.ico').fill(faviconUrl);

      await modal.getByRole('button', { name: /Typography|타이포그래피/ }).click();
      await modal.locator('[data-font-picker]').nth(1).getByRole('button').click();
      const fontDialog = page.getByRole('dialog', { name: /Fonts|글꼴/ });
      await expect(fontDialog).toBeVisible();
      await fontDialog.getByPlaceholder(/Search fonts|글꼴 검색/).fill('monospace');
      await fontDialog.getByRole('button', { name: /monospace/i }).first().click();
      await expect(fontDialog).toHaveCount(0);

      await modal.getByRole('button', { name: /Advanced|고급/ }).click();
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
      await modal.getByRole('button', { name: /General|일반/ }).click();
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
      const moveDirection = resolvedTargetIndex > 0 ? 'up' : 'down';
      const expectedMovedIndex = moveDirection === 'up' ? resolvedTargetIndex - 1 : resolvedTargetIndex + 1;
      const neighborItem = originalNavigation[expectedMovedIndex];
      expect(neighborItem?.id).toBeTruthy();
      const neighborLabel = typeof neighborItem!.label === 'string'
        ? neighborItem!.label
        : neighborItem!.label.ko || neighborItem!.label.en || neighborItem!.label['zh-hant'] || '';
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
      await page.locator('[data-builder-rail-item="nav"]').click();
      const navDrawer = page.locator('[aria-hidden="false"]').first();
      await expect(navDrawer.locator('[data-builder-navigation-editor="true"]')).toBeVisible();

      await navDrawer
        .locator(`[data-builder-nav-item-row="${targetItem!.id}"]`)
        .getByTitle('편집')
        .click();
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

      const moveResponsePromise = page.waitForResponse((response) => (
        response.url().includes('/api/builder/site/navigation')
        && response.request().method() === 'PUT'
      ));
      await navDrawer
        .locator(`[data-builder-nav-item-row="${targetItem!.id}"]`)
        .getByTitle(moveDirection === 'up' ? '위로' : '아래로')
        .click();
      expect((await moveResponsePromise).status()).toBe(200);
      await expect(navDrawer.getByText('저장 중...')).toHaveCount(0);

      const navAfterMoveResponse = await page.request.get('/api/builder/site/navigation?locale=ko');
      expect(navAfterMoveResponse.status()).toBe(200);
      const navAfterMovePayload = (await navAfterMoveResponse.json()) as {
        navigation?: Array<{ id: string }>;
      };
      const movedIds = navAfterMovePayload.navigation?.map((item) => item.id) ?? [];
      expect(movedIds.indexOf(targetItem!.id)).toBe(expectedMovedIndex);
      expect(movedIds.indexOf(neighborItem!.id)).toBe(resolvedTargetIndex);
      const editorHeaderIds = await page.locator('.builder-site-header .nav-list [data-builder-nav-item-id]').evaluateAll((elements) => (
        elements
          .map((element) => element.getAttribute('data-builder-nav-item-id'))
          .filter((id): id is string => Boolean(id))
      ));
      const targetHeaderIndex = editorHeaderIds.indexOf(targetItem!.id);
      const neighborHeaderIndex = editorHeaderIds.indexOf(neighborItem!.id);
      expect(targetHeaderIndex).toBeGreaterThanOrEqual(0);
      expect(neighborHeaderIndex).toBeGreaterThanOrEqual(0);
      if (moveDirection === 'up') {
        expect(targetHeaderIndex).toBeLessThan(neighborHeaderIndex);
      } else {
        expect(targetHeaderIndex).toBeGreaterThan(neighborHeaderIndex);
      }

      if (servicesIndex >= 0) {
        const addChildResponsePromise = page.waitForResponse((response) => (
          response.url().includes('/api/builder/site/navigation')
          && response.request().method() === 'PUT'
        ));
        await navDrawer
          .locator(`[data-builder-nav-item-row="${originalNavigation[servicesIndex]!.id}"]`)
          .getByTitle('하위 메뉴 추가')
          .click();
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
        if (await servicesLink.isVisible().catch(() => false)) {
          await servicesLink.hover();
          await expect(page.locator('.builder-site-header .mega-panel.active').first()).toContainText(childLabel);
        }

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

      const publicHtmlResponse = await page.request.get(`/ko/${slug}`);
      expect(publicHtmlResponse.status()).toBe(200);
      const publicHtml = await publicHtmlResponse.text();
      expect(publicHtml).toContain(navLabel);
      expect(publicHtml).toContain(`href="${navHref}"`);
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
      await page.locator('[class*="iconRail"]').getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      await page.getByRole('button', { name: /\+ New|\+ 새 페이지/ }).click();

      const gallery = page.locator('[data-modal-shell="true"][data-modal-nested="false"]').last();
      await expect(gallery).toBeVisible();
      await gallery.getByRole('button', { name: /빈 페이지/ }).click();

      await page.getByPlaceholder(/예: about, services/).fill(slug);
      await page.getByRole('button', { name: '생성' }).click();
      await expect(page.getByText(/Loaded page:/).last()).toBeVisible({ timeout: 20_000 });

      const canvas = page.getByRole('application', { name: 'Canvas editor' });
      await expect(canvas.getByText('페이지가 비어있습니다.')).toBeVisible();
      await expect(canvas.getByText('좌측 + 패널에서 텍스트, 이미지, 섹션을 추가하세요.')).toBeVisible();
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
      const createdPageId = created.pageId;
      if (!createdPageId) {
        throw new Error('Expected created page id for page sync regression.');
      }
      pageId = createdPageId;

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
        errorCode?: string;
        pageId?: string;
        success?: boolean;
      };
      expect(duplicatePayload).toMatchObject({
        success: false,
        errorCode: 'duplicate_slug',
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

  test('shows duplicate slug validation while renaming a page in the Pages panel', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const sourceSlug = `pw-rename-source-${token}`;
    const targetSlug = `pw-rename-target-${token}`;
    const sourceTitle = `Rename source ${token}`;
    const targetTitle = `Rename target ${token}`;
    let sourcePageId: string | null = null;
    let targetPageId: string | null = null;
    await page.setExtraHTTPHeaders(mutationHeaders(targetSlug));

    try {
      const sourceCreate = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug: sourceSlug,
          title: sourceTitle,
          blank: true,
        },
        headers: mutationHeaders(sourceSlug),
      });
      expect(sourceCreate.status()).toBe(200);
      sourcePageId = ((await sourceCreate.json()) as { pageId?: string }).pageId ?? null;
      expect(sourcePageId).toBeTruthy();

      const targetCreate = await page.request.post('/api/builder/site/pages', {
        data: {
          locale: 'ko',
          slug: targetSlug,
          title: targetTitle,
          blank: true,
        },
        headers: mutationHeaders(targetSlug),
      });
      expect(targetCreate.status()).toBe(200);
      targetPageId = ((await targetCreate.json()) as { pageId?: string }).pageId ?? null;
      expect(targetPageId).toBeTruthy();

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(targetPageId!)}`);
      await page.locator('[class*="iconRail"]').getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
      const targetRow = pagesDrawer.locator(`[data-builder-page-row="${targetPageId}"]`).first();
      await targetRow.scrollIntoViewIfNeeded();
      await expect(targetRow).toBeVisible();

      await targetRow.hover();
      await targetRow.getByRole('button', { name: '페이지 메뉴' }).click();
      await pagesDrawer.getByRole('button', { name: '이름 변경' }).click();
      await targetRow.getByLabel('페이지 이름').fill(`Duplicate rename ${token}`);
      await targetRow.getByLabel('페이지 slug').fill(sourceSlug);

      const renameResponsePromise = page.waitForResponse((response) => (
        response.url().includes(`/api/builder/site/pages/${targetPageId}`)
        && response.request().method() === 'PATCH'
      ));
      await targetRow.getByLabel('페이지 slug').press('Enter');
      const renameResponse = await renameResponsePromise;
      expect(renameResponse.status()).toBe(400);

      await expect(pagesDrawer.getByRole('status')).toContainText(/같은 (?:locale|로케일) 안에 동일한 (?:slug|슬러그)/);
      await expect(targetRow).toHaveAttribute('data-builder-page-slug', targetSlug);
      await expect.poll(async () => findPageIdBySlug(page, targetSlug), { timeout: 20_000 }).toBe(targetPageId);
      await expect.poll(async () => findPageIdBySlug(page, sourceSlug), { timeout: 20_000 }).toBe(sourcePageId);
    } finally {
      targetPageId ??= await findPageIdBySlug(page, targetSlug);
      sourcePageId ??= await findPageIdBySlug(page, sourceSlug);
      if (targetPageId) {
        await page.request.delete(`/api/builder/site/pages/${targetPageId}?locale=ko`, {
          headers: mutationHeaders(targetSlug),
          failOnStatusCode: false,
        });
      }
      if (sourcePageId) {
        await page.request.delete(`/api/builder/site/pages/${sourcePageId}?locale=ko`, {
          headers: mutationHeaders(sourceSlug),
          failOnStatusCode: false,
        });
      }
      await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 }).catch(() => undefined);
    }
  });

  test('keeps active page slug and nested navigation in sync after rename and delete', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `pw-page-sync-${token}`;
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
      const syncPageId = created.pageId;
      if (!syncPageId) {
        throw new Error('Expected created page id for page sync regression.');
      }
      pageId = syncPageId;

      const originalNavResponse = await page.request.get('/api/builder/site/navigation?locale=ko', {
        headers: mutationHeaders(slug),
      });
      expect(originalNavResponse.status()).toBe(200);
      const originalNavPayload = (await originalNavResponse.json()) as { navigation?: TestNavigationItem[] };
      originalNavigation = originalNavPayload.navigation ?? [];
      expect(originalNavigation.length).toBeGreaterThan(0);

      const fallbackParent = originalNavigation[0];
      if (!fallbackParent) {
        throw new Error('Expected at least one navigation item for page sync regression.');
      }
      const parentId = originalNavigation.find((item) => item.id === 'nav-services')?.id ?? fallbackParent.id;
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
      await page.locator('[class*="iconRail"]').getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      let pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
      await expect(pagesDrawer.getByText(/Pages|페이지/).first()).toBeVisible();

      let initialRow = pagesDrawer.locator(`[data-builder-page-row="${pageId}"]`).first();
      await expect(initialRow).toBeVisible();
      await initialRow.getByRole('button').filter({ hasText: title }).click();
      const pageDropdown = page.locator('[class*="pageDropdownButton"]').first();
      await expect(pageDropdown).toContainText(`/${slug}`);

      await page.locator('[class*="iconRail"]').getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
      await expect(pagesDrawer.getByText(/Pages|페이지/).first()).toBeVisible();
      initialRow = pagesDrawer.locator(`[data-builder-page-row="${pageId}"]`).first();
      await expect(initialRow).toBeVisible();
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

    await page.locator('[class*="iconRail"]').getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    await page.getByRole('button', { name: /\+ New|\+ 새 페이지/ }).click();

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
    await nested.getByRole('button', { name: /tablet|태블릿/i }).click();
    await nested.getByRole('button', { name: /mobile|모바일/i }).click();
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
