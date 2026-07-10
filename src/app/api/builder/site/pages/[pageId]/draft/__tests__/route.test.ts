import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import { emitEditorPageSaveHook } from '@/lib/builder/apps/lifecycle-emitters';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import { createHomePageCanvasDocumentDecomposed } from '@/lib/builder/canvas/seed-home';
import { HERO_SEARCH_WRAPPER_Y } from '@/lib/builder/canvas/decompose-hero';
import {
  canProjectPageToLocale,
  readPageCanvasRecordState,
  readSiteDocument,
  updatePageCanvasRecord,
} from '@/lib/builder/site/persistence';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'admin@example.test' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  canProjectPageToLocale: vi.fn(() => true),
  readSiteDocument: vi.fn(),
  readPageCanvasRecordState: vi.fn(),
  updatePageCanvasRecord: vi.fn(),
}));

vi.mock('@/lib/builder/apps/lifecycle-emitters', () => ({
  emitEditorPageSaveHook: vi.fn(),
}));

function makeDocument(id: string): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-05-20T00:00:00.000Z',
    updatedBy: 'test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
    // Keep a stable marker outside the canvas schema assertions below by
    // varying updatedBy; the route normalizer should still accept the document.
    ...(id ? { updatedBy: id } : {}),
  };
}

function canvasNodeBase(zIndex: number) {
  return {
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
  };
}

