/**
 * Phase 4 — Site + multi-page persistence.
 *
 * Extends the Phase 1 sandbox persistence with site-level CRUD:
 * - Site document: metadata, navigation, theme, page list
 * - Per-page canvas documents: draft + published variants
 *
 * Backend selector mirrors Wave 5b / Sprint 0 pattern:
 * Blob when BLOB_READ_WRITE_TOKEN is set, file otherwise.
 */

import { del, get, put } from '@vercel/blob';
import { mkdir, realpath } from 'fs/promises';
import { isDeepStrictEqual } from 'node:util';
import path from 'path';
import { defaultLocale, type Locale } from '@/lib/locales';
import {
  builderCanvasDocumentSchema,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import {
  type BuilderSiteDocument,
  type BuilderPageMeta,
  type BuilderPageLifecycleMeta,
  type BuilderNavItem,
  type BuilderLightbox,
  type SiteRedirect,
  type PageCanvasRecord,
  type SavedSection,
  type SavedSectionCategory,
  createDefaultSiteDocument,
  createDefaultLightbox,
  generatePageId,
  generateSavedSectionId,
} from './types';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeBuilderInstalledApps, normalizeBuilderUninstalledApps } from '@/lib/builder/apps/types';
import {
  normalizeBuilderSiteId,
  requireBuilderSiteIdForMutation,
} from '@/lib/builder/site/identity';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
import { normalizeMobileSchemaForSiteDocument } from '@/lib/builder/site/mobile-schema';
import { isBlobBlockedForDeployEnv } from '@/lib/builder/storage/blob-env-guard';
import { withCanvasMutex } from '@/lib/builder/collab/canvas-mutex';
import { assertSiteDocumentInvariants } from '@/lib/builder/site/site-invariants';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  PAGE_CANVAS_CAS_ACTIVATION_MARKER,
  PAGE_CANVAS_CAS_MARKER_ENV,
  PAGE_CANVAS_CAS_MODE_ENV,
  PAGE_CANVAS_CAS_ROOT_ENV,
  PageCanvasCasConflictError,
  PageCanvasCasMigrationRequiredError,
  createPageCanvasVersionedStore,
  resolvePageCanvasCasLocalRoot,
  resolvePageCanvasPersistenceMode,
  type PageCanvasCasCoordinate,
  type PageCanvasCasSnapshot,
  type PageCanvasVersionedStore,
} from '@/lib/builder/site/page-canvas-versioned-store';
import {
  PERSISTENCE_ERROR_CODES,
  PersistenceInvalidDataError,
  PersistenceMissingError,
  isPersistenceError,
} from '@/lib/builder/storage/persistence-errors';
import {
  atomicRemoveLocalJson,
  atomicWriteLocalJson,
  readLocalJsonFile,
  withLocalJsonWriteLease,
} from '@/lib/builder/storage/local-json-write-lease.mjs';

export {
  PAGE_CANVAS_CAS_ACTIVATION_MARKER,
  PAGE_CANVAS_CAS_MARKER_ENV,
  PAGE_CANVAS_CAS_MODE_ENV,
  PAGE_CANVAS_CAS_ROOT_ENV,
  PageCanvasCasConflictError,
  PageCanvasCasMigrationRequiredError,
};

const BLOB_PREFIX = 'builder-site';
let siteWriteQueue: Promise<void> = Promise.resolve();

type WriteSiteDocumentOptions = {
  /**
   * Site-wide writes often originate from panels that loaded an older site
   * snapshot. Preserve concurrently-created pages unless a destructive page
   * cleanup path explicitly opts out. Deleted pages that only exist in a stale
   * next document are filtered separately by createdAt.
   */
  preserveMissingPages?: boolean;
  /**
   * Most site writes are partial panel saves that loaded an older site snapshot.
   * Preserve concurrently-created menu items unless a destructive navigation
   * edit explicitly opts out.
   */
  preserveMissingNavigation?: boolean;
  /** Writes that only update page publish metadata must not overwrite menu edits. */
  preserveNavigation?: boolean;
  /** Keep specific next-only pages even when the latest snapshot is newer. */
  preserveNextPageIds?: readonly string[];
  /** Preserve newer publish metadata from the latest snapshot when merging site writes. */
  preserveLatestPublishMeta?: boolean;
  /**
   * Preserve concurrently-created redirect rules for partial site writes.
   * Redirect Manager deletes can target specific IDs via deleteRedirectIds.
   */
  preserveMissingRedirects?: boolean;
  deleteRedirectIds?: readonly string[];
  preserveMissingInstalledApps?: boolean;
  deleteInstalledAppIds?: readonly string[];
  preserveMissingUninstalledApps?: boolean;
  deleteUninstalledAppIds?: readonly string[];
  /**
   * Targeted destructive page edits should remove only these pages while still
   * preserving unrelated pages created by concurrent writers.
   */
  deletePageIds?: readonly string[];
  /**
   * CMS source-collection override writers (services/lawyers slug + copy
   * overrides) are the only paths that intend to change
   * `sourceCollectionOverrides`. Every other partial site write loaded an
   * older snapshot, so the latest persisted overrides win by default to
   * avoid lost updates; override writers opt in with this flag.
   */
  sourceCollectionOverridesUpdated?: boolean;
};

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (isBlobBlockedForDeployEnv()) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  if (process.env.BUILDER_SITE_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

function localRoot(): string {
  const override = process.env.BUILDER_SITE_ROOT?.trim();
  if (override) return override;
  return path.join(process.cwd(), 'runtime-data', 'builder-site');
}

async function prepareLocalJsonRoot(): Promise<string> {
  const root = path.resolve(localRoot());
  await mkdir(root, { recursive: true });
  return realpath(root);
}

// ─── Site document ────────────────────────────────────────────────

function sitePathname(siteId: string): string {
  return `${BLOB_PREFIX}/${normalizeBuilderSiteId(siteId)}/site.json`;
}

async function loadSiteDocument(siteId: string): Promise<BuilderSiteDocument | null> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const pathname = sitePathname(normalizedSiteId);
  if (isBlobBackend()) {
    const result = await get(pathname, { access: 'private', useCache: false });
    if (!result || (result as { statusCode?: number }).statusCode === 404) return null;
    if (result.statusCode !== 200 || !result.stream) {
      throw new Error(`Unexpected builder site Blob response status: ${result.statusCode}`);
    }
    const text = await new Response(result.stream).text();
    return normalizeSiteDocumentLifecycle(JSON.parse(text) as BuilderSiteDocument, normalizedSiteId);
  } else {
    const allowedRoot = await prepareLocalJsonRoot();
    const targetPath = path.join(allowedRoot, normalizedSiteId, 'site.json');
    const snapshot = await readLocalJsonFile(targetPath, { allowedRoot });
    if (snapshot.kind === 'missing') return null;
    return normalizeSiteDocumentLifecycle(
      JSON.parse(snapshot.bytes.toString('utf8')) as BuilderSiteDocument,
      normalizedSiteId,
    );
  }
}

export async function readSiteDocument(siteId: string, locale: Locale): Promise<BuilderSiteDocument> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const existing = await loadSiteDocument(normalizedSiteId);
  if (existing) return existing;
  return normalizeSiteDocumentLifecycle(
    createDefaultSiteDocument(locale, normalizedSiteId),
    normalizedSiteId,
  );
}

