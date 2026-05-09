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

import { get, put } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  type BuilderSiteDocument,
  type BuilderPageMeta,
  type BuilderPageLifecycleMeta,
  type BuilderNavItem,
  type BuilderLightbox,
  type PageCanvasRecord,
  type SavedSection,
  type SavedSectionCategory,
  createDefaultSiteDocument,
  createDefaultLightbox,
  generatePageId,
  generateSavedSectionId,
} from './types';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';

const BLOB_PREFIX = 'builder-site';
let siteWriteQueue: Promise<void> = Promise.resolve();
const pageCanvasWriteQueues = new Map<string, Promise<void>>();

type WriteSiteDocumentOptions = {
  /**
   * Site-wide writes often originate from panels that loaded an older site
   * snapshot. Preserve concurrently-created pages unless a destructive page
   * cleanup path explicitly opts out. Deleted pages that only exist in a stale
   * next document are filtered separately by createdAt.
   */
  preserveMissingPages?: boolean;
};

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  if (process.env.BUILDER_SITE_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

function localRoot(): string {
  return path.join(process.cwd(), 'runtime-data', 'builder-site');
}

// ─── Site document ────────────────────────────────────────────────

function sitePathname(siteId: string): string {
  return `${BLOB_PREFIX}/${normalizeBuilderSiteId(siteId)}/site.json`;
}

async function loadSiteDocument(siteId: string): Promise<BuilderSiteDocument | null> {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const pathname = sitePathname(normalizedSiteId);
  if (isBlobBackend()) {
    try {
      const result = await get(pathname, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return normalizeSiteDocumentLifecycle(JSON.parse(text) as BuilderSiteDocument, normalizedSiteId);
      }
    } catch { /* fallthrough */ }
  } else {
    try {
      const text = await readFile(path.join(localRoot(), normalizedSiteId, 'site.json'), 'utf8');
      return normalizeSiteDocumentLifecycle(JSON.parse(text) as BuilderSiteDocument, normalizedSiteId);
    } catch { /* fallthrough */ }
  }
  return null;
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
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  const existing = await loadSiteDocument(normalizedSiteId);
  if (existing) return existing;
  const fresh = normalizeSiteDocumentLifecycle(
    createDefaultSiteDocument(locale, normalizedSiteId),
    normalizedSiteId,
  );
  await writeSiteDocument(fresh);
  return fresh;
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
  const filteredNextPages = nextDoc.pages.filter((page) => (
    latestPageIds.has(page.pageId) || shouldKeepNextOnlyPage(page, latestDoc)
  ));
  const filteredNextPageIds = new Set(filteredNextPages.map((page) => page.pageId));
  const missingPages = options.preserveMissingPages !== false
    ? latestDoc.pages.filter((page) => !filteredNextPageIds.has(page.pageId))
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

export async function writeSiteDocument(
  doc: BuilderSiteDocument,
  options: WriteSiteDocumentOptions = {},
): Promise<void> {
  const previousWrite = siteWriteQueue;
  let releaseWrite!: () => void;
  siteWriteQueue = new Promise<void>((resolve) => {
    releaseWrite = resolve;
  });

  await previousWrite;
  try {
    const normalizedSiteId = normalizeBuilderSiteId(doc.siteId);
    const latestDoc = await loadSiteDocument(normalizedSiteId);
    const seoMergedDoc = mergeUntouchedPageSeoForWrite({ ...doc, siteId: normalizedSiteId }, latestDoc);
    const mergedDoc = reconcileSiteDocumentPagesForWrite(seoMergedDoc, latestDoc, options);
    const normalizedDoc = normalizeSiteDocumentLifecycle(mergedDoc, normalizedSiteId);
    const pathname = sitePathname(normalizedSiteId);
    const json = JSON.stringify(normalizedDoc);
    if (isBlobBackend()) {
      await put(pathname, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
    } else {
      const dir = path.join(localRoot(), normalizedSiteId);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'site.json'), json, 'utf8');
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

function pagePathname(siteId: string, pageId: string, variant: PageVariant): string {
  const suffix = variant === 'draft' ? 'draft.json' : 'published.json';
  return `${BLOB_PREFIX}/${normalizeBuilderSiteId(siteId)}/pages/${pageId}.${suffix}`;
}

function pageCanvasQueueKey(siteId: string, pageId: string, variant: PageVariant): string {
  return `${normalizeBuilderSiteId(siteId)}:${pageId}:${variant}`;
}

async function withPageCanvasWriteLock<T>(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  task: () => Promise<T>,
): Promise<T> {
  const key = pageCanvasQueueKey(siteId, pageId, variant);
  const previousWrite = pageCanvasWriteQueues.get(key) ?? Promise.resolve();
  let releaseWrite!: () => void;
  const currentWrite = new Promise<void>((resolve) => {
    releaseWrite = resolve;
  });
  const queuedWrite = previousWrite.catch(() => undefined).then(() => currentWrite);
  pageCanvasWriteQueues.set(key, queuedWrite);

  await previousWrite.catch(() => undefined);
  try {
    return await task();
  } finally {
    releaseWrite();
    if (pageCanvasWriteQueues.get(key) === queuedWrite) {
      pageCanvasWriteQueues.delete(key);
    }
  }
}

function isRecordLike(input: unknown): input is PageCanvasRecord {
  if (!input || typeof input !== 'object') return false;
  const value = input as Partial<PageCanvasRecord>;
  return (
    typeof value.revision === 'number' &&
    Number.isFinite(value.revision) &&
    typeof value.savedAt === 'string' &&
    !!value.document &&
    typeof value.document === 'object'
  );
}

function legacyRecordFromDocument(document: BuilderCanvasDocument): PageCanvasRecord {
  return {
    revision: 0,
    savedAt: document.updatedAt,
    document,
  };
}

async function readPageCanvasPayload(
  siteId: string,
  pageId: string,
  variant: PageVariant,
): Promise<unknown | null> {
  const pn = pagePathname(siteId, pageId, variant);
  if (isBlobBackend()) {
    try {
      const result = await get(pn, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return JSON.parse(text) as unknown;
      }
    } catch { /* fallthrough */ }
  } else {
    try {
      const filePath = path.join(localRoot(), pn.replace(`${BLOB_PREFIX}/`, ''));
      const text = await readFile(filePath, 'utf8');
      return JSON.parse(text) as unknown;
    } catch { /* fallthrough */ }
  }
  return null;
}

async function writePageCanvasPayload(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  payload: unknown,
): Promise<void> {
  const pn = pagePathname(siteId, pageId, variant);
  const json = JSON.stringify(payload);
  if (isBlobBackend()) {
    await put(pn, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
  } else {
    const filePath = path.join(localRoot(), pn.replace(`${BLOB_PREFIX}/`, ''));
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, json, 'utf8');
  }
}

export async function readPageCanvasRecordState(
  siteId: string,
  pageId: string,
  variant: PageVariant = 'draft',
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
  await withPageCanvasWriteLock(siteId, pageId, variant, () =>
    writePageCanvasPayload(siteId, pageId, variant, record));
}

export async function updatePageCanvasRecord(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  updater: PageCanvasRecordUpdater,
): Promise<PageCanvasRecord> {
  return withPageCanvasWriteLock(siteId, pageId, variant, async () => {
    const state = await readPageCanvasRecordState(siteId, pageId, variant);
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
  const site = await ensureSiteDocument(siteId, locale);
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
  const site = await ensureSiteDocument(siteId, locale);
  site.pages = site.pages.filter((p) => p.pageId !== pageId);
  site.navigation = removeNavigationItemsForPage(site.navigation, pageId);
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { preserveMissingPages: false });
}

export async function listPages(siteId: string, locale: Locale): Promise<BuilderPageMeta[]> {
  const site = await readSiteDocument(siteId, locale);
  return site.pages;
}

function normalizeSiteDocumentLifecycle(
  site: BuilderSiteDocument,
  siteId: string | null | undefined = site.siteId,
): BuilderSiteDocument {
  const normalizedSiteId = normalizeBuilderSiteId(siteId);
  return {
    ...site,
    siteId: normalizedSiteId,
    pages: (site.pages ?? []).map((page) => ({
      ...page,
      lifecycle:
        page.lifecycle ??
        createDefaultPageLifecycleMeta(page.documentKind ?? 'section-snapshot-v1'),
    })),
    lightboxes: site.lightboxes ?? [],
    translations: site.translations ?? [],
    sectionLibrary: site.sectionLibrary ?? [],
    redirects: site.redirects ?? [],
  };
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
  const site = await readSiteDocument(siteId, locale);
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
  const site = await readSiteDocument(siteId, locale);
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
  const site = await readSiteDocument(siteId, locale);
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
  if (isBlobBackend()) {
    try {
      const result = await get(pn, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return JSON.parse(text) as BuilderCanvasDocument;
      }
    } catch { /* fallthrough */ }
  } else {
    try {
      const filePath = path.join(localRoot(), pn.replace(`${BLOB_PREFIX}/`, ''));
      const text = await readFile(filePath, 'utf8');
      return JSON.parse(text) as BuilderCanvasDocument;
    } catch { /* fallthrough */ }
  }
  return null;
}

export async function writeLightboxCanvas(
  siteId: string,
  lightboxId: string,
  doc: BuilderCanvasDocument,
): Promise<void> {
  const pn = lightboxPathname(siteId, lightboxId);
  const json = JSON.stringify(doc);
  if (isBlobBackend()) {
    await put(pn, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
  } else {
    const filePath = path.join(localRoot(), pn.replace(`${BLOB_PREFIX}/`, ''));
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, json, 'utf8');
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
  if (isBlobBackend()) {
    try {
      const result = await get(pn, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return JSON.parse(text) as BuilderCanvasDocument;
      }
    } catch { /* fallthrough */ }
  } else {
    try {
      const filePath = path.join(localRoot(), pn.replace(`${BLOB_PREFIX}/`, ''));
      const text = await readFile(filePath, 'utf8');
      return JSON.parse(text) as BuilderCanvasDocument;
    } catch { /* fallthrough */ }
  }
  return null;
}

async function writeGlobalCanvas(
  siteId: string,
  slot: 'header' | 'footer',
  doc: BuilderCanvasDocument,
): Promise<void> {
  const pn = globalCanvasPathname(siteId, slot);
  const json = JSON.stringify(doc);
  if (isBlobBackend()) {
    await put(pn, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
  } else {
    const filePath = path.join(localRoot(), pn.replace(`${BLOB_PREFIX}/`, ''));
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, json, 'utf8');
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
  const site = await readSiteDocument(siteId, locale);
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
  const site = await readSiteDocument(siteId, locale);
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
  const site = await readSiteDocument(siteId, locale);
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
  const site = await readSiteDocument(siteId, locale);
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
  const site = await readSiteDocument(siteId, locale);
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
  // eslint-disable-next-line no-console
  console.log('[publishPage] start siteId=%s pageId=%s locale=%s', siteId, pageId, locale);
  const draft = await readPageCanvas(siteId, pageId, 'draft');
  if (!draft) {
    // eslint-disable-next-line no-console
    console.log('[publishPage] draft not found, abort');
    return false;
  }
  // eslint-disable-next-line no-console
  console.log('[publishPage] draft found, nodes=%d', draft.nodes?.length ?? 0);
  await writePageCanvas(siteId, pageId, 'published', draft);
  // eslint-disable-next-line no-console
  console.log('[publishPage] published canvas written');
  const site = await readSiteDocument(siteId, locale);
  const page = site.pages.find((p) => p.pageId === pageId);
  // eslint-disable-next-line no-console
  console.log('[publishPage] site doc pageIds=%s, match=%s', site.pages.map((p) => p.pageId).join(','), page ? 'YES' : 'NO');
  if (page) {
    page.publishedAt = new Date().toISOString();
    page.updatedAt = new Date().toISOString();
    await writeSiteDocument(site);
    // eslint-disable-next-line no-console
    console.log('[publishPage] site doc written with publishedAt=%s', page.publishedAt);
  } else {
    // eslint-disable-next-line no-console
    console.log('[publishPage] page NOT found in site doc — publishedAt NOT set');
  }
  return true;
}
