import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bulkUpdateEditableBuilderCmsRecordStatus,
  createEditableBuilderCmsCollection,
  createEditableBuilderCmsRecord,
  readEditableBuilderCmsCollection,
  updateEditableBuilderCmsRecord,
} from '@/lib/builder/cms-editable';
import {
  bulkRestoreTrashedEditableBuilderCmsRecords,
  bulkTrashEditableBuilderCmsRecords,
  readEditableBuilderCmsCollectionTrash,
} from '@/lib/builder/cms-record-trash';
import { DEFAULT_THEME, type BuilderSiteDocument } from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderCmsRecord } from '@/lib/builder/cms-types';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('editable builder CMS record trash', () => {
  let siteDoc: BuilderSiteDocument;

  beforeEach(() => {
    const now = '2026-06-25T00:00:00.000Z';
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

  it('moves selected records into trash and restores them as archived records', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
    });
    const first = requireRecord(await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'First quote', slug: 'first' },
    }));
    const second = requireRecord(await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'Second quote', slug: 'second' },
    }));
    await bulkUpdateEditableBuilderCmsRecordStatus(
      'test-site',
      'ko',
      'testimonials',
      [first.recordId],
      'archived',
      undefined,
      { actor: 'admin', actorLabel: 'Archive Admin' },
    );

    const trashed = await bulkTrashEditableBuilderCmsRecords(
      'test-site',
      'ko',
      'testimonials',
      [first.recordId, 'missing-record'],
      { actor: 'admin', actorLabel: 'Trash Admin' },
    );

    expect(trashed).toMatchObject({
      requested: 2,
      trashed: 1,
      deleted: 1,
      missingRecordIds: ['missing-record'],
    });
    expect(trashed?.trashedRecords).toMatchObject([
      {
        record: { recordId: first.recordId, status: 'archived' },
        deletedBy: 'Trash Admin',
      },
    ]);
    await expect(readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials')).resolves.toMatchObject({
      recordCount: 1,
      records: [{ recordId: second.recordId }],
    });
    await expect(readEditableBuilderCmsCollectionTrash('test-site', 'ko', 'testimonials')).resolves.toMatchObject([
      {
        record: { recordId: first.recordId, fields: { slug: 'first' } },
        deletedBy: 'Trash Admin',
      },
    ]);

    const restored = await bulkRestoreTrashedEditableBuilderCmsRecords(
      'test-site',
      'ko',
      'testimonials',
      [first.recordId, 'missing-trash'],
      { actor: 'admin', actorLabel: 'Restore Admin' },
    );

    expect(restored).toMatchObject({
      requested: 2,
      restored: 1,
      missingRecordIds: ['missing-trash'],
      records: [{ recordId: first.recordId, status: 'archived' }],
    });
    await expect(readEditableBuilderCmsCollectionTrash('test-site', 'ko', 'testimonials')).resolves.toEqual([]);
    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials');
    expect(latest?.records.map((record) => [record.recordId, record.status])).toEqual([
      [second.recordId, 'draft'],
      [first.recordId, 'archived'],
    ]);
  });

  it('keeps trashed records when later CMS mutations rewrite the collection', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'testimonials',
      name: 'Testimonials',
    });
    const first = requireRecord(await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'First quote', slug: 'first' },
    }));
    const second = requireRecord(await createEditableBuilderCmsRecord('test-site', 'ko', 'testimonials', {
      fields: { title: 'Second quote', slug: 'second' },
    }));

    await bulkTrashEditableBuilderCmsRecords(
      'test-site',
      'ko',
      'testimonials',
      [first.recordId],
      { actor: 'admin', actorLabel: 'Trash Admin' },
    );
    await expect(readEditableBuilderCmsCollectionTrash('test-site', 'ko', 'testimonials')).resolves.toHaveLength(1);

    const updated = await updateEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'testimonials',
      second.recordId,
      { fields: { title: 'Second quote edited', slug: 'second' } },
      { actor: 'admin', actorLabel: 'Edit Admin' },
    );

    expect(updated?.fields).toMatchObject({ title: 'Second quote edited', slug: 'second' });
    await expect(readEditableBuilderCmsCollectionTrash('test-site', 'ko', 'testimonials')).resolves.toMatchObject([
      {
        record: { recordId: first.recordId, fields: { slug: 'first' } },
        deletedBy: 'Trash Admin',
      },
    ]);
    const latest = await readEditableBuilderCmsCollection('test-site', 'ko', 'testimonials');
    expect(latest?.trashedRecords).toMatchObject([
      {
        record: { recordId: first.recordId, status: 'draft' },
        deletedBy: 'Trash Admin',
      },
    ]);
  });
});

function requireRecord(record: BuilderCmsRecord | null): BuilderCmsRecord {
  if (record) return record;
  throw new Error('Expected CMS record fixture to be created.');
}
