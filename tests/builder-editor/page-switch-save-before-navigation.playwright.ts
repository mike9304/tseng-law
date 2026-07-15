import { expect, test, type APIRequestContext, type Locator, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';

type DraftPayload = {
  readonly document?: BuilderCanvasDocument;
};

const BASE_STYLE = {
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
} as const;

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'page-switch-save';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeTextNode(id: string, text: string, y: number): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    rect: { x: 88, y, width: 680, height: 72 },
    style: BASE_STYLE,
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      fontSize: 34,
      color: '#0f172a',
      fontWeight: 'bold',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
      fontFamily: 'system-ui',
    },
  };
}

function makePageDocument(token: string, markerId: string, markerText: string): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: `page-switch-save-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      makeTextNode(markerId, markerText, 88),
    ],
  };
}

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  title: string,
  document: BuilderCanvasDocument,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title, document },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  if (!payload.pageId) throw new Error('page_id_missing');
  return payload.pageId;
}

async function getDraftDocument(page: Page, pageId: string, slug: string): Promise<BuilderCanvasDocument> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as DraftPayload;
  if (!payload.document) throw new Error('draft_document_missing');
  return payload.document;
}

async function openPagesDrawer(page: Page): Promise<Locator> {
  await page.locator('[data-builder-rail-item="pages"]').click();
  const drawer = page.locator('aside[data-builder-drawer="pages"]').first();
  await expect(drawer.locator('[data-page-switcher="true"]')).toBeVisible();
  return drawer;
}

async function switchToPage(page: Page, pageId: string): Promise<void> {
  const drawer = await openPagesDrawer(page);
  const row = drawer.locator(`[data-builder-page-row="${pageId}"]`);
  await expect(row).toBeVisible();
  await row.locator('button').nth(1).click();
}

async function parkDebouncedAutosave(page: Page): Promise<void> {
  await page.evaluate(`
    (() => {
      const originalSetTimeout = window.setTimeout.bind(window);
      window.setTimeout = (handler, timeout, ...args) => {
        const effectiveTimeout = timeout === 1000 ? 60000 : timeout;
        return originalSetTimeout(handler, effectiveTimeout, ...args);
      };
    })()
  `);
}

async function dragCatalogPresetWithRealPointer(
  page: Page,
  preset: Locator,
  stage: Locator,
  canvasLocal: { readonly x: number; readonly y: number },
): Promise<void> {
  // Honest readiness: source and target must be visible with real rendered
  // geometry before any pointer endpoint is touched. No synthetic events,
  // no bypass flags, no fixed waits.
  await expect(preset).toBeVisible();
  await expect(stage).toBeVisible();
  // Browser-native HTML5 drag: on darwin + Chromium/CDP a manual page.mouse
  // down/move/up gesture completes without entering the dragstart/dragover/
  // drop lifecycle for a native HTML5 draggable catalog preset, so no node is
  // inserted. Playwright's Locator.dragTo is HTML5-aware and drives the real
  // lifecycle, releasing at the canvas-local drop offset.
  await preset.dragTo(stage, { targetPosition: { x: canvasLocal.x, y: canvasLocal.y } });
}

function hasInsertedRichText(document: BuilderCanvasDocument): boolean {
  return document.nodes.some((node) => (
    node.kind === 'text'
    && typeof node.content.text === 'string'
    && node.content.text.includes('굵게, 기울임')
  ));
}

test.describe('/ko/admin-builder page switching draft persistence', () => {
  test('clears shared-id selection and keeps each page geometry after a canceled pointer gesture', async ({ page }) => {
    test.setTimeout(90_000);

    const token = `interaction-${Date.now().toString(36)}`;
    const firstSlug = `page-switch-interaction-a-${token}`;
    const secondSlug = `page-switch-interaction-b-${token}`;
    const sharedNodeId = `page-switch-shared-node-${token}`;
    const firstSharedDocument = makePageDocument(token, sharedNodeId, `Shared page node A ${token}`);
    const secondSharedDocument = makePageDocument(token, sharedNodeId, `Shared page node B ${token}`);
    const secondSharedNode = secondSharedDocument.nodes.find((node) => node.id === sharedNodeId);
    if (!secondSharedNode) throw new Error('page_switch_second_shared_node_missing');
    secondSharedNode.rect = { x: 344, y: 388, width: 420, height: 96 };
    const createdPages: Array<{ readonly id: string; readonly slug: string }> = [];

    try {
      const firstPageId = await createBuilderPage(
        page.request,
        firstSlug,
        `Page switch interaction A ${token}`,
        firstSharedDocument,
      );
      createdPages.push({ id: firstPageId, slug: firstSlug });
      const secondPageId = await createBuilderPage(
        page.request,
        secondSlug,
        `Page switch interaction B ${token}`,
        secondSharedDocument,
      );
      createdPages.push({ id: secondPageId, slug: secondSlug });

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(firstPageId)}&pageSwitchInteraction=${token}`);
      const sharedNode = page.locator(`[data-node-id="${sharedNodeId}"]`);
      await expect(sharedNode).toBeVisible({ timeout: 30_000 });
      await sharedNode.click({ position: { x: 20, y: 20 } });
      await expect(sharedNode).toHaveAttribute('data-selected', 'true');

      const stage = page.getByRole('application', { name: 'Canvas editor' });

      // Start a REAL move gesture on the shared node body. Honest hit testing: the
      // grab point is derived from the rendered body box and the move assertion
      // fails fast if the pointerdown did not land on the node.
      const nodeBody = sharedNode.locator('[data-builder-node-body="true"]').first();
      await expect(nodeBody).toBeVisible();
      const bodyBox = await nodeBody.boundingBox();
      if (!bodyBox) throw new Error('page_switch_shared_node_body_bounds_missing');
      const grabPoint = {
        x: bodyBox.x + Math.min(24, bodyBox.width / 4),
        y: bodyBox.y + Math.min(24, bodyBox.height / 4),
      };

      await page.mouse.move(grabPoint.x, grabPoint.y);
      await page.mouse.down();
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'move');
      // Drag past the 4px activation threshold so the direct-move preview engages.
      await page.mouse.move(grabPoint.x + 36, grabPoint.y + 24);
      await expect(sharedNode).toHaveAttribute('data-builder-direct-move-preview', 'true');

      // Cancel via the REAL Escape terminal path; the preview must revert.
      await page.keyboard.press('Escape');
      await expect(stage).toHaveAttribute('data-canvas-interaction', 'idle');
      await expect(sharedNode).not.toHaveAttribute('data-builder-direct-move-preview', 'true');
      await page.mouse.up();

      // Switch to page B (same node id, different geometry) through the real UI.
      const drawer = await openPagesDrawer(page);
      const targetRow = drawer.locator(`[data-builder-page-row="${secondPageId}"]`);
      await expect(targetRow).toBeVisible();
      await targetRow.locator('button').nth(1).click();
      await expect(drawer).not.toBeVisible({ timeout: 30_000 });

      // Page B renders the shared id with its own geometry; the page-A selection
      // must not leak across the page-identity boundary.
      await expect(sharedNode).toBeVisible({ timeout: 30_000 });
      await expect(sharedNode).not.toHaveAttribute('data-selected', 'true');
      await expect(sharedNode).toHaveCSS('left', `${secondSharedNode.rect.x}px`);
      await expect(sharedNode).toHaveCSS('top', `${secondSharedNode.rect.y}px`);
      await expect(sharedNode).toHaveCSS('width', `${secondSharedNode.rect.width}px`);
      await expect(sharedNode).toHaveCSS('height', `${secondSharedNode.rect.height}px`);

      // The canceled gesture reverted and no superseded pointer leaked across the
      // page switch, so each draft must still match its initial geometry. Polling
      // the draft API (deterministic) replaces the fixed sleep; foreign/late
      // pointer rejection is already locked by the focused lifecycle unit tests.
      const firstInitialRect = firstSharedDocument.nodes.find((node) => node.id === sharedNodeId)?.rect;
      const secondInitialRect = secondSharedNode.rect;
      expect(firstInitialRect).toBeDefined();
      await expect.poll(async () => {
        const firstDocument = await getDraftDocument(page, firstPageId, firstSlug);
        const secondDocument = await getDraftDocument(page, secondPageId, secondSlug);
        return {
          first: firstDocument.nodes.find((node) => node.id === sharedNodeId)?.rect,
          second: secondDocument.nodes.find((node) => node.id === sharedNodeId)?.rect,
        };
      }, { timeout: 10_000 }).toEqual({ first: firstInitialRect, second: secondInitialRect });
    } finally {
      for (const createdPage of [...createdPages].reverse()) {
        await page.request.delete(`/api/builder/site/pages/${createdPage.id}?locale=ko`, {
          headers: mutationHeaders(createdPage.slug),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('flushes the current dirty draft before navigating to another page', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const firstSlug = `page-switch-save-a-${token}`;
    const secondSlug = `page-switch-save-b-${token}`;
    const createdPages: Array<{ readonly id: string; readonly slug: string }> = [];

    try {
      const firstPageId = await createBuilderPage(
        page.request,
        firstSlug,
        `Page switch save A ${token}`,
        makePageDocument(token, `first-marker-${token}`, `First page ${token}`),
      );
      createdPages.push({ id: firstPageId, slug: firstSlug });
      const secondPageId = await createBuilderPage(
        page.request,
        secondSlug,
        `Page switch save B ${token}`,
        makePageDocument(token, `second-marker-${token}`, `Second page ${token}`),
      );
      createdPages.push({ id: secondPageId, slug: secondSlug });

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(firstPageId)}&pageSwitchSave=${token}`);
      await expect(page.locator(`[data-node-id="first-marker-${token}"]`)).toBeVisible({ timeout: 30_000 });

      const pagesDrawer = await openPagesDrawer(page);
      await expect(pagesDrawer.locator(`[data-builder-page-row="${firstPageId}"]`)).toBeVisible();
      await expect(pagesDrawer.locator(`[data-builder-page-row="${secondPageId}"]`)).toBeVisible();
      await parkDebouncedAutosave(page);

      const catalogDrawer = await openCatalogDrawer(page);
      const richTextPreset = catalogDrawer.locator('[data-builder-text-widget-preset="rich-text"]');
      await expect(richTextPreset).toBeVisible();

      const stage = page.getByRole('application', { name: 'Canvas editor' });
      await dragCatalogPresetWithRealPointer(page, richTextPreset, stage, { x: 260, y: 230 });
      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: '굵게, 기울임' }).last()).toBeVisible();
      await switchToPage(page, secondPageId);
      await expect(page.locator(`[data-node-id="second-marker-${token}"]`)).toBeVisible({ timeout: 30_000 });

      await expect.poll(async () => {
        const document = await getDraftDocument(page, firstPageId, firstSlug);
        return hasInsertedRichText(document);
      }, { timeout: 30_000 }).toBe(true);

      await page.screenshot({ path: '/tmp/tseng-page-switch-save-before-navigation.png', fullPage: false });
    } finally {
      for (const createdPage of [...createdPages].reverse()) {
        await page.request.delete(`/api/builder/site/pages/${createdPage.id}?locale=ko`, {
          headers: mutationHeaders(createdPage.slug),
          failOnStatusCode: false,
        });
      }
    }
  });
});
