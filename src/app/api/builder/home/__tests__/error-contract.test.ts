import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as homeRoute from '@/app/api/builder/home/route';
import * as publishChecksRoute from '@/app/api/builder/home/publish-checks/route';
import * as publishRoute from '@/app/api/builder/home/publish/route';
import * as revisionsRoute from '@/app/api/builder/home/revisions/route';
import * as rollbackRoute from '@/app/api/builder/home/revisions/rollback/route';
import {
  BuilderSnapshotConflictError,
  listBuilderHomeSnapshotHistory,
  publishBuilderHomeSnapshot,
  readBuilderHomeSnapshot,
  readBuilderHomeSnapshotHistoryDetail,
  rollbackBuilderHomeDraftToPublishedRevision,
  writeBuilderHomeSnapshot,
} from '@/lib/builder/persistence';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  BuilderPublishValidationError,
  validateBuilderHomeSnapshotForPublish,
} from '@/lib/builder/validation';
import {
  recordPageRollback,
  recordPublishBlocked,
  recordPublishFailure,
  recordPublishSuccess,
} from '@/lib/builder/audit/record';
import type { Locale } from '@/lib/locales';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'admin' })),
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
    validateBuilderHomeSnapshotForPublish: vi.fn(),
  };
});

vi.mock('@/lib/builder/persistence', () => {
  class BuilderSnapshotConflictError extends Error {
    constructor(readonly conflict: Record<string, unknown>) {
      super('Builder snapshot conflict');
      this.name = 'BuilderSnapshotConflictError';
    }
  }

  const normalizeBuilderHomeLocale = (value?: string | null): Locale => (
    value === 'zh-hant' || value === 'en' ? value : 'ko'
  );

  return {
    BuilderSnapshotConflictError,
    normalizeBuilderHomeLocale,
    isBuilderSnapshotKind: (value: string | null | undefined) => value === 'draft' || value === 'published',
    readBuilderHomeSnapshot: vi.fn(),
    writeBuilderHomeSnapshot: vi.fn(),
    publishBuilderHomeSnapshot: vi.fn(),
    listBuilderHomeSnapshotHistory: vi.fn(),
    readBuilderHomeSnapshotHistoryDetail: vi.fn(),
    rollbackBuilderHomeDraftToPublishedRevision: vi.fn(),
    buildBuilderHomeSnapshotResponse: vi.fn((result: Record<string, unknown>) => ({
      ok: true,
      storage: result.backend,
      persisted: 'persisted' in result ? result.persisted : true,
      snapshot: result.snapshot,
    })),
    buildBuilderHomeSnapshotHistoryListResponse: vi.fn((result: Record<string, unknown>) => ({
      ok: true,
      storage: result.backend,
      records: result.records,
    })),
    buildBuilderHomeSnapshotHistoryDetailResponse: vi.fn((result: Record<string, unknown>) => ({
      ok: true,
      storage: result.backend,
      record: result.record,
      snapshot: result.snapshot,
    })),
  };
});

const mockedGuardBuilderRead = vi.mocked(guardBuilderRead);
const mockedGuardMutation = vi.mocked(guardMutation);
const mockedReadBuilderHomeSnapshot = vi.mocked(readBuilderHomeSnapshot);
const mockedWriteBuilderHomeSnapshot = vi.mocked(writeBuilderHomeSnapshot);
const mockedPublishBuilderHomeSnapshot = vi.mocked(publishBuilderHomeSnapshot);
const mockedListBuilderHomeSnapshotHistory = vi.mocked(listBuilderHomeSnapshotHistory);
const mockedReadBuilderHomeSnapshotHistoryDetail = vi.mocked(readBuilderHomeSnapshotHistoryDetail);
const mockedRollbackBuilderHomeDraftToPublishedRevision = vi.mocked(rollbackBuilderHomeDraftToPublishedRevision);
const mockedValidateBuilderHomeSnapshotForPublish = vi.mocked(validateBuilderHomeSnapshotForPublish);
const mockedRecordPageRollback = vi.mocked(recordPageRollback);
const mockedRecordPublishBlocked = vi.mocked(recordPublishBlocked);
const mockedRecordPublishFailure = vi.mocked(recordPublishFailure);
const mockedRecordPublishSuccess = vi.mocked(recordPublishSuccess);