export async function ensureSiteDocument(siteId: string, locale: Locale): Promise<BuilderSiteDocument> {
  const normalizedSiteId = requireBuilderSiteIdForMutation(siteId);
  if (isBlobBackend()) {
    const existing = await loadSiteDocument(normalizedSiteId);
    if (existing) return existing;
    const fresh = normalizeSiteDocumentLifecycle(
      createDefaultSiteDocument(locale, normalizedSiteId),
      normalizedSiteId,
    );
    await writeSiteDocument(fresh);
    return fresh;
  }

  const allowedRoot = await prepareLocalJsonRoot();
  const dir = path.join(allowedRoot, normalizedSiteId);
  await mkdir(dir, { recursive: true });
  const targetPath = path.join(dir, 'site.json');
  return withLocalJsonWriteLease(targetPath, { allowedRoot }, async (lease) => {
    const current = await readLocalJsonFile(lease);
    if (current.kind === 'present') {
      return normalizeSiteDocumentLifecycle(
        JSON.parse(current.bytes.toString('utf8')) as BuilderSiteDocument,
        normalizedSiteId,
      );
    }
    const fresh = prepareSiteDocumentForWrite(
      createDefaultSiteDocument(locale, normalizedSiteId),
      normalizedSiteId,
      null,
      {},
    );
    await atomicWriteLocalJson(lease, JSON.stringify(fresh), { expectedGeneration: null });
    return fresh;
  });
}

export function mergeUntouchedPageSeoForWrite(
  nextDoc: BuilderSiteDocument,
  latestDoc: BuilderSiteDocument | null,
): BuilderSiteDocument {
  if (!latestDoc?.pages?.length || !nextDoc.pages?.length) return nextDoc;

  const latestPageById = new Map(latestDoc.pages.map((page) => [page.pageId, page] as const));

  return {
    ...nextDoc,
    pages: nextDoc.pages.map((page) => {
      const latestPage = latestPageById.get(page.pageId);
      if (!latestPage) return page;
      const hasLatestSeo = Boolean(latestPage.seo && Object.keys(latestPage.seo).length > 0);
      const hasIncomingSeoField = Object.prototype.hasOwnProperty.call(page, 'seo');
      if (!hasLatestSeo || hasIncomingSeoField) return page;
      return { ...page, seo: latestPage.seo };
    }),
  };
}

function shouldKeepLatestPublishMeta(page: BuilderPageMeta, latestPage: BuilderPageMeta): boolean {
  const latestPublishedMs = timestampMs(latestPage.publishedSavedAt, latestPage.publishedAt);
  if (latestPublishedMs === null) return false;

  const nextPublishedMs = timestampMs(page.publishedSavedAt, page.publishedAt);
  if (nextPublishedMs === null) return true;
  return latestPublishedMs > nextPublishedMs;
}

export function mergeLatestPagePublishMetaForWrite(
  nextDoc: BuilderSiteDocument,
  latestDoc: BuilderSiteDocument | null,
): BuilderSiteDocument {
  if (!latestDoc?.pages?.length || !nextDoc.pages?.length) return nextDoc;

  const latestPageById = new Map(latestDoc.pages.map((page) => [page.pageId, page] as const));
  let changed = false;
  const pages = nextDoc.pages.map((page) => {
    const latestPage = latestPageById.get(page.pageId);
    if (!latestPage || !shouldKeepLatestPublishMeta(page, latestPage)) return page;

    changed = true;
    return {
      ...page,
      publishedAt: latestPage.publishedAt,
      publishedRevisionId: latestPage.publishedRevisionId ?? page.publishedRevisionId,
      publishedRevision: latestPage.publishedRevision ?? page.publishedRevision,
      publishedSavedAt: latestPage.publishedSavedAt ?? latestPage.publishedAt ?? page.publishedSavedAt,
      lastPublishedDraftRevision: latestPage.lastPublishedDraftRevision ?? page.lastPublishedDraftRevision,
    };
  });

  return changed ? { ...nextDoc, pages } : nextDoc;
}

function timestampMs(...values: Array<string | undefined>): number | null {
  let newest: number | null = null;
  for (const value of values) {
    if (!value) continue;
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) continue;
    newest = newest === null ? parsed : Math.max(newest, parsed);
  }
  return newest;
}

function shouldKeepNextOnlyPage(page: BuilderPageMeta, latestDoc: BuilderSiteDocument): boolean {
  const latestSiteTimestamp = timestampMs(latestDoc.updatedAt, latestDoc.createdAt);
  if (latestSiteTimestamp === null) return true;

  const pageCreatedAt = timestampMs(page.createdAt);
  if (pageCreatedAt === null) return false;
  return pageCreatedAt >= latestSiteTimestamp;
}

export function reconcileSiteDocumentPagesForWrite(
  nextDoc: BuilderSiteDocument,
  latestDoc: BuilderSiteDocument | null,
  options: WriteSiteDocumentOptions = {},
): BuilderSiteDocument {
  if (!latestDoc?.pages?.length) return nextDoc;

  const latestPageIds = new Set(latestDoc.pages.map((page) => page.pageId));
  const preserveNextPageIds = new Set(options.preserveNextPageIds ?? []);
  const deletePageIds = new Set(options.deletePageIds ?? []);
  const filteredNextPages = nextDoc.pages.filter((page) => (
    !deletePageIds.has(page.pageId) &&
    (
      latestPageIds.has(page.pageId)
      || preserveNextPageIds.has(page.pageId)
      || shouldKeepNextOnlyPage(page, latestDoc)
    )
  ));
  const filteredNextPageIds = new Set(filteredNextPages.map((page) => page.pageId));
  const missingPages = options.preserveMissingPages !== false
    ? latestDoc.pages.filter((page) => !filteredNextPageIds.has(page.pageId) && !deletePageIds.has(page.pageId))
    : [];
  const nextPages = missingPages.length > 0
    ? [...filteredNextPages, ...missingPages]
    : filteredNextPages;

  if (
    nextPages.length === nextDoc.pages.length &&
    nextPages.every((page, index) => page === nextDoc.pages[index])
  ) {
    return nextDoc;
  }
  return {
    ...nextDoc,
    pages: nextPages,
  };
}

function navigationIdentity(item: BuilderNavItem): string[] {
  return [
    `id:${item.id}`,
    `page:${item.pageId}`,
    `href:${item.href}`,
  ];
}

function collectNavigationIdentities(items: BuilderNavItem[], identities = new Set<string>()): Set<string> {
  for (const item of items) {
    for (const identity of navigationIdentity(item)) {
      identities.add(identity);
    }
    if (item.children?.length) collectNavigationIdentities(item.children, identities);
  }
  return identities;
}

function shouldKeepLatestNavItem(item: BuilderNavItem, nextDoc: BuilderSiteDocument): boolean {
  if (!item.pageId || item.pageId.startsWith('external-')) return true;
  return nextDoc.pages.some((page) => page.pageId === item.pageId);
}

export function reconcileSiteDocumentNavigationForWrite(
  nextDoc: BuilderSiteDocument,
  latestDoc: BuilderSiteDocument | null,
  options: WriteSiteDocumentOptions = {},
): BuilderSiteDocument {
  if (options.preserveMissingNavigation === false) return nextDoc;
  if (!latestDoc?.navigation?.length) return nextDoc;

  const nextIdentities = collectNavigationIdentities(nextDoc.navigation ?? []);
  const missingItems = latestDoc.navigation.filter((item) => (
    shouldKeepLatestNavItem(item, nextDoc) &&
    !navigationIdentity(item).some((identity) => nextIdentities.has(identity))
  ));
  if (missingItems.length === 0) return nextDoc;

  return {
    ...nextDoc,
    navigation: [...(nextDoc.navigation ?? []), ...missingItems],
  };
}

