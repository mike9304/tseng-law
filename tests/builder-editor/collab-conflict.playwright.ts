import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';

type DraftPayload = {
  readonly draft?: {
    readonly revision?: number;
    readonly savedAt?: string;
  } | null;
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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'f96-conflict';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeTextNode(id: string, text: string): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    rect: { x: 88, y: 96, width: 720, height: 80 },
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
    updatedBy: `f96-conflict-${token}`,
    stageWidth: 1280,
    stageHeight: 760,
    nodes: [
      makeTextNode(markerId, markerText),
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

async function readDraft(page: Page, pageId: string, scope: string): Promise<DraftPayload> {
  const response = await page.request.get(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`, {
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  return (await response.json()) as DraftPayload;
}

async function putDraft(
  request: APIRequestContext,
  pageId: string,
  scope: string,
  expectedRevision: number,
  document: BuilderCanvasDocument,
): Promise<DraftPayload> {
  const response = await request.put(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=ko`, {
    data: { expectedRevision, document },
    headers: mutationHeaders(scope),
  });
  expect(response.status()).toBe(200);
  return (await response.json()) as DraftPayload;
}

function draftRevision(payload: DraftPayload): number {
  const revision = payload.draft?.revision;
  if (typeof revision !== 'number') throw new Error('draft_revision_missing');
  return revision;
}

function textNodeContent(document: BuilderCanvasDocument | undefined, nodeId: string): string | undefined {
  const node = document?.nodes.find((candidate) => candidate.id === nodeId);
  if (!node || node.kind !== 'text') return undefined;
  return 'text' in node.content && typeof node.content.text === 'string'
    ? node.content.text
    : undefined;
}

async function dragCatalogPresetToCanvas(
  page: Page,
  selector: string,
  canvasPoint: { readonly x: number; readonly y: number },
): Promise<void> {
  await page.evaluate(({ point, sourceSelector }) => {
    const source = document.querySelector<HTMLElement>(sourceSelector);
    const stage = document.querySelector<HTMLElement>('[role="application"][aria-label="Canvas editor"]');
    if (!source || !stage) throw new Error('f96_conflict_drop_target_missing');

    const stageRect = stage.getBoundingClientRect();
    const clientX = stageRect.left + point.x * (stageRect.width / stage.offsetWidth);
    const clientY = stageRect.top + point.y * (stageRect.height / stage.offsetHeight);
    const dataTransfer = new DataTransfer();

    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
    stage.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }));
    stage.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, clientX, clientY, dataTransfer }));
  }, { point: canvasPoint, sourceSelector: selector });
}

test('/ko/admin-builder shows a visible draft conflict instead of overwriting another save', async ({ page }) => {
  test.setTimeout(90_000);
  const token = Date.now().toString(36);
  const slug = `f96-conflict-${token}`;
  const markerId = `f96-marker-${token}`;
  let pageId: string | null = null;

  try {
    pageId = await createBuilderPage(
      page.request,
      slug,
      `F96 conflict ${token}`,
      makePageDocument(token, markerId, `Original draft ${token}`),
    );

    await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&f96Conflict=${token}`);
    await expect(page.locator(`[data-node-id="${markerId}"]`)).toContainText(`Original draft ${token}`);

    const initialDraft = await readDraft(page, pageId, slug);
    const initialRevision = draftRevision(initialDraft);
    const externalDraft = await putDraft(
      page.request,
      pageId,
      `${slug}-external`,
      initialRevision,
      makePageDocument(token, markerId, `Other editor saved first ${token}`),
    );
    expect(draftRevision(externalDraft)).toBe(initialRevision + 1);

    const catalogDrawer = await openCatalogDrawer(page);
    await expect(catalogDrawer.locator('[data-builder-text-widget-preset="rich-text"]')).toBeVisible();
    const conflictResponse = page.waitForResponse((response) => (
      response.request().method() === 'PUT'
      && response.url().includes(`/api/builder/site/pages/${encodeURIComponent(pageId!)}/draft`)
      && response.status() === 409
    ));
    await dragCatalogPresetToCanvas(page, '[data-builder-text-widget-preset="rich-text"]', { x: 280, y: 260 });
    await conflictResponse;

    const conflictBanner = page.getByRole('alert').filter({ hasText: '다른 탭에서 저장됨' });
    await expect(conflictBanner).toBeVisible({ timeout: 30_000 });
    await expect(conflictBanner.getByRole('button', { name: '새로고침' })).toBeVisible();

    const latestDraft = await readDraft(page, pageId, slug);
    expect(draftRevision(latestDraft)).toBe(draftRevision(externalDraft));
    expect(textNodeContent(latestDraft.document, markerId)).toBe(`Other editor saved first ${token}`);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${encodeURIComponent(pageId)}?locale=ko`, {
        headers: mutationHeaders(slug),
        failOnStatusCode: false,
      });
    }
  }
});
