import { describe, expect, it } from 'vitest';
import {
  buildCmsDynamicItemLifecyclePolicyStepBody,
  formatCmsDynamicItemLifecyclePolicySavedStatus,
  getCmsDynamicItemLifecyclePolicyDataAttributes,
  resolveCmsDynamicItemLifecyclePolicyPresets,
  resolveCmsDynamicItemReusablePolicyTemplates,
  shouldShowCmsDynamicItemLifecyclePolicyToolbar,
} from '@/components/builder/cms/cms-dynamic-item-lifecycle-policy-presets';
import type { LinkedDynamicItemRouteCoverage } from '@/components/builder/cms/cms-dynamic-linked-pages-model';

function makeCoverage(
  overrides: Partial<LinkedDynamicItemRouteCoverage> = {},
): LinkedDynamicItemRouteCoverage {
  return {
    pageId: 'recipe-detail',
    slugField: 'slug',
    totalRecordCount: 0,
    publishedRouteCount: 0,
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

describe('cms dynamic item lifecycle policy presets', () => {
  it('builds a route-preparation policy in repair-then-publish order', () => {
    const presets = resolveCmsDynamicItemLifecyclePolicyPresets(makeCoverage({
      missingSlugRecordIds: ['missing-id'],
      slugConflictRecordIds: ['duplicate-id'],
      publishableHeldBackRecordIds: ['draft-id'],
    }));

    const [preset] = presets;
    if (!preset) throw new Error('Expected a lifecycle policy preset.');
    expect(preset.kind).toBe('prepare-public-routes');
    expect(preset.idleLabel).toBe('Prepare public routes (3)');
    expect(preset.steps).toEqual([
      { kind: 'generate-missing-slugs', recordIds: ['missing-id'] },
      { kind: 'repair-slug-conflicts', recordIds: ['duplicate-id'] },
      { kind: 'publish-held-back', recordIds: ['draft-id'] },
    ]);
    expect(preset.confirm).toContain('generate missing slug values');
    expect(preset.confirm).toContain('repair duplicate slug values');
    expect(preset.confirm).toContain('publish held-back records');
  });

  it('offers non-destructive quarantine and recovery policies for lifecycle records', () => {
    const presets = resolveCmsDynamicItemLifecyclePolicyPresets(makeCoverage({
      archivableHeldBackRecordIds: ['draft-id', 'pending-id'],
      restorableArchivedRecordIds: ['archived-id'],
      deletableArchivedRecordIds: ['delete-id'],
    }));

    expect(presets.map((preset) => preset.kind)).toEqual([
      'quarantine-held-back',
      'recover-archived',
    ]);
    expect(presets.map((preset) => preset.steps)).toEqual([
      [{ kind: 'archive-held-back', recordIds: ['draft-id', 'pending-id'] }],
      [{ kind: 'restore-archived', recordIds: ['archived-id'] }],
    ]);
  });

  it('exposes stable route-card data attributes for policy buttons', () => {
    expect(getCmsDynamicItemLifecyclePolicyDataAttributes('prepare-public-routes', 'page-1')).toEqual({
      'data-cms-dynamic-item-policy-prepare-public-routes': 'page-1',
    });
    expect(getCmsDynamicItemLifecyclePolicyDataAttributes('recover-archived', 'page-1')).toEqual({
      'data-cms-dynamic-item-policy-recover-archived': 'page-1',
    });
  });

  it('returns no policies when every route lifecycle bucket is empty', () => {
    expect(resolveCmsDynamicItemLifecyclePolicyPresets(makeCoverage())).toEqual([]);
  });

  it('keeps the policy toolbar visible for clean routes with a saved policy', () => {
    expect(shouldShowCmsDynamicItemLifecyclePolicyToolbar({
      presets: [],
      savedPolicy: {
        sourceFieldKey: 'code',
        slugPattern: '{{code}}-{{title}}',
        slugConflictRule: 'record-id-suffix',
        updatedAt: '2026-06-25T12:34:56.000Z',
        updatedBy: 'Admin',
      },
    })).toBe(true);
    expect(shouldShowCmsDynamicItemLifecyclePolicyToolbar({
      presets: [],
      savedPolicy: undefined,
    })).toBe(false);
  });

  it('keeps clean route policy controls visible when another named policy can be reused', () => {
    const reusablePolicyTemplates = resolveCmsDynamicItemReusablePolicyTemplates([
      {
        collectionId: 'recipes',
        pageId: 'recipe-source',
        policyName: 'Public recipe routes',
        sourceFieldKey: 'code',
        slugPattern: '{{code}}-{{title}}',
        slugConflictRule: 'record-id-suffix',
        updatedAt: '2026-06-25T12:34:56.000Z',
        updatedBy: 'Admin',
      },
      {
        collectionId: 'recipes',
        pageId: 'recipe-target',
        policyName: 'Current page policy',
        sourceFieldKey: 'slug',
        slugPattern: '{{slug}}',
        slugConflictRule: 'next-available',
        updatedAt: '2026-06-25T12:34:56.000Z',
        updatedBy: 'Admin',
      },
      {
        collectionId: 'recipes',
        pageId: 'recipe-unnamed',
        policyName: '',
        sourceFieldKey: 'code',
        slugPattern: '{{code}}',
        slugConflictRule: 'next-available',
        updatedAt: '2026-06-25T12:34:56.000Z',
        updatedBy: 'Admin',
      },
    ], 'recipe-target');

    expect(reusablePolicyTemplates).toEqual([
      {
        pageId: 'recipe-source',
        policyName: 'Public recipe routes',
        sourceFieldKey: 'code',
        slugPattern: '{{code}}-{{title}}',
        slugConflictRule: 'record-id-suffix',
      },
    ]);
    expect(shouldShowCmsDynamicItemLifecyclePolicyToolbar({
      presets: [],
      savedPolicy: undefined,
      reusablePolicyTemplates,
    })).toBe(true);
  });

  it('builds route-preparation step bodies with authored slug policy options', () => {
    expect(buildCmsDynamicItemLifecyclePolicyStepBody({
      step: { kind: 'repair-slug-conflicts', recordIds: ['duplicate-id'] },
      slugField: 'slug',
      sourceFieldKey: 'code',
      slugPattern: '{{code}}-{{title}}',
      slugConflictRule: 'record-id-suffix',
    })).toEqual({
      action: 'repair-slug-conflicts',
      recordIds: ['duplicate-id'],
      slugField: 'slug',
      sourceFieldKey: 'code',
      slugPattern: '{{code}}-{{title}}',
      slugConflictRule: 'record-id-suffix',
    });
  });

  it('formats saved route-preparation policy metadata for reload visibility', () => {
    expect(formatCmsDynamicItemLifecyclePolicySavedStatus({
      sourceFieldKey: 'code',
      slugPattern: '{{code}}-{{title}}',
      slugConflictRule: 'record-id-suffix',
      updatedAt: '2026-06-25T12:34:56.000Z',
      updatedBy: ' Admin ',
    })).toBe('Last saved by Admin on 2026-06-25 12:34 UTC');
    expect(formatCmsDynamicItemLifecyclePolicySavedStatus({
      sourceFieldKey: 'code',
      slugPattern: '{{code}}-{{title}}',
      slugConflictRule: 'record-id-suffix',
      updatedAt: 'not-a-date',
      updatedBy: 'Admin',
    })).toBeNull();
  });
});