function activeRedirectSourceConflict(a: SiteRedirect, b: SiteRedirect): boolean {
  return Boolean(a.isActive && b.isActive && a.from === b.from && a.redirectId !== b.redirectId);
}

export function reconcileSiteDocumentRedirectsForWrite(
  nextDoc: BuilderSiteDocument,
  latestDoc: BuilderSiteDocument | null,
  options: WriteSiteDocumentOptions = {},
): BuilderSiteDocument {
  if (options.preserveMissingRedirects === false) return nextDoc;
  if (!latestDoc?.redirects?.length) return nextDoc;

  const deleteIds = new Set(options.deleteRedirectIds ?? []);
  const latestIds = new Set(latestDoc.redirects.map((redirect) => redirect.redirectId));
  const nextIds = new Set((nextDoc.redirects ?? []).map((redirect) => redirect.redirectId));
  const merged = (nextDoc.redirects ?? []).filter((redirect) => !deleteIds.has(redirect.redirectId));
  let changed = merged.length !== (nextDoc.redirects ?? []).length;

  for (const latestRedirect of latestDoc.redirects) {
    if (deleteIds.has(latestRedirect.redirectId) || nextIds.has(latestRedirect.redirectId)) continue;

    const conflictIndex = merged.findIndex((redirect) => activeRedirectSourceConflict(redirect, latestRedirect));
    if (conflictIndex >= 0) {
      const conflictingRedirect = merged[conflictIndex];
      if (!latestIds.has(conflictingRedirect.redirectId)) {
        merged.splice(conflictIndex, 1, latestRedirect);
        changed = true;
      }
      continue;
    }

    merged.push(latestRedirect);
    changed = true;
  }

  if (!changed) return nextDoc;
  return {
    ...nextDoc,
    redirects: merged,
  };
}

export function reconcileSiteDocumentInstalledAppsForWrite(
  nextDoc: BuilderSiteDocument,
  latestDoc: BuilderSiteDocument | null,
  options: WriteSiteDocumentOptions = {},
): BuilderSiteDocument {
  if (options.preserveMissingInstalledApps === false) return nextDoc;
  if (!latestDoc?.installedApps?.length) return nextDoc;

  const deleteIds = new Set(options.deleteInstalledAppIds ?? []);
  const latestApps = normalizeBuilderInstalledApps(latestDoc.installedApps);
  const latestById = new Map(latestApps.map((app) => [app.appId, app]));
  let changed = false;
  const nextApps = normalizeBuilderInstalledApps(nextDoc.installedApps ?? [])
    .filter((app) => !deleteIds.has(app.appId))
    .map((app) => {
      const latestApp = latestById.get(app.appId);
      if (!latestApp) return app;
      if (Date.parse(latestApp.updatedAt) > Date.parse(app.updatedAt)) {
        changed = true;
        return latestApp;
      }
      return app;
    });
  const nextIds = new Set(nextApps.map((app) => app.appId));
  const missingApps = latestApps
    .filter((app) => !deleteIds.has(app.appId) && !nextIds.has(app.appId));

  if (missingApps.length === 0 && !changed && nextApps.length === (nextDoc.installedApps ?? []).length) return nextDoc;
  return {
    ...nextDoc,
    installedApps: [...nextApps, ...missingApps],
  };
}

export function reconcileSiteDocumentUninstalledAppsForWrite(
  nextDoc: BuilderSiteDocument,
  latestDoc: BuilderSiteDocument | null,
  options: WriteSiteDocumentOptions = {},
): BuilderSiteDocument {
  if (options.preserveMissingUninstalledApps === false) return nextDoc;
  if (!latestDoc?.uninstalledApps?.length) return nextDoc;

  const deleteIds = new Set(options.deleteUninstalledAppIds ?? []);
  const latestArchives = normalizeBuilderUninstalledApps(latestDoc.uninstalledApps);
  const latestById = new Map(latestArchives.map((archive) => [archive.appId, archive]));
  let changed = false;
  const nextArchives = normalizeBuilderUninstalledApps(nextDoc.uninstalledApps ?? [])
    .filter((archive) => !deleteIds.has(archive.appId))
    .map((archive) => {
      const latestArchive = latestById.get(archive.appId);
      if (!latestArchive) return archive;
      if (Date.parse(latestArchive.uninstalledAt) > Date.parse(archive.uninstalledAt)) {
        changed = true;
        return latestArchive;
      }
      return archive;
    });
  const nextIds = new Set(nextArchives.map((archive) => archive.appId));
  const missingArchives = latestArchives
    .filter((archive) => !deleteIds.has(archive.appId) && !nextIds.has(archive.appId));

  if (missingArchives.length === 0 && !changed && nextArchives.length === (nextDoc.uninstalledApps ?? []).length) return nextDoc;
  return {
    ...nextDoc,
    uninstalledApps: [...nextArchives, ...missingArchives],
  };
}

function prepareSiteDocumentForWrite(
  doc: BuilderSiteDocument,
  normalizedSiteId: string,
  latestDoc: BuilderSiteDocument | null,
  options: WriteSiteDocumentOptions,
): BuilderSiteDocument {
  const invariantOptions = {
    forbidInternalSandboxPages:
      normalizedSiteId === DEFAULT_BUILDER_SITE_ID && process.env.NODE_ENV === 'production',
  };
  assertSiteDocumentInvariants(doc, invariantOptions);
  if (latestDoc) assertSiteDocumentInvariants(latestDoc, invariantOptions);
  const navigationMergedDoc = options.preserveNavigation && latestDoc
    ? { ...doc, navigation: latestDoc.navigation ?? doc.navigation }
    : doc;
  const seoMergedDoc = mergeUntouchedPageSeoForWrite(
    { ...navigationMergedDoc, siteId: normalizedSiteId },
    latestDoc,
  );
  const pageMergedDoc = reconcileSiteDocumentPagesForWrite(seoMergedDoc, latestDoc, options);
  const publishMetaMergedDoc = options.preserveLatestPublishMeta === false
    ? pageMergedDoc
    : mergeLatestPagePublishMetaForWrite(pageMergedDoc, latestDoc);
  const redirectMergedDoc = reconcileSiteDocumentRedirectsForWrite(
    publishMetaMergedDoc,
    latestDoc,
    options,
  );
  const appMergedDoc = reconcileSiteDocumentInstalledAppsForWrite(
    redirectMergedDoc,
    latestDoc,
    options,
  );
  const appArchiveMergedDoc = reconcileSiteDocumentUninstalledAppsForWrite(
    appMergedDoc,
    latestDoc,
    options,
  );
  const sourceOverridesMergedDoc = options.sourceCollectionOverridesUpdated || !latestDoc
    ? appArchiveMergedDoc
    : { ...appArchiveMergedDoc, sourceCollectionOverrides: latestDoc.sourceCollectionOverrides };
  const mergedDoc = reconcileSiteDocumentNavigationForWrite(
    sourceOverridesMergedDoc,
    latestDoc,
    options,
  );
  const normalizedDoc = normalizeSiteDocumentLifecycle(mergedDoc, normalizedSiteId);
  assertSiteDocumentInvariants(normalizedDoc, invariantOptions);
  return normalizedDoc;
}

