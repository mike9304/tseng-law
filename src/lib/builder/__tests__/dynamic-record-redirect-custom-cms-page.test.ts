import { describe, expect, it } from 'vitest';
import { computeRecordSlugRedirectInputs } from '@/lib/builder/dynamic-record-redirect-lifecycle';

describe('record slug redirects with custom CMS dynamic item pages', () => {
  it('does not add custom CMS item page bases to built-in collection slug redirects', () => {
    const result = computeRecordSlugRedirectInputs(
      {
        locale: 'ko',
        collectionId: 'columns',
        oldSlug: 'old-column',
        newSlug: 'new-column',
      },
      [
        {
          slug: 'recipes-detail',
          locale: 'ko',
          isHomePage: false,
          dynamicItem: {
            kind: 'collection-item-v1',
            collectionId: 'columns',
            targetId: 'home.insights.feed',
            cmsCollectionId: 'recipes',
            slugField: 'slug',
            defaultRecordSlug: 'old-recipe',
            createdAt: '2026-06-21T00:00:00.000Z',
          },
        },
      ],
    );

    expect(result.redirects.map((redirect) => redirect.from)).toEqual(['/ko/columns/old-column']);
    expect(result.redirects.map((redirect) => redirect.to)).toEqual(['/ko/columns/new-column']);
  });
});
