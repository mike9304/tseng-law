import { describe, expect, it } from 'vitest';
import {
  createBuilderCmsRecordSavedView,
  normalizeBuilderCmsRecordSavedViews,
  queryBuilderCmsRecords,
} from '@/lib/builder/cms-record-query';
import type { BuilderCmsFieldDefinition, BuilderCmsRecord } from '@/lib/builder/cms-types';

const fields: BuilderCmsFieldDefinition[] = [
  {
    fieldId: 'field-title',
    key: 'title',
    label: 'Title',
    type: 'text',
    localized: true,
    repeated: false,
    required: true,
  },
  {
    fieldId: 'field-score',
    key: 'score',
    label: 'Score',
    type: 'number',
    localized: false,
    repeated: false,
    required: false,
  },
  {
    fieldId: 'field-featured',
    key: 'featured',
    label: 'Featured',
    type: 'boolean',
    localized: false,
    repeated: false,
    required: false,
  },
  {
    fieldId: 'field-date',
    key: 'publishedOn',
    label: 'Published on',
    type: 'date',
    localized: false,
    repeated: false,
    required: false,
  },
  {
    fieldId: 'field-tags',
    key: 'tags',
    label: 'Tags',
    type: 'string-list',
    localized: false,
    repeated: true,
    required: false,
  },
  {
    fieldId: 'field-hero',
    key: 'hero',
    label: 'Hero image',
    type: 'image',
    localized: false,
    repeated: false,
    required: false,
  },
];

const records: BuilderCmsRecord[] = [
  record('record-a', 'published', {
    title: 'Taiwan Legal Guide',
    score: 10,
    featured: true,
    publishedOn: '2026-05-10',
    tags: ['legal', 'taiwan'],
    hero: {
      url: '/api/builder/assets/ko/lobby.webp',
      altText: 'Taipei office lobby',
      assetId: 'builder/assets/ko/lobby.webp',
    },
  }),
  record('record-b', 'draft', {
    title: 'Korea Advisory Note',
    score: 4,
    featured: false,
    publishedOn: '2026-05-12',
    tags: ['advisory'],
  }),
  record('record-c', 'published', {
    title: 'Investment Update',
    score: 10,
    featured: true,
    publishedOn: '2026-05-14',
    tags: ['investment', 'taiwan'],
  }),
];

describe('builder CMS record query', () => {
  it('applies typed filters across field types and media metadata', () => {
    const result = queryBuilderCmsRecords(records, fields, {
      filters: [
        { filterId: 'status', fieldKey: 'status', operator: 'is', value: 'published' },
        { filterId: 'score', fieldKey: 'score', operator: 'gte', value: 10 },
        { filterId: 'tags', fieldKey: 'tags', operator: 'includes', value: 'taiwan' },
        { filterId: 'hero', fieldKey: 'hero', operator: 'contains', value: 'Taipei office' },
      ],
      sortBy: 'title',
      sortDirection: 'asc',
    });

    expect(result.filteredRecordIds).toEqual(['record-a']);
    expect(result.records[0]?.fields.hero).toMatchObject({
      altText: 'Taipei office lobby',
      assetId: 'builder/assets/ko/lobby.webp',
    });
  });

  it('uses deterministic tie-breaking and stable pagination', () => {
    const result = queryBuilderCmsRecords(records, fields, {
      filters: [{ filterId: 'featured', fieldKey: 'featured', operator: 'is', value: 'true' }],
      sortBy: 'score',
      sortDirection: 'desc',
      page: 2,
      pageSize: 1,
    });

    expect(result.filteredRecordIds).toEqual(['record-a', 'record-c']);
    expect(result.records.map((item) => item.recordId)).toEqual(['record-c']);
    expect(result).toMatchObject({ page: 2, pageCount: 2, pageSize: 1, total: 2 });
  });

  it('normalizes saved record views for local persistence', () => {
    const view = createBuilderCmsRecordSavedView({
      name: 'Published Taiwan',
      query: ' legal ',
      filters: [{ filterId: 'status', fieldKey: 'status', operator: 'is', value: 'published' }],
      sortBy: 'updatedAt',
      sortDirection: 'desc',
      pageSize: 25,
      now: '2026-05-16T00:00:00.000Z',
    });

    expect(view).toMatchObject({
      name: 'Published Taiwan',
      query: 'legal',
      pageSize: 25,
      filters: [{ fieldKey: 'status', operator: 'is', value: 'published' }],
    });
    expect(normalizeBuilderCmsRecordSavedViews([view, { ...view, name: 'Duplicate' }, { name: '' }])).toHaveLength(1);
  });
});

function record(recordId: string, status: BuilderCmsRecord['status'], fieldsValue: BuilderCmsRecord['fields']): BuilderCmsRecord {
  return {
    recordId,
    status,
    locale: 'ko',
    fields: fieldsValue,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-15T00:00:00.000Z',
  };
}
