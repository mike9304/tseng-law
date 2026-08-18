import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as overviewRoute from '@/app/api/builder/sites/[siteId]/pages/[pageKey]/route';
import * as draftRoute from '@/app/api/builder/sites/[siteId]/pages/[pageKey]/draft/route';
import * as publishChecksRoute from '@/app/api/builder/sites/[siteId]/pages/[pageKey]/publish-checks/route';
import * as publishRoute from '@/app/api/builder/sites/[siteId]/pages/[pageKey]/publish/route';
import * as revisionsRoute from '@/app/api/builder/sites/[siteId]/pages/[pageKey]/revisions/route';
import * as rollbackRoute from '@/app/api/builder/sites/[siteId]/pages/[pageKey]/revisions/rollback/route';
import {
  BuilderSnapshotConflictError,
  listBuilderPageSnapshotHistory,
  publishBuilderPageSnapshot,
  readBuilderPageSnapshot,
  readBuilderPageSnapshotHistoryDetail,
  rollbackBuilderPageDraftToPublishedRevision,
  writeBuilderPageSnapshot,
} from '@/lib/builder/persistence';
import { readBuilderPageSnapshotOverview } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  BuilderPublishValidationError,
  validateBuilderSnapshotForPublish,
} from '@/lib/builder/validation';
import {
  recordPageRollback,
  recordPublishBlocked,
  recordPublishFailure,
  recordPublishSuccess,
} from '@/lib/builder/audit/record';
import type { BuilderPageSnapshot } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'admin@example.test' } })),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordPageRollback: vi.fn(async () => undefined),
  recordPublishBlocked: vi.fn(async () => undefined),
  recordPublishFailure: vi.fn(async () => undefined),
  recordPublishSuccess: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/validation', () => {
  class BuilderPublishValidationError extends Error {
    constructor(readonly issues: Array<Record<string, unknown>>) {
      super('Builder publish validation failed');
      this.name = 'BuilderPublishValidationError';
    }
  }

  return {
    BuilderPublishValidationError,
    validateBuilderSnapshotForPublish: vi.fn(async () => undefined),
  };
});

vi.mock('@/lib/builder/site', () => ({
  getBuilderPageConfig: vi.fn(() => ({ publicPath: '/' })),
  isBuilderPageKey: vi.fn((value: string) => ['home', 'about', 'contact'].includes(value)),
  isDefaultBuilderSiteId: vi.fn((value: string) => value === 'default'),
  readBuilderPageSnapshotOverview: vi.fn(),
}));

vi.mock('@/lib/builder/persistence', () => {
  class BuilderSnapshotConflictError extends Error {
    constructor(readonly conflict: Record<string, unknown>) {
      super('Builder snapshot conflict');
      this.name = 'BuilderSnapshotConflictError';
    }
  }

  return {
    BuilderSnapshotConflictError,
    isBuilderSnapshotKind: (value: string | null | undefined) => value === 'draft' || value === 'published',
    readBuilderPageSnapshot: vi.fn(),
    writeBuilderPageSnapshot: vi.fn(),
    publishBuilderPageSnapshot: vi.fn(),
    listBuilderPageSnapshotHistory: vi.fn(),
    readBuilderPageSnapshotHistoryDetail: vi.fn(),
    rollbackBuilderPageDraftToPublishedRevision: vi.fn(),
    buildBuilderSnapshotResponse: vi.fn((result: Record<string, unknown>) => ({
      ok: true,
      storage: result.backend,
      snapshot: result.snapshot,
    })),
    buildBuilderSnapshotHistoryListResponse: vi.fn((result: Record<string, unknown>) => ({
      ok: true,
      storage: result.backend,
      records: result.records,
    })),
    buildBuilderSnapshotHistoryDetailResponse: vi.fn((result: Record<string, unknown>) => ({
      ok: true,
      storage: result.backend,
      record: result.record,
      snapshot: result.snapshot,
    })),
  };
});

