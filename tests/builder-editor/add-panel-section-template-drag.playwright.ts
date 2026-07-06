import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

type DraftCanvasRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

type DraftCanvasNode = {
  readonly id: string;
  readonly parentId: string | null;
  readonly rect: DraftCanvasRect;
  readonly serialized: string;
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'section-template-drag';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createBuilderPage(request: APIRequestContext, slug: string, title: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title, blank: true },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  const pageId = payload.pageId;
  if (!pageId) throw new Error('page_id_missing');
  return pageId;
}

async function draftDocumentText(page: Page, pageId: string): Promise<string> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return '';
  const payload = (await response.json()) as { document?: unknown };
  return JSON.stringify(payload.document ?? null).replace(/\\n/g, ' ');
}

async function draftRootRectForText(
  page: Page,
  pageId: string,
  text: string,
): Promise<DraftCanvasRect | null> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`, {
    headers: mutationHeaders(pageId),
    failOnStatusCode: false,
  });
  if (response.status() !== 200) return null;

  const payload: unknown = await response.json();
  const payloadRecord = readRecord(payload);
  const documentRecord = readRecord(payloadRecord?.document);
  const nodeValues = documentRecord?.nodes;
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

async function dragSectionTemplateToCanvas(
  page: Page,
  selector: string,
  canvasPoint: { x: number; y: number },
): Promise<void> {
  await page.evaluate(({ point, sourceSelector }) => {
    const source = document.querySelector<HTMLElement>(sourceSelector);
    const stage = document.querySelector<HTMLElement>('[role="application"][aria-label="Canvas editor"]');
    if (!source || !stage) throw new Error('section_template_drag_target_missing');

    const stageRect = stage.getBoundingClientRect();
    const clientX = stageRect.left + point.x * (stageRect.width / stage.offsetWidth);
    const clientY = stageRect.top + point.y * (stageRect.height / stage.offsetHeight);
    const dataTransfer = new DataTransfer();

    source.dispatchEvent(new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer,
    }));
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

function readRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null;
}

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

test.describe('/ko/admin-builder Add panel built-in section template drag/drop', () => {
  test('drops a built-in section template at the dragged canvas position and persists it', async ({ page }) => {
    test.setTimeout(90_000);

    const token = Date.now().toString(36);
    const slug = `g-editor-section-drag-${token}`;
    const insertedTitle = '서비스 상세를 단계별로 펼쳐 보게 합니다';
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `Section Drag ${token}`);
      const createdPageId = pageId;
      await page.setExtraHTTPHeaders(mutationHeaders(slug));
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(createdPageId)}&sectionDrag=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await drawer.getByRole('searchbox', { name: /Search add elements|추가 요소 검색/ }).fill('주요업무');
      const selector = '[data-builder-built-in-section-template="services-accordion"]';
      const templateCard = drawer.locator(selector);
      await templateCard.scrollIntoViewIfNeeded();
      await expect(templateCard).toBeVisible();

      const canvasPoint = { x: 176, y: 132 };
      await dragSectionTemplateToCanvas(page, selector, canvasPoint);

      await expect(page.locator('[data-node-id^="heading-"]').filter({ hasText: insertedTitle }).last()).toBeVisible();
      await expect.poll(async () => {
        const rect = await draftRootRectForText(page, createdPageId, insertedTitle);
        if (!rect) return Number.POSITIVE_INFINITY;
        return Math.max(Math.abs(rect.x - canvasPoint.x), Math.abs(rect.y - canvasPoint.y));
      }, { timeout: 30_000 }).toBeLessThanOrEqual(2);
      await expect.poll(async () => draftDocumentText(page, createdPageId), { timeout: 30_000 }).toContain(insertedTitle);

      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(createdPageId)}&sectionDragReload=${token}`);
      await expect(page.locator('[data-node-id^="heading-"]').filter({ hasText: insertedTitle }).first()).toBeVisible();
      await expect(page.getByText('포함 범위와 제외 범위를 명확히 합니다.').first()).toBeVisible();
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          failOnStatusCode: false,
          headers: mutationHeaders(slug),
        });
      }
    }
  });
});
