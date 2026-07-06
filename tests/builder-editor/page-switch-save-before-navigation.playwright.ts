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

async function dragCatalogPresetToCanvas(
  page: Page,
  selector: string,
  canvasPoint: { readonly x: number; readonly y: number },
): Promise<void> {
  await page.evaluate(({ point, sourceSelector }) => {
    const source = document.querySelector<HTMLElement>(sourceSelector);
    const stage = document.querySelector<HTMLElement>('[role="application"][aria-label="Canvas editor"]');
    if (!source || !stage) throw new Error('page_switch_drop_target_missing');

    const stageRect = stage.getBoundingClientRect();
    const clientX = stageRect.left + point.x * (stageRect.width / stage.offsetWidth);
    const clientY = stageRect.top + point.y * (stageRect.height / stage.offsetHeight);
    const dataTransfer = new DataTransfer();

    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
    stage.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }));
    stage.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }));
  }, { point: canvasPoint, sourceSelector: selector });
}

function hasInsertedRichText(document: BuilderCanvasDocument): boolean {
  return document.nodes.some((node) => (
    node.kind === 'text'
    && typeof node.content.text === 'string'
    && node.content.text.includes('굵게, 기울임')
  ));
}

test.describe('/ko/admin-builder page switching draft persistence', () => {
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

      await dragCatalogPresetToCanvas(page, '[data-builder-text-widget-preset="rich-text"]', { x: 260, y: 230 });
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
