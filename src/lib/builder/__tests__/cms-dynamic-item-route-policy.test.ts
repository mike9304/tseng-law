import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import {
  DEFAULT_THEME,
  type BuilderPageMeta,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  deleteBuilderCmsDynamicItemRoutePolicy,
  readBuilderCmsDynamicItemRoutePoliciesForCollection,
  saveBuilderCmsDynamicItemRoutePolicyOptions,
} from '@/lib/builder/cms-dynamic-item-route-policy';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('CMS dynamic item route policy persistence', () => {
  let siteDoc: BuilderSiteDocument;

  beforeEach(() => {
    siteDoc = makeSiteDoc();
    mockedReadSiteDocument.mockReset();
    mockedReadSiteDocument.mockImplementation(async () => siteDoc);
    mockedWriteSiteDocument.mockReset();
    mockedWriteSiteDocument.mockImplementation(async (nextDoc) => {
      siteDoc = nextDoc;
    });
  });

  it('saves authored slug policy options for a linked custom dynamic item page', async () => {
    // Given: a CMS collection with a linked dynamic item page and no saved policy.
    expect(await readBuilderCmsDynamicItemRoutePoliciesForCollection('test-site', 'ko', 'recipes')).toEqual([]);

    // When: the route card saves source, pattern, and conflict-rule options.
    const saved = await saveBuilderCmsDynamicItemRoutePolicyOptions({
      siteId: 'test-site',
      localeInput: 'ko',
      collectionId: 'recipes',
      pageId: 'page-recipes-detail',
      options: {
        policyName: ' Public recipe routes ',
        sourceFieldKey: 'code',
        slugPattern: '{{ code }}-{{title}}',
        slugConflictRule: 'record-id-suffix',
      },
      actorLabel: 'Admin',
    });

    // Then: the normalized policy is persisted and readable by collection detail.
    expect(saved).toMatchObject({
      collectionId: 'recipes',
      pageId: 'page-recipes-detail',
      policyName: 'Public recipe routes',
      sourceFieldKey: 'code',
      slugPattern: '{{code}}-{{title}}',
      slugConflictRule: 'record-id-suffix',
      updatedBy: 'Admin',
    });
    expect(siteDoc.dynamicItemRoutePolicies).toEqual([saved]);
    expect(await readBuilderCmsDynamicItemRoutePoliciesForCollection('test-site', 'ko', 'recipes'))
      .toEqual([saved]);
  });

  it('replaces the matching page policy without dropping other collection policies', async () => {
    // Given: one existing policy for the same route and one for another page.
    siteDoc.dynamicItemRoutePolicies = [
      {
        collectionId: 'recipes',
        pageId: 'page-recipes-detail',
        policyName: 'Old route policy',
        sourceFieldKey: 'title',
        slugPattern: '{{title}}',
        slugConflictRule: 'next-available',
        updatedAt: '2026-06-24T00:00:00.000Z',
        updatedBy: 'Old Admin',
      },
      {
        collectionId: 'recipes',
        pageId: 'page-other-detail',
        policyName: 'Other route policy',
        sourceFieldKey: 'code',
        slugPattern: '{{code}}',
        slugConflictRule: 'next-available',
        updatedAt: '2026-06-24T00:00:00.000Z',
        updatedBy: 'Other Admin',
      },
    ];

    // When: the same page saves a new empty-source policy.
    const saved = await saveBuilderCmsDynamicItemRoutePolicyOptions({
      siteId: 'test-site',
      localeInput: 'ko',
      collectionId: 'recipes',
      pageId: 'page-recipes-detail',
      options: {
        policyName: 'Updated route policy',
        sourceFieldKey: '',
        slugPattern: '{{title}}',
        slugConflictRule: 'next-available',
      },
      actorLabel: 'Admin',
    });

    // Then: only that route-card policy is replaced.
    expect(siteDoc.dynamicItemRoutePolicies).toHaveLength(2);
    expect(siteDoc.dynamicItemRoutePolicies?.[0]).toEqual(saved);
    expect(siteDoc.dynamicItemRoutePolicies?.[1]).toEqual({
      collectionId: 'recipes',
      pageId: 'page-other-detail',
      policyName: 'Other route policy',
      sourceFieldKey: 'code',
      slugPattern: '{{code}}',
      slugConflictRule: 'next-available',
      updatedAt: '2026-06-24T00:00:00.000Z',
      updatedBy: 'Other Admin',
    });
  });

  it('deletes the matching page policy without dropping other collection policies', async () => {
    // Given: saved policies exist for two linked item pages in the same collection.
    siteDoc.dynamicItemRoutePolicies = [
      {
        collectionId: 'recipes',
        pageId: 'page-recipes-detail',
        policyName: 'Public recipe routes',
        sourceFieldKey: 'code',
        slugPattern: '{{code}}-{{title}}',
        slugConflictRule: 'record-id-suffix',
        updatedAt: '2026-06-25T12:34:56.000Z',
        updatedBy: 'Admin',
      },
      {
        collectionId: 'recipes',
        pageId: 'page-other-detail',
        policyName: 'Other route policy',
        sourceFieldKey: 'title',
        slugPattern: '{{title}}',
        slugConflictRule: 'next-available',
        updatedAt: '2026-06-25T12:40:00.000Z',
        updatedBy: 'Admin',
      },
    ];

    // When: the source page policy is deleted.
    const deleted = await deleteBuilderCmsDynamicItemRoutePolicy({
      siteId: 'test-site',
      localeInput: 'ko',
      collectionId: 'recipes',
      pageId: 'page-recipes-detail',
    });

    // Then: only that page policy is removed and the other policy remains.
    expect(deleted?.pageId).toBe('page-recipes-detail');
    expect(siteDoc.dynamicItemRoutePolicies).toEqual([
      {
        collectionId: 'recipes',
        pageId: 'page-other-detail',
        policyName: 'Other route policy',
        sourceFieldKey: 'title',
        slugPattern: '{{title}}',
        slugConflictRule: 'next-available',
        updatedAt: '2026-06-25T12:40:00.000Z',
        updatedBy: 'Admin',
      },
    ]);
  });
});

function makeSiteDoc(): BuilderSiteDocument {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    version: 1,
    siteId: 'test-site',
    name: 'Test site',
    locale: 'ko',
    navigation: [],
    theme: DEFAULT_THEME,
    pages: [
      makeDynamicItemPage('page-recipes-detail', 'recipes-detail', 'recipes', now),
      makeDynamicItemPage('page-other-detail', 'other-detail', 'recipes', now),
    ],
    cmsCollections: [makeCollection(now)],
    createdAt: now,
    updatedAt: now,
  };
}

function makeDynamicItemPage(
  pageId: string,
  slug: string,
  collectionId: string,
  now: string,
): BuilderPageMeta {
  return {
    pageId,
    slug,
    title: { ko: slug, en: slug, 'zh-hant': slug },
    locale: 'ko',
    dynamicItem: {
      kind: 'collection-item-v1',
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      cmsCollectionId: collectionId,
      slugField: 'slug',
      defaultRecordSlug: 'alpha',
      createdAt: now,
    },
    createdAt: now,
    updatedAt: now,
  };
}

function makeCollection(now: string): BuilderCmsCollection {
  return {
    collectionId: 'recipes',
    name: 'Recipes',
    slug: 'recipes',
    description: '',
    localized: false,
    fields: [
      { fieldId: 'title-field', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'slug-field', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'code-field', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}
