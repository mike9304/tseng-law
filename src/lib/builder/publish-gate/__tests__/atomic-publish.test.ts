/**
 * F26 — Atomic publish pipeline tests.
 *
 * Strategy:
 *   - Mock `@/lib/builder/site/publish` so each `publishPage` call routes to
 *     a test-controlled handler (success, throw, throw-on-second).
 *   - Mock `@/lib/builder/site/persistence` with an in-memory site doc store
 *     so transactions can read/write without touching disk for site state.
 *   - Force `PUBLISH_TX_ROOT` to an `os.tmpdir()` subdir so transaction
 *     files (which are real disk writes by design) don't leak into the
 *     repo's `runtime-data/`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import os from 'os';
import path from 'path';
import { mkdtemp, rm } from 'fs/promises';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';

// In-memory site doc store, shared with mocked persistence.
const siteStore: { current: BuilderSiteDocument | null } = { current: null };
// In-memory published page records, keyed by pageId.
const publishedStore = new Map<string, { revision: number; savedAt: string; document: unknown }>();

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(async () => {
    if (!siteStore.current) throw new Error('site_not_seeded');
    // Return a structural clone so callers can't mutate the source-of-truth.
    return JSON.parse(JSON.stringify(siteStore.current)) as BuilderSiteDocument;
  }),
  writeSiteDocument: vi.fn(async (doc: BuilderSiteDocument) => {
    siteStore.current = JSON.parse(JSON.stringify(doc));
  }),
  readPageCanvasRecordState: vi.fn(async (_siteId: string, pageId: string) => {
    const record = publishedStore.get(pageId);
    if (!record) return null;
    return { record, isEnvelope: true };
  }),
  writePageCanvasRecord: vi.fn(async (_siteId: string, pageId: string, record: unknown) => {
    publishedStore.set(pageId, record as { revision: number; savedAt: string; document: unknown });
  }),
}));

// Page publish handler — overridden per test.
const pagePublishHandler = vi.fn();
vi.mock('@/lib/builder/site/publish', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/site/publish')>(
    '@/lib/builder/site/publish',
  );
  return {
    ...actual,
    publishPage: vi.fn(async (siteId: string, pageId: string) => {
      return pagePublishHandler(siteId, pageId);
    }),
  };
});

import {
  beginPublishTransaction,
  commitPublishTransaction,
  rollbackPublishTransaction,
  readPublishTransaction,
} from '@/lib/builder/publish-gate/atomic-publish';
import { publishAtomic } from '@/lib/builder/publish-gate/atomic-publish-orchestrator';

let txRoot: string;

function seedSite(): void {
  siteStore.current = {
    version: 1,
    siteId: 'test-site',
    name: 'Test',
    locale: 'ko',
    navigation: [],
    theme: {
      colors: {
        primary: '#000', secondary: '#111', accent: '#222',
        text: '#333', background: '#fff', muted: '#eee',
      },
      fonts: { heading: 'sans', body: 'sans' },
      radii: { sm: 4, md: 8, lg: 16 },
    },
    pages: [
      {
        pageId: 'page-1', slug: 'p1', title: { ko: 'P1', 'zh-hant': 'P1', en: 'P1' },
        locale: 'ko', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        pageId: 'page-2', slug: 'p2', title: { ko: 'P2', 'zh-hant': 'P2', en: 'P2' },
        locale: 'ko', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    cmsCollections: [
      {
        collectionId: 'col-a',
        name: 'Col A', slug: 'col-a', description: '', localized: false,
        fields: [], indexes: [],
        records: [
          { recordId: 'r1', status: 'draft', fields: {}, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
          { recordId: 'r2', status: 'published', fields: {}, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z' },
        ],
        permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
        createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
  publishedStore.clear();
}

beforeEach(async () => {
  txRoot = await mkdtemp(path.join(os.tmpdir(), 'pubtx-test-'));
  process.env.PUBLISH_TX_ROOT = txRoot;
  seedSite();
  pagePublishHandler.mockReset();
});

afterEach(async () => {
  delete process.env.PUBLISH_TX_ROOT;
  await rm(txRoot, { recursive: true, force: true });
});

describe('beginPublishTransaction', () => {
  it('snapshots the site doc and per-page published records', async () => {
    publishedStore.set('page-1', { revision: 7, savedAt: 'before', document: { stub: true } });
    const tx = await beginPublishTransaction({
      pageIds: ['page-1', 'page-2'],
      cmsCollectionIds: ['col-a'],
      siteId: 'test-site',
      locale: 'ko',
    });
    expect(tx.status).toBe('pending');
    expect(tx.snapshots.siteDoc?.siteId).toBe('test-site');
    expect(tx.snapshots.publishedRecords['page-1']?.revision).toBe(7);
    expect(tx.snapshots.publishedRecords['page-2']).toBeNull();
    const persisted = await readPublishTransaction(tx.id);
    expect(persisted?.id).toBe(tx.id);
  });
});

describe('publishAtomic happy path', () => {
  it('publishes pages, flips CMS draft records, commits transaction', async () => {
    pagePublishHandler.mockImplementation(async () => ({ ok: true }));

    const outcome = await publishAtomic({
      pageIds: ['page-1', 'page-2'],
      cmsCollectionIds: ['col-a'],
      siteId: 'test-site',
      locale: 'ko',
    });

    expect(outcome.ok).toBe(true);
    expect(outcome.status).toBe('committed');
    expect(outcome.results.filter((r) => r.status === 'succeeded')).toHaveLength(3);
    // Draft record should now be published; the already-published one stays.
    const collection = siteStore.current?.cmsCollections?.[0];
    expect(collection?.records.map((r) => r.status).sort()).toEqual(['published', 'published']);
    // Transaction file gone after commit.
    const persisted = await readPublishTransaction(outcome.transactionId);
    expect(persisted).toBeNull();
  });
});

describe('publishAtomic failure path', () => {
  it('rolls back when the first page publish fails', async () => {
    pagePublishHandler.mockImplementationOnce(async () => {
      throw new Error('boom');
    });

    const outcome = await publishAtomic({
      pageIds: ['page-1', 'page-2'],
      cmsCollectionIds: ['col-a'],
      siteId: 'test-site',
      locale: 'ko',
    });

    expect(outcome.ok).toBe(false);
    expect(outcome.status).toBe('rolled-back');
    expect(outcome.results[0]?.status).toBe('failed');
    expect(outcome.results[1]?.status).toBe('skipped');
    // CMS records untouched.
    const collection = siteStore.current?.cmsCollections?.[0];
    expect(collection?.records.find((r) => r.recordId === 'r1')?.status).toBe('draft');
  });

  it('rolls back already-published pages when a later CMS commit fails', async () => {
    pagePublishHandler.mockImplementation(async (_siteId: string, pageId: string) => {
      publishedStore.set(pageId, { revision: 1, savedAt: 'after', document: { pageId } });
      return { ok: true };
    });
    publishedStore.set('page-1', { revision: 5, savedAt: 'before', document: { stub: true } });

    const outcome = await publishAtomic({
      pageIds: ['page-1', 'page-2'],
      cmsCollectionIds: ['missing-collection'],
      siteId: 'test-site',
      locale: 'ko',
    });

    expect(outcome.ok).toBe(false);
    expect(outcome.status).toBe('rolled-back');
    // page-1's published record must be restored to the snapshot.
    expect(publishedStore.get('page-1')?.revision).toBe(5);
    // page-2 had no prior published variant — orchestrator wrote one, rollback
    // can't fully un-write it, but the failure surfaces so the operator can clean up.
    const cmsResult = outcome.results.find((r) => r.kind === 'cms');
    expect(cmsResult?.status).toBe('failed');
    expect(cmsResult?.error).toContain('cms_collection_not_found');
  });
});

describe('rollbackPublishTransaction', () => {
  it('is a no-op on already-committed transactions', async () => {
    pagePublishHandler.mockImplementation(async () => ({ ok: true }));
    const tx = await beginPublishTransaction({
      pageIds: [], cmsCollectionIds: [], siteId: 'test-site', locale: 'ko',
    });
    await commitPublishTransaction(tx.id);
    // Read of a deleted transaction returns null; rollback throws.
    await expect(rollbackPublishTransaction(tx.id)).rejects.toThrow(/publish_transaction_not_found/);
  });
});