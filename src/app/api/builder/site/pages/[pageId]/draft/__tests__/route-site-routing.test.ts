import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import { emitEditorPageSaveHook } from '@/lib/builder/apps/lifecycle-emitters';
import {
  canProjectPageToLocale,
  readPageCanvasRecordState,
  readSiteDocument,
  updatePageCanvasRecord,
} from '@/lib/builder/site/persistence';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { GET, PUT } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'admin' })),
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
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

function makeDocument(updatedBy: string): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-06-21T00:00:00.000Z',
    updatedBy,
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
  };
}

function recordState(document: BuilderCanvasDocument) {
  return {
    record: {
      revision: 3,
      savedAt: '2026-06-21T00:10:00.000Z',
      updatedBy: 'editor',
      document,
    },
    isEnvelope: true,
  };
}

function siteDocument() {
  return {
    version: 1,
    siteId: 'workspace-site-b',
    locale: 'ko',
    name: 'Workspace Site B',
    pages: [
      {
        pageId: 'site-b-home',
        slug: '',
        title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
        locale: 'ko',
        isHomePage: true,
        createdAt: '2026-06-21T00:00:00.000Z',
        updatedAt: '2026-06-21T00:00:00.000Z',
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
    createdAt: '2026-06-21T00:00:00.000Z',
    updatedAt: '2026-06-21T00:00:00.000Z',
  } satisfies Awaited<ReturnType<typeof readSiteDocument>>;
}

function routedRequest(method = 'GET', body?: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/pages/site-b-home/draft?locale=ko', {
    method,
    headers: {
      referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site-b&pageId=site-b-home',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe('/api/builder/site/pages/[pageId]/draft site routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderRead).mockReturnValue({ username: 'admin' });
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin' });
    vi.mocked(canProjectPageToLocale).mockReturnValue(true);
    vi.mocked(readSiteDocument).mockResolvedValue(siteDocument());
    vi.mocked(readPageCanvasRecordState).mockResolvedValue(recordState(makeDocument('site-b-draft')));
    vi.mocked(updatePageCanvasRecord).mockResolvedValue({
      revision: 4,
      savedAt: '2026-06-21T00:11:00.000Z',
      updatedBy: 'admin',
      document: makeDocument('site-b-saved'),
    });
  });

  it('loads drafts from the selected workspace site', async () => {
    const response = await GET(routedRequest(), { params: { pageId: 'site-b-home' } });

    expect(response.status).toBe(200);
    expect(readSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(readPageCanvasRecordState).toHaveBeenCalledWith('workspace-site-b', 'site-b-home', 'draft');
  });

  it('saves drafts and emits lifecycle hooks under the selected workspace site', async () => {
    const response = await PUT(
      routedRequest('PUT', { expectedRevision: 3, document: makeDocument('site-b-next') }),
      { params: { pageId: 'site-b-home' } },
    );

    expect(response.status).toBe(200);
    expect(updatePageCanvasRecord).toHaveBeenCalledWith(
      'workspace-site-b',
      'site-b-home',
      'draft',
      expect.any(Function),
    );
    expect(emitEditorPageSaveHook).toHaveBeenCalledWith({
      kind: 'editor.page-save',
      payload: {
        siteId: 'workspace-site-b',
        pageId: 'site-b-home',
        revision: 4,
        savedAt: '2026-06-21T00:11:00.000Z',
      },
    });
  });
});