function makeHomeDocument(): BuilderCanvasDocument {
  return {
    ...makeDocument('home-draft'),
    updatedBy: 'home-seed-v6',
    nodes: [
      {
        id: 'home-hero-root',
        kind: 'container',
        parentId: undefined,
        rect: { x: 0, y: 0, width: 1280, height: 1020 },
        ...canvasNodeBase(0),
        content: {
          label: 'Hero',
          background: 'transparent',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          className: 'hero',
        },
      },
      {
        id: 'home-hero-title',
        kind: 'text',
        parentId: 'home-hero-root',
        rect: { x: 0, y: 44, width: 620, height: 128 },
        ...canvasNodeBase(1),
        content: {
          text: '대만 법률을 한국어로 명확하게.',
          fontSize: 34,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: 'home-insights-root',
        kind: 'container',
        parentId: undefined,
        rect: { x: 0, y: 1020, width: 1280, height: 1260 },
        ...canvasNodeBase(24),
        content: {
          label: 'Insights',
          background: 'transparent',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          className: 'section section--gray',
        },
      },
      {
        id: 'home-insights-title',
        kind: 'text',
        parentId: 'home-insights-root',
        rect: { x: 0, y: 0, width: 360, height: 40 },
        ...canvasNodeBase(25),
        content: {
          text: '칼럼 아카이브',
          fontSize: 30,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: 'home-services-root',
        kind: 'container',
        parentId: undefined,
        rect: { x: 0, y: 2280, width: 1280, height: 1520 },
        ...canvasNodeBase(84),
        content: {
          label: 'Services',
          background: 'transparent',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          className: 'section section--light',
        },
      },
      {
        id: 'home-services-title',
        kind: 'text',
        parentId: 'home-services-root',
        rect: { x: 0, y: 0, width: 360, height: 40 },
        ...canvasNodeBase(85),
        content: {
          text: '업무분야',
          fontSize: 30,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
    ],
  };
}

function recordState(document: BuilderCanvasDocument) {
  return {
    record: {
      revision: 7,
      savedAt: '2026-05-20T00:10:00.000Z',
      updatedBy: 'publisher',
      document,
    },
    isEnvelope: true,
  };
}

function getRequest(pageId: string) {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/${pageId}/draft?locale=ko`);
}

function putRequest(pageId: string, body: unknown, locale = 'ko') {
  return new NextRequest(
    `https://law.example.test/api/builder/site/pages/${pageId}/draft?locale=${locale}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    },
  );
}

describe('/api/builder/site/pages/[pageId]/draft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(updatePageCanvasRecord).mockReset();
    vi.mocked(guardBuilderRead).mockReturnValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({
      username: 'admin-1',
      permission: 'edit-pages',
    });
    vi.mocked(canProjectPageToLocale).mockReturnValue(true);
    const siteDocument = {
      version: 1,
      siteId: 'default',
      locale: 'ko',
      name: 'Test site',
      pages: [
        {
          pageId: 'page-published-only',
          slug: 'columns',
          title: { ko: '칼럼', 'zh-hant': '專欄', en: 'Columns' },
          locale: 'ko',
          createdAt: '2026-05-20T00:00:00.000Z',
          updatedAt: '2026-05-20T00:00:00.000Z',
        },
      ],
      navigation: [],
      settings: {},
      theme: {
        colors: {
          primary: '#123b63',
          secondary: '#1e5a96',
          accent: '#e8a838',
          background: '#ffffff',
          text: '#1f2937',
          muted: '#f3f4f6',
        },
        fonts: { heading: 'system-ui', body: 'system-ui' },
        radii: { sm: 2, md: 8, lg: 12 },
      },
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    } satisfies Awaited<ReturnType<typeof readSiteDocument>>;
    vi.mocked(readSiteDocument).mockResolvedValue(siteDocument);
  });

  it('loads the published canvas when the draft record is missing', async () => {
    const publishedDocument = makeDocument('published-only-section');
    vi.mocked(readPageCanvasRecordState).mockImplementation(async (_siteId, _pageId, variant = 'draft') => (
      variant === 'draft' ? null : recordState(publishedDocument)
    ));

    const route = await import('../route');
    const response = await route.GET(getRequest('page-published-only'), {
      params: { pageId: 'page-published-only' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.draft).toBeNull();
    expect(payload.recoveredFrom).toBe('published');
    expect(payload.document.updatedBy).toBe('published-only-section');
    expect(guardBuilderRead).toHaveBeenCalledTimes(1);
    expect(guardMutation).not.toHaveBeenCalled();
  });

  it('preserves saved home node order and z-indexes when loading drafts', async () => {
    vi.mocked(readPageCanvasRecordState).mockResolvedValue(recordState(makeHomeDocument()));

    const route = await import('../route');
    const response = await route.GET(getRequest('page-published-only'), {
      params: { pageId: 'page-published-only' },
    });
    const payload = await response.json();
    const roots = payload.document.nodes
      .filter((node: { parentId?: string | null }) => !node.parentId)
      .map((node: { id: string; zIndex: number }) => ({ id: node.id, zIndex: node.zIndex }));
    const firstTexts = payload.document.nodes
      .filter((node: { kind: string }) => node.kind === 'text')
      .map((node: { content: { text?: string } }) => node.content.text);

    expect(response.status).toBe(200);
    expect(roots).toEqual([
      { id: 'home-hero-root', zIndex: 0 },
      { id: 'home-insights-root', zIndex: 24 },
      { id: 'home-services-root', zIndex: 84 },
    ]);
    expect(firstTexts).toEqual([
      '대만 법률을 한국어로 명확하게.',
      '칼럼 아카이브',
      '업무분야',
    ]);
  });

  it('repairs legacy ko hero-search geometry through the read-only GET path without mutating metadata', async () => {
    // Stored draft mirrors the pre-migration raw shape: hero-search wrapper at
    // x0/y618/width1280 and a zh-hant-sized container (width1151).
    const fixture = createHomePageCanvasDocumentDecomposed('ko');
    for (const node of fixture.nodes) {
      if (node.id === 'home-hero-search-wrapper') {
        node.rect = { x: 0, y: HERO_SEARCH_WRAPPER_Y, width: 1280, height: 62 };
      } else if (node.id === 'home-hero-search-container') {
        node.rect = { x: 0, y: 0, width: 1151, height: 62 };
      }
    }
    const storedUpdatedAt = fixture.updatedAt;
    const storedUpdatedBy = fixture.updatedBy;
    vi.mocked(readPageCanvasRecordState).mockResolvedValue(recordState(fixture));

    const route = await import('../route');
    const response = await route.GET(getRequest('page-published-only'), {
      params: { pageId: 'page-published-only' },
    });
    const payload = await response.json();
    const wrapper = payload.document.nodes.find(
      (node: { id: string }) => node.id === 'home-hero-search-wrapper',
    );
    const container = payload.document.nodes.find(
      (node: { id: string }) => node.id === 'home-hero-search-container',
    );

    expect(response.status).toBe(200);
    expect(wrapper.rect).toEqual({ x: 51, y: HERO_SEARCH_WRAPPER_Y, width: 760, height: 62 });
    expect(container.rect).toEqual({ x: 0, y: 0, width: 760, height: 62 });
    // Read-only normalization must not rewrite record-level metadata.
    expect(payload.document.updatedAt).toBe(storedUpdatedAt);
    expect(payload.document.updatedBy).toBe(storedUpdatedBy);
    expect(updatePageCanvasRecord).not.toHaveBeenCalled();
  });

  it('still returns 404 when both draft and published records are missing', async () => {
    vi.mocked(readPageCanvasRecordState).mockResolvedValue(null);

    const route = await import('../route');
    const response = await route.GET(getRequest('page-published-only'), {
      params: { pageId: 'page-published-only' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toBe('페이지 초안을 찾을 수 없습니다.');
    expect(payload.errorCode).toBe('draft_not_found');
  });

  it('returns localized invalid JSON errors for draft saves', async () => {
    const route = await import('../route');
    const response = await route.PUT(putRequest('page-published-only', '{', 'zh-hant'), {
      params: { pageId: 'page-published-only' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(updatePageCanvasRecord).not.toHaveBeenCalled();
  });

  it('rejects an unrepairable draft document instead of persisting a fallback', async () => {
    const route = await import('../route');
    const response = await route.PUT(
      putRequest('page-published-only', {
        expectedRevision: 7,
        document: { nodes: 'garbage' },
      }),
      { params: { pageId: 'page-published-only' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.errorCode).toBe('draft_document_invalid');
    expect(updatePageCanvasRecord).not.toHaveBeenCalled();
  });

  it('accepts overlong document-level updatedBy migration markers when saving drafts', async () => {
    const overlongUpdatedBy = [
      'home-seed-v11',
      'insights-source',
      'hero-responsive-parity',
      'home-tablet-parity',
      'home-mobile-parity',
      'insights-source',
      'offices-tabs',
      'faq-parity',
    ].join('+');
    const writtenUpdatedBy: string[] = [];
    vi.mocked(updatePageCanvasRecord).mockImplementation(async (_siteId, _pageId, _variant, updater) => {
      const next = await updater(recordState(makeDocument('current-draft')));
      writtenUpdatedBy.push(next.document.updatedBy);
      return next;
    });

    const route = await import('../route');
    const response = await route.PUT(
      putRequest('page-published-only', {
        expectedRevision: 7,
        document: makeDocument(overlongUpdatedBy),
      }),
      { params: { pageId: 'page-published-only' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutation).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'draft',
      permission: 'edit-pages',
    });
    expect(payload.draft.updatedBy).toBe('admin');
    expect(writtenUpdatedBy[0]).toBe(overlongUpdatedBy.slice(0, 120));
    expect(writtenUpdatedBy[0]).toHaveLength(120);
  });

  it('requires the latest draft revision when saving an enveloped draft', async () => {
    vi.mocked(updatePageCanvasRecord).mockImplementation(async (_siteId, _pageId, _variant, updater) => (
      updater(recordState(makeDocument('current-draft')))
    ));

    const route = await import('../route');
    const response = await route.PUT(
      putRequest('page-published-only', { document: makeDocument('next-draft') }),
      { params: { pageId: 'page-published-only' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(428);
    expect(payload.error).toBe('최신 초안 리비전을 확인한 뒤 다시 저장해 주세요.');
    expect(payload.errorCode).toBe('draft_expected_revision_required');
    expect(payload.current).toEqual({
      revision: 7,
      savedAt: '2026-05-20T00:10:00.000Z',
    });
  });

  it('returns localized conflict errors with the current revision', async () => {
    vi.mocked(updatePageCanvasRecord).mockImplementation(async (_siteId, _pageId, _variant, updater) => (
      updater(recordState(makeDocument('current-draft')))
    ));

    const route = await import('../route');
    const response = await route.PUT(
      putRequest('page-published-only', {
        expectedRevision: 6,
        document: makeDocument('next-draft'),
      }),
      { params: { pageId: 'page-published-only' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.error).toBe('다른 변경 사항이 먼저 저장되었습니다. 최신 초안을 다시 불러와 주세요.');
    expect(payload.errorCode).toBe('draft_conflict');
    expect(payload.current).toEqual({
      revision: 7,
      savedAt: '2026-05-20T00:10:00.000Z',
    });
  });

  it('emits an editor.page-save lifecycle hook after a successful draft save', async () => {
    const savedRecord = {
      revision: 8,
      savedAt: '2026-05-20T00:11:00.000Z',
      updatedBy: 'admin',
      document: makeDocument('next-draft'),
    };
    vi.mocked(updatePageCanvasRecord).mockResolvedValue(savedRecord);

    const route = await import('../route');
    const response = await route.PUT(
      putRequest('page-published-only', {
        expectedRevision: 7,
        document: makeDocument('next-draft'),
      }),
      { params: { pageId: 'page-published-only' } },
    );

    expect(response.status).toBe(200);
    expect(emitEditorPageSaveHook).toHaveBeenCalledWith({
      kind: 'editor.page-save',
      payload: {
        siteId: DEFAULT_BUILDER_SITE_ID,
        pageId: 'page-published-only',
        revision: savedRecord.revision,
        savedAt: savedRecord.savedAt,
      },
    });
  });

  it('does not expose raw read failures', async () => {
    vi.mocked(readPageCanvasRecordState).mockRejectedValue(new Error('disk exploded'));

    const route = await import('../route');
    const response = await route.GET(getRequest('page-published-only'), {
      params: { pageId: 'page-published-only' },
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '페이지 초안을 불러오지 못했습니다.',
      errorCode: 'draft_load_failed',
    });
  });

  it('does not expose raw save failures', async () => {
    vi.mocked(updatePageCanvasRecord).mockRejectedValue(new Error('write lock broke'));

    const route = await import('../route');
    const response = await route.PUT(
      putRequest('page-published-only', {
        expectedRevision: 7,
        document: makeDocument('next-draft'),
      }),
      { params: { pageId: 'page-published-only' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '페이지 초안을 저장하지 못했습니다.',
      errorCode: 'draft_save_failed',
    });
  });
});