export async function writeSiteDocument(
  doc: BuilderSiteDocument,
  options: WriteSiteDocumentOptions = {},
): Promise<void> {
  const mutationSiteId = requireBuilderSiteIdForMutation(doc.siteId);
  const previousWrite = siteWriteQueue;
  let releaseWrite!: () => void;
  siteWriteQueue = new Promise<void>((resolve) => {
    releaseWrite = resolve;
  });

  await previousWrite;
  try {
    const normalizedSiteId = mutationSiteId;
    const pathname = sitePathname(normalizedSiteId);
    if (isBlobBackend()) {
      const latestDoc = await loadSiteDocument(normalizedSiteId);
      const normalizedDoc = prepareSiteDocumentForWrite(
        doc,
        normalizedSiteId,
        latestDoc,
        options,
      );
      const json = JSON.stringify(normalizedDoc);
      await put(pathname, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
    } else {
      const allowedRoot = await prepareLocalJsonRoot();
      const dir = path.join(allowedRoot, normalizedSiteId);
      await mkdir(dir, { recursive: true });
      const targetPath = path.join(dir, 'site.json');
      await withLocalJsonWriteLease(targetPath, { allowedRoot }, async (lease) => {
        const current = await readLocalJsonFile(lease);
        const latestDoc = current.kind === 'missing'
          ? null
          : normalizeSiteDocumentLifecycle(
              JSON.parse(current.bytes.toString('utf8')) as BuilderSiteDocument,
              normalizedSiteId,
            );
        const normalizedDoc = prepareSiteDocumentForWrite(
          doc,
          normalizedSiteId,
          latestDoc,
          options,
        );
        await atomicWriteLocalJson(lease, JSON.stringify(normalizedDoc), {
          expectedGeneration: current.kind === 'missing' ? null : current.generation,
        });
      });
    }
  } finally {
    releaseWrite();
  }
}

// ─── Page canvas documents ────────────────────────────────────────

type PageVariant = 'draft' | 'published';
type WritePageCanvasOptions = {
  incrementRevision?: boolean;
  updatedBy?: string;
};
type PageCanvasRecordUpdater = (
  state: PageCanvasRecordState | null,
) => PageCanvasRecord | Promise<PageCanvasRecord>;

export interface PageCanvasRecordState {
  record: PageCanvasRecord;
  isEnvelope: boolean;
}

// Page ids are embedded in Blob pathnames and local file paths, and dynamic
// API route segments arrive URL-decoded — a crafted id containing `..` or
// separators must never reach path.join/Blob paths.
const SAFE_PAGE_CANVAS_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

function pagePathname(siteId: string, pageId: string, variant: PageVariant): string {
  if (!SAFE_PAGE_CANVAS_ID.test(pageId)) {
    throw new Error(`Invalid builder page id: ${JSON.stringify(pageId)}`);
  }
  const suffix = variant === 'draft' ? 'draft.json' : 'published.json';
  return `${BLOB_PREFIX}/${normalizeBuilderSiteId(siteId)}/pages/${pageId}.${suffix}`;
}

async function withPageCanvasWriteLock<T>(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  task: () => Promise<T>,
): Promise<T> {
  void variant;
  return withCanvasMutex(requireBuilderSiteIdForMutation(siteId), pageId, task);
}

function isRecordLike(input: unknown): input is PageCanvasRecord {
  if (!input || typeof input !== 'object') return false;
  const value = input as Partial<PageCanvasRecord>;
  return (
    typeof value.revision === 'number' &&
    Number.isInteger(value.revision) &&
    value.revision >= 0 &&
    typeof value.savedAt === 'string' &&
    Number.isFinite(Date.parse(value.savedAt)) &&
    (value.updatedBy === undefined || typeof value.updatedBy === 'string') &&
    !!value.document &&
    typeof value.document === 'object'
  );
}

function isPageCanvasRecordCandidate(input: unknown): boolean {
  return Boolean(
    input
    && typeof input === 'object'
    && (
      Object.prototype.hasOwnProperty.call(input, 'revision')
      || Object.prototype.hasOwnProperty.call(input, 'savedAt')
      || Object.prototype.hasOwnProperty.call(input, 'document')
    ),
  );
}

function legacyRecordFromDocument(document: BuilderCanvasDocument): PageCanvasRecord {
  return {
    revision: 0,
    savedAt: document.updatedAt,
    document,
  };
}

export type BuilderCanvasPersistenceErrorCode = 'read_failed' | 'invalid_data';

/**
 * Stable, provider-neutral error for persisted canvas reads.
 *
 * The original failure is retained as a non-enumerable cause for server-side
 * diagnostics, while the public message deliberately excludes provider text,
 * credentials, and local filesystem paths.
 */
export class BuilderCanvasPersistenceError extends Error {
  readonly cause!: unknown;
  readonly statusCode: number | undefined;

  constructor(
    readonly code: BuilderCanvasPersistenceErrorCode,
    readonly backend: 'blob' | 'local',
    options: { cause?: unknown; statusCode?: number } = {},
  ) {
    super(code === 'invalid_data'
      ? 'Stored builder canvas data is invalid'
      : 'Builder canvas persistence read failed');
    this.name = 'BuilderCanvasPersistenceError';
    this.statusCode = options.statusCode;
    Object.defineProperty(this, 'cause', {
      configurable: false,
      enumerable: false,
      value: options.cause,
      writable: false,
    });
  }
}

function readExactHttpStatus(value: unknown): number | undefined {
  if (!value || typeof value !== 'object') return undefined;
  for (const property of ['statusCode', 'status'] as const) {
    let candidate: unknown;
    try {
      candidate = Reflect.get(value, property);
    } catch {
      continue;
    }
    if (typeof candidate === 'number' && Number.isInteger(candidate)) return candidate;
  }
  return undefined;
}

function validateStoredCanvasDocument(value: unknown): BuilderCanvasDocument {
  // Parse for validation only. Returning the original object preserves legacy
  // unknown fields while still refusing corrupt documents at the read boundary.
  builderCanvasDocumentSchema.parse(value);
  return value as BuilderCanvasDocument;
}

function validateStoredPageCanvasPayload(value: unknown): unknown {
  if (isPageCanvasRecordCandidate(value) && !isRecordLike(value)) {
    throw new TypeError('Invalid page canvas record envelope');
  }
  if (isRecordLike(value)) {
    validateStoredCanvasDocument(value.document);
    return value;
  }
  return validateStoredCanvasDocument(value);
}

function parseStoredCanvasJson<T>(
  text: string,
  backend: 'blob' | 'local',
  validate: (value: unknown) => T,
): T {
  let value: unknown;
  try {
    value = JSON.parse(text) as unknown;
  } catch (error) {
    throw new BuilderCanvasPersistenceError('invalid_data', backend, { cause: error });
  }
  return validateCanvasValue(value, backend, validate);
}

function validateCanvasValue<T>(
  value: unknown,
  backend: 'blob' | 'local',
  validate: (input: unknown) => T,
): T {
  try {
    return validate(value);
  } catch (error) {
    if (error instanceof BuilderCanvasPersistenceError) throw error;
    throw new BuilderCanvasPersistenceError('invalid_data', backend, { cause: error });
  }
}

async function readStoredCanvasPayload<T>(
  pathname: string,
  validate: (value: unknown) => T,
): Promise<T | null> {
  if (isBlobBackend()) {
    let result: Awaited<ReturnType<typeof get>> | null;
    try {
      result = await get(pathname, { access: 'private', useCache: false });
    } catch (error) {
      const statusCode = readExactHttpStatus(error);
      if (statusCode === 404) return null;
      throw new BuilderCanvasPersistenceError('read_failed', 'blob', {
        cause: error,
        statusCode,
      });
    }

    if (result === null) return null;
    if (result === undefined) {
      throw new BuilderCanvasPersistenceError('read_failed', 'blob');
    }
    const statusCode = readExactHttpStatus(result);
    if (statusCode === 404) return null;
    if (statusCode !== 200 || !result.stream) {
      throw new BuilderCanvasPersistenceError('read_failed', 'blob', { statusCode });
    }

    try {
      const text = await new Response(result.stream).text();
      return parseStoredCanvasJson(text, 'blob', validate);
    } catch (error) {
      if (error instanceof BuilderCanvasPersistenceError) throw error;
      throw new BuilderCanvasPersistenceError('read_failed', 'blob', {
        cause: error,
        statusCode,
      });
    }
  }

  const allowedRoot = await prepareLocalJsonRoot();
  const filePath = path.join(allowedRoot, pathname.replace(`${BLOB_PREFIX}/`, ''));
  try {
    const snapshot = await readLocalJsonFile(filePath, { allowedRoot });
    if (snapshot.kind === 'missing') return null;
    return parseStoredCanvasJson(snapshot.bytes.toString('utf8'), 'local', validate);
  } catch (error) {
    if (error instanceof BuilderCanvasPersistenceError) throw error;
    throw new BuilderCanvasPersistenceError('read_failed', 'local', { cause: error });
  }
}

async function readPageCanvasPayload(
  siteId: string,
  pageId: string,
  variant: PageVariant,
): Promise<unknown | null> {
  const pn = pagePathname(siteId, pageId, variant);
  return readStoredCanvasPayload(pn, validateStoredPageCanvasPayload);
}

async function writeLocalJsonPayload(pathname: string, data: string): Promise<void> {
  const allowedRoot = await prepareLocalJsonRoot();
  const filePath = path.join(allowedRoot, pathname.replace(`${BLOB_PREFIX}/`, ''));
  await mkdir(path.dirname(filePath), { recursive: true });
  await withLocalJsonWriteLease(filePath, { allowedRoot }, async (lease) => {
    const current = await readLocalJsonFile(lease);
    await atomicWriteLocalJson(lease, data, {
      expectedGeneration: current.kind === 'missing' ? null : current.generation,
    });
  });
}

async function removeLocalJsonPayload(pathname: string): Promise<void> {
  const allowedRoot = await prepareLocalJsonRoot();
  const filePath = path.join(allowedRoot, pathname.replace(`${BLOB_PREFIX}/`, ''));
  await mkdir(path.dirname(filePath), { recursive: true });
  await withLocalJsonWriteLease(filePath, { allowedRoot }, async (lease) => {
    const current = await readLocalJsonFile(lease);
    if (current.kind === 'missing') return;
    await atomicRemoveLocalJson(lease, { expectedGeneration: current.generation });
  });
}

async function writePageCanvasPayload(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  payload: unknown,
): Promise<void> {
  const pn = pagePathname(requireBuilderSiteIdForMutation(siteId), pageId, variant);
  const backend = isBlobBackend() ? 'blob' : 'local';
  validateCanvasValue(payload, backend, validateStoredPageCanvasPayload);
  const json = JSON.stringify(payload);
  if (backend === 'blob') {
    await put(pn, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
  } else {
    await writeLocalJsonPayload(pn, json);
  }
}

async function deletePageCanvasPayload(
  siteId: string,
  pageId: string,
  variant: PageVariant,
): Promise<void> {
  const pn = pagePathname(requireBuilderSiteIdForMutation(siteId), pageId, variant);
  if (isBlobBackend()) {
    await del(pn);
  } else {
    await removeLocalJsonPayload(pn);
  }
}

function pageCanvasCasBackend(): 'blob' | 'local' {
  return isBlobBackend() ? 'blob' : 'local';
}

function pageCanvasCasCoordinate(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  mutation: boolean,
): PageCanvasCasCoordinate {
  const normalizedSiteId = mutation
    ? requireBuilderSiteIdForMutation(siteId)
    : normalizeBuilderSiteId(siteId);
  // Reuse the legacy path boundary so both stores accept exactly the same
  // page-id alphabet even though the CAS adapter hashes local keys.
  pagePathname(normalizedSiteId, pageId, variant);
  return { siteId: normalizedSiteId, pageId, variant };
}

function createActivatedPageCanvasStore(): {
  backend: 'blob' | 'local';
  store: PageCanvasVersionedStore;
} {
  const backend = pageCanvasCasBackend();
  const store = createPageCanvasVersionedStore({
    backend,
    ...(backend === 'blob'
      ? { blobToken: process.env.BLOB_READ_WRITE_TOKEN }
      : {
          localRoot: resolvePageCanvasCasLocalRoot(localRoot()),
          // expand/cutover already require the exact activation handshake.
          // This keeps staged local production cutovers operable without
          // weakening FileCas's safe default for unrelated callers.
          productionMutationPolicy: 'allow' as const,
        }),
  });
  return { backend, store };
}

async function readPageCanvasCasSnapshot(
  store: PageCanvasVersionedStore,
  coordinate: PageCanvasCasCoordinate,
): Promise<PageCanvasCasSnapshot | null> {
  try {
    return await store.read(coordinate);
  } catch (error) {
    if (
      error instanceof PersistenceMissingError
      || (isPersistenceError(error) && error.code === PERSISTENCE_ERROR_CODES.MISSING)
    ) {
      return null;
    }
    throw error;
  }
}

function canvasReadErrorFromCas(
  error: unknown,
  backend: 'blob' | 'local',
): BuilderCanvasPersistenceError {
  if (error instanceof BuilderCanvasPersistenceError) return error;
  if (isPersistenceError(error) && error.code === PERSISTENCE_ERROR_CODES.INVALID_DATA) {
    return new BuilderCanvasPersistenceError('invalid_data', backend, { cause: error });
  }
  return new BuilderCanvasPersistenceError('read_failed', backend, { cause: error });
}

async function readLegacyPageCanvasRecordState(
  siteId: string,
  pageId: string,
  variant: PageVariant,
): Promise<PageCanvasRecordState | null> {
  const payload = await readPageCanvasPayload(siteId, pageId, variant);
  if (!payload) return null;
  if (isRecordLike(payload)) {
    return { record: payload, isEnvelope: true };
  }
  return {
    record: legacyRecordFromDocument(payload as BuilderCanvasDocument),
    isEnvelope: false,
  };
}

async function readCasPageCanvasRecordState(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  mode: 'expand' | 'cutover',
): Promise<PageCanvasRecordState | null> {
  const coordinate = pageCanvasCasCoordinate(siteId, pageId, variant, false);
  const { backend, store } = createActivatedPageCanvasStore();
  try {
    const snapshot = await readPageCanvasCasSnapshot(store, coordinate);
    if (mode === 'expand') {
      const legacy = await readLegacyPageCanvasRecordState(siteId, pageId, variant);
      if (snapshot && !legacy) {
        throw new PersistenceInvalidDataError(
          'Page canvas CAS record has no legacy source during expand verification',
        );
      }
      if (snapshot && legacy && !isDeepStrictEqual(snapshot.record, legacy.record)) {
        throw new PersistenceInvalidDataError(
          'Page canvas CAS and legacy records diverge during expand verification',
        );
      }
      return snapshot
        ? { record: snapshot.record, isEnvelope: true }
        : legacy;
    }
    if (snapshot) return { record: snapshot.record, isEnvelope: true };
    // Cutover is authoritative: a missing CAS record is missing even if stale
    // legacy bytes still exist. Invalid/unavailable CAS never reaches here.
    return null;
  } catch (error) {
    throw canvasReadErrorFromCas(error, backend);
  }
}

async function currentCasSnapshotForMutation(
  store: PageCanvasVersionedStore,
  coordinate: PageCanvasCasCoordinate,
  mode: 'expand' | 'cutover',
): Promise<PageCanvasCasSnapshot | null> {
  // Expand is a read/verification phase. It intentionally freezes application
  // mutations so rollback to legacy cannot resurrect deleted or stale bytes.
  if (mode === 'expand') throw new PageCanvasCasMigrationRequiredError();
  const snapshot = await readPageCanvasCasSnapshot(store, coordinate);
  if (snapshot) return snapshot;

  // Cutover reads never fall back, but mutations still inspect legacy
  // existence to detect an incomplete backfill before creating a CAS record.
  const legacy = await readLegacyPageCanvasRecordState(
    coordinate.siteId,
    coordinate.pageId,
    coordinate.variant,
  );
  if (legacy) throw new PageCanvasCasMigrationRequiredError();
  return null;
}

async function throwCasConflictWithCurrent(
  store: PageCanvasVersionedStore,
  coordinate: PageCanvasCasCoordinate,
  cause: unknown,
): Promise<never> {
  const current = await readPageCanvasCasSnapshot(store, coordinate);
  throw new PageCanvasCasConflictError(current
    ? { revision: current.record.revision, savedAt: current.record.savedAt }
    : null, { cause });
}

async function commitPageCanvasRecordCas(
  store: PageCanvasVersionedStore,
  coordinate: PageCanvasCasCoordinate,
  current: PageCanvasCasSnapshot | null,
  record: PageCanvasRecord,
): Promise<PageCanvasRecord> {
  try {
    const committed = current
      ? await store.compareAndSet(coordinate, current.storageVersion, record)
      : await store.create(coordinate, record);
    return committed.record;
  } catch (error) {
    if (isPersistenceError(error) && error.code === PERSISTENCE_ERROR_CODES.CONFLICT) {
      return throwCasConflictWithCurrent(store, coordinate, error);
    }
    throw error;
  }
}

async function updatePageCanvasRecordCas(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  updater: PageCanvasRecordUpdater,
  mode: 'expand' | 'cutover',
): Promise<PageCanvasRecord> {
  const coordinate = pageCanvasCasCoordinate(siteId, pageId, variant, true);
  const { store } = createActivatedPageCanvasStore();
  const current = await currentCasSnapshotForMutation(store, coordinate, mode);
  const state: PageCanvasRecordState | null = current
    ? { record: current.record, isEnvelope: true }
    : null;
  // Full-document replacement is deliberately evaluated once. A stale CAS
  // re-read is used only to report the conflict; it never re-runs the updater.
  const next = await updater(state);
  return commitPageCanvasRecordCas(store, coordinate, current, next);
}

export async function readPageCanvasRecordState(
  siteId: string,
  pageId: string,
  variant: PageVariant = 'draft',
): Promise<PageCanvasRecordState | null> {
  let mode: ReturnType<typeof resolvePageCanvasPersistenceMode>;
  try {
    mode = resolvePageCanvasPersistenceMode();
  } catch (error) {
    throw canvasReadErrorFromCas(error, pageCanvasCasBackend());
  }
  if (mode === 'legacy') {
    return readLegacyPageCanvasRecordState(siteId, pageId, variant);
  }
  return readCasPageCanvasRecordState(siteId, pageId, variant, mode);
}

export async function readPageCanvasRecord(
  siteId: string,
  pageId: string,
  variant: PageVariant = 'draft',
): Promise<PageCanvasRecord | null> {
  const state = await readPageCanvasRecordState(siteId, pageId, variant);
  return state?.record ?? null;
}

export async function writePageCanvasRecord(
  siteId: string,
  pageId: string,
  record: PageCanvasRecord,
  variant: PageVariant = 'draft',
): Promise<void> {
  await withPageCanvasWriteLock(siteId, pageId, variant, async () => {
    const mode = resolvePageCanvasPersistenceMode();
    if (mode === 'legacy') {
      await writePageCanvasPayload(siteId, pageId, variant, record);
      return;
    }
    await updatePageCanvasRecordCas(
      siteId,
      pageId,
      variant,
      () => record,
      mode,
    );
  });
}

export async function deletePageCanvasRecord(
  siteId: string,
  pageId: string,
  variant: PageVariant = 'draft',
): Promise<void> {
  await withPageCanvasWriteLock(siteId, pageId, variant, async () => {
    const mode = resolvePageCanvasPersistenceMode();
    if (mode === 'legacy') {
      await deletePageCanvasPayload(siteId, pageId, variant);
      return;
    }

    const coordinate = pageCanvasCasCoordinate(siteId, pageId, variant, true);
    const { store } = createActivatedPageCanvasStore();
    const current = await currentCasSnapshotForMutation(store, coordinate, mode);
    if (!current) return;
    try {
      await store.compareAndDelete(coordinate, current.storageVersion);
    } catch (error) {
      if (isPersistenceError(error) && error.code === PERSISTENCE_ERROR_CODES.CONFLICT) {
        await throwCasConflictWithCurrent(store, coordinate, error);
      }
      throw error;
    }
  });
}

export async function updatePageCanvasRecord(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  updater: PageCanvasRecordUpdater,
): Promise<PageCanvasRecord> {
  return withPageCanvasWriteLock(siteId, pageId, variant, async () => {
    const mode = resolvePageCanvasPersistenceMode();
    if (mode !== 'legacy') {
      return updatePageCanvasRecordCas(siteId, pageId, variant, updater, mode);
    }
    const state = await readLegacyPageCanvasRecordState(siteId, pageId, variant);
    const record = await updater(state);
    await writePageCanvasPayload(siteId, pageId, variant, record);
    return record;
  });
}

export async function readPageCanvas(
  siteId: string,
  pageId: string,
  variant: PageVariant,
): Promise<BuilderCanvasDocument | null> {
  const state = await readPageCanvasRecordState(siteId, pageId, variant);
  return state?.record.document ?? null;
}

export async function writePageCanvas(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  doc: BuilderCanvasDocument,
  options: WritePageCanvasOptions = {},
): Promise<void> {
  await updatePageCanvasRecord(siteId, pageId, variant, (state) => {
    const incrementRevision = options.incrementRevision ?? true;
    const revision = state
      ? incrementRevision
        ? state.record.revision + 1
        : state.record.revision
      : 0;
    return {
      revision,
      savedAt: new Date().toISOString(),
      updatedBy: options.updatedBy,
      document: doc,
    };
  });
}

// ─── Page CRUD ────────────────────────────────────────────────────

export async function createPage(
  siteId: string,
  locale: Locale,
  slug: string,
  title: string,
): Promise<BuilderPageMeta> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await ensureSiteDocument(mutationSiteId, locale);
  const pageId = generatePageId();
  const meta: BuilderPageMeta = {
    pageId,
    slug,
    title: { ko: title, 'zh-hant': title, en: title },
    locale,
    documentKind: 'canvas-scene-vnext',
    lifecycle: createDefaultPageLifecycleMeta('canvas-scene-vnext'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  site.pages.push(meta);
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return meta;
}

function removeNavigationItemsForPage(items: BuilderNavItem[], pageId: string): BuilderNavItem[] {
  return items
    .filter((item) => item.pageId !== pageId)
    .map((item) => {
      if (!item.children?.length) return item;
      const children = removeNavigationItemsForPage(item.children, pageId);
      if (children.length > 0) return { ...item, children };
      const itemWithoutChildren = { ...item };
      delete itemWithoutChildren.children;
      return itemWithoutChildren;
    });
}

export async function deletePage(siteId: string, pageId: string, locale: Locale): Promise<void> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await ensureSiteDocument(mutationSiteId, locale);
  site.pages = site.pages.filter((p) => p.pageId !== pageId);
  site.navigation = removeNavigationItemsForPage(site.navigation, pageId);
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { deletePageIds: [pageId] });
}

function pageLocaleProjectionKey(page: BuilderPageMeta, locale: Locale): string {
  return page.isHomePage || page.slug === '' ? '__home__' : resolveLocaleSlug(page, locale);
}

function hasLocaleEquivalentPage(
  pages: BuilderPageMeta[],
  sourcePage: BuilderPageMeta,
  locale: Locale,
): boolean {
  const linkedPageId = sourcePage.linkedPageIds?.[locale];
  if (linkedPageId && pages.some((page) => (
    page.pageId === linkedPageId &&
    page.locale === locale &&
    resolveLocaleSlug(page, locale) === resolveLocaleSlug(sourcePage, locale)
  ))) {
    return true;
  }
  const sourceKey = sourcePage.isHomePage ? '__home__' : resolveLocaleSlug(sourcePage, locale);
  return pages.some((page) => (
    page.locale === locale && pageLocaleProjectionKey(page, locale) === sourceKey
  ));
}

export function canProjectPageToLocale(
  page: BuilderPageMeta,
  pages: BuilderPageMeta[],
  locale: Locale,
): boolean {
  if (page.locale === locale) return true;
  if (locale === defaultLocale || page.locale !== defaultLocale) return false;
  return !hasLocaleEquivalentPage(pages, page, locale);
}

export function projectPagesForLocale(
  pages: BuilderPageMeta[],
  locale: Locale,
): BuilderPageMeta[] {
  return pages.filter((page) => canProjectPageToLocale(page, pages, locale));
}

export async function listPages(siteId: string, locale: Locale): Promise<BuilderPageMeta[]> {
  const site = await readSiteDocument(siteId, locale);
  return projectPagesForLocale(site.pages, locale);
}

function normalizeSiteDocumentLifecycle(
  site: BuilderSiteDocument,
  siteId: string | null | undefined = site.siteId,
): BuilderSiteDocument {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  return normalizeMobileSchemaForSiteDocument({
    ...site,
    siteId: normalizedSiteId,
    pages: (site.pages ?? []).map((page) => ({
      ...page,
      lifecycle:
        page.lifecycle ??
        createDefaultPageLifecycleMeta(page.documentKind ?? 'section-snapshot-v1'),
    })),
    lightboxes: site.lightboxes ?? [],
    popups: site.popups ?? [],
    translations: site.translations ?? [],
    cmsCollections: site.cmsCollections ?? [],
    sectionLibrary: site.sectionLibrary ?? [],
    redirects: site.redirects ?? [],
    installedApps: normalizeBuilderInstalledApps(site.installedApps ?? []),
    uninstalledApps: normalizeBuilderUninstalledApps(site.uninstalledApps ?? []),
  });
}

function createDefaultPageLifecycleMeta(
  documentKind: BuilderPageMeta['documentKind']
): BuilderPageLifecycleMeta {
  if (documentKind === 'canvas-scene-vnext') {
    return {
      activeDocumentFamily: 'canvas-sandbox-v1',
      publishBackend: 'builder-snapshot',
      sceneStatus: 'seeded',
    };
  }

  return {
    activeDocumentFamily: 'section-snapshot-v1',
    publishBackend: 'builder-snapshot',
    sceneStatus: 'derived-only',
  };
}

// ─── Lightbox CRUD ────────────────────────────────────────────────

export async function listLightboxes(siteId: string, locale: Locale): Promise<BuilderLightbox[]> {
  const site = await readSiteDocument(siteId, locale);
  const all = site.lightboxes ?? [];
  return all.filter((lb) => lb.locale === locale);
}

export async function findLightboxBySlug(
  siteId: string,
  locale: Locale,
  slug: string,
): Promise<BuilderLightbox | null> {
  const list = await listLightboxes(siteId, locale);
  return list.find((lb) => lb.slug === slug) ?? null;
}

export async function createLightbox(
  siteId: string,
  locale: Locale,
  slug: string,
  name: string,
): Promise<BuilderLightbox> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await readSiteDocument(mutationSiteId, locale);
  if (!site.lightboxes) site.lightboxes = [];
  const lb = createDefaultLightbox(locale, slug, name);
  site.lightboxes.push(lb);
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return lb;
}

