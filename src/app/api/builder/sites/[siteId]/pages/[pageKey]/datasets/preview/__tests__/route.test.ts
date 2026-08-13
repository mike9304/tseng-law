import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { createDefaultBuilderPageDatasets } from '@/lib/builder/datasets';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderPageSnapshot } from '@/lib/builder/types';
import * as route from '@/app/api/builder/sites/[siteId]/pages/[pageKey]/datasets/preview/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  getAllColumnPostsIncludingBlob: vi.fn(),
}));

vi.mock('@/lib/builder/persistence', () => ({
  readBuilderPageSnapshot: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
}));

const mockedGuardMutation = vi.mocked(guardMutation);
const mockedReadBuilderPageSnapshot = vi.mocked(readBuilderPageSnapshot);
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
      locale: 'ko',
      updatedAt: '2026-05-29T00:00:00.000Z',
      updatedBy: 'builder-api',
      root: { id: 'page-root', type: 'page', name: 'Home', pageKey: 'home', children: [] },
      datasets: createDefaultBuilderPageDatasets('home'),
      sections: [],
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

describe('/api/builder/sites/[siteId]/pages/[pageKey]/datasets/preview', () => {
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
  });

  it('returns a live preview of draft dataset records', async () => {
    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/preview?locale=ko', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          mode: 'list',
          limit: 2,
          filters: [{ fieldId: 'title', operator: 'contains', value: '투자' }],
          sort: [{ fieldId: 'title', direction: 'asc' }],
        }),
      }),
      { params: Promise.resolve({ siteId: 'default', pageKey: 'home' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.binding).toMatchObject({
      targetId: 'home.services.list',
      collectionId: 'service-areas',
      limit: 2,
    });
    expect(Array.isArray(payload.sampleRecords)).toBe(true);
    expect(Array.isArray(payload.repeaterItems)).toBe(true);
  });

  it('prefers cms-backed service records when available', async () => {
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

    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/preview?locale=ko', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          mode: 'list',
          limit: 2,
        }),
      }),
      { params: Promise.resolve({ siteId: 'default', pageKey: 'home' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.sampleRecords?.[0]).toMatchObject({
      recordId: 'cms-service-preview',
      primaryLabel: 'CMS 서비스 미리보기',
      routePath: '/ko/services/cms-service-preview',
    });
    expect(payload.repeaterItems?.[0]).toMatchObject({
      itemId: 'cms-service-preview',
      title: 'CMS 서비스 미리보기',
      href: '/ko/services/cms-service-preview',
    });
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/preview?locale=zh-hant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{',
      }),
      { params: Promise.resolve({ siteId: 'default', pageKey: 'home' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
  });

  it('returns stable-code JSON for invalid preview limits', async () => {
    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/preview?locale=ko', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'ko',
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          mode: 'list',
          limit: -1,
        }),
      }),
      { params: Promise.resolve({ siteId: 'default', pageKey: 'home' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '데이터셋 표시 수는 0 이상이어야 합니다.',
      errorCode: 'page_dataset_limit_invalid',
    });
  });

  it('does not expose raw preview failures', async () => {
    mockedReadBuilderPageSnapshot.mockRejectedValueOnce(new Error('preview secret leaked'));

    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/preview?locale=en', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale: 'en',
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          mode: 'list',
        }),
      }),
      { params: Promise.resolve({ siteId: 'default', pageKey: 'home' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to build the dataset preview.',
      errorCode: 'page_dataset_preview_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('preview secret leaked');
  });

  it('refuses anonymous callers', async () => {
    mockedGuardMutation.mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );

    const response = await route.POST(
      new NextRequest('https://law.example.test/api/builder/sites/default/pages/home/datasets/preview?locale=ko', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          targetId: 'home.services.list',
          collectionId: 'service-areas',
          mode: 'list',
        }),
      }),
      { params: Promise.resolve({ siteId: 'default', pageKey: 'home' }) },
    );

    expect(response.status).toBe(401);
    expect(mockedReadBuilderPageSnapshot).not.toHaveBeenCalled();
  });
});
