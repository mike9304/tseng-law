import { describe, expect, it } from 'vitest';
import { composeVisitorDatasetPatch } from '@/lib/builder/datasets-visitor-filters';
import { createDefaultBuilderPageDatasets } from '@/lib/builder/datasets';
import type { BuilderPageDatasetBinding } from '@/lib/builder/types';

function homeInsightsBinding(): BuilderPageDatasetBinding {
  const binding = createDefaultBuilderPageDatasets('home').find((entry) => (
    entry.targetId === 'home.insights.feed'
  ));
  if (!binding) throw new Error('Missing home insights binding.');
  return binding;
}

describe('composeVisitorDatasetPatch custom CMS field access', () => {
  it('uses collection field metadata instead of the carrier target whitelist', () => {
    const binding: BuilderPageDatasetBinding = {
      ...homeInsightsBinding(),
      cmsCollectionId: 'recipes',
      limit: 6,
    };

    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding,
      query: {
        filter: { difficulty: 'advanced', category: 'soup' },
        sort: 'difficulty:asc,category:desc',
      },
      fieldAccess: {
        filterFields: [{ fieldId: 'difficulty', label: 'Difficulty' }],
        sortFields: [{ fieldId: 'difficulty', label: 'Difficulty' }],
        defaultLimit: 6,
      },
    });

    expect(result.appliedFilters).toEqual([
      { fieldId: 'difficulty', operator: 'contains', value: 'advanced' },
    ]);
    expect(result.appliedSort).toEqual([
      { fieldId: 'difficulty', direction: 'asc' },
    ]);
    expect(result.rejectedFilterFields).toEqual(['category']);
    expect(result.rejectedSortFields).toEqual(['category']);
  });
});
