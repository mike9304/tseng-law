/**
 * Phase 6 — Publish pipeline logic.
 *
 * Handles the draft → preview → publish lifecycle:
 * - Preview: generates a time-limited token URL for stakeholder review
 * - Publish: copies draft canvas to published + ISR revalidate +
 *            auto-snapshot to revisions store
 * - Rollback: restores a previous revision as the current draft
 * - Publish checks: validates the page before allowing publish via the
 *            shared `publish-gate` runner (`runAllChecks`).
 */

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { readFile, writeFile, mkdir, readdir, stat } from 'fs/promises';
import path from 'path';
import {
  ensureSiteDocument,
  readPageCanvasRecordState,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from './persistence';
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { PageCanvasRecord } from './types';
import { runAllChecks, type PublishCheckSuite } from '@/lib/builder/publish-gate/gate-runner';
import { buildSitePagePath } from '@/lib/builder/site/paths';

// ─── Preview tokens (Blob-persisted for serverless) ──────────────

const PREVIEW_TTL_MS = 30 * 60 * 1000; // 30 minutes
const PREVIEW_BLOB_PREFIX = 'builder-preview-tokens/';

export async function createPreviewToken(pageId: string, locale: Locale): Promise<string> {
  const token = crypto.randomUUID();
  const entry = { pageId, locale, expiresAt: Date.now() + PREVIEW_TTL_MS };
  try {
    const { put } = await import('@vercel/blob');
    await put(`${PREVIEW_BLOB_PREFIX}${token}.json`, JSON.stringify(entry), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
  } catch {
    // Blob unavailable — use URL-encoded fallback (token embeds the data)
    const encoded = Buffer.from(JSON.stringify(entry)).toString('base64url');
    return `inline-${encoded}`;
  }
  return token;
}

export async function resolvePreviewToken(token: string): Promise<{ pageId: string; locale: Locale } | null> {
  // Inline token fallback (no Blob needed)
  if (token.startsWith('inline-')) {
    try {
      const decoded = JSON.parse(Buffer.from(token.slice(7), 'base64url').toString('utf8')) as { pageId: string; locale: Locale; expiresAt: number };
      if (Date.now() > decoded.expiresAt) return null;
      return { pageId: decoded.pageId, locale: decoded.locale };
    } catch { return null; }
  }

  try {
    const { get } = await import('@vercel/blob');
    const result = await get(`${PREVIEW_BLOB_PREFIX}${token}.json`, { access: 'private', useCache: false });
    if (!result?.stream || result.statusCode !== 200) return null;
    const entry = JSON.parse(await new Response(result.stream).text()) as { pageId: string; locale: Locale; expiresAt: number };
    if (Date.now() > entry.expiresAt) return null;
    return { pageId: entry.pageId, locale: entry.locale };
  } catch {
    return null;
  }
}

// ─── Publish checks (delegated to publish-gate runner) ───────────

export interface PublishCheckResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
  /** Full structured suite from the publish-gate (preferred for new UIs). */
  suite?: PublishCheckSuite;
}

/**
 * Lightweight string-only result form for legacy callers
 * (existing publish endpoint returns these). New surfaces should
 * call `runAllChecks` directly from `publish-gate/gate-runner`.
 */
export async function runPublishChecks(
  doc: BuilderCanvasDocument,
  pageId?: string,
  siteId: string = 'default',
  locale?: Locale,
): Promise<PublishCheckResult> {
  let page = null;
  let site = null;
  if (pageId && locale) {
    try {
      site = await readSiteDocument(siteId, locale);
      page = site.pages.find((p) => p.pageId === pageId) ?? null;
    } catch {
      site = null;
      page = null;
    }
  }
  const suite = await runAllChecks(doc, page, site);
  return {
    passed: !suite.hasBlocker,
    errors: suite.results.filter((r) => r.severity === 'blocker').map((r) => r.message),
    warnings: suite.results.filter((r) => r.severity === 'warning').map((r) => r.message),
    suite,
  };
}

// ─── Publish flow ─────────────────────────────────────────────────

export class PublishError extends Error {
  constructor(
    public code: string,
    public status: number,
    public body: Record<string, unknown> = {},
  ) {
    super(code);
    this.name = 'PublishError';
  }
}

export interface PublishResult {
  ok: true;
  revisionId: string;
  revision: number;
  publishedRevisionId: string;
  publishedRevision: number;
  publishedSavedAt: string;
  slug: string;
  warnings: string[];
  checks: PublishCheckResult;
}

function publishBlockers(checks: PublishCheckResult): unknown[] {
  return checks.suite?.results.filter((result) => result.severity === 'blocker') ?? checks.errors;
}

export async function publishPage(
  siteId: string,
  pageId: string,
  options: { expectedDraftRevision?: number } = {},
): Promise<PublishResult> {
  const draftState = await readPageCanvasRecordState(siteId, pageId, 'draft');
  if (!draftState) {
    throw new PublishError('draft_not_found', 404);
  }

  if (
    options.expectedDraftRevision !== undefined &&
    options.expectedDraftRevision !== draftState.record.revision
  ) {
    throw new PublishError('draft_stale', 409, {
      current: { revision: draftState.record.revision },
    });
  }

  const checks = await runPublishChecks(
    draftState.record.document,
    pageId,
    siteId,
    draftState.record.document.locale,
  );

  if (!checks.passed) {
    throw new PublishError('publish_blocked', 422, {
      blockers: publishBlockers(checks),
    });
  }

  let revisionResult: { revisionId: string; revision: number };
  try {
    revisionResult = await recordRevision(siteId, pageId, draftState.record, { source: 'publish' });
  } catch (error) {
    if (error instanceof PublishError) throw error;
    throw new PublishError('revision_write_failed', 500);
  }

  const site = await ensureSiteDocument(siteId, draftState.record.document.locale);
  const page = site.pages.find((p) => p.pageId === pageId);
  if (!page) {
    throw new PublishError('page_not_in_site', 500);
  }

  const publishedSavedAt = new Date().toISOString();
  page.publishedAt = publishedSavedAt;
  page.publishedRevisionId = revisionResult.revisionId;
  page.publishedRevision = revisionResult.revision;
  page.publishedSavedAt = publishedSavedAt;
  page.lastPublishedDraftRevision = draftState.record.revision;
  page.updatedAt = publishedSavedAt;
  site.updatedAt = publishedSavedAt;

  try {
    await writeSiteDocument(site);
  } catch {
    throw new PublishError('site_write_failed', 500);
  }

  try {
    revalidatePath(buildSitePagePath(draftState.record.document.locale, page.slug || ''));
  } catch {
    // dev or non-existent path
  }

  // PR #5 — rebuild the search index asynchronously after each publish so
  // the public /api/search endpoint reflects the freshly published content.
  void rebuildSearchIndexBestEffort();

  // PR #13 — emit a webhook event for any subscriber listening on page.published.
  void import('@/lib/builder/webhooks/dispatcher').then(({ emitEvent }) => {
    emitEvent('page.published', {
      siteId,
      pageId,
      slug: page.slug || '',
      locale: draftState.record.document.locale,
      publishedRevision: revisionResult.revision,
      publishedAt: publishedSavedAt,
    });
  }).catch(() => undefined);

  return {
    ok: true,
    revisionId: revisionResult.revisionId,
    revision: revisionResult.revision,
    publishedRevisionId: revisionResult.revisionId,
    publishedRevision: revisionResult.revision,
    publishedSavedAt,
    slug: page.slug || '',
    warnings: checks.warnings,
    checks,
  };
}

async function rebuildSearchIndexBestEffort(): Promise<void> {
  try {
    const [{ collectAllSearchDocs }, { buildSearchIndex }, { saveSearchIndex }] = await Promise.all([
      import('@/lib/builder/search/source-collector'),
      import('@/lib/builder/search/index-builder'),
      import('@/lib/builder/search/index-storage'),
    ]);
    const docs = await collectAllSearchDocs('default');
    const index = buildSearchIndex(docs);
    await saveSearchIndex(index);
  } catch (err) {
    console.warn('[publish] search index rebuild failed', err);
  }
}

export async function publishPageWithChecks(
  siteId: string,
  pageId: string,
  locale: Locale,
  options: { skipChecks?: boolean; ignoreWarnings?: boolean } = {},
): Promise<{ success: boolean; checks: PublishCheckResult; slug?: string; revisionId?: string | null }> {
  void locale;
  void options;

  try {
    const result = await publishPage(siteId, pageId);
    return {
      success: true,
      checks: result.checks,
      slug: result.slug,
      revisionId: result.revisionId,
    };
  } catch (error) {
    if (error instanceof PublishError && error.code === 'publish_blocked') {
      const blockers = Array.isArray(error.body.blockers) ? error.body.blockers : [];
      const errors = blockers
        .map((blocker) =>
          blocker && typeof blocker === 'object' && 'message' in blocker
            ? String((blocker as { message?: unknown }).message)
            : String(blocker),
        )
        .filter(Boolean);
      return {
        success: false,
        checks: { passed: false, warnings: [], errors },
      };
    }
    if (error instanceof PublishError && error.code === 'draft_not_found') {
      return {
        success: false,
        checks: { passed: false, warnings: [], errors: ['Draft not found'] },
      };
    }
    throw error;
  }
}

// ─── Version history (Blob + filesystem fallback) ───────────────
//
// Each revision stores the full BuilderCanvasDocument plus a small wrapper:
//   { _revisionId, _source, _savedAt, ...document }
//
// Blob backend: `builder-revisions/<pageId>/<revisionId>.json`
// File backend: `runtime-data/builder-revisions/<pageId>/<revisionId>.json`
//
// Filesystem fallback exists so revisions still work in local `npm run dev`
// without BLOB_READ_WRITE_TOKEN — same selector as `site/persistence.ts`.

export interface PageRevision {
  revisionId: string;
  pageId: string;
  savedAt: string;
  nodeCount: number;
  /** Origin of the snapshot — 'publish' | 'manual' | 'rollback-backup' etc. */
  source?: string;
}

const REVISION_BLOB_PREFIX = 'builder-revisions/';
const MAX_REVISIONS = 50;

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  return true;
}

