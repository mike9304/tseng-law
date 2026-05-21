import { describe, expect, it } from 'vitest';
import {
  buildVisitorQueryString,
  composeVisitorDatasetPatch,
  parseVisitorPaginationParams,
  sliceVisitorRecords,
} from '@/lib/builder/datasets-visitor-filters';
import { createDefaultBuilderPageDatasets } from '@/lib/builder/datasets';
import type { BuilderPageDatasetBinding } from '@/lib/builder/types';

function bindingFor(targetId: 'home.insights.feed' | 'home.services.list'): BuilderPageDatasetBinding {
  const datasets = createDefaultBuilderPageDatasets('home');
  const binding = datasets.find((entry) => entry.targetId === targetId);
  if (!binding) throw new Error(`no binding for ${targetId}`);
  return binding;
}

describe('composeVisitorDatasetPatch', () => {
  it('accepts whitelisted filters and rejects unknown fields', () => {
    const binding = bindingFor('home.insights.feed');
    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding,
      query: {
        filter: {
          category: 'formation',
          unknownField: 'value',
          title: 'taiwan',
        },
      },
    });

    expect(result.appliedFilters).toEqual([
      { fieldId: 'category', operator: 'contains', value: 'formation' },
      { fieldId: 'title', operator: 'contains', value: 'taiwan' },
    ]);
    expect(result.rejectedFilterFields).toEqual(['unknownField']);
  });

  it('honors the equals operator override when supplied', () => {
    const binding = bindingFor('home.insights.feed');
    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding,
      query: {
        filter: { slug: 'taiwan-gym-injury-lawsuit' },
        filterOp: { slug: 'equals' },
      },
    });

    expect(result.appliedFilters).toEqual([
      { fieldId: 'slug', operator: 'equals', value: 'taiwan-gym-injury-lawsuit' },
    ]);
  });

  it('parses sort tokens and rejects unknown sort fields', () => {
    const binding = bindingFor('home.insights.feed');
    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding,
      query: { sort: 'date:desc,title:asc,unknown:asc' },
    });

    expect(result.appliedSort).toEqual([
      { fieldId: 'date', direction: 'desc' },
      { fieldId: 'title', direction: 'asc' },
    ]);
    expect(result.rejectedSortFields).toEqual(['unknown']);
  });

  it('clamps overly long filter values', () => {
    const binding = bindingFor('home.insights.feed');
    const longValue = 'a'.repeat(500);
    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding,
      query: { filter: { title: longValue } },
    });

    expect(result.appliedFilters[0]?.value).toHaveLength(120);
  });

  it('drops fields containing unsafe characters', () => {
    const binding = bindingFor('home.insights.feed');
    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding,
      query: { filter: { 'title; drop table': 'x', '__proto__': 'y' } },
    });

    expect(result.appliedFilters).toEqual([]);
  });

  it('caps the visitor filter count', () => {
    const binding = bindingFor('home.insights.feed');
    const filter: Record<string, string> = {};
    for (let i = 0; i < 12; i += 1) {
      filter[`title${i}`] = String(i);
    }
    // Only known fields can pass through anyway.
    filter.title = 'real';
    filter.category = 'formation';
    filter.categoryLabel = 'foo';
    filter.slug = 'bar';
    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding,
      query: { filter },
    });

    expect(result.appliedFilters.length).toBeLessThanOrEqual(6);
  });

  it('merges authored filters with visitor filters and dedupes identical pairs', () => {
    const baseline = bindingFor('home.insights.feed');
    const authored: BuilderPageDatasetBinding = {
      ...baseline,
      filters: [{ fieldId: 'category', operator: 'contains', value: 'formation' }],
    };
    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding: authored,
      query: { filter: { category: 'formation', title: 'taiwan' } },
    });

    expect(result.patch.filters).toEqual([
      { fieldId: 'category', operator: 'contains', value: 'formation' },
      { fieldId: 'title', operator: 'contains', value: 'taiwan' },
    ]);
  });

  it('uses authored sort when visitor provides none', () => {
    const baseline = bindingFor('home.insights.feed');
    const authored: BuilderPageDatasetBinding = {
      ...baseline,
      sort: [{ fieldId: 'date', direction: 'desc' }],
    };
    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding: authored,
      query: {},
    });

    expect(result.patch.sort).toEqual([{ fieldId: 'date', direction: 'desc' }]);
  });

  it('never widens the limit beyond the editor-authored cap', () => {
    const baseline = bindingFor('home.insights.feed');
    const authored: BuilderPageDatasetBinding = { ...baseline, limit: 7 };
    const result = composeVisitorDatasetPatch({
      targetId: 'home.insights.feed',
      binding: authored,
      query: { perPage: '20', page: '3' },
    });

    expect(result.patch.limit).toBeLessThanOrEqual(7);
  });
});