export async function updateLightbox(
  siteId: string,
  locale: Locale,
  id: string,
  patch: Partial<Omit<BuilderLightbox, 'id' | 'createdAt'>>,
): Promise<BuilderLightbox | null> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await readSiteDocument(mutationSiteId, locale);
  if (!site.lightboxes) site.lightboxes = [];
  const index = site.lightboxes.findIndex((lb) => lb.id === id);
  if (index === -1) return null;
  const next: BuilderLightbox = {
    ...site.lightboxes[index],
    ...patch,
    id: site.lightboxes[index].id,
    createdAt: site.lightboxes[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  site.lightboxes[index] = next;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return next;
}

export async function deleteLightbox(
  siteId: string,
  locale: Locale,
  id: string,
): Promise<boolean> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await readSiteDocument(mutationSiteId, locale);
  if (!site.lightboxes) return false;
  const before = site.lightboxes.length;
  site.lightboxes = site.lightboxes.filter((lb) => lb.id !== id);
  if (site.lightboxes.length === before) return false;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return true;
}

// ─── Lightbox canvas (single variant — saved = published) ─────────

function lightboxPathname(siteId: string, lightboxId: string): string {
  return `${BLOB_PREFIX}/${normalizeBuilderSiteId(siteId)}/lightboxes/${lightboxId}.json`;
}

