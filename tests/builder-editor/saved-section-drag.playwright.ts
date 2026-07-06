import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

type JsonRecord = Readonly<Record<string, unknown>>;

type DraftCanvasRect = { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
type DraftCanvasNode = { readonly id: string; readonly parentId: string | null; readonly rect: DraftCanvasRect; readonly serialized: string };

const BASE_STYLE = {
  backgroundColor: 'transparent', borderColor: '#cbd5e1', borderStyle: 'solid', borderWidth: 0, borderRadius: 0,
  shadowX: 0, shadowY: 0, shadowBlur: 0, shadowSpread: 0, shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
} as const;

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'saved-section-drag';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeSavedSectionNodes(token: string, text: string): readonly JsonRecord[] {
  const rootNodeId = `saved-drag-root-${token}`;
  return [
    {
      id: rootNodeId,
      kind: 'container',
      rect: { x: 0, y: 0, width: 620, height: 230 },
      style: { ...BASE_STYLE, backgroundColor: '#eff6ff', borderRadius: 18 },
      zIndex: 0,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        label: 'Saved section drag root',
        background: '#eff6ff',
        borderColor: '#bfdbfe',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 18,
        padding: 0,
        layoutMode: 'absolute',
        as: 'section',
      },
    },
    {
      id: `saved-drag-text-${token}`,
      kind: 'text',
      parentId: rootNodeId,
      rect: { x: 34, y: 58, width: 520, height: 84 },
      style: { ...BASE_STYLE, borderRadius: 10 },
      zIndex: 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        text,
        fontSize: 30,
        color: '#1e3a8a',
        fontWeight: 'bold',
        align: 'left',
        lineHeight: 1.2,
        letterSpacing: 0,
        fontFamily: 'system-ui',
        verticalAlign: 'top',
        textTransform: 'none',
        as: 'h2',
      },
    },
  ];
}

async function createSavedSection(
  request: APIRequestContext,
  token: string,
  sectionText: string,
  headers: Record<string, string>,
): Promise<string> {
  const response = await request.post('/api/builder/site/section-library?locale=ko', {
    headers,
    data: {
      locale: 'ko',
      name: `Saved drag ${token}`,
      category: 'custom',
      rootNodeId: `saved-drag-root-${token}`,
      nodes: makeSavedSectionNodes(token, sectionText),
    },
  });
  expect(response.status()).toBe(200);
  const payload: unknown = await response.json();
  const sectionId = readString(readRecord(readRecord(payload)?.section)?.sectionId);
  expect(readBoolean(readRecord(payload)?.ok), readString(readRecord(payload)?.error) ?? undefined).toBe(true);
  expect(sectionId).toBeTruthy();
  if (!sectionId) throw new Error('section_id_missing');
  return sectionId;
}

async function createBuilderPage(
  request: APIRequestContext,
  slug: string,
  headers: Record<string, string>,
): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    headers,
    data: {
      locale: 'ko',
      slug,
      title: `Saved section drag ${slug}`,
      blank: true,
    },
  });
  expect(response.status()).toBe(200);
  const payload: unknown = await response.json();
  const pageId = readString(readRecord(payload)?.pageId);
  expect(readBoolean(readRecord(payload)?.success), readString(readRecord(payload)?.error) ?? undefined).toBe(true);
  expect(pageId).toBeTruthy();
  if (!pageId) throw new Error('page_id_missing');
  return pageId;
}

async function draftRootRectForText(page: Page, pageId: string, text: string): Promise<DraftCanvasRect | null> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return null;

  const payload: unknown = await response.json();
  const nodeValues = readRecord(readRecord(payload)?.document)?.nodes;
  if (!Array.isArray(nodeValues)) return null;

  const nodes = nodeValues.flatMap((value) => {
    const node = toDraftCanvasNode(value);
    return node ? [node] : [];
  });
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const textNode = nodes.find((node) => node.serialized.includes(text));
  if (!textNode) return null;

  let root = textNode;
  const visited = new Set<string>();
  while (root.parentId && !visited.has(root.parentId)) {
    visited.add(root.parentId);
    const parent = nodesById.get(root.parentId);
    if (!parent) break;
    root = parent;
  }
  return root.rect;
}

