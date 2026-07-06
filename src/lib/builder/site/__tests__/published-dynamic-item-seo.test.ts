import { describe, expect, it } from 'vitest';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import type { BuilderDynamicItemPageMeta } from '@/lib/builder/site/dynamic-page-types';
import {
  isPublishedDynamicItemRecordRoutable,
  resolvePublishedDynamicItemRecordJsonLd,
  resolvePublishedDynamicItemRecordSeo,
} from '@/lib/builder/site/published-dynamic-item-seo';

const dynamicItem = {
  kind: 'collection-item-v1',
  collectionId: 'columns',
  targetId: 'home.insights.feed',
  cmsCollectionId: 'recipes-seo',
  slugField: 'slug',
  defaultRecordSlug: 'alpha-recipe',
  createdAt: '2026-06-21T00:00:00.000Z',
} satisfies BuilderDynamicItemPageMeta;

function makeRecipeCollection(): BuilderCmsCollection {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    collectionId: 'recipes-seo',
    name: 'Recipes',
    slug: 'recipes',
    description: 'Custom recipe collection',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-summary', key: 'summary', label: 'Summary', type: 'rich-text', localized: false, repeated: false, required: false },
      { fieldId: 'f-hero', key: 'heroImage', label: 'Hero image', type: 'image', localized: false, repeated: false, required: false },
      { fieldId: 'f-date', key: 'publishedAt', label: 'Published at', type: 'date', localized: false, repeated: false, required: false },
      { fieldId: 'f-author', key: 'author', label: 'Author', type: 'text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: 'alpha-recipe',
        status: 'published',
        locale: 'ko',
        fields: {
          title: 'Alpha Recipe SEO',
          slug: 'alpha-recipe',
          summary: '<p>Custom summary from the arbitrary CMS record.</p>',
          heroImage: { url: '/api/builder/assets/alpha-recipe.webp' },
          publishedAt: '2026-06-01',
          author: 'Chef Seo',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'draft-recipe',
        status: 'draft',
        locale: 'ko',
        fields: {
          title: 'Draft Recipe SEO',
          slug: 'draft-recipe',
          summary: 'Draft summary must not leak.',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'archived-recipe',
        status: 'archived',
        locale: 'ko',
        fields: {
          title: 'Archived Recipe SEO',
          slug: 'archived-recipe',
          summary: 'Archived summary must not leak.',
        },
        createdAt: now,
        updatedAt: now,
      },
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

describe('published dynamic item SEO', () => {
  it('resolves per-record SEO for custom CMS dynamic item pages', () => {
    const site = { cmsCollections: [makeRecipeCollection()] };

    const seo = resolvePublishedDynamicItemRecordSeo({
      dynamicItem,
      locale: 'ko',
      recordSlug: 'alpha-recipe',
      site,
      slugPath: 'recipes/alpha-recipe',
    });

    expect(seo).toEqual({
      title: 'Alpha Recipe SEO',
      description: 'Custom summary from the arbitrary CMS record.',
      canonicalPath: '/ko/recipes/alpha-recipe',
      keywords: ['Alpha Recipe SEO', 'Recipes'],
      image: '/api/builder/assets/alpha-recipe.webp',
      noIndex: false,
    });
  });

  it('builds Article JSON-LD for custom CMS dynamic item records', () => {
    const site = { cmsCollections: [makeRecipeCollection()] };

    const jsonLd = resolvePublishedDynamicItemRecordJsonLd({
      dynamicItem,
      locale: 'ko',
      recordSlug: 'alpha-recipe',
      site,
      siteUrl: 'https://tseng-law.com',
      slugPath: 'recipes/alpha-recipe',
    });

    expect(jsonLd).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Alpha Recipe SEO',
      description: 'Custom summary from the arbitrary CMS record.',
      datePublished: '2026-06-01',
      image: '/api/builder/assets/alpha-recipe.webp',
      url: 'https://tseng-law.com/ko/recipes/alpha-recipe',
      author: { '@type': 'Person', name: 'Chef Seo' },
    });
  });

  it('only treats published custom CMS item records as public-routable', () => {
    const site = { cmsCollections: [makeRecipeCollection()] };

    expect(isPublishedDynamicItemRecordRoutable({
      dynamicItem,
      locale: 'ko',
      recordSlug: 'alpha-recipe',
      site,
    })).toBe(true);
    expect(isPublishedDynamicItemRecordRoutable({
      dynamicItem,
      locale: 'ko',
      recordSlug: 'draft-recipe',
      site,
    })).toBe(false);
    expect(isPublishedDynamicItemRecordRoutable({
      dynamicItem,
      locale: 'ko',
      recordSlug: 'archived-recipe',
      site,
    })).toBe(false);
  });
});