export async function readLightboxCanvas(
  siteId: string,
  lightboxId: string,
): Promise<BuilderCanvasDocument | null> {
  const pn = lightboxPathname(siteId, lightboxId);
  return readStoredCanvasPayload(pn, validateStoredCanvasDocument);
}

export async function writeLightboxCanvas(
  siteId: string,
  lightboxId: string,
  doc: BuilderCanvasDocument,
): Promise<void> {
  const pn = lightboxPathname(requireBuilderSiteIdForMutation(siteId), lightboxId);
  const backend = isBlobBackend() ? 'blob' : 'local';
  validateCanvasValue(doc, backend, validateStoredCanvasDocument);
  const json = JSON.stringify(doc);
  if (backend === 'blob') {
    await put(pn, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
  } else {
    await writeLocalJsonPayload(pn, json);
  }
}

// ─── Global header / footer canvas (single variant — saved = published) ───
//
// Mirrors the lightbox pattern: site doc holds an ID reference under
// `headerFooter.headerCanvasId` / `footerCanvasId`, the actual canvas JSON
// is stored alongside lightboxes/pages under `${BLOB_PREFIX}/${siteId}/global/`.
//
// For v1 we use fixed IDs (`global-header` / `global-footer`); the schema
// already supports per-locale overrides for future expansion.

export const GLOBAL_HEADER_CANVAS_ID = 'global-header';
export const GLOBAL_FOOTER_CANVAS_ID = 'global-footer';

function globalCanvasPathname(siteId: string, slot: 'header' | 'footer'): string {
  return `${BLOB_PREFIX}/${normalizeBuilderSiteId(siteId)}/global/${slot}.json`;
}

async function readGlobalCanvas(
  siteId: string,
  slot: 'header' | 'footer',
): Promise<BuilderCanvasDocument | null> {
  const pn = globalCanvasPathname(siteId, slot);
  return readStoredCanvasPayload(pn, validateStoredCanvasDocument);
}

async function writeGlobalCanvas(
  siteId: string,
  slot: 'header' | 'footer',
  doc: BuilderCanvasDocument,
): Promise<void> {
  const pn = globalCanvasPathname(requireBuilderSiteIdForMutation(siteId), slot);
  const backend = isBlobBackend() ? 'blob' : 'local';
  validateCanvasValue(doc, backend, validateStoredCanvasDocument);
  const json = JSON.stringify(doc);
  if (backend === 'blob') {
    await put(pn, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
  } else {
    await writeLocalJsonPayload(pn, json);
  }
}

export async function readHeaderCanvas(siteId: string): Promise<BuilderCanvasDocument | null> {
  return readGlobalCanvas(siteId, 'header');
}

export async function writeHeaderCanvas(siteId: string, doc: BuilderCanvasDocument): Promise<void> {
  await writeGlobalCanvas(siteId, 'header', doc);
}

export async function readFooterCanvas(siteId: string): Promise<BuilderCanvasDocument | null> {
  return readGlobalCanvas(siteId, 'footer');
}

export async function writeFooterCanvas(siteId: string, doc: BuilderCanvasDocument): Promise<void> {
  await writeGlobalCanvas(siteId, 'footer', doc);
}

/**
 * Ensure `site.headerFooter.headerCanvasId` / `footerCanvasId` reference the
 * fixed global IDs. Idempotent — only writes the site doc when an ID changes.
 * Returns `true` if the site doc was modified.
 */
export async function ensureGlobalHeaderFooterIds(
  siteId: string,
  locale: Locale,
): Promise<boolean> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await readSiteDocument(mutationSiteId, locale);
  const current = site.headerFooter ?? {};
  const wantHeader = typeof current.headerCanvasId === 'string'
    ? current.headerCanvasId
    : undefined;
  const wantFooter = typeof current.footerCanvasId === 'string'
    ? current.footerCanvasId
    : undefined;

  let changed = false;
  const next = { ...current };

  if (wantHeader !== GLOBAL_HEADER_CANVAS_ID) {
    next.headerCanvasId = GLOBAL_HEADER_CANVAS_ID;
    changed = true;
  }
  if (wantFooter !== GLOBAL_FOOTER_CANVAS_ID) {
    next.footerCanvasId = GLOBAL_FOOTER_CANVAS_ID;
    changed = true;
  }

  if (changed) {
    site.headerFooter = next;
    site.updatedAt = new Date().toISOString();
    await writeSiteDocument(site);
  }
  return changed;
}

// ─── Section library CRUD ────────────────────────────────────────
//
// Sections are stored inline on the site document under `sectionLibrary`.
// Wix Studio "Saved Sections" parity — a user designs a container +
// descendants once and reuses it across pages.

export async function listSections(siteId: string, locale: Locale): Promise<SavedSection[]> {
  const site = await readSiteDocument(siteId, locale);
  return site.sectionLibrary ?? [];
}

export async function findSection(
  siteId: string,
  locale: Locale,
  sectionId: string,
): Promise<SavedSection | null> {
  const list = await listSections(siteId, locale);
  return list.find((s) => s.sectionId === sectionId) ?? null;
}

export async function createSection(
  siteId: string,
  locale: Locale,
  input: {
    name: string;
    description?: string;
    category?: SavedSectionCategory;
    thumbnail?: string;
    rootNodeId: string;
    nodes: BuilderCanvasNode[];
  },
): Promise<SavedSection> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await readSiteDocument(mutationSiteId, locale);
  if (!site.sectionLibrary) site.sectionLibrary = [];
  const now = new Date().toISOString();
  const section: SavedSection = {
    sectionId: generateSavedSectionId(),
    name: input.name,
    description: input.description,
    category: input.category,
    thumbnail: input.thumbnail,
    rootNodeId: input.rootNodeId,
    nodes: input.nodes,
    createdAt: now,
    updatedAt: now,
    usage: 0,
  };
  site.sectionLibrary.push(section);
  site.updatedAt = now;
  await writeSiteDocument(site);
  return section;
}

