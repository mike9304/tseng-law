/**
 * F26 — Atomic publish orchestrator.
 *
 * Drives `beginPublishTransaction` → publish each page → publish each CMS
 * draft → `commitPublishTransaction`. Any failure triggers a single
 * `rollbackPublishTransaction` call and returns the partial result list so
 * the caller can show which step blew up.
 *
 * Page publishes delegate to `publishPage` from `site/publish.ts`. CMS
 * "publishing" is the act of flipping every `status === 'draft'` (and any
 * `'approved'`) record in the collection to `'published'` and bumping
 * `updatedAt`. We don't have a stand-alone helper yet so the flip is inlined
 * here — extract once a richer CMS publish UI ships.
 *
 * Side effects that can't be rolled back (revalidatePath, webhook dispatch,
 * search index rebuild from inside `publishPage`) are documented as a known
 * limitation. The rollback rewrites the same site doc, so any subsequent
 * publish will re-trigger revalidation naturally.
 */

import { PublishError, publishPage } from '@/lib/builder/site/publish';
import {
  readSiteDocument,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import type { Locale } from '@/lib/locales';
import { defaultLocale } from '@/lib/locales';
import type { BuilderCmsCollection, BuilderCmsRecord } from '@/lib/builder/cms-types';
import {
  beginPublishTransaction,
  commitPublishTransaction,
  rollbackPublishTransaction,
  type PublishTransaction,
} from './atomic-publish';

export type AtomicPublishStepKind = 'page' | 'cms';
export type AtomicPublishStepStatus = 'succeeded' | 'failed' | 'skipped';

export interface AtomicPublishStepResult {
  kind: AtomicPublishStepKind;
  id: string;
  status: AtomicPublishStepStatus;
  error?: string;
}

export interface AtomicPublishInput {
  pageIds: string[];
  cmsCollectionIds: string[];
  siteId: string;
  locale?: Locale;
}

export interface AtomicPublishOutcome {
  ok: boolean;
  transactionId: string;
  status: PublishTransaction['status'];
  results: AtomicPublishStepResult[];
}

const PUBLISHABLE_RECORD_STATUSES: ReadonlySet<BuilderCmsRecord['status']> =
  new Set(['draft', 'approved']);

function publishCollectionRecordsInPlace(collection: BuilderCmsCollection): {
  collection: BuilderCmsCollection;
  publishedCount: number;
} {
  const now = new Date().toISOString();
  let publishedCount = 0;
  const records = collection.records.map((record) => {
    if (!PUBLISHABLE_RECORD_STATUSES.has(record.status)) return record;
    publishedCount += 1;
    return {
      ...record,
      status: 'published' as const,
      updatedAt: now,
    };
  });
  if (publishedCount === 0) {
    return { collection, publishedCount: 0 };
  }
  return {
    collection: { ...collection, records, updatedAt: now },
    publishedCount,
  };
}

async function publishCmsCollection(
  siteId: string,
  locale: Locale,
  collectionId: string,
): Promise<{ publishedCount: number }> {
  const site = await readSiteDocument(siteId, locale);
  const idx = (site.cmsCollections ?? []).findIndex(
    (collection) => collection.collectionId === collectionId,
  );
  if (idx < 0) {
    throw new Error(`cms_collection_not_found:${collectionId}`);
  }
  const { collection: nextCollection, publishedCount } =
    publishCollectionRecordsInPlace(site.cmsCollections![idx]!);
  if (publishedCount === 0) {
    return { publishedCount: 0 };
  }
  const nextCollections = [...site.cmsCollections!];
  nextCollections[idx] = nextCollection;
  const nextSite = {
    ...site,
    cmsCollections: nextCollections,
    updatedAt: new Date().toISOString(),
  };
  await writeSiteDocument(nextSite, { preserveNavigation: true });
  return { publishedCount };
}

function errorMessage(err: unknown): string {
  if (err instanceof PublishError) {
    return `${err.code}${err.body && Object.keys(err.body).length ? `:${JSON.stringify(err.body)}` : ''}`;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function publishAtomic(input: AtomicPublishInput): Promise<AtomicPublishOutcome> {
  const locale: Locale = input.locale ?? defaultLocale;
  const tx = await beginPublishTransaction({
    pageIds: input.pageIds,
    cmsCollectionIds: input.cmsCollectionIds,
    siteId: input.siteId,
    locale,
  });

  const results: AtomicPublishStepResult[] = [];
  let aborted = false;

  // 1. Publish pages sequentially. Stop on first failure.
  for (const pageId of input.pageIds) {
    if (aborted) {
      results.push({ kind: 'page', id: pageId, status: 'skipped' });
      continue;
    }
    try {
      await publishPage(input.siteId, pageId);
      results.push({ kind: 'page', id: pageId, status: 'succeeded' });
    } catch (err) {
      results.push({
        kind: 'page',
        id: pageId,
        status: 'failed',
        error: errorMessage(err),
      });
      aborted = true;
    }
  }

  // 2. Publish CMS drafts sequentially. Same stop-on-failure semantics.
  for (const collectionId of input.cmsCollectionIds) {
    if (aborted) {
      results.push({ kind: 'cms', id: collectionId, status: 'skipped' });
      continue;
    }
    try {
      await publishCmsCollection(input.siteId, locale, collectionId);
      results.push({ kind: 'cms', id: collectionId, status: 'succeeded' });
    } catch (err) {
      results.push({
        kind: 'cms',
        id: collectionId,
        status: 'failed',
        error: errorMessage(err),
      });
      aborted = true;
    }
  }

  if (aborted) {
    const rolled = await rollbackPublishTransaction(tx.id);
    return {
      ok: false,
      transactionId: tx.id,
      status: rolled.status,
      results,
    };
  }

  const committed = await commitPublishTransaction(tx.id);
  return {
    ok: true,
    transactionId: tx.id,
    status: committed.status,
    results,
  };
}