function revisionsLocalRoot(pageId: string): string {
  return path.join(process.cwd(), 'runtime-data', 'builder-revisions', pageId);
}

interface RevisionEnvelope extends BuilderCanvasDocument {
  _revisionId: string;
  _source?: string;
  _savedAt?: string;
  _siteId?: string;
  _recordRevision?: number;
  _recordSavedAt?: string;
  _recordUpdatedBy?: string;
}

type RevisionSourceOptions = { source?: string };

function createRevisionWriteError(): Error {
  return new Error('revision_write_failed');
}

export async function recordRevision(
  pageId: string,
  doc: BuilderCanvasDocument,
  options?: RevisionSourceOptions,
): Promise<string>;
export async function recordRevision(
  siteId: string,
  pageId: string,
  record: PageCanvasRecord,
  options?: RevisionSourceOptions,
): Promise<{ revisionId: string; revision: number }>;
export async function recordRevision(
  first: string,
  second: string | BuilderCanvasDocument,
  third?: PageCanvasRecord | RevisionSourceOptions,
  fourth: RevisionSourceOptions = {},
): Promise<string | { revisionId: string; revision: number }> {
  const recordsCanvasEnvelope =
    typeof second === 'string' &&
    third &&
    typeof third === 'object' &&
    'document' in third &&
    'revision' in third;

  const siteId = recordsCanvasEnvelope ? first : undefined;
  const pageId = recordsCanvasEnvelope ? (second as string) : first;
  const record = recordsCanvasEnvelope ? (third as PageCanvasRecord) : undefined;
  const doc = record?.document ?? (second as BuilderCanvasDocument);
  const options = recordsCanvasEnvelope ? fourth : ((third as RevisionSourceOptions | undefined) ?? {});
  const revisionId = `${pageId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const envelope: RevisionEnvelope = {
    ...doc,
    _revisionId: revisionId,
    _source: options.source ?? 'manual',
    _savedAt: new Date().toISOString(),
    _siteId: siteId,
    _recordRevision: record?.revision,
    _recordSavedAt: record?.savedAt,
    _recordUpdatedBy: record?.updatedBy,
  };
  const json = JSON.stringify(envelope);

  if (isBlobBackend()) {
    try {
      const { put } = await import('@vercel/blob');
      await put(`${REVISION_BLOB_PREFIX}${pageId}/${revisionId}.json`, json, {
        access: 'private',
        allowOverwrite: true,
        contentType: 'application/json',
      });
    } catch {
      throw createRevisionWriteError();
    }
    return record
      ? { revisionId, revision: record.revision }
      : revisionId;
  }

  try {
    const dir = revisionsLocalRoot(pageId);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${revisionId}.json`), json, 'utf8');
  } catch {
    throw createRevisionWriteError();
  }
  return record
    ? { revisionId, revision: record.revision }
    : revisionId;
}