const mockedGuardMutation = vi.mocked(guardMutation);
const mockedReadBuilderPageSnapshotOverview = vi.mocked(readBuilderPageSnapshotOverview);
const mockedReadBuilderPageSnapshot = vi.mocked(readBuilderPageSnapshot);
const mockedWriteBuilderPageSnapshot = vi.mocked(writeBuilderPageSnapshot);
const mockedPublishBuilderPageSnapshot = vi.mocked(publishBuilderPageSnapshot);
const mockedListBuilderPageSnapshotHistory = vi.mocked(listBuilderPageSnapshotHistory);
const mockedReadBuilderPageSnapshotHistoryDetail = vi.mocked(readBuilderPageSnapshotHistoryDetail);
const mockedRollbackBuilderPageDraftToPublishedRevision = vi.mocked(rollbackBuilderPageDraftToPublishedRevision);
const mockedValidateBuilderSnapshotForPublish = vi.mocked(validateBuilderSnapshotForPublish);
const mockedRecordPageRollback = vi.mocked(recordPageRollback);
const mockedRecordPublishBlocked = vi.mocked(recordPublishBlocked);
const mockedRecordPublishFailure = vi.mocked(recordPublishFailure);
const mockedRecordPublishSuccess = vi.mocked(recordPublishSuccess);

function makeSnapshot(locale: Locale = 'ko', revision = 7): BuilderPageSnapshot {
  return {
    version: 1,
    kind: 'draft',
    pageKey: 'home',
    locale,
    revision,
    savedAt: '2026-06-03T00:10:00.000Z',
    updatedBy: 'admin',
    document: {
      version: 1,
      pageKey: 'home',
      locale,
      updatedAt: '2026-06-03T00:00:00.000Z',
      updatedBy: 'admin',
      root: { id: 'root', type: 'page', name: 'Home', pageKey: 'home', children: [] },
      datasets: [],
      sections: [],
    } as BuilderPageSnapshot['document'],
    state: {
      version: 1,
      faqItems: [],
      serviceItems: [],
      overrides: {},
      activeCollectionIndex: {},
    },
  };
}

