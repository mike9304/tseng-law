import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { readPageCanvas, writePageCanvas } from '@/lib/builder/site/persistence';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import * as route from '@/app/api/builder/site/pages/[pageId]/move-from/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readPageCanvas: vi.fn(),
  writePageCanvas: vi.fn(),
}));

vi.mock('@/lib/builder/canvas/types', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/canvas/types')>();
  return {
    ...actual,
    normalizeCanvasDocument: vi.fn((document: BuilderCanvasDocument) => document),
  };
});

vi.mock('@/lib/builder/canvas/tree', () => ({
  buildChildrenMap: vi.fn(() => new Map<string, string[]>()),
  getCanvasNodeDescendantIds: vi.fn(() => []),
  resolveCanvasNodeAbsoluteRect: vi.fn((node: BuilderCanvasNode) => node.rect),
}));

const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedWritePageCanvas = vi.mocked(writePageCanvas);

function postRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-target/move-from${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function postSelectedSiteRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-target/move-from${query}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-move-site',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function node(overrides: Partial<BuilderCanvasNode> = {}): BuilderCanvasNode {
  return {
    id: 'node-1',
    kind: 'text',
    name: 'Text',
    rect: { x: 20, y: 30, width: 160, height: 48 },
    zIndex: 1,
    style: {},
    content: { text: 'Hello' },
    ...overrides,
  } as unknown as BuilderCanvasNode;
}

function canvas(nodes: BuilderCanvasNode[] = []): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-06-03T00:00:00.000Z',
    nodes,
  } as BuilderCanvasDocument;
}

describe('/api/builder/site/pages/[pageId]/move-from', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    mockedReadPageCanvas
      .mockResolvedValueOnce(canvas([node()]))
      .mockResolvedValueOnce(canvas());
    mockedWritePageCanvas.mockResolvedValue(undefined);
  });

  it('returns localized stable-code JSON for malformed move payloads', async () => {
    const response = await route.POST(postRequest('{', '?locale=en'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the site request format.',
      errorCode: 'invalid_json',
    });
    expect(mockedReadPageCanvas).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when source page id is missing', async () => {
    const response = await route.POST(postRequest({ nodeIds: ['node-1'] }, '?locale=ko'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '원본 페이지 ID가 필요합니다.',
      errorCode: 'move_source_page_required',
    });
    expect(mockedReadPageCanvas).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when source and target are the same page', async () => {
    const response = await route.POST(postRequest({ sourcePageId: 'page-target', nodeIds: ['node-1'] }, '?locale=zh-hant'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '無法將元素移動到同一頁面。',
      errorCode: 'move_same_page',
    });
    expect(mockedReadPageCanvas).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when no node ids are supplied', async () => {
    const response = await route.POST(postRequest({ sourcePageId: 'page-source', nodeIds: [] }, '?locale=en'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Select elements to move.',
      errorCode: 'move_node_ids_required',
    });
    expect(mockedReadPageCanvas).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when draft loading fails', async () => {
    mockedReadPageCanvas.mockReset();
    mockedReadPageCanvas.mockRejectedValueOnce(new Error('raw draft load failure'));
    const response = await route.POST(postRequest({ sourcePageId: 'page-source', nodeIds: ['node-1'] }, '?locale=en'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to load the page drafts for moving.',
      errorCode: 'move_drafts_load_failed',
    });
    expect(data.error).not.toContain('raw draft load failure');
  });

  it('returns localized stable-code JSON when the source draft is missing', async () => {
    mockedReadPageCanvas.mockReset();
    mockedReadPageCanvas
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(canvas());
    const response = await route.POST(postRequest({ sourcePageId: 'page-source', nodeIds: ['node-1'] }, '?locale=ko'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '원본 페이지 초안을 찾을 수 없습니다.',
      errorCode: 'move_source_draft_not_found',
    });
  });

  it('returns localized stable-code JSON when the target draft is missing', async () => {
    mockedReadPageCanvas.mockReset();
    mockedReadPageCanvas
      .mockResolvedValueOnce(canvas([node()]))
      .mockResolvedValueOnce(null);
    const response = await route.POST(postRequest({ sourcePageId: 'page-source', nodeIds: ['node-1'] }, '?locale=zh-hant'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '找不到目標頁面草稿。',
      errorCode: 'move_target_draft_not_found',
    });
  });

  it('returns localized stable-code JSON when no requested nodes match', async () => {
    mockedReadPageCanvas.mockReset();
    mockedReadPageCanvas
      .mockResolvedValueOnce(canvas([node()]))
      .mockResolvedValueOnce(canvas());
    const response = await route.POST(postRequest({ sourcePageId: 'page-source', nodeIds: ['missing-node'] }, '?locale=en'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: 'No movable elements were found.',
      errorCode: 'move_no_matching_nodes',
    });
    expect(mockedWritePageCanvas).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when writing the target draft fails', async () => {
    mockedWritePageCanvas.mockRejectedValueOnce(new Error('raw target write failure'));
    const response = await route.POST(postRequest({ sourcePageId: 'page-source', nodeIds: ['node-1'] }, '?locale=ko'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '대상 페이지에 요소를 저장하지 못했습니다.',
      errorCode: 'move_target_write_failed',
    });
    expect(data.error).not.toContain('raw target write failure');
  });

  it('returns localized stable-code JSON and target details when writing the source draft fails', async () => {
    mockedWritePageCanvas
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('raw source write failure'));
    const response = await route.POST(postRequest({ sourcePageId: 'page-source', nodeIds: ['node-1'] }, '?locale=en'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Saved to the target page, but could not remove the elements from the source page. Try again.',
      errorCode: 'move_source_write_failed',
      target: { pageId: 'page-target', nodeCount: 1 },
    });
    expect(data.error).not.toContain('raw source write failure');
  });

  it('preserves the move success shape', async () => {
    const response = await route.POST(postRequest({ sourcePageId: 'page-source', nodeIds: ['node-1'] }, '?locale=ko'), {
      params: { pageId: 'page-target' },
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      ok: true,
      movedCount: 1,
      source: { pageId: 'page-source', nodeCount: 0 },
      target: { pageId: 'page-target', nodeCount: 1 },
    });
    expect(data.movedRootIds).toHaveLength(1);
  });

  it('moves nodes inside the selected workspace site from the editor referer', async () => {
    const response = await route.POST(
      postSelectedSiteRequest({ siteId: 'default', sourcePageId: 'page-source', nodeIds: ['node-1'] }, '?locale=ko'),
      { params: { pageId: 'page-target' } },
    );

    expect(response.status).toBe(200);
    expect(mockedReadPageCanvas).toHaveBeenNthCalledWith(1, 'workspace-move-site', 'page-source', 'draft');
    expect(mockedReadPageCanvas).toHaveBeenNthCalledWith(2, 'workspace-move-site', 'page-target', 'draft');
    expect(mockedWritePageCanvas).toHaveBeenNthCalledWith(
      1,
      'workspace-move-site',
      'page-target',
      'draft',
      expect.any(Object),
    );
    expect(mockedWritePageCanvas).toHaveBeenNthCalledWith(
      2,
      'workspace-move-site',
      'page-source',
      'draft',
      expect.any(Object),
    );
  });
});