async function listRevisionsLocal(pageId: string): Promise<PageRevision[]> {
  try {
    const dir = revisionsLocalRoot(pageId);
    const files = await readdir(dir);
    const items: PageRevision[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const full = path.join(dir, file);
      try {
        const [text, stats] = await Promise.all([readFile(full, 'utf8'), stat(full)]);
        const env = JSON.parse(text) as RevisionEnvelope;
        items.push({
          revisionId: env._revisionId || file.replace('.json', ''),
          pageId,
          savedAt: env._savedAt ?? stats.mtime.toISOString(),
          nodeCount: Array.isArray(env.nodes) ? env.nodes.length : 0,
          source: env._source,
        });
      } catch {
        // skip corrupt file
      }
    }
    items.sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
    return items.slice(0, MAX_REVISIONS);
  } catch {
    return [];
  }
}

export async function listRevisions(pageId: string): Promise<PageRevision[]> {
  if (isBlobBackend()) {
    try {
      const { list, get } = await import('@vercel/blob');
      const result = await list({ prefix: `${REVISION_BLOB_PREFIX}${pageId}/` });
      const sorted = result.blobs
        .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
        .slice(0, MAX_REVISIONS);
      // Read each blob to extract nodeCount + source. Limit parallelism a bit.
      const revisions = await Promise.all(
        sorted.map(async (blob, i) => {
          const revisionId = blob.pathname.split('/').pop()?.replace('.json', '') || `rev-${i}`;
          let nodeCount = 0;
          let source: string | undefined;
          let savedAt = blob.uploadedAt.toISOString();
          try {
            const detail = await get(blob.pathname, { access: 'private', useCache: false });
            if (detail?.stream && detail.statusCode === 200) {
              const env = JSON.parse(await new Response(detail.stream).text()) as RevisionEnvelope;
              nodeCount = Array.isArray(env.nodes) ? env.nodes.length : 0;
              source = env._source;
              savedAt = env._savedAt ?? savedAt;
            }
          } catch {
            // ignore — fall back to defaults
          }
          return { revisionId, pageId, savedAt, nodeCount, source } satisfies PageRevision;
        }),
      );
      return revisions;
    } catch {
      // fall through
    }
  }
  return listRevisionsLocal(pageId);
}

