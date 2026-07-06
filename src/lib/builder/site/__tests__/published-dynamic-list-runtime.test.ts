import { describe, expect, it } from 'vitest';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { createDefaultBuilderPageDatasets, replaceBuilderPageDatasetBinding } from '@/lib/builder/datasets';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import { resolvePublishedDynamicListRuntime } from '@/lib/builder/site/published-dynamic-list-runtime';

const now = '2026-06-21T00:00:00.000Z';

function makeRecipeCollection(): BuilderCmsCollection {
  return {
    collectionId: 'recipes-runtime',
    name: 'Recipes Runtime',
    slug: 'recipes-runtime',
    description: 'Custom recipe records for dynamic item runtime binding.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: 'alpha-runtime-id',
        status: 'published',
        locale: 'ko',
        fields: {
          title: 'Alpha Runtime',
          slug: 'alpha-runtime',
          content: 'Alpha runtime body.',
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

describe('resolvePublishedDynamicListRuntime', () => {
  it('hydrates user CMS runtime records for dynamic item dataset bindings', () => {
    const datasetDocument = {
      pageKey: 'home' as const,
      datasets: replaceBuilderPageDatasetBinding(
        createDefaultBuilderPageDatasets('home'),
        'home',
        'home.insights.feed',
        {
          collectionId: 'columns',
          cmsCollectionId: 'recipes-runtime',
          filters: [{ fieldId: 'slug', operator: 'equals', value: 'alpha-runtime' }],
          sort: [],
          limit: 1,
        },
      ),
    };
    const runtime = resolvePublishedDynamicListRuntime({
      datasetDocument,
      dynamicList: undefined,
      locale: 'ko',
      searchParams: undefined,
      site: {
        ...createDefaultSiteDocument('ko', 'default'),
        cmsCollections: [makeRecipeCollection()],
      },
      slugPath: 'recipes-item/alpha-runtime',
    });

    expect(runtime.bindingContext.runtimeRecordsByTarget?.['home.insights.feed']).toEqual([
      expect.objectContaining({
        recordId: 'alpha-runtime-id',
        fieldValues: expect.objectContaining({
          title: 'Alpha Runtime',
          content: 'Alpha runtime body.',
        }),
      }),
    ]);
  });
});
