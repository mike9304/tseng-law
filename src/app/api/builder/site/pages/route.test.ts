import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { revalidatePath } from 'next/cache';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  createPage,
  listPages,
  readPageCanvas,
  readPageCanvasRecordState,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { SEED_DRAFT_UPDATED_BY } from '@/lib/builder/canvas/home-draft-reseed';
import { createDefaultCanvasDocument } from '@/lib/builder/canvas/types';
import { createDefaultSiteDocument, type BuilderPageMeta, type BuilderSiteDocument } from '@/lib/builder/site/types';
import { SiteInvariantError } from '@/lib/builder/site/site-invariants';
import * as route from '@/app/api/builder/site/pages/route';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'edit-pages',
  })),
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  createPage: vi.fn(),
  listPages: vi.fn(),
  readPageCanvas: vi.fn(),
  readPageCanvasRecordState: vi.fn(),
  readSiteDocument: vi.fn(),
  writePageCanvas: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedCreatePage = vi.mocked(createPage);
const mockedListPages = vi.mocked(listPages);
const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedReadPageCanvasRecordState = vi.mocked(readPageCanvasRecordState);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWritePageCanvas = vi.mocked(writePageCanvas);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages${query}`);
}

function postRequest(body: unknown, query = '', headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function pageMeta(overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: 'page-about',
    slug: 'about',
    title: { ko: '회사소개', 'zh-hant': '關於我們', en: 'About' },
    locale: 'en',
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
    ...overrides,
  };
}

function pageCanvasRecordState(revision: number, savedAt: string): NonNullable<Awaited<ReturnType<typeof readPageCanvasRecordState>>> {
  return {
    record: {
      revision,
      savedAt,
      document: createDefaultCanvasDocument('en'),
    },
    isEnvelope: true,
  };
}

describe('/api/builder/site/pages', () => {
  let site: BuilderSiteDocument;
  let createdPage: BuilderPageMeta;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValue({
      username: 'admin',
      permission: 'edit-pages',
    });
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    vi.mocked(revalidatePath).mockImplementation(() => undefined);
    site = createDefaultSiteDocument('ko', 'default');
    site.pages.push(pageMeta({ pageId: 'page-about', slug: 'about', locale: 'en' }));
    createdPage = pageMeta({ pageId: 'page-new', slug: 'new-page', locale: 'ko' });
    mockedListPages.mockResolvedValue(site.pages);
    mockedReadPageCanvasRecordState.mockResolvedValue(null);
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedCreatePage.mockResolvedValue(createdPage);
    mockedReadPageCanvas.mockResolvedValue(null);
    mockedWritePageCanvas.mockResolvedValue(undefined);
    mockedWriteSiteDocument.mockResolvedValue(undefined);
  });

  it('returns localized stable-code JSON when page listing fails', async () => {
    mockedListPages.mockRejectedValueOnce(new Error('raw list failure'));
    const response = await route.GET(getRequest('?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      success: false,
      error: '無法載入頁面清單。',
      errorCode: 'pages_list_failed',
    });
    expect(data.error).not.toContain('raw list failure');
  });

  it('requires edit-pages and does not list pages when permission is denied', async () => {
    vi.mocked(guardBuilderReadWithPermission).mockResolvedValueOnce(
      NextResponse.json({ error: 'Missing permission: edit-pages' }, { status: 403 }),
    );

    const response = await route.GET(getRequest('?locale=ko&siteId=workspace-site-b'));

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermission).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'edit-pages',
    );
    expect(mockedListPages).not.toHaveBeenCalled();
    expect(mockedReadPageCanvasRecordState).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for malformed create payloads', async () => {
    const response = await route.POST(postRequest('{', '?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      success: false,
      error: 'Check the site request format.',
      errorCode: 'invalid_json',
    });
    expect(mockedCreatePage).not.toHaveBeenCalled();
  });

  it.each([
    [{ locale: 'ko', slug: 'blocked', title: 'Blocked', siteId: ['workspace-site-b'] }, ''],
    [{ locale: 'ko', slug: 'blocked', title: 'Blocked' }, '?siteId=..%2F..%2Fx'],
  ])('rejects a supplied invalid create site id before canonical persistence access', async (body, query) => {
    const response = await route.POST(postRequest(body, query));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({ ok: false, success: false, errorCode: 'invalid_site_id' });
    expect(mockedReadSiteDocument).not.toHaveBeenCalled();
    expect(mockedCreatePage).not.toHaveBeenCalled();
    expect(mockedWritePageCanvas).not.toHaveBeenCalled();
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('lists pages from the selected workspace site', async () => {
    const response = await route.GET(getRequest('?locale=ko&siteId=workspace-site-b'));

    expect(response.status).toBe(200);
    expect(mockedListPages).toHaveBeenCalledWith('workspace-site-b', 'ko');
  });

  it('marks a published page with a newer draft record as having unpublished changes', async () => {
    mockedListPages.mockResolvedValue([
      pageMeta({
        pageId: 'page-live',
        publishedAt: '2026-06-03T00:00:00.000Z',
        publishedSavedAt: '2026-06-03T00:00:00.000Z',
        lastPublishedDraftRevision: 3,
      }),
    ]);
    mockedReadPageCanvasRecordState.mockResolvedValue(pageCanvasRecordState(4, '2026-06-03T00:10:00.000Z'));

    const response = await route.GET(getRequest('?locale=en&siteId=workspace-site-b'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockedReadPageCanvasRecordState).toHaveBeenCalledWith('workspace-site-b', 'page-live', 'draft');
    expect(data.pages[0]).toMatchObject({
      pageId: 'page-live',
      draftSavedAt: '2026-06-03T00:10:00.000Z',
      draftRevision: 4,
      hasUnpublishedChanges: true,
    });
  });

  it('falls back to draft timestamps when published draft revision metadata is absent', async () => {
    mockedListPages.mockResolvedValue([
      pageMeta({
        pageId: 'page-legacy-published',
        publishedAt: '2026-06-03T00:00:00.000Z',
        publishedSavedAt: '2026-06-03T00:00:00.000Z',
      }),
    ]);
    mockedReadPageCanvasRecordState.mockResolvedValue(pageCanvasRecordState(0, '2026-06-03T00:10:00.000Z'));

    const response = await route.GET(getRequest('?locale=en&siteId=workspace-site-b'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pages[0]).toMatchObject({
      pageId: 'page-legacy-published',
      draftSavedAt: '2026-06-03T00:10:00.000Z',
      draftRevision: 0,
      hasUnpublishedChanges: true,
    });
  });

  it('does not mark a never-published draft page as having unpublished changes', async () => {
    mockedListPages.mockResolvedValue([
      pageMeta({
        pageId: 'page-draft',
      }),
    ]);
    mockedReadPageCanvasRecordState.mockResolvedValue(pageCanvasRecordState(7, '2026-06-03T00:10:00.000Z'));

    const response = await route.GET(getRequest('?locale=en&siteId=workspace-site-b'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pages[0]).toMatchObject({
      pageId: 'page-draft',
      draftSavedAt: '2026-06-03T00:10:00.000Z',
      draftRevision: 7,
      hasUnpublishedChanges: false,
    });
  });

  it('does not mark a published page when the draft revision is not newer', async () => {
    mockedListPages.mockResolvedValue([
      pageMeta({
        pageId: 'page-current',
        publishedAt: '2026-06-03T00:00:00.000Z',
        publishedSavedAt: '2026-06-03T00:00:00.000Z',
        lastPublishedDraftRevision: 5,
      }),
    ]);
    mockedReadPageCanvasRecordState.mockResolvedValue(pageCanvasRecordState(5, '2026-06-03T00:20:00.000Z'));

    const response = await route.GET(getRequest('?locale=en&siteId=workspace-site-b'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pages[0]).toMatchObject({
      pageId: 'page-current',
      draftSavedAt: '2026-06-03T00:20:00.000Z',
      draftRevision: 5,
      hasUnpublishedChanges: false,
    });
  });

  it('returns localized stable-code JSON for unsupported dynamic list collections', async () => {
    const response = await route.POST(postRequest({
      locale: 'zh-hant',
      slug: 'bad-list',
      dynamicListCollectionId: 'unsupported',
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      success: false,
      errorCode: 'unsupported_dynamic_list_collection',
    });
    expect(data.error).toContain('集合');
    expect(mockedCreatePage).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for invalid slugs', async () => {
    const response = await route.POST(postRequest({ locale: 'ko', slug: 'Bad Slug!' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      success: false,
      error: '페이지 주소는 영문 소문자, 숫자, 하이픈, 슬래시 구분 경로만 사용할 수 있습니다.',
      errorCode: 'invalid_slug',
    });
    expect(mockedCreatePage).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for duplicate slugs without creating a page', async () => {
    const response = await route.POST(postRequest({ locale: 'en', slug: 'about', title: 'About' }));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toMatchObject({
      ok: false,
      success: false,
      error: 'A page with this slug already exists in the same language.',
      errorCode: 'duplicate_slug',
      pageId: 'page-about',
    });
    expect(mockedCreatePage).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when creating a page fails', async () => {
    mockedCreatePage.mockRejectedValueOnce(new Error('raw create failure'));
    const response = await route.POST(postRequest({ locale: 'en', slug: 'contact', title: 'Contact' }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      success: false,
      error: 'Unable to create the page.',
      errorCode: 'page_create_failed',
    });
    expect(data.error).not.toContain('raw create failure');
  });

  it('surfaces a concurrent create invariant conflict as sanitized 409 JSON', async () => {
    mockedCreatePage.mockRejectedValueOnce(new SiteInvariantError([{
      code: 'ROUTE_DUPLICATE',
      message: 'raw storage conflict with private details',
      pageId: 'page-new',
      conflictingPageId: 'page-racing-writer',
      locale: 'en',
      slug: 'contact',
      field: 'slug',
    }]));

    const response = await route.POST(postRequest({ locale: 'en', slug: 'contact', title: 'Contact' }));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toMatchObject({
      ok: false,
      success: false,
      error: 'Unable to create the page.',
      errorCode: 'site_invariant_conflict',
      issues: [{
        code: 'ROUTE_DUPLICATE',
        pageId: 'page-new',
        conflictingPageId: 'page-racing-writer',
        locale: 'en',
        slug: 'contact',
        field: 'slug',
      }],
    });
    expect(JSON.stringify(data)).not.toContain('raw storage conflict');
    expect(data.issues[0]).not.toHaveProperty('message');
    expect(data).not.toHaveProperty('stack');
  });

  it('preserves the page create success shape', async () => {
    const response = await route.POST(postRequest({ locale: 'ko', slug: 'new-page', title: '새 페이지' }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      success: true,
      pageId: 'page-new',
      page: { pageId: 'page-new', slug: 'new-page' },
    });
    expect(mockedWritePageCanvas).toHaveBeenCalledWith(DEFAULT_BUILDER_SITE_ID, 'page-new', 'draft', expect.objectContaining({
      locale: 'ko',
    }), { updatedBy: SEED_DRAFT_UPDATED_BY });
  });

  it('creates pages in the selected workspace site resolved from the editor referer', async () => {
    const response = await route.POST(postRequest(
      { locale: 'ko', slug: 'workspace-page', title: '작업 공간 페이지', siteId: 'default' },
      '',
      { referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-site-b' },
    ));

    expect(response.status).toBe(200);
    expect(mockedCreatePage).toHaveBeenCalledWith('workspace-site-b', 'ko', 'workspace-page', '작업 공간 페이지');
    expect(mockedWritePageCanvas).toHaveBeenCalledWith('workspace-site-b', 'page-new', 'draft', expect.objectContaining({
      locale: 'ko',
    }), { updatedBy: SEED_DRAFT_UPDATED_BY });
  });
});