export async function updateSection(
  siteId: string,
  locale: Locale,
  sectionId: string,
  patch: Partial<Omit<SavedSection, 'sectionId' | 'createdAt' | 'nodes' | 'rootNodeId'>>,
): Promise<SavedSection | null> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await readSiteDocument(mutationSiteId, locale);
  if (!site.sectionLibrary) site.sectionLibrary = [];
  const index = site.sectionLibrary.findIndex((s) => s.sectionId === sectionId);
  if (index === -1) return null;
  const existing = site.sectionLibrary[index];
  const next: SavedSection = {
    ...existing,
    ...patch,
    sectionId: existing.sectionId,
    createdAt: existing.createdAt,
    nodes: existing.nodes,
    rootNodeId: existing.rootNodeId,
    updatedAt: new Date().toISOString(),
  };
  site.sectionLibrary[index] = next;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return next;
}

export async function incrementSectionUsage(
  siteId: string,
  locale: Locale,
  sectionId: string,
): Promise<SavedSection | null> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await readSiteDocument(mutationSiteId, locale);
  if (!site.sectionLibrary) return null;
  const index = site.sectionLibrary.findIndex((s) => s.sectionId === sectionId);
  if (index === -1) return null;
  const existing = site.sectionLibrary[index];
  const next: SavedSection = {
    ...existing,
    usage: (existing.usage ?? 0) + 1,
    updatedAt: new Date().toISOString(),
  };
  site.sectionLibrary[index] = next;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return next;
}

