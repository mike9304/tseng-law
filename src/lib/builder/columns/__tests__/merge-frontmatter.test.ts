import { describe, expect, it } from 'vitest';
import { mergeFrontmatter } from '@/lib/builder/columns/merge-frontmatter';
import type { ColumnFrontmatter } from '@/lib/builder/columns/types';

const base: ColumnFrontmatter = {
  lastmod: '2026-07-01T00:00:00.000Z',
  attorneyReviewStatus: 'pending',
  freshness: 'unknown',
  typography: { presetId: 'ko-body-sans' },
  tags: ['a'],
};

describe('mergeFrontmatter typography', () => {
  it('merges typography patch', () => {
    const next = mergeFrontmatter(
      base,
      { typography: { presetId: 'ko-body-readable', bodySize: 'lg' } },
      '2026-07-24T00:00:00.000Z',
    );
    expect(next.typography).toEqual({ presetId: 'ko-body-readable', bodySize: 'lg' });
    expect(next.tags).toEqual(['a']);
    expect(next.lastmod).toBe('2026-07-24T00:00:00.000Z');
  });

  it('clears typography on null', () => {
    const next = mergeFrontmatter(base, { typography: null }, '2026-07-24T00:00:00.000Z');
    expect(next.typography).toBeUndefined();
  });

  it('preserves typography when only body-related fields are absent (frontmatter undefined)', () => {
    const next = mergeFrontmatter(base, undefined, '2026-07-24T00:00:00.000Z');
    expect(next.typography).toEqual({ presetId: 'ko-body-sans' });
  });

  it('preserves typography when patch frontmatter omits typography key', () => {
    const next = mergeFrontmatter(base, { featured: true }, '2026-07-24T00:00:00.000Z');
    expect(next.typography).toEqual({ presetId: 'ko-body-sans' });
    expect(next.featured).toBe(true);
  });

  it('ignores invalid typography objects (keeps previous)', () => {
    const next = mergeFrontmatter(
      base,
      { typography: { presetId: 'not-real' } },
      '2026-07-24T00:00:00.000Z',
    );
    expect(next.typography).toEqual({ presetId: 'ko-body-sans' });
  });
});
