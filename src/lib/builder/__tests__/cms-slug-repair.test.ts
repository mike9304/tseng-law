import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_THEME,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { readEditableBuilderCmsCollection } from '@/lib/builder/cms-editable';
import { bulkRepairEditableBuilderCmsRecordSlugConflicts } from '@/lib/builder/cms-slug-conflict-repair';
import { bulkGenerateEditableBuilderCmsRecordSlugs } from '@/lib/builder/cms-slug-repair';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('CMS slug repair', () => {
  let siteDoc: BuilderSiteDocument;

  beforeEach(() => {
    const now = '2026-06-21T00:00:00.000Z';
    siteDoc = {
      version: 1,
      siteId: 'test-site',
      name: 'Test site',
      locale: 'ko',
      navigation: [],
      theme: DEFAULT_THEME,
      pages: [],
      cmsCollections: [
        {
          collectionId: 'recipes',
          name: 'Recipes',
          slug: 'recipes',
          description: '',
          localized: false,
          fields: [
            {
              fieldId: 'title-field',
              key: 'title',
              label: 'Title',
              type: 'text',
              localized: false,
              repeated: false,
              required: true,
            },
            {
              fieldId: 'slug-field',
              key: 'slug',
              label: 'Slug',
              type: 'slug',
              localized: false,
              repeated: false,
              required: true,
              unique: true,
            },
            {
              fieldId: 'code-field',
              key: 'code',
              label: 'Code',
              type: 'text',
              localized: false,
              repeated: false,
              required: false,
            },
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
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    mockedReadSiteDocument.mockReset();
    mockedReadSiteDocument.mockImplementation(async () => siteDoc);
    mockedWriteSiteDocument.mockReset();
    mockedWriteSiteDocument.mockImplementation(async (nextDoc) => {
      siteDoc = nextDoc;
    });
  });

  it('generates unique slugs for requested missing-slug records', async () => {
    const result = await bulkGenerateEditableBuilderCmsRecordSlugs(
      'test-site',
      'ko',
      'recipes',
      ['missing-alpha', 'missing-cjk', 'missing-record'],
      'slug',
    );

    expect(result).toMatchObject({
      requested: 3,
      updated: 2,
      missingRecordIds: ['missing-record'],
      skippedRecordIds: [],
      slugField: 'slug',
    });
    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'recipes');
    expect(latest?.records.map((record) => [record.recordId, record.fields.slug])).toEqual([
      ['alpha-id', 'alpha-recipe'],
      ['missing-alpha', 'alpha-recipe-2'],
      ['missing-cjk', 'cjk-code'],
      ['duplicate-alpha', 'alpha-recipe'],
    ]);
  });

  it('generates missing slugs from a requested source field', async () => {
    const result = await bulkGenerateEditableBuilderCmsRecordSlugs(
      'test-site',
      'ko',
      'recipes',
      ['missing-alpha', 'missing-cjk'],
      'slug',
      {},
      'code',
    );

    expect(result).toMatchObject({
      requested: 2,
      updated: 2,
      skippedRecordIds: [],
      sourceFieldKey: 'code',
    });
    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'recipes');
    expect(latest?.records.map((record) => [record.recordId, record.fields.slug])).toEqual([
      ['alpha-id', 'alpha-recipe'],
      ['missing-alpha', 'external-42'],
      ['missing-cjk', 'cjk-code'],
      ['duplicate-alpha', 'alpha-recipe'],
    ]);
  });

  it('repairs only requested duplicate-slug records', async () => {
    const result = await bulkRepairEditableBuilderCmsRecordSlugConflicts(
      'test-site',
      'ko',
      'recipes',
      ['alpha-id', 'duplicate-alpha', 'missing-alpha'],
      'slug',
    );

    expect(result).toMatchObject({
      requested: 3,
      updated: 1,
      missingRecordIds: [],
      skippedRecordIds: ['alpha-id', 'missing-alpha'],
      slugField: 'slug',
    });
    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'recipes');
    expect(latest?.records.map((record) => [record.recordId, record.fields.slug])).toEqual([
      ['alpha-id', 'alpha-recipe'],
      ['missing-alpha', ''],
      ['missing-cjk', ''],
      ['duplicate-alpha', 'alpha-recipe-2'],
    ]);
  });

  it('repairs duplicate slugs from a requested source field', async () => {
    const result = await bulkRepairEditableBuilderCmsRecordSlugConflicts(
      'test-site',
      'ko',
      'recipes',
      ['duplicate-alpha'],
      'slug',
      {},
      'code',
    );

    expect(result).toMatchObject({
      requested: 1,
      updated: 1,
      skippedRecordIds: [],
      sourceFieldKey: 'code',
    });
    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'recipes');
    expect(latest?.records.map((record) => [record.recordId, record.fields.slug])).toEqual([
      ['alpha-id', 'alpha-recipe'],
      ['missing-alpha', ''],
      ['missing-cjk', ''],
      ['duplicate-alpha', 'duplicate-code'],
    ]);
  });

  it('repairs duplicate slugs with a record-id conflict rule', async () => {
    const result = await bulkRepairEditableBuilderCmsRecordSlugConflicts(
      'test-site',
      'ko',
      'recipes',
      ['duplicate-alpha'],
      'slug',
      {},
      undefined,
      undefined,
      'record-id-suffix',
    );

    expect(result).toMatchObject({
      requested: 1,
      updated: 1,
      skippedRecordIds: [],
      slugConflictRule: 'record-id-suffix',
    });
    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'recipes');
    expect(latest?.records.map((record) => [record.recordId, record.fields.slug])).toEqual([
      ['alpha-id', 'alpha-recipe'],
      ['missing-alpha', ''],
      ['missing-cjk', ''],
      ['duplicate-alpha', 'alpha-recipe-duplicate-alpha'],
    ]);
  });
});
