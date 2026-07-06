import { describe, expect, it } from 'vitest';
import { buildDatasetBindingPatch } from '@/lib/builder/cms-binding-request';

const builtin = { collectionIds: ['columns'], modeOptions: ['list'] } as const;

describe('buildDatasetBindingPatch (WIX-PERFECT #6 Slice 3)', () => {
  it('builds a CMS-collection patch carrying cmsCollectionId (built-in checks skipped)', () => {
    const result = buildDatasetBindingPatch(
      { targetId: 'home.insights.feed', cmsCollectionId: 'recipes', mode: 'list', limit: 8, filters: [], sort: [] },
      builtin,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.isCmsCollection).toBe(true);
    expect(result.patch.cmsCollectionId).toBe('recipes');
    expect(result.patch.collectionId).toBe('columns'); // valid built-in kept for type-safety
    expect(result.patch.limit).toBe(8);
  });

  it('treats a cms.<id>.list targetId as a CMS binding even without explicit cmsCollectionId... requires the id', () => {
    const missing = buildDatasetBindingPatch({ targetId: 'cms.recipes.list' }, builtin);
    expect(missing.ok).toBe(false);
    if (missing.ok) return;
    expect(missing.error).toMatch(/CMS collection id/i);
  });

  it('validates a built-in binding strictly (unchanged behavior)', () => {
    const ok = buildDatasetBindingPatch(
      { targetId: 'home.insights.feed', collectionId: 'columns', mode: 'list' },
      builtin,
    );
    expect(ok.ok).toBe(true);
    if (!ok.ok) return;
    expect(ok.isCmsCollection).toBe(false);
    expect(ok.patch.cmsCollectionId).toBeUndefined();
  });

  it('rejects a built-in binding with a non-approved collection', () => {
    const bad = buildDatasetBindingPatch(
      { targetId: 'home.insights.feed', collectionId: 'not-real', mode: 'list' },
      builtin,
    );
    expect(bad.ok).toBe(false);
    if (bad.ok) return;
    expect(bad.error).toMatch(/collection is not approved/i);
  });

  it('rejects a built-in binding with a non-approved mode', () => {
    const bad = buildDatasetBindingPatch(
      { targetId: 'home.insights.feed', collectionId: 'columns', mode: 'grid' },
      builtin,
    );
    expect(bad.ok).toBe(false);
    if (bad.ok) return;
    expect(bad.error).toMatch(/mode is not approved/i);
  });

  it('rejects a negative limit on either path', () => {
    const r = buildDatasetBindingPatch(
      { targetId: 'home.insights.feed', cmsCollectionId: 'recipes', limit: -1 },
      builtin,
    );
    expect(r.ok).toBe(false);
  });
});