describe('parseVisitorPaginationParams', () => {
  it('returns sane defaults for empty input', () => {
    const result = parseVisitorPaginationParams(undefined);
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(12);
    expect(result.offset).toBe(0);
  });

  it('rejects non-numeric and out-of-range page values', () => {
    expect(parseVisitorPaginationParams({ page: 'abc' }).page).toBe(1);
    expect(parseVisitorPaginationParams({ page: '0' }).page).toBe(1);
    expect(parseVisitorPaginationParams({ page: '99999' }).page).toBe(500);
  });

  it('respects editor-authored per-page ceiling', () => {
    const result = parseVisitorPaginationParams({ perPage: '50' }, 6);
    expect(result.perPage).toBe(6);
  });

  it('falls back to the limit alias', () => {
    const result = parseVisitorPaginationParams({ limit: '4' }, 10);
    expect(result.perPage).toBe(4);
  });

  it('computes the offset from page and perPage', () => {
    const result = parseVisitorPaginationParams({ page: '3', perPage: '5' }, 20);
    expect(result.offset).toBe(10);
  });
});

describe('sliceVisitorRecords', () => {
  it('returns the requested window and pagination flags', () => {
    const records = Array.from({ length: 25 }, (_, i) => i);
    const result = sliceVisitorRecords(records, { page: 2, perPage: 10, offset: 10 });
    expect(result.items).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    expect(result.hasPrev).toBe(true);
    expect(result.hasNext).toBe(true);
    expect(result.totalPages).toBe(3);
  });

  it('flags last page correctly', () => {
    const records = [1, 2, 3];
    const result = sliceVisitorRecords(records, { page: 1, perPage: 10, offset: 0 });
    expect(result.hasPrev).toBe(false);
    expect(result.hasNext).toBe(false);
    expect(result.totalPages).toBe(1);
  });

  it('handles empty record lists', () => {
    const result = sliceVisitorRecords([], { page: 1, perPage: 10, offset: 0 });
    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(1);
  });
});

describe('buildVisitorQueryString', () => {
  it('serializes filters and sort tokens', () => {
    const result = buildVisitorQueryString({
      filters: [
        { fieldId: 'category', operator: 'contains', value: 'formation' },
        { fieldId: 'slug', operator: 'equals', value: 'taiwan-basics' },
      ],
      sort: [
        { fieldId: 'date', direction: 'desc' },
        { fieldId: 'title', direction: 'asc' },
      ],
      page: 2,
      perPage: 6,
    });

    expect(result).toContain('filter%5Bcategory%5D=formation');
    expect(result).toContain('filter%5Bslug%5D=taiwan-basics');
    expect(result).toContain('filterOp%5Bslug%5D=equals');
    expect(result).toContain('sort=date%3Adesc%2Ctitle%3Aasc');
    expect(result).toContain('page=2');
    expect(result).toContain('perPage=6');
  });

  it('skips page=1 to keep canonical URLs clean', () => {
    const result = buildVisitorQueryString({ page: 1 });
    expect(result).toBe('');
  });

  it('omits empty filters', () => {
    const result = buildVisitorQueryString({
      filters: [{ fieldId: '', operator: 'contains', value: '' }],
    });
    expect(result).toBe('');
  });
});