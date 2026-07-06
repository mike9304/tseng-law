import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createEditableBuilderCmsCollection,
  createEditableBuilderCmsRecord,
} from '@/lib/builder/cms-editable';
import {
  __resetUserRoleStorageRootForTests,
  __setUserRoleStorageRootForTests,
} from '@/lib/builder/security/user-role-store';
import {
  DataSdkPermissionError,
  createDataSdk,
} from '@/lib/builder/dev/data-sdk';

// Storage isolation: the CMS store reads/writes site documents through
// `@/lib/builder/site/persistence`, whose local backend root is the
// `BUILDER_SITE_ROOT` env override. Pointing it at a fresh temp dir per test
// gives each run a clean store without touching real runtime-data.
const ORIGINAL_SITE_ROOT = process.env.BUILDER_SITE_ROOT;
const ORIGINAL_BUILDER_USERNAME = process.env.BUILDER_USERNAME;
const ORIGINAL_CMS_ADMIN_USERNAME = process.env.CMS_ADMIN_USERNAME;

const SITE_ID = 'sdk-test';

let tempRoot: string;

beforeEach(() => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'tseng-data-sdk-'));
  process.env.BUILDER_SITE_ROOT = tempRoot;
  // Force the file backend even if a blob token happens to be present in CI.
  process.env.BUILDER_SITE_BACKEND = 'local';
  process.env.BUILDER_USERNAME = 'admin';
  delete process.env.CMS_ADMIN_USERNAME;
  // Isolate the RBAC user-role store the same way existing security tests do.
  __setUserRoleStorageRootForTests(tempRoot);
});

afterEach(() => {
  __resetUserRoleStorageRootForTests();
  rmSync(tempRoot, { recursive: true, force: true });
  if (ORIGINAL_SITE_ROOT === undefined) delete process.env.BUILDER_SITE_ROOT;
  else process.env.BUILDER_SITE_ROOT = ORIGINAL_SITE_ROOT;
  delete process.env.BUILDER_SITE_BACKEND;
  if (ORIGINAL_BUILDER_USERNAME === undefined) delete process.env.BUILDER_USERNAME;
  else process.env.BUILDER_USERNAME = ORIGINAL_BUILDER_USERNAME;
  if (ORIGINAL_CMS_ADMIN_USERNAME === undefined) delete process.env.CMS_ADMIN_USERNAME;
  else process.env.CMS_ADMIN_USERNAME = ORIGINAL_CMS_ADMIN_USERNAME;
});

/** Seed a default-schema collection (title + slug fields) for a test. */
async function seedCollection(collectionId: string): Promise<void> {
  await createEditableBuilderCmsCollection(SITE_ID, 'ko', {
    collectionId,
    name: collectionId,
  });
}

describe('createDataSdk — happy path CRUD', () => {
  it('lists collections and round-trips a record through create/get/update/delete', async () => {
    await seedCollection('articles');

    const sdk = createDataSdk({ actor: 'admin', siteId: SITE_ID });

    const summaries = await sdk.collections.list();
    expect(summaries.map((s) => s.collectionId)).toContain('articles');

    const created = await sdk.records.create('articles', {
      title: 'First post',
      slug: 'first-post',
    });
    expect(created.recordId).toBeTruthy();
    expect(created.fields.title).toBe('First post');

    const fetched = await sdk.records.get('articles', created.recordId);
    expect(fetched?.fields.slug).toBe('first-post');

    const updated = await sdk.records.update('articles', created.recordId, {
      title: 'Edited title',
      slug: 'first-post',
    });
    expect(updated.fields.title).toBe('Edited title');

    const deleted = await sdk.records.delete('articles', created.recordId);
    expect(deleted).toBe(true);
    expect(await sdk.records.get('articles', created.recordId)).toBeNull();
  });

  it('returns null/empty for unknown collection on read paths', async () => {
    const sdk = createDataSdk({ actor: 'admin', siteId: SITE_ID });

    const result = await sdk.records.list('does-not-exist');
    expect(result.records).toEqual([]);
    expect(result.total).toBe(0);

    expect(await sdk.records.get('does-not-exist', 'rec-1')).toBeNull();
  });
});