function makeSnapshot(locale: Locale = 'ko', kind: 'draft' | 'published' = 'draft', revision = 7) {
  return {
    version: 1,
    kind,
    pageKey: 'home',
    locale,
    revision,
    savedAt: '2026-06-03T00:10:00.000Z',
    updatedBy: 'admin',
    document: {
      version: 1,
      pageKey: 'home',
      locale,
      root: { id: 'root', children: [] },
    },
    state: { overrides: {} },
  };
}

function snapshotResult(locale: Locale = 'ko', kind: 'draft' | 'published' = 'draft', persisted = true) {
  return {
    backend: 'memory',
    persisted,
    snapshot: makeSnapshot(locale, kind),
  };
}

function writeResult(locale: Locale = 'ko', kind: 'draft' | 'published' = 'draft') {
  return {
    backend: 'memory',
    snapshot: makeSnapshot(locale, kind, 8),
  };
}

function request(path: string, body?: unknown): NextRequest {
  const init = body === undefined
    ? undefined
    : {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: typeof body === 'string' ? body : JSON.stringify(body),
      };
  return new NextRequest(`https://law.example.test${path}`, init);
}

function putRequest(path: string, body: unknown): NextRequest {
  return new NextRequest(`https://law.example.test${path}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function conflict(locale: Locale = 'ko', kind: 'draft' | 'published' = 'draft') {
  return new BuilderSnapshotConflictError({
    kind,
    locale,
    expectedRevision: 6,
    currentSnapshot: makeSnapshot(locale, kind),
  } as never);
}

describe('/api/builder/home stable error contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGuardBuilderRead.mockReturnValue({ username: 'admin' } as never);
    mockedGuardMutation.mockResolvedValue({
      user: { id: 'admin-1', email: 'admin@example.test' },
    } as never);
    mockedReadBuilderHomeSnapshot.mockImplementation(async (kind, locale) => (
      snapshotResult(locale, kind)
    ) as never);
    mockedWriteBuilderHomeSnapshot.mockImplementation(async (input) => (
      writeResult(input.locale, input.kind)
    ) as never);
    mockedPublishBuilderHomeSnapshot.mockImplementation(async (locale) => (
      writeResult(locale, 'published')
    ) as never);
    mockedListBuilderHomeSnapshotHistory.mockResolvedValue({ backend: 'memory', records: [] } as never);
    mockedReadBuilderHomeSnapshotHistoryDetail.mockResolvedValue({
      backend: 'memory',
      record: { revisionId: 'rev-1', revision: 1 },
      snapshot: makeSnapshot('ko', 'published', 1),
    } as never);
    mockedRollbackBuilderHomeDraftToPublishedRevision.mockResolvedValue({
      ...writeResult('ko', 'draft'),
      sourceRevisionId: 'rev-1',
      sourceRevision: 1,
      sourceSavedAt: '2026-06-03T00:00:00.000Z',
      sourceUpdatedBy: 'admin',
    } as never);
    mockedValidateBuilderHomeSnapshotForPublish.mockResolvedValue(undefined);
    mockedRecordPageRollback.mockResolvedValue(undefined);
    mockedRecordPublishBlocked.mockResolvedValue(undefined);
    mockedRecordPublishFailure.mockResolvedValue(undefined);
    mockedRecordPublishSuccess.mockResolvedValue(undefined);
  });

  it('localizes invalid home snapshot kind errors', async () => {
    const response = await homeRoute.GET(request('/api/builder/home?kind=backup&locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認首頁快照類型。',
      errorCode: 'home_snapshot_kind_invalid',
    });
    expect(mockedReadBuilderHomeSnapshot).not.toHaveBeenCalled();
  });

  it('does not expose raw home snapshot read failures', async () => {
    mockedReadBuilderHomeSnapshot.mockRejectedValueOnce(new Error('blob read token leaked'));
    const response = await homeRoute.GET(request('/api/builder/home?kind=draft&locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load the home snapshot.',
      errorCode: 'home_snapshot_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('blob read token leaked');
  });

  it('returns localized invalid JSON errors for home snapshot saves', async () => {
    const response = await homeRoute.PUT(putRequest('/api/builder/home?locale=zh-hant', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedWriteBuilderHomeSnapshot).not.toHaveBeenCalled();
  });

  it('returns stable-code JSON for home snapshot save conflicts', async () => {
    mockedWriteBuilderHomeSnapshot.mockRejectedValueOnce(conflict('ko', 'draft'));
    const response = await homeRoute.PUT(
      putRequest('/api/builder/home?locale=ko', {
        document: makeSnapshot('ko').document,
        state: { overrides: {} },
        expectedRevision: 6,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.error).toBe('다른 변경 사항이 먼저 저장되었습니다. 최신 홈 스냅샷을 다시 불러와 주세요.');
    expect(payload.errorCode).toBe('home_snapshot_save_conflict');
    expect(payload.conflict.currentSnapshot.revision).toBe(7);
  });

  it('does not expose raw home snapshot save failures', async () => {
    mockedWriteBuilderHomeSnapshot.mockRejectedValueOnce(new Error('write lock leaked'));
    const response = await homeRoute.PUT(
      putRequest('/api/builder/home?locale=en', {
        document: makeSnapshot('en').document,
        state: { overrides: {} },
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to save the home snapshot.',
      errorCode: 'home_snapshot_save_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('write lock leaked');
  });

  it('returns stable-code JSON when publish checks have no draft', async () => {
    mockedReadBuilderHomeSnapshot.mockResolvedValueOnce(snapshotResult('ko', 'draft', false) as never);
    const response = await publishChecksRoute.POST(request('/api/builder/home/publish-checks?locale=ko', {}));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '게시할 홈 초안을 찾을 수 없습니다.',
      errorCode: 'home_publish_draft_not_found',
    });
  });

  it('does not expose raw publish-check failures', async () => {
    mockedReadBuilderHomeSnapshot.mockRejectedValueOnce(new Error('asset read failed internally'));
    const response = await publishChecksRoute.POST(request('/api/builder/home/publish-checks?locale=en', {}));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to publish the home snapshot.',
      errorCode: 'home_publish_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('asset read failed internally');
  });

  it('returns stable-code JSON when home publish has no draft', async () => {
    mockedReadBuilderHomeSnapshot.mockImplementationOnce(async () => (
      snapshotResult('zh-hant', 'draft', false)
    ) as never);
    const response = await publishRoute.POST(request('/api/builder/home/publish?locale=zh-hant', {}));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到可發布的首頁草稿。',
      errorCode: 'home_publish_draft_not_found',
    });
    expect(mockedRecordPublishFailure).toHaveBeenCalledWith(expect.objectContaining({ reason: 'draft_not_found' }));
  });

  it('returns stable-code JSON for home publish validation blockers', async () => {
    const issue = {
      code: 'builder_asset_not_found' as const,
      message: 'raw issue detail',
      sectionId: 'section-1',
      sectionKey: 'hero',
      sectionTitle: 'Hero',
      surfaceId: 'image',
      src: 'builder-asset://missing',
    };
    mockedPublishBuilderHomeSnapshot.mockRejectedValueOnce(new BuilderPublishValidationError([issue]) as never);
    const response = await publishRoute.POST(request('/api/builder/home/publish?locale=en', {}));
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toEqual({
      ok: false,
      error: 'The home snapshot did not pass pre-publish validation.',
      errorCode: 'home_publish_validation_failed',
      issues: [issue],
    });
    expect(mockedRecordPublishBlocked).toHaveBeenCalledWith(expect.objectContaining({ blockerCount: 1 }));
  });

  it('returns stable-code JSON for home publish conflicts', async () => {
    mockedPublishBuilderHomeSnapshot.mockRejectedValueOnce(conflict('ko', 'published'));
    const response = await publishRoute.POST(request('/api/builder/home/publish?locale=ko', {}));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.errorCode).toBe('home_publish_conflict');
    expect(payload.error).toBe('다른 변경 사항이 먼저 저장되었습니다. 최신 홈 스냅샷을 다시 불러온 뒤 게시해 주세요.');
    expect(payload.conflict.kind).toBe('published');
  });

  it('does not expose raw home publish failures', async () => {
    mockedPublishBuilderHomeSnapshot.mockRejectedValueOnce(new Error('publish secret leaked'));
    const response = await publishRoute.POST(request('/api/builder/home/publish?locale=en', {}));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to publish the home snapshot.',
      errorCode: 'home_publish_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('publish secret leaked');
  });

  it('returns stable-code JSON when a home revision is missing', async () => {
    mockedReadBuilderHomeSnapshotHistoryDetail.mockResolvedValueOnce({
      backend: 'memory',
      record: null,
      snapshot: null,
    } as never);
    const response = await revisionsRoute.GET(
      request('/api/builder/home/revisions?revisionId=rev-missing&locale=zh-hant'),
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到首頁修訂。',
      errorCode: 'home_revision_not_found',
    });
  });

  it('does not expose raw home revision list failures', async () => {
    mockedListBuilderHomeSnapshotHistory.mockRejectedValueOnce(new Error('revision store leaked'));
    const response = await revisionsRoute.GET(request('/api/builder/home/revisions?locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load home revisions.',
      errorCode: 'home_revisions_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('revision store leaked');
  });

  it('returns localized invalid JSON errors for home rollback', async () => {
    const response = await rollbackRoute.POST(request('/api/builder/home/revisions/rollback?locale=zh-hant', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedRollbackBuilderHomeDraftToPublishedRevision).not.toHaveBeenCalled();
  });

  it('requires a home rollback revision id', async () => {
    const response = await rollbackRoute.POST(request('/api/builder/home/revisions/rollback?locale=ko', {}));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '롤백할 홈 리비전을 선택해 주세요.',
      errorCode: 'home_rollback_revision_required',
    });
    expect(mockedRollbackBuilderHomeDraftToPublishedRevision).not.toHaveBeenCalled();
  });

  it('returns stable-code JSON when a home rollback target is missing', async () => {
    mockedRollbackBuilderHomeDraftToPublishedRevision.mockResolvedValueOnce(null);
    const response = await rollbackRoute.POST(
      request('/api/builder/home/revisions/rollback?locale=zh-hant', { revisionId: 'rev-missing' }),
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到已發布的首頁修訂紀錄。',
      errorCode: 'home_rollback_revision_not_found',
    });
  });

  it('returns stable-code JSON for home rollback conflicts', async () => {
    mockedRollbackBuilderHomeDraftToPublishedRevision.mockRejectedValueOnce(conflict('ko', 'draft'));
    const response = await rollbackRoute.POST(
      request('/api/builder/home/revisions/rollback?locale=ko', { revisionId: 'rev-1' }),
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.errorCode).toBe('home_rollback_conflict');
    expect(payload.error).toBe('다른 변경 사항이 먼저 저장되었습니다. 최신 공유 초안을 다시 불러온 뒤 롤백해 주세요.');
    expect(payload.conflict.kind).toBe('draft');
  });

  it('does not expose raw home rollback failures', async () => {
    mockedRollbackBuilderHomeDraftToPublishedRevision.mockRejectedValueOnce(new Error('rollback secret leaked'));
    const response = await rollbackRoute.POST(
      request('/api/builder/home/revisions/rollback?locale=en', { revisionId: 'rev-1' }),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to complete the home snapshot rollback.',
      errorCode: 'home_rollback_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('rollback secret leaked');
  });
});
