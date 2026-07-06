import { describe, expect, it } from 'vitest';
import {
  resolveCmsDynamicItemPolicyRolloutTargets,
} from '@/components/builder/cms/cms-dynamic-item-policy-rollout';
import type { LinkedDynamicItemRouteCoverage } from '@/components/builder/cms/cms-dynamic-linked-pages-model';

function makeCoverage(
  pageId: string,
  overrides: Partial<LinkedDynamicItemRouteCoverage> = {},
): LinkedDynamicItemRouteCoverage {
  return {
    pageId,
    slugField: 'slug',
    totalRecordCount: 2,
    publishedRouteCount: 2,
    draftRecordCount: 0,
    archivedRecordCount: 0,
    missingSlugCount: 0,
    slugConflictCount: 0,
    sampleRoutes: [],
    publishableHeldBackRecordIds: [],
    archivableHeldBackRecordIds: [],
    restorableArchivedRecordIds: [],
    deletableArchivedRecordIds: [],
    missingSlugRecordIds: [],
    slugConflictRecordIds: [],
    ...overrides,
  };
}

describe('cms dynamic item policy rollout', () => {
  it('targets only clean linked item pages without an existing saved policy', () => {
    const targets = resolveCmsDynamicItemPolicyRolloutTargets({
      candidates: [
        { pageId: 'source-page', title: 'Source page', coverage: makeCoverage('source-page') },
        { pageId: 'clean-target', title: 'Clean target', coverage: makeCoverage('clean-target') },
        {
          pageId: 'draft-target',
          title: 'Draft target',
          coverage: makeCoverage('draft-target', {
            draftRecordCount: 1,
            publishableHeldBackRecordIds: ['draft-record'],
          }),
        },
        {
          pageId: 'missing-target',
          title: 'Missing target',
          coverage: makeCoverage('missing-target', {
            missingSlugCount: 1,
            missingSlugRecordIds: ['missing-record'],
          }),
        },
      ],
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
      ],
    });

    expect(targets).toEqual([
      { pageId: 'clean-target', title: 'Clean target' },
    ]);
  });
});
