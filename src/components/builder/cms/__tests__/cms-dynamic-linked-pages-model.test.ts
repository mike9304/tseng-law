import { describe, expect, it } from 'vitest';
import type { BuilderCmsCollectionDetail } from '@/lib/builder/cms-types';
import {
  resolveLinkedItemPages,
  resolveLinkedItemRouteCoverage,
  type LinkedDynamicItemPage,
} from '@/components/builder/cms/cms-dynamic-linked-pages-model';

const now = '2026-06-21T00:00:00.000Z';

function makeCollection(): BuilderCmsCollectionDetail {
  return {
    collectionId: 'recipes',
    name: 'Recipes',
    slug: 'recipes',
    description: 'Recipe records used by dynamic item pages.',
    localized: false,
    fieldCount: 2,
    indexCount: 0,
    recordCount: 4,
    fields: [
      { fieldId: 'title-field', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'slug-field', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
    ],
    indexes: [],
    records: [
      {
        recordId: 'alpha-id',
        status: 'published',
        locale: 'ko',
        fields: { title: 'Alpha', slug: 'alpha' },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'beta-id',
        status: 'published',
        locale: 'ko',
        fields: { title: 'Beta', slug: 'beta' },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'draft-id',
        status: 'draft',
        locale: 'ko',
        fields: { title: 'Draft', slug: 'draft' },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'missing-slug-id',
        status: 'published',
        locale: 'ko',
        fields: { title: 'Missing slug', slug: '' },
        createdAt: now,
        updatedAt: now,
      },
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

function makeItemPage(collectionId: string): LinkedDynamicItemPage {
  const [itemPage] = resolveLinkedItemPages({
    collectionId,
    locale: 'ko',
    pages: [
      {
        pageId: 'recipe-detail',
        slug: 'recipes-detail',
        publishedAt: now,
        title: { ko: 'Recipe detail' },
        dynamicItem: {
          cmsCollectionId: collectionId,
          slugField: 'slug',
          defaultRecordSlug: 'alpha',
        },
      },
    ],
  });
  if (!itemPage) throw new Error('Expected linked dynamic item page fixture.');
  return itemPage;
}

describe('cms dynamic linked pages model', () => {
  it('summarizes published record routes for linked dynamic item pages', () => {
    const collection = makeCollection();
    const itemPage = makeItemPage(collection.collectionId);

    const coverage = resolveLinkedItemRouteCoverage({
      collection,
      locale: 'ko',
      page: itemPage,
    });

    expect(coverage).toMatchObject({
      pageId: 'recipe-detail',
      slugField: 'slug',
      publishedRouteCount: 2,
      draftRecordCount: 1,
      missingSlugCount: 1,
      totalRecordCount: 4,
    });
    expect(coverage.sampleRoutes).toEqual([
      {
        recordId: 'alpha-id',
        slug: 'alpha',
        publicHref: '/ko/recipes-detail/alpha',
      },
      {
        recordId: 'beta-id',
        slug: 'beta',
        publicHref: '/ko/recipes-detail/beta',
      },
    ]);
  });

  it('links incomplete dynamic item route records back to CMS repair', () => {
    const collection = makeCollection();
    const itemPage = makeItemPage(collection.collectionId);

    const coverage = resolveLinkedItemRouteCoverage({
      collection,
      locale: 'ko',
      page: itemPage,
    });

    expect(coverage.draftReviewLink).toEqual({
      recordId: 'draft-id',
      href: '/ko/admin-builder/cms?collectionId=recipes&recordId=draft-id',
    });
    expect(coverage.missingSlugReviewLink).toEqual({
      recordId: 'missing-slug-id',
      href: '/ko/admin-builder/cms?collectionId=recipes&recordId=missing-slug-id',
    });
  });

  it('selects publishable held-back records with slugs for batch item route publish', () => {
    const collection = makeCollection();
    const itemPage = makeItemPage(collection.collectionId);
    const coverage = resolveLinkedItemRouteCoverage({
      collection: {
        ...collection,
        recordCount: 6,
        records: [
          ...collection.records,
          {
            recordId: 'pending-id',
            status: 'pending',
            locale: 'ko',
            fields: { title: 'Pending', slug: 'pending' },
            createdAt: now,
            updatedAt: now,
          },
          {
            recordId: 'archived-id',
            status: 'archived',
            locale: 'ko',
            fields: { title: 'Archived', slug: 'archived' },
            createdAt: now,
            updatedAt: now,
          },
        ],
      },
      locale: 'ko',
      page: itemPage,
    });

    expect(coverage.draftRecordCount).toBe(2);
    expect(coverage.archivedRecordCount).toBe(1);
    expect(coverage.publishableHeldBackRecordIds).toEqual(['draft-id', 'pending-id']);
    expect(coverage.archivableHeldBackRecordIds).toEqual(['draft-id', 'pending-id']);
    expect(coverage.restorableArchivedRecordIds).toEqual(['archived-id']);
    expect(coverage.deletableArchivedRecordIds).toEqual(['archived-id']);
  });

  it('selects missing-slug records for batch item route slug repair', () => {
    const collection = makeCollection();
    const itemPage = makeItemPage(collection.collectionId);

    const coverage = resolveLinkedItemRouteCoverage({
      collection,
      locale: 'ko',
      page: itemPage,
    });

    expect(coverage.missingSlugRecordIds).toEqual(['missing-slug-id']);
  });

  it('selects duplicate-slug records for batch item route conflict repair', () => {
    const collection = makeCollection();
    const itemPage = makeItemPage(collection.collectionId);

    const coverage = resolveLinkedItemRouteCoverage({
      collection: {
        ...collection,
        recordCount: 5,
        records: [
          ...collection.records,
          {
            recordId: 'duplicate-beta-id',
            status: 'published',
            locale: 'ko',
            fields: { title: 'Duplicate Beta', slug: 'beta' },
            createdAt: now,
            updatedAt: now,
          },
        ],
      },
      locale: 'ko',
      page: itemPage,
    });

    expect(coverage.publishedRouteCount).toBe(2);
    expect(coverage.slugConflictCount).toBe(1);
    expect(coverage.slugConflictRecordIds).toEqual(['duplicate-beta-id']);
    expect(coverage.slugConflictReviewLink).toEqual({
      recordId: 'duplicate-beta-id',
      href: '/ko/admin-builder/cms?collectionId=recipes&recordId=duplicate-beta-id',
    });
    expect(coverage.sampleRoutes.map((route) => route.recordId)).toEqual(['alpha-id', 'beta-id']);
  });
});