async function dragSavedSectionToCanvas(
  page: Page,
  selector: string,
  canvasPoint: { readonly x: number; readonly y: number },
): Promise<void> {
  await page.evaluate(({ point, sourceSelector }) => {
    const source = document.querySelector<HTMLElement>(sourceSelector);
    const stage = document.querySelector<HTMLElement>('[role="application"][aria-label="Canvas editor"]');
    if (!source || !stage) throw new Error('saved_section_drag_target_missing');

    const stageRect = stage.getBoundingClientRect();
    const clientX = stageRect.left + point.x * (stageRect.width / stage.offsetWidth);
    const clientY = stageRect.top + point.y * (stageRect.height / stage.offsetHeight);
    const dataTransfer = new DataTransfer();

    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
    stage.dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }));
    stage.dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      dataTransfer,
    }));
  }, { point: canvasPoint, sourceSelector: selector });
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readRecord(value: unknown): JsonRecord | null {
  return isJsonRecord(value) ? value : null;
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null;
}

function readBoolean(value: unknown): boolean | null { return typeof value === 'boolean' ? value : null; }

function readNumber(value: unknown): number | null { return typeof value === 'number' && Number.isFinite(value) ? value : null; }

function readRect(value: unknown): DraftCanvasRect | null {
  const record = readRecord(value);
  if (!record) return null;
  const x = readNumber(record.x);
  const y = readNumber(record.y);
  const width = readNumber(record.width);
  const height = readNumber(record.height);
  if (x === null || y === null || width === null || height === null) return null;
  return { height, width, x, y };
}

function toDraftCanvasNode(value: unknown): DraftCanvasNode | null {
  const record = readRecord(value);
  if (!record) return null;
  const id = readString(record.id);
  const rect = readRect(record.rect);
  if (!id || !rect) return null;
  return {
    id,
    parentId: readString(record.parentId),
    rect,
    serialized: JSON.stringify(record),
  };
}

test.describe('/ko/admin-builder saved section drag/drop', () => {
  test('drops a saved section at the dragged canvas position and persists it', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `saved-section-drag-${token}`;
    const sectionText = `Saved section dragged ${token}`;
    const headers = mutationHeaders(slug);
    let pageId: string | null = null;
    let sectionId: string | null = null;

    try {
      sectionId = await createSavedSection(page.request, token, sectionText, headers);
      pageId = await createBuilderPage(page.request, slug, headers);
      const createdPageId = pageId;
      const createdSectionId = sectionId;

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(createdPageId)}&savedSectionDrag=${token}`);
      await page.keyboard.press('Escape');

      const catalogDrawer = await openCatalogDrawer(page);
      const selector = `[data-builder-saved-section-card="${createdSectionId}"]`;
      const savedSectionCard = catalogDrawer.locator(selector);
      await savedSectionCard.scrollIntoViewIfNeeded();
      await expect(savedSectionCard).toBeVisible();

      const canvasPoint = { x: 212, y: 164 };
      await dragSavedSectionToCanvas(page, selector, canvasPoint);

      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: sectionText }).last()).toBeVisible();
      await expect(page.locator('[data-node-id][data-selected="true"]')).toHaveCount(1);
      await expect.poll(async () => {
        const rect = await draftRootRectForText(page, createdPageId, sectionText);
        if (!rect) return Number.POSITIVE_INFINITY;
        return Math.max(Math.abs(rect.x - canvasPoint.x), Math.abs(rect.y - canvasPoint.y));
      }, { timeout: 30_000 }).toBeLessThanOrEqual(2);

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(createdPageId)}&savedSectionDragReload=${token}`);
      await expect(page.locator('[data-node-id^="text-"]').filter({ hasText: sectionText }).last()).toBeVisible();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers,
          failOnStatusCode: false,
        });
      }
      if (sectionId) {
        await page.request.delete(`/api/builder/site/section-library/${encodeURIComponent(sectionId)}?locale=ko`, {
          headers,
          failOnStatusCode: false,
        });
      }
    }
  });
});
