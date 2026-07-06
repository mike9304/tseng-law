import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultCanvasDocument } from '@/lib/builder/canvas/types';
import { guardMutation } from '@/lib/builder/security/guard';
import { listRevisions, recordRevision } from '@/lib/builder/site/publish';
import { readPageCanvas, readPageCanvasRecordState, readSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/pages/[pageId]/revisions/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/site/publish', () => ({
  listRevisions: vi.fn(async () => []),
  recordRevision: vi.fn(),
  readRevisionDocument: vi.fn(async () => createDefaultCanvasDocument('ko')),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readPageCanvas: vi.fn(),
  readPageCanvasRecordState: vi.fn(),
  readSiteDocument: vi.fn(),
}));

const SELECTED_SITE_ID = 'workspace-revisions-site';
const EDITOR_REFERRER = `https://law.example.test/ko/admin-builder?siteId=${SELECTED_SITE_ID}`;

const document = createDefaultCanvasDocument('ko');
const record = {
  document,
  revision: 7,
  savedAt: '2026-06-21T01:00:00.000Z',
  updatedBy: 'admin',
};

const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedReadPageCanvasRecordState = vi.mocked(readPageCanvasRecordState);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedListRevisions = vi.mocked(listRevisions);
const mockedRecordRevision = vi.mocked(recordRevision);

function siteDocument(siteId: string, pageIds: readonly string[]): BuilderSiteDocument {
  return {
    version: 1,
    siteId,
    name: siteId,
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
    pages: pageIds.map((pageId) => ({
      pageId,
      slug: pageId,
      title: { ko: pageId, en: pageId, 'zh-hant': pageId },
      locale: 'ko',
      createdAt: '2026-06-21T01:00:00.000Z',
      updatedAt: '2026-06-21T01:00:00.000Z',
    })),
    createdAt: '2026-06-21T01:00:00.000Z',
    updatedAt: '2026-06-21T01:00:00.000Z',
  };
}

function getRequest(headers?: HeadersInit): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/pages/page-1/revisions?locale=ko', {
    headers,
  });
}

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/pages/page-1/revisions?locale=ko', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      referer: EDITOR_REFERRER,
    },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/site/pages/[pageId]/revisions selected site routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' });
    mockedReadPageCanvas.mockResolvedValue(document);
    mockedReadPageCanvasRecordState.mockResolvedValue({ record, isEnvelope: true });
    mockedReadSiteDocument.mockImplementation(async (siteId) => (
      siteId === SELECTED_SITE_ID
        ? siteDocument(SELECTED_SITE_ID, ['page-1'])
        : siteDocument(String(siteId), [])
    ));
    mockedListRevisions.mockResolvedValue([]);
    mockedRecordRevision.mockResolvedValue({ revisionId: 'rev-selected', revision: 7 });
  });

  it('lists revisions only after confirming the page belongs to the selected editor site', async () => {
    const response = await route.GET(getRequest({ referer: EDITOR_REFERRER }), {
      params: { pageId: 'page-1' },
    });

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith(SELECTED_SITE_ID, 'ko');
    expect(mockedListRevisions).toHaveBeenCalledWith('page-1');
  });

  it('does not list selected-site revisions through a default-site request', async () => {
    const response = await route.GET(getRequest(), { params: { pageId: 'page-1' } });

    expect(response.status).toBe(404);
    expect(mockedListRevisions).not.toHaveBeenCalled();
  });

  it('snapshots the selected editor site draft when legacy body siteId is default', async () => {
    const response = await route.POST(postRequest({ siteId: 'default', source: 'manual' }), {
      params: { pageId: 'page-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ ok: true, revisionId: 'rev-selected' });
    expect(mockedReadPageCanvasRecordState).toHaveBeenCalledWith(SELECTED_SITE_ID, 'page-1', 'draft');
    expect(mockedRecordRevision).toHaveBeenCalledWith(
      SELECTED_SITE_ID,
      'page-1',
      record,
      { source: 'manual' },
    );
  });
});
