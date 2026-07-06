import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';

type DraftPayload = {
  readonly document?: BuilderCanvasDocument;
  readonly draft?: { readonly revision?: number };
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'nested-container-drop';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeContainerNode(
  id: string,
  rect: BuilderCanvasNode['rect'],
  zIndex: number,
  parentId?: string,
): BuilderCanvasNode {
  return {
    id,
    kind: 'container',
    ...(parentId ? { parentId } : {}),
    rect,
    style: { ...BASE_STYLE, backgroundColor: parentId ? '#eff6ff' : '#f8fafc', borderRadius: 18 },
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: id,
      background: parentId ? '#eff6ff' : '#f8fafc',
      borderColor: parentId ? '#93c5fd' : '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 18,
      padding: 0,
      layoutMode: 'absolute',
      as: parentId ? 'div' : 'section',
    },
  };
}

function makeNestedDropDocument(token: string): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: new Date().toISOString(),
    updatedBy: `nested-container-drop-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      makeContainerNode(`nested-drop-root-${token}`, { x: 80, y: 72, width: 760, height: 460 }, 0),
      makeContainerNode(`nested-drop-target-${token}`, { x: 96, y: 86, width: 360, height: 240 }, 1, `nested-drop-root-${token}`),
    ],
  };
}

async function createBuilderPage(request: APIRequestContext, slug: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title: `Nested container drop ${slug}`, blank: true },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  if (!payload.pageId) throw new Error('page_id_missing');
  return payload.pageId;
}

async function seedDraftDocument(
  request: APIRequestContext,
  pageId: string,
  slug: string,
  document: BuilderCanvasDocument,
): Promise<void> {
  const current = await request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(slug),
  });
  expect(current.status()).toBe(200);
  const currentPayload = (await current.json()) as DraftPayload;
  const expectedRevision = currentPayload.draft?.revision;

  const response = await request.put(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(slug),
    data: {
      document,
      ...(typeof expectedRevision === 'number' ? { expectedRevision } : {}),
    },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; error?: string };
  expect(payload.ok, payload.error).toBe(true);
}

async function dragCatalogPresetToCanvas(
  page: Page,
  selector: string,
  canvasPoint: { readonly x: number; readonly y: number },
): Promise<void> {
  await page.evaluate(({ point, sourceSelector }) => {
    const source = document.querySelector<HTMLElement>(sourceSelector);
    const stage = document.querySelector<HTMLElement>('[role="application"][aria-label="Canvas editor"]');
    if (!source || !stage) throw new Error('nested_container_drop_target_missing');

    const stageRect = stage.getBoundingClientRect();
    const clientX = stageRect.left + point.x * (stageRect.width / stage.offsetWidth);
    const clientY = stageRect.top + point.y * (stageRect.height / stage.offsetHeight);
    const dataTransfer = new DataTransfer();

    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
    stage.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }));
    stage.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }));
  }, { point: canvasPoint, sourceSelector: selector });
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

function findInsertedRichText(document: BuilderCanvasDocument): BuilderCanvasNode | null {
  return document.nodes.find((node) => (
    node.kind === 'text'
    && typeof node.content.text === 'string'
    && node.content.text.includes('굵게, 기울임')
  )) ?? null;
}

test.describe('/ko/admin-builder Add panel nested container drop', () => {
  test('drops a catalog preset into the deepest target container with local coordinates', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `nested-container-drop-${token}`;
    const targetId = `nested-drop-target-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug);
      await seedDraftDocument(page.request, pageId, slug, makeNestedDropDocument(token));

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&nestedDrop=${token}`);
      await page.keyboard.press('Escape');
      await expect(page.locator(`[data-node-id="${targetId}"]`)).toBeVisible({ timeout: 30_000 });
      const drawer = await openCatalogDrawer(page);
      const preset = drawer.locator('[data-builder-text-widget-preset="rich-text"]');
      await expect(preset).toBeVisible();

      const canvasPoint = { x: 224, y: 198 };
      await dragCatalogPresetToCanvas(page, '[data-builder-text-widget-preset="rich-text"]', canvasPoint);
      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: '굵게, 기울임' }).last()).toBeVisible();
      await expect(page.locator(`[data-node-id="${targetId}"] [data-node-id^="text-"]`).last()).toBeVisible();

      await expect.poll(async () => {
        const document = await getDraftDocument(page, pageId ?? '', slug);
        const inserted = findInsertedRichText(document);
        if (!inserted || inserted.parentId !== targetId) return Number.POSITIVE_INFINITY;
        return Math.max(Math.abs(inserted.rect.x - 48), Math.abs(inserted.rect.y - 40));
      }, { timeout: 30_000 }).toBeLessThanOrEqual(2);

      await page.screenshot({ path: '/tmp/tseng-add-panel-nested-container-drop.png', fullPage: false });

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&nestedDropReload=${token}`);
      await expect(page.locator(`[data-node-id="${targetId}"] [data-node-id^="text-"]`).filter({ hasText: '굵게, 기울임' }).last()).toBeVisible();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });
});
