import { describe, expect, it } from 'vitest';
import { resolveCmsDynamicItemPolicyLibraryEntries } from '@/components/builder/cms/cms-dynamic-item-policy-library';
import type { LinkedDynamicItemPage } from '@/components/builder/cms/cms-dynamic-linked-pages-model';

describe('CMS dynamic item policy library', () => {
  it('returns named saved route policies with page titles and exact-template usage counts', () => {
    // Given: linked item pages with two pages sharing the same named policy tuple.
    const pages: readonly LinkedDynamicItemPage[] = [
      makePage('source-page', 'Recipe source page'),
      makePage('target-page', 'Recipe target page'),
      makePage('draft-page', 'Draft page'),
    ];

    // When: the collection policies are resolved into a library surface.
    const entries = resolveCmsDynamicItemPolicyLibraryEntries({
      pages,
      policies: [
        {
          collectionId: 'recipes',
          pageId: 'source-page',
          policyName: 'Public recipe routes',
          sourceFieldKey: 'code',
          slugPattern: '{{code}}-{{title}}',
          slugConflictRule: 'record-id-suffix',
          updatedAt: '2026-06-25T12:34:56.000Z',
          updatedBy: 'Admin',
        },
        {
          collectionId: 'recipes',
          pageId: 'target-page',
          policyName: 'Public recipe routes',
          sourceFieldKey: 'code',
          slugPattern: '{{code}}-{{title}}',
          slugConflictRule: 'record-id-suffix',
          updatedAt: '2026-06-25T12:40:00.000Z',
          updatedBy: 'Admin',
        },
        {
          collectionId: 'recipes',
          pageId: 'draft-page',
          policyName: '',
          sourceFieldKey: 'title',
          slugPattern: '{{title}}',
          slugConflictRule: 'next-available',
          updatedAt: '2026-06-25T12:41:00.000Z',
          updatedBy: 'Admin',
        },
      ],
    });

    // Then: only reusable named policies appear, each with source page metadata.
    expect(entries).toEqual([
      {
        pageId: 'source-page',
        policyName: 'Public recipe routes',
        sourceFieldKey: 'code',
        slugPattern: '{{code}}-{{title}}',
        slugConflictRule: 'record-id-suffix',
        sourceTitle: 'Recipe source page',
        usageCount: 2,
        updatedAt: '2026-06-25T12:34:56.000Z',
        updatedBy: 'Admin',
      },
      {
        pageId: 'target-page',
        policyName: 'Public recipe routes',
        sourceFieldKey: 'code',
        slugPattern: '{{code}}-{{title}}',
        slugConflictRule: 'record-id-suffix',
        sourceTitle: 'Recipe target page',
        usageCount: 2,
        updatedAt: '2026-06-25T12:40:00.000Z',
        updatedBy: 'Admin',
      },
    ]);
  });
});

function makePage(pageId: string, title: string): LinkedDynamicItemPage {
  return {
    pageId,
    title,
    slug: pageId,
    editorHref: `/ko/admin-builder?pageId=${pageId}`,
    publicHref: `/ko/${pageId}`,
    published: false,
    recordSlug: 'alpha',
    slugField: 'slug',
  };
}
