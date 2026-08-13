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
import { mkdir } from 'fs/promises';
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
import { requireBuilderSiteIdForMutation } from '@/lib/builder/site/identity';
import {
  SafeLocalFsSafetyError,
  isSafeLocalFsNotFoundError,
  openSafeLocalFsRoot,
  type SafeLocalFsRoot,
} from '@/lib/builder/storage/safe-local-fs';

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
  const suite = await runAllChecks(doc, page, site, siteId);
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
  cacheInvalidatedAt: string;
  revalidatedPaths: string[];
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
  try {
    const writeOptions = draftState.record.updatedBy
      ? { updatedBy: draftState.record.updatedBy }
      : {};
    await writePageCanvas(siteId, pageId, 'published', draftState.record.document, writeOptions);
  } catch {
    throw new PublishError('published_write_failed', 500);
  }

  page.publishedAt = publishedSavedAt;
  page.publishedRevisionId = revisionResult.revisionId;
  page.publishedRevision = revisionResult.revision;
  page.publishedSavedAt = publishedSavedAt;
  page.lastPublishedDraftRevision = draftState.record.revision;
  page.updatedAt = publishedSavedAt;
  site.updatedAt = publishedSavedAt;
  const revalidatedPaths = [
    buildSitePagePath(draftState.record.document.locale, page.slug || ''),
    '/sitemap.xml',
    '/robots.txt',
  ];
  const cacheInvalidatedAt = new Date().toISOString();

  try {
    await writeSiteDocument(site, { preserveNavigation: true, preserveNextPageIds: [pageId] });
  } catch {
    throw new PublishError('site_write_failed', 500);
  }

  for (const targetPath of revalidatedPaths) {
    try {
      revalidatePath(targetPath);
    } catch (err) {
      // dev or non-existent path — log so failures don't silently leave a
      // stale cache in production.
      console.warn('[publish] revalidatePath failed', targetPath, err);
    }
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

  // F109 — fire app extension hooks listening on publish.completed.
  void import('@/lib/builder/apps/hook-runtime').then(({ dispatchAppHookEvent }) => (
    dispatchAppHookEvent({
      kind: 'publish.completed',
      payload: {
        siteId,
        pageId,
        revision: revisionResult.revision,
        publishedAt: publishedSavedAt,
      },
    })
  )).catch(() => undefined);

  return {
    ok: true,
    revisionId: revisionResult.revisionId,
    revision: revisionResult.revision,
    publishedRevisionId: revisionResult.revisionId,
    publishedRevision: revisionResult.revision,
    publishedSavedAt,
    cacheInvalidatedAt,
    revalidatedPaths,
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
// Each revision stores the full BuilderCanvasDocument plus a bound wrapper:
//   { _siteId, _pageId, _revisionId, _source, _savedAt, ...document }
//
// Blob backend: `builder-revisions/<siteId>/<pageId>/<revisionId>.json`
// File backend: `runtime-data/builder-revisions/<siteId>/<pageId>/<revisionId>.json`
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
const SAFE_REVISION_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  return true;
}

class BuilderRevisionRootConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BuilderRevisionRootConfigurationError';
  }
}

function configuredRevisionsLocalRoot(): string {
  const configuredRoot = process.env.BUILDER_REVISIONS_ROOT;
  if (configuredRoot === undefined) {
    return path.resolve(process.cwd(), 'runtime-data', 'builder-revisions');
  }

  const trimmedRoot = configuredRoot.trim();
  if (!path.isAbsolute(trimmedRoot)) {
    throw new BuilderRevisionRootConfigurationError(
      'BUILDER_REVISIONS_ROOT must be an absolute path.',
    );
  }

  return path.resolve(trimmedRoot);
}

function requireSafeRevisionSegment(value: string, label: 'pageId' | 'revisionId'): string {
  if (!SAFE_REVISION_SEGMENT.test(value)) {
    throw new BuilderRevisionRootConfigurationError(
      `Builder revision ${label} must be an exact safe path segment.`,
    );
  }
  return value;
}

function revisionRelativeDirectory(siteId: string, pageId: string): string {
  return `${siteId}/${pageId}`;
}

function revisionRelativeFile(siteId: string, pageId: string, revisionId: string): string {
  return `${revisionRelativeDirectory(siteId, pageId)}/${revisionId}.json`;
}

