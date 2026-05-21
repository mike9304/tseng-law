import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  canProjectPageToLocale,
  readPageCanvasRecordState,
  readSiteDocument,
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

describe('/api/builder/site/pages/[pageId]/draft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderRead).mockReturnValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'admin@example.test' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    vi.mocked(canProjectPageToLocale).mockReturnValue(true);
    vi.mocked(readSiteDocument).mockResolvedValue({
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
      theme: {},
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    } as unknown as Awaited<ReturnType<typeof readSiteDocument>>);
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

  it('still returns 404 when both draft and published records are missing', async () => {
    vi.mocked(readPageCanvasRecordState).mockResolvedValue(null);

    const route = await import('../route');
    const response = await route.GET(getRequest('page-published-only'), {
      params: { pageId: 'page-published-only' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toBe('Draft not found');
  });
});
