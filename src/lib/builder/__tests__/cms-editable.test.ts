import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_THEME, type BuilderSiteDocument } from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { readBuilderImageAsset } from '@/lib/builder/assets';
import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  bulkDeleteEditableBuilderCmsRecords,
  bulkUpdateEditableBuilderCmsRecordStatus,
  canAccessBuilderCmsCollection,
  createEditableBuilderCmsCollection,
  createEditableBuilderCmsRecord,
  deleteEditableBuilderCmsRecord,
  duplicateEditableBuilderCmsRecord,
  exportEditableBuilderCmsRecordsCsv,
  filterAndSortBuilderCmsRecords,
  importEditableBuilderCmsRecordsCsv,
  listEditableBuilderCmsCollections,
  readEditableBuilderCmsCollection,
  restoreEditableBuilderCmsRecordRevision,
  updateEditableBuilderCmsCollection,
  updateEditableBuilderCmsRecord,
} from '@/lib/builder/cms-editable';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

vi.mock('@/lib/builder/assets', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/assets')>('@/lib/builder/assets');
  return {
    ...actual,
    readBuilderImageAsset: vi.fn(),
  };
});

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);
const mockedReadBuilderImageAsset = vi.mocked(readBuilderImageAsset);

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
    mockedReadBuilderImageAsset.mockReset();
    mockedReadBuilderImageAsset.mockResolvedValue({
      backend: 'file',
      content: Buffer.from('image'),
      contentType: 'image/webp',
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
    expect(detail.indexes).toMatchObject([
      {
        indexId: 'idx-slug',
        fields: [{ fieldKey: 'slug', direction: 'asc' }],
        unique: true,
      },
    ]);
    expect(detail.permissions).toEqual({
      read: ['admin'],
      create: ['admin'],
      update: ['admin'],
      delete: ['admin'],
    });
    await expect(listEditableBuilderCmsCollections('test-site', 'ko')).resolves.toMatchObject([
      { collectionId: 'testimonials', recordCount: 0, fieldCount: 2, indexCount: 1 },
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

    const withRevision = await readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials');
    const revision = withRevision?.records[0].revisions?.[0];
    expect(revision).toMatchObject({
      action: 'update',
      authorLabel: 'Admin',
      fields: { title: 'Before', slug: 'before' },
    });

    const restored = await restoreEditableBuilderCmsRecordRevision(
      'test-site',
      'ko',
      'testimonials',
      created!.recordId,
      revision!.revisionId,
    );
    expect(restored?.fields).toMatchObject({ title: 'Before', slug: 'before' });
    const restoreRevision = restored?.revisions?.[restored.revisions.length - 1];
    expect(restoreRevision).toMatchObject({
      action: 'restore',
      fields: { title: 'After', slug: 'after' },
    });

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

  it('bulk updates and deletes selected editable records', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
    });
    const first = await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'First quote', slug: 'first' },
    });
    const second = await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'Second quote', slug: 'second' },
    });
    const third = await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'Third quote', slug: 'third' },
    });

    const archived = await bulkUpdateEditableBuilderCmsRecordStatus(
      'test-site',
      'ko',
      'testimonials',
      [first!.recordId, second!.recordId, first!.recordId, 'missing-record'],
      'archived',
    );

    expect(archived).toMatchObject({
      requested: 3,
      updated: 2,
      missingRecordIds: ['missing-record'],
    });
    expect(archived?.records.map((record) => record.status)).toEqual(['archived', 'archived']);
    expect(archived?.records[0].revisions?.[0]).toMatchObject({
      action: 'update',
      status: 'draft',
      fields: { title: 'First quote', slug: 'first' },
    });

    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials');
    expect(latest?.records.map((record) => [record.fields.slug, record.status])).toEqual([
      ['first', 'archived'],
      ['second', 'archived'],
      ['third', 'draft'],
    ]);

    const deleted = await bulkDeleteEditableBuilderCmsRecords(
      'test-site',
      'ko',
      'testimonials',
      [first!.recordId, third!.recordId, 'missing-record'],
    );

    expect(deleted).toMatchObject({
      requested: 3,
      deleted: 2,
      missingRecordIds: ['missing-record'],
    });
    await expect(
      readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials'),
    ).resolves.toMatchObject({
      recordCount: 1,
      records: [{ recordId: second!.recordId }],
    });
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

  it('stores image fields with asset, alt text, and focal metadata', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'gallery',
      name: 'Gallery',
      fields: [
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
          fieldId: 'field-slug',
          key: 'slug',
          label: 'Slug',
          type: 'slug',
          localized: false,
          repeated: false,
          required: true,
          unique: true,
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
      ],
    });

    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'gallery', {
      fields: {
        title: 'Lobby',
        slug: 'lobby',
        hero: {
          url: '/api/builder/assets/ko/lobby.webp',
          filename: 'lobby.webp',
          altText: ' Law office lobby ',
          focalPoint: { x: -1, y: 2 },
        },
      },
    });
    expect(created?.fields.hero).toMatchObject({
      url: '/api/builder/assets/ko/lobby.webp',
      assetId: 'builder/assets/ko/lobby.webp',
      filename: 'lobby.webp',
      altText: 'Law office lobby',
      focalPoint: { x: 0, y: 1 },
    });

    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'gallery', {
        fields: { title: 'Broken', slug: 'broken', hero: 'not-an-image-url' },
      }),
    ).rejects.toMatchObject({
      issues: ['Hero image must be an image URL.'],
    });
    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'gallery', {
        fields: {
          title: 'Mismatched',
          slug: 'mismatched',
          hero: {
            url: '/api/builder/assets/ko/lobby.webp',
            assetId: 'builder/assets/en/lobby.webp',
          },
        },
      }),
    ).rejects.toMatchObject({
      issues: ['Hero image asset ID must match its URL.'],
    });
    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'gallery', {
        fields: { title: 'Malformed', slug: 'malformed', hero: '/api/builder/assets/lobby.webp' },
      }),
    ).rejects.toMatchObject({
      issues: ['Hero image must be a valid builder asset URL.'],
    });
    mockedReadBuilderImageAsset.mockResolvedValueOnce(null);
    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'gallery', {
        fields: { title: 'Missing', slug: 'missing', hero: '/api/builder/assets/ko/missing.webp' },
      }),
    ).rejects.toMatchObject({
      issues: ['Hero image points to a missing builder asset.'],
    });
  });

  it('updates CMS permissions and gates record access by actor', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
      permissions: {
        read: ['public', 'admin', 'public'],
        create: ['member'],
        update: ['staff'],
        delete: [],
      },
    });

    const detail = await readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials');
    expect(detail?.permissions).toEqual({
      read: ['public', 'admin'],
      create: ['member', 'admin'],
      update: ['staff', 'admin'],
      delete: ['admin'],
    });
    expect(canAccessBuilderCmsCollection(detail!, 'read', 'public')).toBe(true);
    expect(canAccessBuilderCmsCollection(detail!, 'create', 'public')).toBe(false);

    await expect(
      readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials', { actor: 'member' }),
    ).rejects.toBeInstanceOf(BuilderCmsPermissionError);

    await expect(
      createEditableBuilderCmsRecord(
        'test-site',
        'ko',
        'testimonials',
        { fields: { title: 'Public quote', slug: 'public' } },
        { actor: 'public' },
      ),
    ).rejects.toBeInstanceOf(BuilderCmsPermissionError);

    const created = await createEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'testimonials',
      { fields: { title: 'Member quote', slug: 'member' } },
      { actor: 'member' },
    );
    expect(created?.fields).toMatchObject({ title: 'Member quote', slug: 'member' });

    await expect(
      updateEditableBuilderCmsRecord(
        'test-site',
        'ko',
        'testimonials',
        created!.recordId,
        { fields: { title: 'Member update', slug: 'member-update' } },
        { actor: 'member' },
      ),
    ).rejects.toBeInstanceOf(BuilderCmsPermissionError);

    await expect(
      updateEditableBuilderCmsRecord(
        'test-site',
        'ko',
        'testimonials',
        created!.recordId,
        { fields: { title: 'Staff update', slug: 'staff-update' } },
        { actor: 'staff' },
      ),
    ).resolves.toMatchObject({ fields: { title: 'Staff update', slug: 'staff-update' } });

    const updated = await updateEditableBuilderCmsCollection('test-site', 'ko', 'testimonials', {
      permissions: {
        read: ['member'],
        create: ['public'],
        update: ['admin'],
        delete: ['staff'],
      },
    });
    expect(updated?.permissions).toEqual({
      read: ['member', 'admin'],
      create: ['public', 'admin'],
      update: ['admin'],
      delete: ['staff', 'admin'],
    });
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

  it('stores collection index metadata and rejects unknown index fields', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'articles',
      name: 'Articles',
      fields: [
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
          fieldId: 'field-status',
          key: 'status',
          label: 'Status',
          type: 'text',
          localized: false,
          repeated: false,
          required: false,
        },
      ],
      indexes: [
        {
          indexId: 'idx-status-title',
          name: 'Status title',
          fields: [
            { fieldKey: 'status', direction: 'asc' },
            { fieldKey: 'title', direction: 'desc' },
          ],
          unique: false,
          createdAt: '2026-05-16T00:00:00.000Z',
        },
      ],
    });

    const detail = await readEditableBuilderCmsCollection('test-site', 'ko', 'articles');
    expect(detail?.indexes).toMatchObject([
      {
        indexId: 'idx-status-title',
        fields: [
          { fieldKey: 'status', direction: 'asc' },
          { fieldKey: 'title', direction: 'desc' },
        ],
      },
    ]);

    await expect(
      updateEditableBuilderCmsCollection('test-site', 'ko', 'articles', {
        indexes: [
          {
            name: 'Broken',
            fields: [{ fieldKey: 'missing', direction: 'asc' }],
            unique: false,
          },
        ],
      }),
    ).rejects.toMatchObject({
      issues: ['Index 1 references an unknown field: missing'],
    });
  });
});
