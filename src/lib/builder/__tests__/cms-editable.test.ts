import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_THEME, type BuilderSiteDocument } from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  BuilderCmsValidationError,
  createEditableBuilderCmsCollection,
  createEditableBuilderCmsRecord,
  deleteEditableBuilderCmsRecord,
  duplicateEditableBuilderCmsRecord,
  exportEditableBuilderCmsRecordsCsv,
  filterAndSortBuilderCmsRecords,
  importEditableBuilderCmsRecordsCsv,
  listEditableBuilderCmsCollections,
  readEditableBuilderCmsCollection,
  updateEditableBuilderCmsRecord,
} from '@/lib/builder/cms-editable';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('editable builder CMS store', () => {
  let siteDoc: BuilderSiteDocument;

  beforeEach(() => {
    const now = new Date('2026-05-13T00:00:00.000Z').toISOString();
    siteDoc = {
      version: 1,
      siteId: 'test-site',
      name: 'Test site',
      locale: 'ko',
      navigation: [],
      theme: DEFAULT_THEME,
      pages: [],
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

  it('creates editable collections with default schema and admin permissions', async () => {
    const detail = await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
      description: 'Client quotes',
      localized: true,
    });

    expect(detail.collectionId).toBe('testimonials');
    expect(detail.fields.map((field) => field.key)).toEqual(['title', 'slug']);
    expect(detail.permissions).toEqual({
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    });
    await expect(listEditableBuilderCmsCollections('test-site', 'ko')).resolves.toMatchObject([
      { collectionId: 'testimonials', recordCount: 0, fieldCount: 2 },
    ]);
    expect(mockedWriteSiteDocument).toHaveBeenCalledTimes(1);
  });

  it('validates required fields and unique slug values for records', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
    });

    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
        fields: { slug: 'first' },
      }),
    ).rejects.toMatchObject({
      issues: ['Title is required.'],
    });

    const first = await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'First quote', slug: 'first' },
    });
    expect(first?.fields).toMatchObject({ title: 'First quote', slug: 'first' });

    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
        fields: { title: 'Duplicate quote', slug: 'first' },
      }),
    ).rejects.toBeInstanceOf(BuilderCmsValidationError);
  });

  it('updates and deletes editable CMS records without touching source collections', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
    });
    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'Before', slug: 'before' },
    });
    expect(created).not.toBeNull();

    const updated = await updateEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'testimonials',
      created!.recordId,
      { fields: { title: 'After', slug: 'after' } },
    );
    expect(updated?.fields).toMatchObject({ title: 'After', slug: 'after' });

    await expect(
      readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials'),
    ).resolves.toMatchObject({ recordCount: 1 });

    await expect(
      deleteEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', created!.recordId),
    ).resolves.toBe(true);
    await expect(
      readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials'),
    ).resolves.toMatchObject({ recordCount: 0 });
  });

  it('duplicates editable records with unique copy slugs', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
    });
    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'First quote', slug: 'first' },
    });
    expect(created).not.toBeNull();

    const duplicate = await duplicateEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'testimonials',
      created!.recordId,
    );
    expect(duplicate?.recordId).not.toBe(created!.recordId);
    expect(duplicate?.status).toBe('draft');
    expect(duplicate?.fields).toMatchObject({ title: 'First quote', slug: 'first-copy' });

    const secondDuplicate = await duplicateEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'testimonials',
      created!.recordId,
    );
    expect(secondDuplicate?.fields).toMatchObject({ slug: 'first-copy-2' });

    await expect(
      readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials'),
    ).resolves.toMatchObject({ recordCount: 3 });
  });

  it('filters and sorts records by searchable field values', async () => {
    const detail = await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
    });
    await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'Beta quote', slug: 'beta' },
    });
    await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'Alpha quote', slug: 'alpha' },
    });
    await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'Gamma quote', slug: 'gamma' },
    });
    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials');
    expect(latest).not.toBeNull();

    expect(
      filterAndSortBuilderCmsRecords(latest!.records, detail.fields, {
        query: 'alpha',
        sortBy: 'title',
        sortDirection: 'asc',
      }).map((record) => record.fields.title),
    ).toEqual(['Alpha quote']);
    expect(
      filterAndSortBuilderCmsRecords(latest!.records, detail.fields, {
        sortBy: 'title',
        sortDirection: 'desc',
      }).map((record) => record.fields.title),
    ).toEqual(['Gamma quote', 'Beta quote', 'Alpha quote']);
  });

  it('exports and imports CSV rows with rollback on validation failure', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
    });
    await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'First, quote', slug: 'first' },
    });

    const exported = await exportEditableBuilderCmsRecordsCsv('test-site', 'ko', 'testimonials');
    expect(exported?.filename).toBe('testimonials-records.csv');
    expect(exported?.csv).toContain('recordId,status,locale,title,slug');
    expect(exported?.csv).toContain('"First, quote"');

    await expect(
      importEditableBuilderCmsRecordsCsv(
        'test-site',
        'ko',
        'testimonials',
        'recordId,status,locale,title,slug\n,published,ko,Second quote,second\n',
      ),
    ).resolves.toMatchObject({ imported: 1, mode: 'append' });
    await expect(
      readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials'),
    ).resolves.toMatchObject({ recordCount: 2 });

    await expect(
      importEditableBuilderCmsRecordsCsv(
        'test-site',
        'ko',
        'testimonials',
        'recordId,status,locale,title,slug\n,published,ko,Bad duplicate,first\n',
      ),
    ).rejects.toMatchObject({
      issues: ['Row 2: Slug must be unique.'],
    });
    await expect(
      readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials'),
    ).resolves.toMatchObject({ recordCount: 2 });

    await expect(
      importEditableBuilderCmsRecordsCsv(
        'test-site',
        'ko',
        'testimonials',
        'recordId,status,locale,title,slug\n,published,ko,Replacement quote,replacement\n',
        { mode: 'replace' },
      ),
    ).resolves.toMatchObject({ imported: 1, mode: 'replace' });
    await expect(
      readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials'),
    ).resolves.toMatchObject({ recordCount: 1 });
  });

  it('reserves static source collection ids', async () => {
    await expect(
      createEditableBuilderCmsCollection('test-site', 'ko', {
        collectionId: 'columns',
        name: 'Columns',
      }),
    ).rejects.toMatchObject({
      message: 'Static source collection IDs are reserved.',
    });
  });
});
