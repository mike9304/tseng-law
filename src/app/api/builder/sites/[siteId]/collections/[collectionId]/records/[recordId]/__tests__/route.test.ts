import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordCmsRecordEvent } from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderDynamicItemPageMeta, BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { createEditableBuilderCmsCollection, createEditableBuilderCmsRecord } from '@/lib/builder/cms-editable';
import * as route from '@/app/api/builder/sites/[siteId]/collections/[collectionId]/records/[recordId]/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin-1', user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordCmsRecordEvent: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedGuardMutation = vi.mocked(guardMutation);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);
const recordCmsRecordEventMock = vi.mocked(recordCmsRecordEvent);

describe('/api/builder/sites/[siteId]/collections/[collectionId]/records/[recordId]', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    const now = new Date('2026-05-30T00:00:00.000Z').toISOString();
    site = {
      version: 1,
      siteId: 'default',
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
      pages: [] as BuilderPageMeta[],
      cmsCollections: [],
      redirects: [],
      createdAt: now,
      updatedAt: now,
    };
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
    mockedGuardMutation.mockClear();
  });

  it('creates slug redirects and acknowledges them in PATCH responses', async () => {
    const now = new Date('2026-05-30T00:00:00.000Z').toISOString();
    const dynamicItem: BuilderDynamicItemPageMeta = {
      kind: 'collection-item-v1',
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      slugField: 'slug',
      defaultRecordSlug: 'original-article',
      createdAt: now,
    };
    site.pages = [
      {
        pageId: 'page-articles',
        slug: 'insights',
        title: { ko: 'Insights', en: 'Insights', 'zh-hant': 'Insights' },
        locale: 'ko',
        dynamicItem,
        createdAt: now,
        updatedAt: now,
      } satisfies BuilderPageMeta,
    ];
    mockedReadSiteDocument.mockResolvedValue(site);

    await createEditableBuilderCmsCollection('default', 'ko', {
      collectionId: 'articles',
      name: 'Articles',
      slug: 'articles',
      fields: [
        {
          fieldId: 'field-title',
          key: 'title',
          label: 'Title',
          type: 'text',
          localized: true,
          repeated: false,
          required: true,
        },
        {
          fieldId: 'field-slug',
          key: 'slug',
          label: 'Slug',
          type: 'slug',
          localized: false,
          repeated: false,
          required: true,
          unique: true,
        },
      ],
    });
    const created = await createEditableBuilderCmsRecord('default', 'ko', 'articles', {
      fields: { title: 'Original article', slug: 'original-article' },
    });

    const response = await route.PATCH(
      new NextRequest(`https://law.example.test/api/builder/sites/default/collections/articles/records/${created?.recordId}?locale=ko`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fields: { title: 'Original article', slug: 'updated-article' },
        }),
      }),
      { params: Promise.resolve({ siteId: 'default', collectionId: 'articles', recordId: created!.recordId }) },
    );
    const data = await response.json() as {
      ok?: boolean;
      record?: { fields?: Record<string, unknown> };
      redirectCreated?: boolean;
      redirectWarnings?: string[];
    };

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.redirectCreated).toBe(true);
    expect(data.redirectWarnings).toEqual([]);
    expect(data.record?.fields).toMatchObject({
      title: 'Original article',
      slug: 'updated-article',
    });
    expect(site.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/articles/original-article',
        to: '/ko/articles/updated-article',
      }),
    ]));
    expect(recordCmsRecordEventMock).toHaveBeenCalledWith({
      request: expect.any(NextRequest),
      type: 'updated',
      siteId: 'default',
      collectionId: 'articles',
      recordId: created!.recordId,
    });
  });

  it('records a cms.record_deleted audit event after a successful delete and skips it when missing', async () => {
    await createEditableBuilderCmsCollection('default', 'ko', {
      collectionId: 'articles',
      name: 'Articles',
      slug: 'articles',
      fields: [
        {
          fieldId: 'field-title',
          key: 'title',
          label: 'Title',
          type: 'text',
          localized: false,
          repeated: false,
          required: true,
        },
      ],
    });
    const created = await createEditableBuilderCmsRecord('default', 'ko', 'articles', {
      fields: { title: 'Delete me' },
    });

    const deleteResponse = await route.DELETE(
      new NextRequest(`https://law.example.test/api/builder/sites/default/collections/articles/records/${created?.recordId}?locale=ko`, {
        method: 'DELETE',
      }),
      { params: Promise.resolve({ siteId: 'default', collectionId: 'articles', recordId: created!.recordId }) },
    );

    expect(deleteResponse.status).toBe(200);
    expect(recordCmsRecordEventMock).toHaveBeenCalledWith({
      request: expect.any(NextRequest),
      type: 'deleted',
      siteId: 'default',
      collectionId: 'articles',
      recordId: created!.recordId,
    });

    recordCmsRecordEventMock.mockClear();

    const missingResponse = await route.DELETE(
      new NextRequest(`https://law.example.test/api/builder/sites/default/collections/articles/records/${created!.recordId}?locale=ko`, {
        method: 'DELETE',
      }),
      { params: Promise.resolve({ siteId: 'default', collectionId: 'articles', recordId: created!.recordId }) },
    );

    expect(missingResponse.status).toBe(404);
    expect(recordCmsRecordEventMock).not.toHaveBeenCalled();
  });
});