export async function readRevisionDocument(
  pageId: string,
  revisionId: string,
): Promise<BuilderCanvasDocument | null> {
  if (isBlobBackend()) {
    try {
      const { get } = await import('@vercel/blob');
      const result = await get(`${REVISION_BLOB_PREFIX}${pageId}/${revisionId}.json`, {
        access: 'private',
        useCache: false,
      });
      if (result?.stream && result.statusCode === 200) {
        const env = JSON.parse(await new Response(result.stream).text()) as RevisionEnvelope;
        const {
          _revisionId: _r,
          _source: _s,
          _savedAt: _sa,
          _siteId: _si,
          _recordRevision: _rr,
          _recordSavedAt: _rs,
          _recordUpdatedBy: _ru,
          ...rest
        } = env;
        void _r; void _s; void _sa; void _si; void _rr; void _rs; void _ru;
        return rest as BuilderCanvasDocument;
      }
    } catch {
      // fall through
    }
  }
  try {
    const file = path.join(revisionsLocalRoot(pageId), `${revisionId}.json`);
    const text = await readFile(file, 'utf8');
    const env = JSON.parse(text) as RevisionEnvelope;
    const {
      _revisionId: _r,
      _source: _s,
      _savedAt: _sa,
      _siteId: _si,
      _recordRevision: _rr,
      _recordSavedAt: _rs,
      _recordUpdatedBy: _ru,
      ...rest
    } = env;
    void _r; void _s; void _sa; void _si; void _rr; void _rs; void _ru;
    return rest as BuilderCanvasDocument;
  } catch {
    return null;
  }
}

export async function rollbackToRevision(
  siteId: string,
  pageId: string,
  revisionId: string,
): Promise<boolean> {
  const doc = await readRevisionDocument(pageId, revisionId);
  if (!doc) return false;
  await writePageCanvas(siteId, pageId, 'draft', doc);
  return true;
}
