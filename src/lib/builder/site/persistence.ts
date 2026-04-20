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
  createDefaultSiteDocument,
  generatePageId,
} from './types';

const BLOB_PREFIX = 'builder-site';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  return true;
}

function localRoot(): string {
  return path.join(process.cwd(), 'runtime-data', 'builder-site');
}

// ─── Site document ────────────────────────────────────────────────

export async function readSiteDocument(siteId: string, locale: Locale): Promise<BuilderSiteDocument> {
  const pathname = `${BLOB_PREFIX}/${siteId}/site.json`;
  if (isBlobBackend()) {
    try {
      const result = await get(pathname, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return normalizeSiteDocumentLifecycle(JSON.parse(text) as BuilderSiteDocument);
      }
    } catch { /* fallthrough */ }
  } else {
    try {
      const text = await readFile(path.join(localRoot(), siteId, 'site.json'), 'utf8');
      return normalizeSiteDocumentLifecycle(JSON.parse(text) as BuilderSiteDocument);
    } catch { /* fallthrough */ }
  }
  // First-time bootstrap: persist the default site doc so future reads get a
  // stable pageId. Without this, every read creates a new home pageId and
  // orphans the canvas/publish state.
  const fresh = createDefaultSiteDocument(locale);
  try {
    await writeSiteDocument(fresh);
  } catch {
    // Best-effort — if write fails, editor still works with in-memory doc
    // but publish may 404 until persisted.
  }
  return fresh;
}

export async function writeSiteDocument(doc: BuilderSiteDocument): Promise<void> {
  const pathname = `${BLOB_PREFIX}/${doc.siteId}/site.json`;
  const json = JSON.stringify(doc);
  if (isBlobBackend()) {
    await put(pathname, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
  } else {
    const dir = path.join(localRoot(), doc.siteId);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'site.json'), json, 'utf8');
  }
}

// ─── Page canvas documents ────────────────────────────────────────

type PageVariant = 'draft' | 'published';

function pagePathname(siteId: string, pageId: string, variant: PageVariant): string {
  const suffix = variant === 'draft' ? 'draft.json' : 'published.json';
  return `${BLOB_PREFIX}/${siteId}/pages/${pageId}.${suffix}`;
}

export async function readPageCanvas(
  siteId: string,
  pageId: string,
  variant: PageVariant,
): Promise<BuilderCanvasDocument | null> {
  const pn = pagePathname(siteId, pageId, variant);
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

export async function writePageCanvas(
  siteId: string,
  pageId: string,
  variant: PageVariant,
  doc: BuilderCanvasDocument,
): Promise<void> {
  const pn = pagePathname(siteId, pageId, variant);
  const json = JSON.stringify(doc);
  if (isBlobBackend()) {
    await put(pn, json, { access: 'private', allowOverwrite: true, contentType: 'application/json' });
  } else {
    const filePath = path.join(localRoot(), pn.replace(`${BLOB_PREFIX}/`, ''));
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, json, 'utf8');
  }
}

// ─── Page CRUD ────────────────────────────────────────────────────

export async function createPage(
  siteId: string,
  locale: Locale,
  slug: string,
  title: string,
): Promise<BuilderPageMeta> {
  const site = await readSiteDocument(siteId, locale);
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

export async function deletePage(siteId: string, pageId: string, locale: Locale): Promise<void> {
  const site = await readSiteDocument(siteId, locale);
  site.pages = site.pages.filter((p) => p.pageId !== pageId);
  site.navigation = site.navigation.filter((n) => n.pageId !== pageId);
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
}

export async function listPages(siteId: string, locale: Locale): Promise<BuilderPageMeta[]> {
  const site = await readSiteDocument(siteId, locale);
  return site.pages;
}

function normalizeSiteDocumentLifecycle(site: BuilderSiteDocument): BuilderSiteDocument {
  return {
    ...site,
    pages: site.pages.map((page) => ({
      ...page,
      lifecycle:
        page.lifecycle ??
        createDefaultPageLifecycleMeta(page.documentKind ?? 'section-snapshot-v1'),
    })),
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
