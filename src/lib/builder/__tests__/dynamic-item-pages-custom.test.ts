import { describe, expect, it } from 'vitest';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import {
  buildBuilderDynamicItemDatasetDocument,
  createBuilderCmsDynamicItemCanvasDocument,
  createBuilderCmsDynamicItemPageMeta,
} from '@/lib/builder/dynamic-item-pages';

const now = '2026-06-21T00:00:00.000Z';

function makeRecipeCollection(): BuilderCmsCollection {
  return {
    collectionId: 'recipes-custom',
    name: 'Recipes Custom',
    slug: 'recipes-custom',
    description: 'Custom recipe records for dynamic item pages.',
    localized: false,
    fields: [
      { fieldId: 'title-field', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'slug-field', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'content-field', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
      { fieldId: 'image-field', key: 'photo', label: 'Photo', type: 'image', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: 'alpha-recipe-id',
        status: 'published',
        locale: 'ko',
        fields: {
          title: 'Alpha Recipe',
          slug: 'alpha-recipe',
          content: 'Alpha recipe detail body.',
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

describe('custom CMS dynamic item pages', () => {
  it('creates dynamic item metadata that keeps the user CMS collection id', () => {
    const meta = createBuilderCmsDynamicItemPageMeta({
      collection: makeRecipeCollection(),
      recordSlug: 'alpha-recipe',
    });

    expect(meta).toMatchObject({
      kind: 'collection-item-v1',
      collectionId: 'columns',
      cmsCollectionId: 'recipes-custom',
      targetId: 'home.insights.feed',
      slugField: 'slug',
      defaultRecordSlug: 'alpha-recipe',
    });
  });

  it('binds the dynamic item dataset to the user CMS collection', () => {
    const meta = createBuilderCmsDynamicItemPageMeta({
      collection: makeRecipeCollection(),
      recordSlug: 'alpha-recipe',
    });

    const document = buildBuilderDynamicItemDatasetDocument(meta, 'alpha-recipe');
    const binding = document.datasets.find((dataset) => dataset.targetId === 'home.insights.feed');

    expect(binding).toMatchObject({
      collectionId: 'columns',
      cmsCollectionId: 'recipes-custom',
      filters: [{ fieldId: 'slug', operator: 'equals', value: 'alpha-recipe' }],
      limit: 1,
    });
  });

  it('creates a canvas that binds title, body, image, and href from custom fields', () => {
    const document = createBuilderCmsDynamicItemCanvasDocument({
      collection: makeRecipeCollection(),
      locale: 'ko',
    });

    const titleNode = document.nodes.find((node) => node.id === 'dynamic-item-title-recipes-custom');
    const bodyNode = document.nodes.find((node) => node.id === 'dynamic-item-summary-recipes-custom');
    const imageNode = document.nodes.find((node) => node.id === 'dynamic-item-image-recipes-custom');
    const linkNode = document.nodes.find((node) => node.id === 'dynamic-item-link-recipes-custom');

    expect(titleNode?.dataBinding).toMatchObject({
      targetId: 'home.insights.feed',
      recordIndex: 0,
      fields: { text: 'title' },
    });
    expect(bodyNode?.dataBinding).toMatchObject({
      targetId: 'home.insights.feed',
      recordIndex: 0,
      fields: { text: 'content' },
    });
    expect(imageNode?.dataBinding?.fields).toMatchObject({
      src: 'photo',
      alt: 'title',
      href: 'href',
    });
    expect(linkNode?.dataBinding?.fields).toMatchObject({ href: 'href' });
  });
});
