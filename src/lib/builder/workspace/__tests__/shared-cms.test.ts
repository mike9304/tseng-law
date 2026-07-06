import { describe, expect, it } from 'vitest';
import { resolveAccountCollectionBindableTargets } from '@/lib/builder/workspace/shared-cms';

describe('resolveAccountCollectionBindableTargets', () => {
  it('maps live cms collections to their binder targets', () => {
    expect(resolveAccountCollectionBindableTargets('columns')).toEqual([
      expect.objectContaining({
        targetId: 'home.insights.feed',
        pageKey: 'home',
        sectionKey: 'home.insights',
        title: 'Insights feed',
      }),
    ]);

    expect(resolveAccountCollectionBindableTargets('service-areas')).toEqual([
      expect.objectContaining({
        targetId: 'home.services.list',
        pageKey: 'home',
        sectionKey: 'home.services',
        title: 'Services list',
      }),
    ]);
  });

  it('returns empty targets for collections without explicit bindings', () => {
    expect(resolveAccountCollectionBindableTargets('unknown-collection')).toEqual([]);
  });
});
