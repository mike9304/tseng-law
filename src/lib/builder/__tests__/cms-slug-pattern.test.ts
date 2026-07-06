import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BuilderCmsValidationError } from '@/lib/builder/cms-validation-error';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { bulkRepairEditableBuilderCmsRecordSlugConflicts } from '@/lib/builder/cms-slug-conflict-repair';
import {
  bulkGenerateEditableBuilderCmsRecordSlugs,
  resolveSlugBase,
} from '@/lib/builder/cms-slug-repair';
import {
  appendSlugPatternToken,
  normalizeOptionalSlugPattern,
  resolveSlugPatternBase,
  resolveSlugPatternPreview,
} from '@/lib/builder/cms-slug-pattern';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  DEFAULT_THEME,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('CMS slug pattern composition', () => {
  let siteDoc: BuilderSiteDocument;

  beforeEach(() => {
    siteDoc = makeSiteDoc(makeCollection());
    mockedReadSiteDocument.mockReset();
    mockedReadSiteDocument.mockImplementation(async () => siteDoc);
    mockedWriteSiteDocument.mockReset();
    mockedWriteSiteDocument.mockImplementation(async (nextDoc) => {
      siteDoc = nextDoc;
    });
  });

  it('composes a slug base from a normalized multi-field pattern', () => {
    const collection = makeCollection();
    const pattern = normalizeOptionalSlugPattern('{{code}}-{{title}}', collection, 'slug');
    const record = requireRecord(collection, 1);

    expect(pattern).toBe('{{code}}-{{title}}');
    expect(pattern ? resolveSlugPatternBase(record, pattern) : '').toBe('external-42-alpha-recipe');
  });

  it('rejects unknown pattern fields before mutation', () => {
    const collection = makeCollection();

    expect(() => normalizeOptionalSlugPattern('{{missing}}-{{title}}', collection, 'slug'))
      .toThrow(BuilderCmsValidationError);
  });

  it('builds field-token presets without duplicating existing pattern fields', () => {
    expect(appendSlugPatternToken('', 'code')).toBe('{{code}}');
    expect(appendSlugPatternToken('{{code}}', 'title')).toBe('{{code}}-{{title}}');
    expect(appendSlugPatternToken('{{code}}-{{title}}', 'code')).toBe('{{code}}-{{title}}');
  });

  it('previews a composed pattern slug from target record fields', () => {
    const collection = makeCollection();
    const record = requireRecord(collection, 1);

    expect(resolveSlugPatternPreview(record.fields, '{{code}}-{{title}}'))
      .toBe('external-42-alpha-recipe');
    expect(resolveSlugPatternPreview(record.fields, '')).toBeNull();
  });

  it('uses the pattern before the source field and fallback when generating missing slugs', async () => {
    const result = await bulkGenerateEditableBuilderCmsRecordSlugs(
      'test-site',
      'ko',
      'recipes',
      ['missing-alpha', 'missing-cjk'],
      'slug',
      {},
      'code',
      '{{code}}-{{title}}',
    );

    expect(result).toMatchObject({
      requested: 2,
      updated: 2,
      skippedRecordIds: [],
      sourceFieldKey: 'code',
      slugPattern: '{{code}}-{{title}}',
    });
    const collection = makeCollection();
    expect(resolveSlugBase(requireRecord(collection, 1), collection.fields, 'code', '{{title}}'))
      .toBe('alpha-recipe');
    const latest = await readSiteDocument('test-site', 'ko');
    expect(latest.cmsCollections?.[0]?.records.map((record) => [record.recordId, record.fields.slug])).toEqual([
      ['alpha-id', 'alpha-recipe'],
      ['missing-alpha', 'external-42-alpha-recipe'],
      ['missing-cjk', 'cjk-code'],
      ['duplicate-alpha', 'alpha-recipe'],
    ]);
  });

  it('uses the pattern when repairing duplicate slug conflicts', async () => {
    const result = await bulkRepairEditableBuilderCmsRecordSlugConflicts(
      'test-site',
      'ko',
      'recipes',
      ['duplicate-alpha'],
      'slug',
      {},
      undefined,
      '{{code}}-{{title}}',
    );

    expect(result).toMatchObject({
      requested: 1,
      updated: 1,
      skippedRecordIds: [],
      slugPattern: '{{code}}-{{title}}',
    });
    const latest = await readSiteDocument('test-site', 'ko');
    expect(latest.cmsCollections?.[0]?.records.map((record) => [record.recordId, record.fields.slug])).toEqual([
      ['alpha-id', 'alpha-recipe'],
      ['missing-alpha', ''],
      ['missing-cjk', ''],
      ['duplicate-alpha', 'duplicate-code-alpha-recipe'],
    ]);
  });
});

function makeSiteDoc(collection: BuilderCmsCollection): BuilderSiteDocument {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    version: 1,
    siteId: 'test-site',
    name: 'Test site',
    locale: 'ko',
    navigation: [],
    theme: DEFAULT_THEME,
    pages: [],
    cmsCollections: [collection],
    createdAt: now,
    updatedAt: now,
  };
}

function requireRecord(collection: BuilderCmsCollection, index: number) {
  const record = collection.records[index];
  if (!record) throw new Error(`Missing fixture record at index ${index}.`);
  return record;
}

function makeCollection(): BuilderCmsCollection {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    collectionId: 'recipes',
    name: 'Recipes',
    slug: 'recipes',
    description: '',
    localized: false,
    fields: [
      { fieldId: 'title-field', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'slug-field', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true, unique: true },
      { fieldId: 'code-field', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: 'alpha-id',
        status: 'published',
        locale: 'ko',
        fields: { title: 'Alpha Recipe', slug: 'alpha-recipe', code: 'alpha-code' },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'missing-alpha',
        status: 'published',
        locale: 'ko',
        fields: { title: 'Alpha Recipe', slug: '', code: 'external 42' },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'missing-cjk',
        status: 'draft',
        locale: 'ko',
        fields: { title: '대만 법률', slug: '', code: 'cjk code' },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: 'duplicate-alpha',
        status: 'published',
        locale: 'ko',
        fields: { title: 'Alpha Recipe', slug: 'alpha-recipe', code: 'duplicate code' },
        createdAt: now,
        updatedAt: now,
      },
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}
