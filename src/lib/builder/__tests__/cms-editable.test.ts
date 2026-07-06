import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_THEME,
  type BuilderDynamicItemPageMeta,
  type BuilderPageMeta,
  type BuilderSiteDocument,
  type SiteRedirect,
} from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { readBuilderImageAsset } from '@/lib/builder/assets';
import { readBuilderCollectionRecordPreviews } from '@/lib/builder/cms';
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

  it('validates reference fields against the related collection before save', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'authors',
      name: 'Authors',
    });
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
          fieldId: 'field-author',
          key: 'author',
          label: 'Author',
          type: 'reference',
          localized: false,
          repeated: false,
          required: false,
          relationCollectionId: 'authors',
        },
      ],
    });

    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'articles', {
        fields: { title: 'Missing author', author: 'record-missing-author' },
      }),
    ).rejects.toMatchObject({
      issues: ['Author must reference an existing Authors record.'],
    });

    const author = await createEditableBuilderCmsRecord('test-site', 'ko', 'authors', {
      fields: { title: 'Ada Lovelace', slug: 'ada-lovelace' },
    });
    expect(author?.recordId).toBeTruthy();

    const article = await createEditableBuilderCmsRecord('test-site', 'ko', 'articles', {
      fields: { title: 'Reference pass', author: author?.recordId },
    });
    expect(article?.fields).toMatchObject({
      title: 'Reference pass',
      author: author?.recordId,
    });

    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'related-articles',
      name: 'Related articles',
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
          fieldId: 'field-column',
          key: 'column',
          label: 'Column',
          type: 'reference',
          localized: false,
          repeated: false,
          required: false,
          relationCollectionId: 'columns',
        },
      ],
    });

    const columnPreview = readBuilderCollectionRecordPreviews('columns', 'ko')[0];
    expect(columnPreview).toBeTruthy();

    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'related-articles', {
        fields: { title: 'Missing column', column: 'record-missing-column' },
      }),
    ).rejects.toMatchObject({
      issues: ['Column must reference an existing Insights columns record.'],
    });

    const relatedArticle = await createEditableBuilderCmsRecord('test-site', 'ko', 'related-articles', {
      fields: { title: 'Source reference pass', column: columnPreview?.recordId },
    });
    expect(relatedArticle?.fields).toMatchObject({
      title: 'Source reference pass',
      column: columnPreview?.recordId,
    });
  });

  it('creates slug redirects when editable record slugs change', async () => {
    const now = new Date('2026-05-13T00:00:00.000Z').toISOString();
    const dynamicItem: BuilderDynamicItemPageMeta = {
      kind: 'collection-item-v1',
      collectionId: 'articles-redirects' as BuilderDynamicItemPageMeta['collectionId'],
      targetId: 'home.insights.feed',
      slugField: 'slug',
      defaultRecordSlug: 'original-article',
      createdAt: now,
    };
    siteDoc.pages = [
      {
        pageId: 'page-articles',
        slug: 'insights',
        title: { ko: 'Insights', en: 'Insights', 'zh-hant': 'Insights' },
        locale: 'ko',
        dynamicItem,
        createdAt: now,
        updatedAt: now,
      } satisfies BuilderPageMeta,
    ];

    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'articles-redirects',
      name: 'Articles redirects',
      slug: 'articles',
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
      ],
    });

    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'articles-redirects', {
      fields: { title: 'Original article', slug: 'original-article' },
    });
    expect(created?.recordId).toBeTruthy();

    const updated = await updateEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'articles-redirects',
      created!.recordId,
      { fields: { title: 'Original article', slug: 'updated-article' } },
    );
    expect(updated?.redirectCreated).toBe(true);
    expect(updated?.redirectWarnings ?? []).toHaveLength(0);
    expect(siteDoc.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/articles/original-article',
        to: '/ko/articles/updated-article',
      }),
      expect.objectContaining({
        from: '/ko/insights/original-article',
        to: '/ko/insights/updated-article',
      }),
    ]));
  });

  it('exposes redirect acknowledgement when inline slug saves change', async () => {
    const now = new Date('2026-05-13T00:00:00.000Z').toISOString();
    const dynamicItem: BuilderDynamicItemPageMeta = {
      kind: 'collection-item-v1',
      collectionId: 'articles-inline' as BuilderDynamicItemPageMeta['collectionId'],
      targetId: 'home.services.list',
      slugField: 'slug',
      defaultRecordSlug: 'inline-article',
      createdAt: now,
    };
    siteDoc.pages = [
      {
        pageId: 'page-articles',
        slug: 'insights',
        title: { ko: 'Insights', en: 'Insights', 'zh-hant': 'Insights' },
        locale: 'ko',
        dynamicItem,
        createdAt: now,
        updatedAt: now,
      } satisfies BuilderPageMeta,
    ];

    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'articles-inline',
      name: 'Articles inline',
      slug: 'articles',
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
      ],
    });

    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'articles-inline', {
      fields: { title: 'Original article', slug: 'original-article' },
    });
    expect(created?.recordId).toBeTruthy();

    const updated = await updateEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'articles-inline',
      created!.recordId,
      { fields: { title: 'Inline article', slug: 'inline-article-updated' } },
    );
    expect(updated?.redirectCreated).toBe(true);
    expect(updated?.redirectWarnings ?? []).toHaveLength(0);
    expect(siteDoc.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/articles/original-article',
        to: '/ko/articles/inline-article-updated',
      }),
      expect.objectContaining({
        from: '/ko/insights/original-article',
        to: '/ko/insights/inline-article-updated',
      }),
    ]));
  });

  it('surfaces redirect warnings when a slug rename collides with an existing redirect', async () => {
    const now = new Date('2026-05-13T00:00:00.000Z').toISOString();
    const createdAt = now;
    siteDoc.redirects = [
      {
        redirectId: 'redir-conflict',
        from: '/ko/articles/original-article',
        to: '/ko/contact?existing=conflict',
        type: 301,
        isActive: true,
        note: 'manual-conflict',
        createdAt,
        updatedAt: createdAt,
      } satisfies SiteRedirect,
    ];

    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'articles-conflict',
      name: 'Articles conflict',
      slug: 'articles',
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
      ],
    });

    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'articles-conflict', {
      fields: { title: 'Original article', slug: 'original-article' },
    });
    expect(created?.recordId).toBeTruthy();

    const updated = await updateEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'articles-conflict',
      created!.recordId,
      { fields: { title: 'Original article', slug: 'updated-article' } },
    );
    expect(updated?.redirectCreated).toBeUndefined();
    expect(updated?.redirectWarnings ?? []).toEqual(
      expect.arrayContaining([expect.stringContaining('already has an active redirect')]),
    );
    expect(siteDoc.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/articles/original-article',
        to: '/ko/contact?existing=conflict',
        note: 'manual-conflict',
      }),
    ]));
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
      { status: 'published', fields: { title: 'After', slug: 'after' } },
    );
    expect(updated?.fields).toMatchObject({ title: 'After', slug: 'after' });
    expect(updated?.status).toBe('published');

    const withRevision = await readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials');
    const revision = withRevision?.records[0].revisions?.[0];
    expect(revision).toMatchObject({
      action: 'update',
      authorLabel: 'Admin',
      fields: { title: 'Before', slug: 'before' },
      name: 'Update status, slug, title',
      diff: {
        status: { before: 'draft', after: 'published' },
        fields: expect.arrayContaining([
          { fieldKey: 'title', before: 'Before', after: 'After' },
          { fieldKey: 'slug', before: 'before', after: 'after' },
        ]),
      },
    });

    const restored = await restoreEditableBuilderCmsRecordRevision(
      'test-site',
      'ko',
      'testimonials',
      created!.recordId,
      revision!.revisionId,
    );
    expect(restored?.fields).toMatchObject({ title: 'Before', slug: 'before' });
    expect(restored?.status).toBe('draft');
    const restoreRevision = restored?.revisions?.[restored.revisions.length - 1];
    expect(restoreRevision).toMatchObject({
      action: 'restore',
      fields: { title: 'After', slug: 'after' },
      name: 'Restore status, slug, title',
      diff: {
        status: { before: 'published', after: 'draft' },
        fields: expect.arrayContaining([
          { fieldKey: 'title', before: 'After', after: 'Before' },
          { fieldKey: 'slug', before: 'after', after: 'before' },
        ]),
      },
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
      undefined,
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

  it('supports visitor moderation record statuses', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'leads',
      name: 'Leads',
    });
    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'leads', {
      status: 'pending',
      fields: { title: 'Visitor lead', slug: 'visitor-lead' },
    });

    expect(created?.status).toBe('pending');

    const approved = await bulkUpdateEditableBuilderCmsRecordStatus(
      'test-site',
      'ko',
      'leads',
      [created!.recordId],
      'approved',
      'Complete lead information',
    );
    expect(approved?.records[0]?.status).toBe('approved');
    expect(approved?.records[0]?.moderation).toMatchObject({
      reason: 'Complete lead information',
      updatedBy: 'Admin',
      history: [
        { status: 'pending', authorLabel: 'Admin' },
        { status: 'approved', reason: 'Complete lead information', authorLabel: 'Admin' },
      ],
    });

    const rejected = await bulkUpdateEditableBuilderCmsRecordStatus(
      'test-site',
      'ko',
      'leads',
      [created!.recordId],
      'rejected',
      'Duplicate inquiry',
    );
    expect(rejected?.records[0]?.status).toBe('rejected');
    expect(rejected?.records[0]?.moderation?.reason).toBe('Duplicate inquiry');

    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'leads');
    expect(latest?.records[0]?.status).toBe('rejected');
    expect(latest?.records[0]?.moderation?.history.map((event) => event.status)).toEqual([
      'pending',
      'approved',
      'rejected',
    ]);
    expect(latest?.records[0]?.revisions?.map((revision) => revision.status)).toEqual([
      'pending',
      'approved',
    ]);
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
    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'First, quote', slug: 'first' },
    });

    const exported = await exportEditableBuilderCmsRecordsCsv('test-site', 'ko', 'testimonials');
    expect(exported?.filename).toBe('testimonials-records.csv');
    expect(exported?.csv).toContain('recordId,status,locale,title,slug');
    expect(exported?.csv).toContain('"First, quote"');

    const selectedExported = await exportEditableBuilderCmsRecordsCsv('test-site', 'ko', 'testimonials', {
      recordIds: [created!.recordId],
    });
    expect(selectedExported?.filename).toBe('testimonials-selected-records.csv');
    expect(selectedExported?.csv).toContain(created!.recordId);
    expect(selectedExported?.csv).not.toContain('Second quote');

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

    const mappedImport = await importEditableBuilderCmsRecordsCsv(
      'test-site',
      'ko',
      'testimonials',
      'Headline,Path,State,Unused\nMapped quote,mapped,published,ignored\n',
      {
        columnMap: {
          title: 'Headline',
          slug: 'Path',
          status: 'State',
        },
      },
    );
    expect(mappedImport).toMatchObject({
      imported: 1,
      summary: {
        mappedColumns: [
          { target: 'status', source: 'State' },
          { target: 'title', source: 'Headline' },
          { target: 'slug', source: 'Path' },
        ],
        skippedColumns: ['Unused'],
      },
    });
    await expect(
      readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials'),
    ).resolves.toMatchObject({ recordCount: 2 });

    await expect(
      importEditableBuilderCmsRecordsCsv(
        'test-site',
        'ko',
        'testimonials',
        'Headline,Path\nBroken,broken\n',
        { columnMap: { title: 'Missing headline', slug: 'Path' } },
      ),
    ).rejects.toMatchObject({
      issues: ['title maps to missing column: Missing headline'],
    });
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

  it('persists typed CMS field values across record field types', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'authors',
      name: 'Authors',
    });
    const detail = await createEditableBuilderCmsCollection('test-site', 'ko', {
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
          fieldId: 'field-body',
          key: 'body',
          label: 'Body',
          type: 'rich-text',
          localized: true,
          repeated: false,
          required: false,
        },
        {
          fieldId: 'field-order',
          key: 'order',
          label: 'Order',
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
          fieldId: 'field-published-at',
          key: 'publishedAt',
          label: 'Published at',
          type: 'date',
          localized: false,
          repeated: false,
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
        {
          fieldId: 'field-contact',
          key: 'contact',
          label: 'Contact',
          type: 'email',
          localized: false,
          repeated: false,
          required: false,
        },
        {
          fieldId: 'field-website',
          key: 'website',
          label: 'Website',
          type: 'url',
          localized: false,
          repeated: false,
          required: false,
        },
        {
          fieldId: 'field-tags',
          key: 'tags',
          label: 'Tags',
          type: 'string-list',
          localized: true,
          repeated: false,
          required: false,
        },
        {
          fieldId: 'field-author',
          key: 'author',
          label: 'Author',
          type: 'reference',
          localized: false,
          repeated: false,
          required: false,
          relationCollectionId: 'authors-typed',
        },
      ],
    });

    expect(detail.fields.map((field) => field.type)).toEqual([
      'text',
      'slug',
      'rich-text',
      'number',
      'boolean',
      'date',
      'image',
      'email',
      'url',
      'string-list',
      'reference',
    ]);
    expect(detail.fields.find((field) => field.key === 'author')).toMatchObject({
      relationCollectionId: 'authors-typed',
    });

    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'authors-typed',
      name: 'Authors Typed',
    });
    const author = await createEditableBuilderCmsRecord('test-site', 'ko', 'authors-typed', {
      recordId: 'record-author',
      fields: {
        title: 'Record Author',
        slug: 'record-author',
      },
    });
    expect(author?.recordId).toBe('record-author');

    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'articles', {
      fields: {
        title: 'Taiwan law update',
        slug: 'taiwan-law-update',
        body: '<p>Clear article body</p>',
        order: '7',
        featured: true,
        publishedAt: '2026-05-17',
        hero: '/api/builder/assets/ko/article.webp',
        contact: 'editor@example.com',
        website: 'https://example.com/article',
        tags: 'taiwan\nlaw\nvisa',
        author: author?.recordId,
      },
    });

    expect(created?.fields).toMatchObject({
      title: 'Taiwan law update',
      slug: 'taiwan-law-update',
      body: '<p>Clear article body</p>',
      order: 7,
      featured: true,
      publishedAt: '2026-05-17',
      hero: {
        url: '/api/builder/assets/ko/article.webp',
        assetId: 'builder/assets/ko/article.webp',
      },
      contact: 'editor@example.com',
      website: 'https://example.com/article',
      tags: ['taiwan', 'law', 'visa'],
      author: author?.recordId,
    });
  });

  it('normalizes defaults, help text, min/max, regex, and options for fields', async () => {
    const detail = await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'validated',
      name: 'Validated',
      fields: [
        {
          fieldId: 'field-title',
          key: 'title',
          label: 'Title',
          type: 'text',
          localized: true,
          repeated: false,
          required: true,
          helpText: ' Use a short internal title ',
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
          fieldId: 'field-summary',
          key: 'summary',
          label: 'Summary',
          type: 'text',
          localized: true,
          repeated: false,
          required: false,
          defaultValue: 'Valid summary',
          validation: { min: '5' as unknown as number, max: 20, pattern: '^Valid' },
        },
        {
          fieldId: 'field-score',
          key: 'score',
          label: 'Score',
          type: 'number',
          localized: false,
          repeated: false,
          required: false,
          defaultValue: '7',
          validation: { min: 1, max: 10 },
        },
        {
          fieldId: 'field-state',
          key: 'state',
          label: 'State',
          type: 'text',
          localized: false,
          repeated: false,
          required: false,
          defaultValue: 'published',
          validation: { options: ['draft', 'published', 'published'] },
        },
      ],
    });

    expect(detail.fields.find((field) => field.key === 'title')).toMatchObject({
      helpText: 'Use a short internal title',
    });
    expect(detail.fields.find((field) => field.key === 'summary')).toMatchObject({
      defaultValue: 'Valid summary',
      validation: { min: 5, max: 20, pattern: '^Valid' },
    });
    expect(detail.fields.find((field) => field.key === 'score')).toMatchObject({
      defaultValue: 7,
      validation: { min: 1, max: 10 },
    });
    expect(detail.fields.find((field) => field.key === 'state')).toMatchObject({
      defaultValue: 'published',
      validation: { options: ['draft', 'published'] },
    });

    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'validated', {
      fields: { title: 'Defaulted', slug: 'defaulted' },
    });
    expect(created?.fields).toMatchObject({
      summary: 'Valid summary',
      score: 7,
      state: 'published',
    });

    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'validated', {
        fields: {
          title: 'Bad summary',
          slug: 'bad-summary',
          summary: 'No',
          score: 5,
          state: 'draft',
        },
      }),
    ).rejects.toMatchObject({
      issues: ['Summary must be at least 5.'],
    });

    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'validated', {
        fields: {
          title: 'Bad score',
          slug: 'bad-score',
          summary: 'Valid custom',
          score: 11,
          state: 'draft',
        },
      }),
    ).rejects.toMatchObject({
      issues: ['Score must be at most 10.'],
    });

    await expect(
      createEditableBuilderCmsRecord('test-site', 'ko', 'validated', {
        fields: {
          title: 'Bad option',
          slug: 'bad-option',
          summary: 'Valid custom',
          score: 5,
          state: 'archived',
        },
      }),
    ).rejects.toMatchObject({
      issues: ['State must be one of: draft, published.'],
    });

    await expect(
      updateEditableBuilderCmsCollection('test-site', 'ko', 'validated', {
        fields: [
          {
            fieldId: 'field-broken',
            key: 'broken',
            label: 'Broken',
            type: 'text',
            localized: false,
            repeated: false,
            required: false,
            validation: { pattern: '[' },
          },
        ],
      }),
    ).rejects.toMatchObject({
      message: 'fields[0].validation.pattern must be a valid regex.',
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

    const staffUpdated = await updateEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'testimonials',
      created!.recordId,
      { fields: { title: 'Staff update', slug: 'staff-update' } },
      { actor: 'staff', actorLabel: 'admin as staff' },
    );
    expect(staffUpdated).toMatchObject({ fields: { title: 'Staff update', slug: 'staff-update' } });
    const staffRevision = staffUpdated?.revisions?.[staffUpdated.revisions.length - 1];
    expect(staffRevision?.authorLabel).toBe('admin as staff');

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