function request(path: string, body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function putRequest(path: string, body: unknown): NextRequest {
  return new NextRequest(`https://law.example.test${path}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const params = { params: Promise.resolve({ siteId: 'default', pageKey: 'home' }) };

describe('/api/builder/sites/[siteId]/pages/[pageKey] lifecycle error contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGuardMutation.mockResolvedValue({
      user: { id: 'admin-1', email: 'admin@example.test' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    mockedReadBuilderPageSnapshotOverview.mockResolvedValue({
      page: { pageKey: 'home' },
    } as never);
    mockedReadBuilderPageSnapshot.mockResolvedValue({
      backend: 'file',
      persisted: true,
      snapshot: makeSnapshot(),
    });
    mockedWriteBuilderPageSnapshot.mockResolvedValue({
      backend: 'file',
      snapshot: makeSnapshot(),
    });
    mockedPublishBuilderPageSnapshot.mockResolvedValue({
      backend: 'file',
      snapshot: makeSnapshot('ko', 8),
    });
    mockedListBuilderPageSnapshotHistory.mockResolvedValue({
      backend: 'file',
      records: [],
    });
    mockedReadBuilderPageSnapshotHistoryDetail.mockResolvedValue({
      backend: 'file',
      record: null,
      snapshot: null,
    });
    mockedRollbackBuilderPageDraftToPublishedRevision.mockResolvedValue(null);
    mockedValidateBuilderSnapshotForPublish.mockResolvedValue(undefined);
    mockedRecordPageRollback.mockResolvedValue(undefined);
    mockedRecordPublishBlocked.mockResolvedValue(undefined);
    mockedRecordPublishFailure.mockResolvedValue(undefined);
    mockedRecordPublishSuccess.mockResolvedValue(undefined);
  });

  it('does not expose raw overview load failures', async () => {
    mockedReadBuilderPageSnapshotOverview.mockRejectedValueOnce(new Error('overview storage secret leaked'));

    const response = await overviewRoute.GET(
      request('/api/builder/sites/default/pages/home?locale=en'),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load the page draft.',
      errorCode: 'draft_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('overview storage secret leaked');
  });

  it('returns localized invalid JSON errors for page draft saves', async () => {
    const response = await draftRoute.PUT(
      putRequest('/api/builder/sites/default/pages/home/draft?locale=zh-hant', '{'),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedWriteBuilderPageSnapshot).not.toHaveBeenCalled();
  });

  it('returns stable-code JSON for page draft save conflicts', async () => {
    mockedWriteBuilderPageSnapshot.mockRejectedValueOnce(
      new BuilderSnapshotConflictError({ kind: 'draft', locale: 'ko', currentSnapshot: makeSnapshot() }) as never,
    );

    const response = await draftRoute.PUT(
      putRequest('/api/builder/sites/default/pages/home/draft?locale=ko', {
        document: makeSnapshot().document,
        state: makeSnapshot().state,
        expectedRevision: 6,
      }),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.errorCode).toBe('draft_conflict');
    expect(payload.error).toBe('다른 변경 사항이 먼저 저장되었습니다. 최신 초안을 다시 불러와 주세요.');
    expect(payload.conflict.currentSnapshot.revision).toBe(7);
  });

  it('does not expose raw page draft save failures', async () => {
    mockedWriteBuilderPageSnapshot.mockRejectedValueOnce(new Error('draft write secret leaked'));

    const response = await draftRoute.PUT(
      putRequest('/api/builder/sites/default/pages/home/draft?locale=en', {
        document: makeSnapshot('en').document,
        state: makeSnapshot('en').state,
      }),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to save the page draft.',
      errorCode: 'draft_save_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('draft write secret leaked');
  });

  it('returns stable-code JSON when publish checks have no draft', async () => {
    mockedReadBuilderPageSnapshot.mockResolvedValueOnce({
      backend: 'file',
      persisted: false,
      snapshot: makeSnapshot('en'),
    });

    const response = await publishChecksRoute.POST(
      request('/api/builder/sites/default/pages/home/publish-checks?locale=en', {}),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Page draft not found.',
      errorCode: 'draft_not_found',
    });
  });

  it('does not expose raw publish-check failures', async () => {
    mockedReadBuilderPageSnapshot.mockRejectedValueOnce(new Error('publish check secret leaked'));

    const response = await publishChecksRoute.POST(
      request('/api/builder/sites/default/pages/home/publish-checks?locale=ko', {}),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '게시 전 점검을 실행하지 못했습니다.',
      errorCode: 'publish_checks_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('publish check secret leaked');
  });

  it('denies an editor page publish before publishing the snapshot', async () => {
    mockedGuardMutation.mockResolvedValue(
      NextResponse.json({ error: 'Missing permission: publish' }, { status: 403 }) as never,
    );

    const response = await publishRoute.POST(
      request('/api/builder/sites/default/pages/home/publish?locale=ko', {}),
      params,
    );

    expect(response.status).toBe(403);
    expect(mockedGuardMutation).toHaveBeenCalledWith(
      expect.any(NextRequest),
      { bucket: 'publish', permission: 'publish' },
    );
    expect(mockedPublishBuilderPageSnapshot).not.toHaveBeenCalled();
  });

  it('returns stable-code JSON when page publish has no draft', async () => {
    mockedReadBuilderPageSnapshot.mockResolvedValueOnce({
      backend: 'file',
      persisted: false,
      snapshot: makeSnapshot('en'),
    });

    const response = await publishRoute.POST(
      request('/api/builder/sites/default/pages/home/publish?locale=en', {}),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Page draft not found.',
      errorCode: 'draft_not_found',
    });
    expect(mockedRecordPublishFailure).toHaveBeenCalledWith(expect.objectContaining({ reason: 'draft_not_found' }));
  });

  it('returns stable-code JSON for page publish validation blockers', async () => {
    const issue = {
      code: 'builder_asset_not_found' as const,
      message: 'raw issue detail',
      sectionId: 'section-1',
      sectionKey: 'hero',
      sectionTitle: 'Hero',
      surfaceId: 'image',
      src: 'builder-asset://missing',
    };
    mockedPublishBuilderPageSnapshot.mockRejectedValueOnce(
      new BuilderPublishValidationError([issue]) as never,
    );

    const response = await publishRoute.POST(
      request('/api/builder/sites/default/pages/home/publish?locale=zh-hant', {}),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toEqual({
      ok: false,
      error: '頁面未通過發布前驗證。',
      errorCode: 'page_publish_validation_failed',
      issues: [issue],
    });
    expect(mockedRecordPublishBlocked).toHaveBeenCalledWith(expect.objectContaining({ blockerCount: 1 }));
  });

  it('returns stable-code JSON for page publish conflicts', async () => {
    mockedPublishBuilderPageSnapshot.mockRejectedValueOnce(
      new BuilderSnapshotConflictError({ kind: 'published', locale: 'ko', currentSnapshot: makeSnapshot() }) as never,
    );

    const response = await publishRoute.POST(
      request('/api/builder/sites/default/pages/home/publish?locale=ko', {}),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.errorCode).toBe('page_publish_conflict');
    expect(payload.error).toBe('다른 변경 사항이 먼저 저장되었습니다. 최신 초안을 다시 불러온 뒤 게시해 주세요.');
    expect(payload.conflict.kind).toBe('published');
  });

  it('does not expose raw page publish failures', async () => {
    mockedPublishBuilderPageSnapshot.mockRejectedValueOnce(new Error('publish write secret leaked'));

    const response = await publishRoute.POST(
      request('/api/builder/sites/default/pages/home/publish?locale=en', {}),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to publish the page.',
      errorCode: 'page_publish_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('publish write secret leaked');
    expect(mockedRecordPublishFailure).toHaveBeenCalledWith(expect.objectContaining({ reason: 'unexpected_error' }));
  });

  it('returns localized stable-code JSON for invalid revision kinds', async () => {
    const response = await revisionsRoute.GET(
      request('/api/builder/sites/default/pages/home/revisions?locale=zh-hant&kind=latest'),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認修訂類型。',
      errorCode: 'revision_kind_invalid',
    });
    expect(mockedListBuilderPageSnapshotHistory).not.toHaveBeenCalled();
  });

  it('returns stable-code JSON when a page revision is missing', async () => {
    const response = await revisionsRoute.GET(
      request('/api/builder/sites/default/pages/home/revisions?locale=ko&revisionId=rev-missing'),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '페이지 리비전을 찾을 수 없습니다.',
      errorCode: 'revision_not_found',
    });
  });

  it('does not expose raw page revision list failures', async () => {
    mockedListBuilderPageSnapshotHistory.mockRejectedValueOnce(new Error('revision storage leaked'));

    const response = await revisionsRoute.GET(
      request('/api/builder/sites/default/pages/home/revisions?locale=en'),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load the page revision.',
      errorCode: 'revision_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('revision storage leaked');
  });

  it('returns localized invalid JSON errors for page rollback', async () => {
    const response = await rollbackRoute.POST(
      request('/api/builder/sites/default/pages/home/revisions/rollback?locale=zh-hant', '{'),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedRollbackBuilderPageDraftToPublishedRevision).not.toHaveBeenCalled();
  });

  it('requires a page rollback revision id', async () => {
    const response = await rollbackRoute.POST(
      request('/api/builder/sites/default/pages/home/revisions/rollback?locale=ko', {}),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '롤백할 리비전을 선택해 주세요.',
      errorCode: 'rollback_revision_required',
    });
    expect(mockedRollbackBuilderPageDraftToPublishedRevision).not.toHaveBeenCalled();
  });

  it('returns stable-code JSON when a page rollback target is missing', async () => {
    const response = await rollbackRoute.POST(
      request('/api/builder/sites/default/pages/home/revisions/rollback?locale=zh-hant', { revisionId: 'rev-missing' }),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到頁面修訂。',
      errorCode: 'revision_not_found',
    });
  });

  it('returns stable-code JSON for page rollback conflicts', async () => {
    mockedRollbackBuilderPageDraftToPublishedRevision.mockRejectedValueOnce(
      new BuilderSnapshotConflictError({ kind: 'draft', locale: 'ko', currentSnapshot: makeSnapshot() }) as never,
    );

    const response = await rollbackRoute.POST(
      request('/api/builder/sites/default/pages/home/revisions/rollback?locale=ko', { revisionId: 'rev-1' }),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.errorCode).toBe('draft_conflict');
    expect(payload.error).toBe('다른 변경 사항이 먼저 저장되었습니다. 최신 초안을 다시 불러와 주세요.');
    expect(payload.conflict.kind).toBe('draft');
  });

  it('does not expose raw page rollback failures', async () => {
    mockedRollbackBuilderPageDraftToPublishedRevision.mockRejectedValueOnce(new Error('rollback secret leaked'));

    const response = await rollbackRoute.POST(
      request('/api/builder/sites/default/pages/home/revisions/rollback?locale=en', { revisionId: 'rev-1' }),
      params,
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to complete the page rollback.',
      errorCode: 'rollback_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('rollback secret leaked');
  });
});
