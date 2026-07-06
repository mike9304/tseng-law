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
import * as route from '@/app/api/builder/sites/[siteId]/pages/[pageKey]/datasets/route';

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

describe('/api/builder/sites/[siteId]/pages/[pageKey]/datasets', () => {
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

  it('returns current dataset overviews on GET', async () => {
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=ko'),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.revision).toBe(12);
    expect(payload.targets).toHaveLength(3);
    expect(payload.targets[1]).toMatchObject({
      targetId: 'home.services.list',
      currentBinding: {
        collectionId: 'service-areas',
        limit: 6,
      },
    });
  });

  it('prefers cms-backed service records in GET overviews when available', async () => {
    mockedReadSiteDocument.mockResolvedValue({
      cmsCollections: [
        {
          collectionId: 'service-areas',
          name: 'Service Areas',
          slug: 'service-areas',
          description: 'CMS service areas',
          localized: true,
          fields: [
            { fieldId: 'field-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true, unique: true },
            { fieldId: 'field-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
            { fieldId: 'field-subtitle', key: 'subtitle', label: 'Subtitle', type: 'text', localized: false, repeated: false, required: false },
            { fieldId: 'field-key-points', key: 'keyPoints', label: 'Key points', type: 'string-list', localized: false, repeated: true, required: false },
            { fieldId: 'field-column-slugs', key: 'columnSlugs', label: 'Related columns', type: 'string-list', localized: false, repeated: true, required: false },
          ],
          indexes: [],
          records: [
            {
              recordId: 'cms-service-preview',
              status: 'published',
              locale: 'ko',
              fields: {
                slug: 'cms-service-preview',
                title: 'CMS 서비스 미리보기',
                subtitle: 'CMS service preview subtitle',
                keyPoints: ['CMS key point'],
                columnSlugs: ['taiwan-company-establishment-basics'],
              },
              createdAt: '2026-05-30T00:00:00.000Z',
              updatedAt: '2026-05-30T00:00:00.000Z',
            },
          ],
          permissions: { read: ['public'], create: ['staff'], update: ['staff'], delete: ['staff'] },
          createdAt: '2026-05-30T00:00:00.000Z',
          updatedAt: '2026-05-30T00:00:00.000Z',
        },
      ],
    } as never);

    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=ko'),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.targets.find((target: { targetId: string }) => target.targetId === 'home.services.list')).toMatchObject({
      sampleRecords: expect.arrayContaining([
        expect.objectContaining({
          recordId: 'cms-service-preview',
          primaryLabel: 'CMS 서비스 미리보기',
        }),
      ]),
    });
  });

  it('persists dataset binding edits on PUT and returns updated overviews', async () => {
    const response = await route.PUT(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=ko', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          mode: 'list',
          limit: 3,
          filters: [{ fieldId: 'title', operator: 'contains', value: '투자' }],
          sort: [{ fieldId: 'title', direction: 'asc' }],
          expectedRevision: 12,
        }),
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();
    const writeInput = mockedWriteBuilderPageSnapshot.mock.calls[0]?.[0];

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.revision).toBe(13);
    expect(writeInput?.expectedRevision).toBe(12);
    expect(writeInput?.document.datasets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          limit: 3,
          filters: [{ fieldId: 'title', operator: 'contains', value: '투자' }],
          sort: [{ fieldId: 'title', direction: 'asc' }],
        }),
      ]),
    );
    expect(payload.targets.find((target: { targetId: string }) => target.targetId === 'home.services.list')).toMatchObject({
      currentBinding: {
        collectionId: 'service-areas',
        limit: 3,
        filters: [{ fieldId: 'title', operator: 'contains', value: '투자' }],
        sort: [{ fieldId: 'title', direction: 'asc' }],
      },
    });
  });

  it('requires the current draft revision on PUT', async () => {
    const response = await route.PUT(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=ko', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          mode: 'list',
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

  it('rejects malformed expected revisions on PUT', async () => {
    const response = await route.PUT(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=en', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'en',
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          mode: 'list',
          expectedRevision: '12',
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
    expect(mockedWriteBuilderPageSnapshot).not.toHaveBeenCalled();
  });

  it('rejects unsupported collections on PUT', async () => {
    const response = await route.PUT(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=ko', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
          collectionId: 'columns',
          mode: 'list',
          limit: 3,
        }),
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '이 대상에 연결할 수 없는 데이터 컬렉션입니다.',
      errorCode: 'page_dataset_collection_unapproved',
    });
    expect(mockedWriteBuilderPageSnapshot).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors on PUT', async () => {
    const response = await route.PUT(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=zh-hant', {
        method: 'PUT',
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

  it('does not expose raw dataset read failures', async () => {
    mockedReadBuilderPageSnapshot.mockRejectedValueOnce(new Error('dataset read secret leaked'));

    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=en'),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load the page datasets.',
      errorCode: 'page_dataset_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('dataset read secret leaked');
  });

  it('returns stable-code JSON for dataset save conflicts', async () => {
    mockedWriteBuilderPageSnapshot.mockRejectedValueOnce(
      new BuilderSnapshotConflictError({ kind: 'draft', locale: 'ko', currentSnapshot: makeSnapshot() }) as never,
    );

    const response = await route.PUT(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=ko', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          mode: 'list',
          expectedRevision: 11,
        }),
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: '다른 변경 사항이 먼저 저장되었습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
      errorCode: 'page_dataset_save_conflict',
      current: {
        revision: 12,
        savedAt: '2026-05-29T00:00:00.000Z',
      },
    });
  });

  it('refuses anonymous callers on PUT', async () => {
    mockedGuardMutation.mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );

    const response = await route.PUT(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets?locale=ko', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          targetId: 'home.services.list',
          collectionId: 'service-areas',
        }),
      }),
      { params: { siteId: 'default', pageKey: 'home' } },
    );

    expect(response.status).toBe(401);
    expect(mockedReadBuilderPageSnapshot).not.toHaveBeenCalled();
  });
});