export async function deleteSection(
  siteId: string,
  locale: Locale,
  sectionId: string,
): Promise<boolean> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const site = await readSiteDocument(mutationSiteId, locale);
  if (!site.sectionLibrary) return false;
  const before = site.sectionLibrary.length;
  site.sectionLibrary = site.sectionLibrary.filter((s) => s.sectionId !== sectionId);
  if (site.sectionLibrary.length === before) return false;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return true;
}

// ─── Publish ──────────────────────────────────────────────────────

export async function publishPage(siteId: string, pageId: string, locale: Locale): Promise<boolean> {
  const mutationSiteId = requireBuilderSiteIdForMutation(siteId);
  const draft = await readPageCanvas(mutationSiteId, pageId, 'draft');
  if (!draft) {
    return false;
  }
  const { checkDisabledConsultationChannels } = await import(
    '@/lib/builder/publish-gate/consultation-channel-checks'
  );
  if (checkDisabledConsultationChannels(draft, mutationSiteId).length > 0) {
    return false;
  }
  await writePageCanvas(mutationSiteId, pageId, 'published', draft);
  const site = await readSiteDocument(mutationSiteId, locale);
  const page = site.pages.find((p) => p.pageId === pageId);
  if (page) {
    const publishedAt = new Date().toISOString();
    page.publishedAt = publishedAt;
    page.publishedSavedAt = publishedAt;
    delete page.publishedRevisionId;
    delete page.publishedRevision;
    delete page.lastPublishedDraftRevision;
    page.updatedAt = publishedAt;
    await writeSiteDocument(site);
  }
  return true;
}