describe('createDataSdk — typed query passthrough', () => {
  it('applies filter + sort + pagination to the underlying store query', async () => {
    // Seed a collection with an extra `category` field for typed filtering.
    // (Avoid the reserved key `status` — the query engine intercepts it as the
    // record lifecycle status, not a field.)
    await createEditableBuilderCmsCollection(SITE_ID, 'ko', {
      collectionId: 'statuses',
      name: 'Statuses',
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
          fieldId: 'field-category',
          key: 'category',
          label: 'Category',
          type: 'text',
          localized: false,
          repeated: false,
          required: true,
        },
      ],
    });

    const titles = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
    for (const title of titles) {
      await createEditableBuilderCmsRecord(SITE_ID, 'ko', 'statuses', {
        fields: { title, slug: `s-${title.toLowerCase()}`, category: 'live' },
      });
    }
    await createEditableBuilderCmsRecord(SITE_ID, 'ko', 'statuses', {
      fields: { title: 'Draft only', slug: 's-draft-only', category: 'archived' },
    });

    const sdk = createDataSdk({ actor: 'admin', siteId: SITE_ID });

    // Filter: only the 5 "live" records (1 of 6 is "archived").
    const filtered = await sdk.records.list('statuses', {
      filters: [
        { filterId: 'f-category', fieldKey: 'category', operator: 'is', value: 'live' },
      ],
    });
    expect(filtered.total).toBe(5);

    // Sort ascending by title + paginate to page 2 of size 2.
    // Sorted titles: Alpha, Beta, Delta, Draft only, Epsilon, Gamma
    const page = await sdk.records.list('statuses', {
      sortBy: 'title',
      sortDirection: 'asc',
      page: 2,
      pageSize: 2,
    });
    expect(page.pageSize).toBe(2);
    expect(page.page).toBe(2);
    expect(page.pageCount).toBe(3);
    expect(page.records.map((r) => r.fields.title)).toEqual(['Delta', 'Draft only']);
  });
});

describe('createDataSdk — permission denial', () => {
  it('denies every operation for an actor without the edit-pages permission', async () => {
    await seedCollection('articles');

    // No role record for "guest" => resolves to the `client` role, which lacks
    // `edit-pages` (clients only get view-cms / view-bookings).
    const sdk = createDataSdk({ actor: 'guest', siteId: SITE_ID });

    await expect(sdk.collections.list()).rejects.toBeInstanceOf(DataSdkPermissionError);
    await expect(sdk.records.list('articles')).rejects.toBeInstanceOf(DataSdkPermissionError);
    await expect(sdk.records.get('articles', 'rec-1')).rejects.toBeInstanceOf(DataSdkPermissionError);

    let readError: DataSdkPermissionError | null = null;
    try {
      await sdk.collections.list();
    } catch (error) {
      readError = error as DataSdkPermissionError;
    }
    expect(readError).toBeInstanceOf(DataSdkPermissionError);
    expect(readError?.permission).toBe('edit-pages');
    expect(readError?.actor).toBe('guest');

    await expect(
      sdk.records.create('articles', { title: 'x', slug: 'x' }),
    ).rejects.toBeInstanceOf(DataSdkPermissionError);
    await expect(
      sdk.records.update('articles', 'rec-1', { title: 'x' }),
    ).rejects.toBeInstanceOf(DataSdkPermissionError);
    await expect(sdk.records.delete('articles', 'rec-1')).rejects.toBeInstanceOf(DataSdkPermissionError);
  });

  it('rejects an empty actor username', () => {
    expect(() => createDataSdk({ actor: '   ' })).toThrow();
  });

  it('defaults siteId/locale when omitted', () => {
    const sdk = createDataSdk({ actor: 'admin' });
    expect(sdk.actor).toBe('admin');
    expect(typeof sdk.siteId).toBe('string');
    expect(sdk.locale).toBe('ko');
  });
});