async function openRevisionsLocalRoot(create: boolean): Promise<SafeLocalFsRoot> {
  const root = configuredRevisionsLocalRoot();
  if (create) {
    await mkdir(root, { recursive: true, mode: 0o700 });
  }
  return openSafeLocalFsRoot(root);
}

interface RevisionEnvelope extends BuilderCanvasDocument {
  _revisionId: string;
  _siteId: string;
  _pageId: string;
  _source?: string;
  _savedAt?: string;
  _recordRevision?: number;
  _recordSavedAt?: string;
  _recordUpdatedBy?: string;
}

type RevisionSourceOptions = { source?: string };

function createRevisionWriteError(): Error {
  return new Error('revision_write_failed');
}

export async function recordRevision(
  siteId: string,
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
  siteId: string,
  pageId: string,
  documentOrRecord: BuilderCanvasDocument | PageCanvasRecord,
  options: RevisionSourceOptions = {},
): Promise<string | { revisionId: string; revision: number }> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const safePageId = requireSafeRevisionSegment(pageId, 'pageId');
  const record = 'document' in documentOrRecord && 'revision' in documentOrRecord
    ? documentOrRecord
    : undefined;
  const doc = record?.document ?? documentOrRecord as BuilderCanvasDocument;
  const revisionId = requireSafeRevisionSegment(
    `${safePageId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    'revisionId',
  );
  const envelope: RevisionEnvelope = {
    ...doc,
    _revisionId: revisionId,
    _siteId: mutationSiteId,
    _pageId: safePageId,
    _source: options.source ?? 'manual',
    _savedAt: new Date().toISOString(),
    _recordRevision: record?.revision,
    _recordSavedAt: record?.savedAt,
    _recordUpdatedBy: record?.updatedBy,
  };
  const json = JSON.stringify(envelope);

  if (isBlobBackend()) {
    try {
      const { put } = await import('@vercel/blob');
      await put(`${REVISION_BLOB_PREFIX}${mutationSiteId}/${safePageId}/${revisionId}.json`, json, {
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
    const localRoot = await openRevisionsLocalRoot(true);
    await localRoot.ensureDirectory(revisionRelativeDirectory(mutationSiteId, safePageId));
    await localRoot.writeFile(
      revisionRelativeFile(mutationSiteId, safePageId, revisionId),
      json,
    );
  } catch (error) {
    if (
      error instanceof BuilderRevisionRootConfigurationError
      || error instanceof SafeLocalFsSafetyError
    ) {
      throw error;
    }
    throw createRevisionWriteError();
  }
  return record
    ? { revisionId, revision: record.revision }
    : revisionId;
}

function revisionEnvelopeMatches(
  envelope: unknown,
  siteId: string,
  pageId: string,
  revisionId: string,
): envelope is RevisionEnvelope {
  if (!envelope || typeof envelope !== 'object') return false;
  try {
    return Reflect.get(envelope, '_siteId') === siteId
      && Reflect.get(envelope, '_pageId') === pageId
      && Reflect.get(envelope, '_revisionId') === revisionId;
  } catch {
    return false;
  }
}

function revisionDocumentFromEnvelope(envelope: RevisionEnvelope): BuilderCanvasDocument {
  const {
    _revisionId: _r,
    _siteId: _si,
    _pageId: _pi,
    _source: _s,
    _savedAt: _sa,
    _recordRevision: _rr,
    _recordSavedAt: _rs,
    _recordUpdatedBy: _ru,
    ...rest
  } = envelope;
  void _r; void _si; void _pi; void _s; void _sa; void _rr; void _rs; void _ru;
  return rest as BuilderCanvasDocument;
}

async function listRevisionsLocal(siteId: string, pageId: string): Promise<PageRevision[]> {
  let localRoot: SafeLocalFsRoot;
  try {
    localRoot = await openRevisionsLocalRoot(false);
  } catch (error) {
    if (isSafeLocalFsNotFoundError(error)) return [];
    throw error;
  }

  let files;
  try {
    files = await localRoot.listRegularFiles(revisionRelativeDirectory(siteId, pageId));
  } catch (error) {
    if (isSafeLocalFsNotFoundError(error)) return [];
    throw error;
  }

  const items: PageRevision[] = [];
  for (const file of files) {
    if (!file.name.endsWith('.json')) continue;
    const revisionId = file.name.slice(0, -'.json'.length);
    if (!SAFE_REVISION_SEGMENT.test(revisionId)) continue;
    const text = (await localRoot.readFile(
      revisionRelativeFile(siteId, pageId, revisionId),
    )).toString('utf8');
    let env: unknown;
    try {
      env = JSON.parse(text) as unknown;
    } catch {
      continue;
    }
    if (!revisionEnvelopeMatches(env, siteId, pageId, revisionId)) continue;
    items.push({
      revisionId,
      pageId,
      savedAt: env._savedAt ?? file.mtime.toISOString(),
      nodeCount: Array.isArray(env.nodes) ? env.nodes.length : 0,
      source: env._source,
    });
  }
  items.sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
  return items.slice(0, MAX_REVISIONS);
}

export async function listRevisions(siteId: string, pageId: string): Promise<PageRevision[]> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const safePageId = requireSafeRevisionSegment(pageId, 'pageId');
  if (isBlobBackend()) {
    const { list, get } = await import('@vercel/blob');
    const prefix = `${REVISION_BLOB_PREFIX}${mutationSiteId}/${safePageId}/`;
    const result = await list({ prefix });
    const sorted = result.blobs
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .slice(0, MAX_REVISIONS);
    const revisions = await Promise.all(
      sorted.map(async (blob): Promise<PageRevision | null> => {
        if (!blob.pathname.startsWith(prefix)) return null;
        const filename = blob.pathname.slice(prefix.length);
        if (!filename.endsWith('.json') || filename.includes('/')) return null;
        const revisionId = filename.slice(0, -'.json'.length);
        if (!SAFE_REVISION_SEGMENT.test(revisionId)) return null;
        const detail = await get(blob.pathname, { access: 'private', useCache: false });
        if (!detail) return null;
        if (!detail.stream || detail.statusCode !== 200) {
          throw new Error('revision_read_failed');
        }
        let env: unknown;
        try {
          env = JSON.parse(await new Response(detail.stream).text()) as unknown;
        } catch {
          return null;
        }
        if (!revisionEnvelopeMatches(env, mutationSiteId, safePageId, revisionId)) return null;
        return {
          revisionId,
          pageId: safePageId,
          savedAt: env._savedAt ?? blob.uploadedAt.toISOString(),
          nodeCount: Array.isArray(env.nodes) ? env.nodes.length : 0,
          source: env._source,
        } satisfies PageRevision;
      }),
    );
    return revisions.filter((revision): revision is PageRevision => revision !== null);
  }
  return listRevisionsLocal(mutationSiteId, safePageId);
}

export async function readRevisionDocument(
  siteId: string,
  pageId: string,
  revisionId: string,
): Promise<BuilderCanvasDocument | null> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const safePageId = requireSafeRevisionSegment(pageId, 'pageId');
  const safeRevisionId = requireSafeRevisionSegment(revisionId, 'revisionId');
  if (isBlobBackend()) {
    const { get } = await import('@vercel/blob');
    const result = await get(`${REVISION_BLOB_PREFIX}${mutationSiteId}/${safePageId}/${safeRevisionId}.json`, {
      access: 'private',
      useCache: false,
    });
    if (!result) return null;
    if (!result.stream || result.statusCode !== 200) {
      throw new Error('revision_read_failed');
    }
    let env: unknown;
    try {
      env = JSON.parse(await new Response(result.stream).text()) as unknown;
    } catch {
      return null;
    }
    if (!revisionEnvelopeMatches(env, mutationSiteId, safePageId, safeRevisionId)) return null;
    return revisionDocumentFromEnvelope(env);
  }

  let localRoot: SafeLocalFsRoot;
  try {
    localRoot = await openRevisionsLocalRoot(false);
  } catch (error) {
    if (isSafeLocalFsNotFoundError(error)) return null;
    throw error;
  }

  let bytes: Buffer;
  try {
    bytes = await localRoot.readFile(
      revisionRelativeFile(mutationSiteId, safePageId, safeRevisionId),
    );
  } catch (error) {
    if (isSafeLocalFsNotFoundError(error)) return null;
    throw error;
  }
  let env: unknown;
  try {
    env = JSON.parse(bytes.toString('utf8')) as unknown;
  } catch {
    return null;
  }
  if (!revisionEnvelopeMatches(env, mutationSiteId, safePageId, safeRevisionId)) return null;
  return revisionDocumentFromEnvelope(env);
}

export async function rollbackToRevision(
  siteId: string,
  pageId: string,
  revisionId: string,
): Promise<boolean> {
  const doc = await readRevisionDocument(siteId, pageId, revisionId);
  if (!doc) return false;
  await writePageCanvas(siteId, pageId, 'draft', doc);
  return true;
}
