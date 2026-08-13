import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { listRevisions, recordRevision, readRevisionDocument } from '@/lib/builder/site/publish';
import { readPageCanvasRecordState, readSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/pages/[pageId]/revisions/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/site/publish', () => ({
  listRevisions: vi.fn(),
  recordRevision: vi.fn(),
  readRevisionDocument: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readPageCanvasRecordState: vi.fn(),
  readSiteDocument: vi.fn(),
}));

const mockedListRevisions = vi.mocked(listRevisions);
const mockedRecordRevision = vi.mocked(recordRevision);
const mockedReadPageCanvasRecordState = vi.mocked(readPageCanvasRecordState);
const mockedReadRevisionDocument = vi.mocked(readRevisionDocument);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);

const document: BuilderCanvasDocument = {
  version: 1,
  locale: 'ko',
  updatedAt: '2026-06-03T00:00:00.000Z',
  updatedBy: 'test',
  stageWidth: 1280,
  stageHeight: 720,
  nodes: [],
};

const siteDocument: BuilderSiteDocument = {
  version: 1,
  siteId: 'tseng-law-main-site',
  name: '호정국제',
  locale: 'ko',
  navigation: [],
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
  pages: [
    {
      pageId: 'page-1',
      slug: 'page-1',
      title: { ko: '페이지', en: 'Page', 'zh-hant': '頁面' },
      locale: 'ko',
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
    },
  ],
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-1/revisions${query}`);
}

function postRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-1/revisions${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/pages/[pageId]/revisions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      username: 'admin',
    });
    mockedListRevisions.mockResolvedValue([]);
    mockedReadSiteDocument.mockResolvedValue(siteDocument);
    mockedReadRevisionDocument.mockResolvedValue(document);
    mockedReadPageCanvasRecordState.mockResolvedValue({
      record: {
        document,
        revision: 1,
        savedAt: '2026-06-03T00:00:00.000Z',
        updatedBy: 'admin',
      },
      isEnvelope: true,
    });
    mockedRecordRevision.mockResolvedValue({ revisionId: 'rev-1', revision: 1 });
  });

  it('returns localized stable-code JSON when a requested revision is missing', async () => {
    mockedReadRevisionDocument.mockResolvedValueOnce(null);
    const response = await route.GET(getRequest('?revisionId=rev-missing&locale=zh-hant'), {
      params: Promise.resolve({ pageId: 'page-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '找不到頁面修訂。',
      errorCode: 'revision_not_found',
    });
    expect(mockedReadRevisionDocument).toHaveBeenCalledWith(
      siteDocument.siteId,
      'page-1',
      'rev-missing',
    );
  });

  it('returns localized stable-code JSON when revision list loading fails', async () => {
    mockedListRevisions.mockRejectedValueOnce(new Error('raw revision list failure'));
    const response = await route.GET(getRequest('?locale=en'), { params: Promise.resolve({ pageId: 'page-1' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to load the page revision.',
      errorCode: 'revision_load_failed',
    });
    expect(data.error).not.toContain('raw revision list failure');
    expect(mockedListRevisions).toHaveBeenCalledWith(siteDocument.siteId, 'page-1');
  });

  it('returns localized stable-code JSON when there is no draft to snapshot', async () => {
    mockedReadPageCanvasRecordState.mockResolvedValueOnce(null);
    const response = await route.POST(postRequest({}, '?locale=ko'), { params: Promise.resolve({ pageId: 'page-1' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '스냅샷을 만들 초안을 찾을 수 없습니다.',
      errorCode: 'revision_draft_not_found',
    });
    expect(mockedRecordRevision).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when revision creation fails', async () => {
    mockedRecordRevision.mockRejectedValueOnce(new Error('revision_write_failed'));
    const response = await route.POST(postRequest({ document }, '?locale=zh-hant'), { params: Promise.resolve({ pageId: 'page-1' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法建立頁面修訂。',
      errorCode: 'revision_create_failed',
    });
    expect(data.error).not.toContain('revision_write_failed');
    expect(mockedRecordRevision).toHaveBeenCalledWith(
      siteDocument.siteId,
      'page-1',
      document,
      { source: 'manual' },
    );
  });

  it('rejects a malformed snapshot site id before any revision read or write', async () => {
    const response = await route.POST(postRequest({ siteId: ['workspace-site-b'], document }), {
      params: Promise.resolve({ pageId: 'page-1' }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({ ok: false, success: false, errorCode: 'invalid_site_id' });
    expect(mockedReadPageCanvasRecordState).not.toHaveBeenCalled();
    expect(mockedRecordRevision).not.toHaveBeenCalled();
  });
});
