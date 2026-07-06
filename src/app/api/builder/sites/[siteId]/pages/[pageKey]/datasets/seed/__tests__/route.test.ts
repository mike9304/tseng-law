import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { createDefaultBuilderPageDatasets } from '@/lib/builder/datasets';
import {
  BuilderSnapshotConflictError,
  readBuilderPageSnapshot,
  writeBuilderPageSnapshot,
} from '@/lib/builder/persistence';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderPageSnapshot } from '@/lib/builder/types';
import * as route from '@/app/api/builder/sites/[siteId]/pages/[pageKey]/datasets/seed/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  getAllColumnPostsIncludingBlob: vi.fn(),
}));

vi.mock('@/lib/builder/persistence', () => ({
  BuilderSnapshotConflictError: class BuilderSnapshotConflictError extends Error {
    conflict: unknown;
    constructor(conflict: unknown) {
      super('Builder snapshot conflict');
      this.name = 'BuilderSnapshotConflictError';
      this.conflict = conflict;
    }
  },
  readBuilderPageSnapshot: vi.fn(),
  writeBuilderPageSnapshot: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
}));

const mockedGuardMutation = vi.mocked(guardMutation);
const mockedReadBuilderPageSnapshot = vi.mocked(readBuilderPageSnapshot);
const mockedWriteBuilderPageSnapshot = vi.mocked(writeBuilderPageSnapshot);
const mockedGetAllColumnPostsIncludingBlob = vi.mocked(getAllColumnPostsIncludingBlob);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);

function makeSnapshot(): BuilderPageSnapshot {
  return {
    version: 1,
    kind: 'draft',
    pageKey: 'home',
    locale: 'ko',
    revision: 12,
    savedAt: '2026-05-29T00:00:00.000Z',
    updatedBy: 'builder-api',
    document: {
      version: 1,
      pageKey: 'home',
      root: { id: 'page-root', type: 'page', name: 'Home', pageKey: 'home', children: [] },
      datasets: createDefaultBuilderPageDatasets('home'),
      sections: [],
      locale: 'ko',
      updatedAt: '2026-05-29T00:00:00.000Z',
      updatedBy: 'builder-api',
    } as unknown as BuilderPageSnapshot['document'],
    state: {
      version: 1,
      faqItems: [],
      serviceItems: [],
      overrides: {},
      activeCollectionIndex: {},
    },
  };
}

describe('/api/builder/sites/[siteId]/pages/[pageKey]/datasets/seed', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGuardMutation.mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    mockedReadBuilderPageSnapshot.mockResolvedValue({
      backend: 'file',
      persisted: true,
      snapshot: makeSnapshot(),
    });
    mockedGetAllColumnPostsIncludingBlob.mockResolvedValue([]);
    mockedReadSiteDocument.mockResolvedValue({ cmsCollections: [] } as never);
    mockedWriteBuilderPageSnapshot.mockImplementation(async (input) => ({
      backend: 'file',
      snapshot: {
        ...makeSnapshot(),
        revision: 13,
        savedAt: '2026-05-29T00:05:00.000Z',
        document: input.document,
        state: input.state,
      },
    }));
  });

  it('seeds the target back to defaults and returns updated overviews', async () => {
    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/seed?locale=ko', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
          expectedRevision: 12,
        }),
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();
    const writeInput = mockedWriteBuilderPageSnapshot.mock.calls[0]?.[0];

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(writeInput?.expectedRevision).toBe(12);
    expect(writeInput?.document.datasets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          limit: 6,
          filters: [],
          sort: [],
        }),
      ]),
    );
    expect(payload.targets.find((target: { targetId: string }) => target.targetId === 'home.services.list')).toMatchObject({
      currentBinding: {
        collectionId: 'service-areas',
        limit: 6,
        filters: [],
        sort: [],
      },
    });
  });

  it('requires the current draft revision before seeding defaults', async () => {
    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/seed?locale=ko', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
        }),
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(428);
    expect(payload).toEqual({
      ok: false,
      error: '최신 페이지 리비전이 필요합니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
      errorCode: 'page_dataset_expected_revision_required',
      current: {
        revision: 12,
        savedAt: '2026-05-29T00:00:00.000Z',
      },
    });
    expect(mockedWriteBuilderPageSnapshot).not.toHaveBeenCalled();
  });

  it('rejects malformed expected revisions before seeding defaults', async () => {
    const malformedRequests = [
      { expectedRevision: '12' },
      { expectedRevision: 12.5 },
      { expectedRevision: -1 },
    ] as const;

    for (const requestBody of malformedRequests) {
      const response = await route.POST(
        new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/seed?locale=en', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            locale: 'en',
            targetId: 'home.services.list',
            ...requestBody,
          }),
        }),
        { params: { siteId: 'default', pageKey: 'home' } },
      );
      const payload = await response.json();

      expect(response.status).toBe(428);
      expect(payload).toEqual({
        ok: false,
        error: 'The latest page revision is required. Refresh the page and try again.',
        errorCode: 'page_dataset_expected_revision_required',
        current: {
          revision: 12,
          savedAt: '2026-05-29T00:00:00.000Z',
        },
      });
    }
    expect(mockedWriteBuilderPageSnapshot).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/seed?locale=zh-hant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{',
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
  });

  it('returns stable-code JSON for dataset seed conflicts', async () => {
    mockedWriteBuilderPageSnapshot.mockRejectedValueOnce(
      new BuilderSnapshotConflictError({ kind: 'draft', locale: 'ko', currentSnapshot: makeSnapshot() }) as never,
    );

    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/seed?locale=ko', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
          expectedRevision: 11,
        }),
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: '다른 변경 사항이 먼저 저장되었습니다. 페이지를 새로고침한 뒤 다시 초기화해 주세요.',
      errorCode: 'page_dataset_seed_conflict',
      current: {
        revision: 12,
        savedAt: '2026-05-29T00:00:00.000Z',
      },
    });
  });

  it('does not expose raw seed failures', async () => {
    mockedWriteBuilderPageSnapshot.mockRejectedValueOnce(new Error('seed secret leaked'));

    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/seed?locale=en', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'en',
          targetId: 'home.services.list',
          expectedRevision: 12,
        }),
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to reset the dataset binding.',
      errorCode: 'page_dataset_seed_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('seed secret leaked');
  });

  it('refuses anonymous callers', async () => {
    mockedGuardMutation.mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );

    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/seed?locale=ko', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          targetId: 'home.services.list',
        }),
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );

    expect(response.status).toBe(401);
    expect(mockedReadBuilderPageSnapshot).not.toHaveBeenCalled();
  });
});
