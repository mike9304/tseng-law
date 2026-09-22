import { createLazyRead } from './lazy-read.mjs';
import { isBuilderOwnedSlug } from '@/lib/builder/site/public-route-ownership';
import { readPublishedPageCanvas } from '@/lib/builder/site/published-canvas';
import { isEnglishNoindexPath } from '@/lib/seo-visibility';
import type { Locale } from '@/lib/locales';
import { locales } from '@/lib/locales';
import {
  readExistingSiteDocument,
} from '@/lib/builder/site/persistence';
import { listBlogPosts } from '@/lib/builder/blog/column-adapter';
import { listFaqSearchDocs } from '@/lib/builder/faq/faq-engine';
import { listPortfolioSearchDocs } from '@/lib/builder/portfolio/portfolio-engine';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { resolveLocaleSeo } from '@/lib/builder/translations/seo-projection';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
import { isInternalSandboxPage } from '@/lib/builder/site/internal-pages';
import { getAllColumnPosts } from '@/lib/columns';
import type { SearchDoc } from './types';

export class SearchCurrentDataUnavailableError extends Error {
  constructor() { super('search_current_data_unavailable'); }
}

/**
 * PR #5 — Collect publishable docs to feed the search index.
 *
 * Pull builder pages, published Blog/Columns posts, FAQ records, and Portfolio
 * projects into a single index source.
 */

function extractTextFromNode(node: BuilderCanvasNode): string {
  const content = (node as { content?: Record<string, unknown> }).content;
  if (!content) return '';
  const out: string[] = [];
  const visit = (value: unknown): void => {
    if (!value) return;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0 && trimmed.length < 2000) out.push(trimmed);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (typeof value === 'object') {
      for (const v of Object.values(value as Record<string, unknown>)) visit(v);
    }
  };
  visit(content);
  return out.join('\n');
}

function extractTextFromDocument(nodes: BuilderCanvasNode[]): string {
  return nodes.map(extractTextFromNode).filter((s) => s.length > 0).join('\n');
}

function isSearchablePage(page: BuilderPageMeta, locale: Locale): boolean {
  if (!page.publishedAt || page.locale !== locale || page.password || page.memberAccess?.requireLogin || page.noIndex || page.seo?.noIndex || isInternalSandboxPage(page)) return false;
  const slug = page.isHomePage ? '' : resolveLocaleSlug(page, locale);
  return isBuilderOwnedSlug(locale, slug) && (locale !== 'en' || !isEnglishNoindexPath('/' + slug));
}
function searchDoc(page: BuilderPageMeta, canvas: BuilderCanvasDocument, locale: Locale): SearchDoc | null {
  if (!isSearchablePage(page, locale) || !canvas.nodes.length || canvas.locale !== locale) return null;
  const slug = page.isHomePage ? '' : resolveLocaleSlug(page, locale);
  const seo = resolveLocaleSeo(page, locale);
  return { id: `page:${locale}:${page.pageId}`, kind: 'page', locale,
    title: page.title[locale] || page.title.ko || page.slug,
    url: buildSitePagePath(locale, slug), summary: seo.description ?? page.seo?.description,
    body: extractTextFromDocument(canvas.nodes), publishedAt: page.publishedAt };
}
/** Exact current target, strict absence/outage distinction; no whole-site canvas hydration. */
export function parseCurrentBuilderSearchTarget(candidate: SearchDoc): {pageId: string; locale: Locale} {
  if (candidate.kind !== 'page' || !locales.includes(candidate.locale as Locale)) throw new SearchCurrentDataUnavailableError();
  const prefix = `page:${candidate.locale}:`;
  if (!candidate.id.startsWith(prefix)) throw new SearchCurrentDataUnavailableError();
  const pageId = candidate.id.slice(prefix.length);
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(pageId)) throw new SearchCurrentDataUnavailableError();
  const locale = candidate.locale as Locale;
  return {pageId, locale};
}
async function readCurrentBuilderSearchDocWithSite(candidate: SearchDoc, siteId: string, readSite: () => ReturnType<typeof readExistingSiteDocument>): Promise<SearchDoc | null> {
  const {pageId, locale} = parseCurrentBuilderSearchTarget(candidate);
  const site = await readSite();
  const page = site?.pages.find(page => page.pageId === pageId);
  if (!page || !isSearchablePage(page, locale)) return null;
  const canvas = await readPublishedPageCanvas(page, siteId);
  return canvas ? searchDoc(page, canvas, locale) : null;
}

/** Standalone callers always perform a fresh strict site read. */
export function readCurrentBuilderSearchDoc(candidate: SearchDoc, siteId = 'default'): Promise<SearchDoc | null> {
  return readCurrentBuilderSearchDocWithSite(candidate, siteId, () => readExistingSiteDocument(siteId));
}
/** One search invocation owns this snapshot, including null/rejection; no cross-query cache. */
export function createCurrentBuilderSearchReader(siteId = 'default') {
  const readSite = createLazyRead(() => readExistingSiteDocument(siteId));
  return (candidate: SearchDoc) => readCurrentBuilderSearchDocWithSite(candidate, siteId, readSite);
}

async function collectPageDocsForLocale(siteId: string, locale: Locale): Promise<SearchDoc[]> {
  // Match the public reader: current publication only, including its designated revision recovery; never draft.
  const site = await readExistingSiteDocument(siteId);
  if (!site) return [];
  const docs: SearchDoc[] = [];
  for (const page of site.pages) {
    if (!isSearchablePage(page, locale)) continue;
    const canvas = await readPublishedPageCanvas(page, siteId);
    const doc = canvas && searchDoc(page, canvas, locale);
    if (doc) docs.push(doc);
  }
  return docs;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function collectBlogDocsForLocale(locale: Locale): Promise<SearchDoc[]> {
  const posts = await listBlogPosts(locale);
  return posts.map((post): SearchDoc => ({
    id: `blog:${locale}:${post.slug}`,
    kind: 'blog',
    locale,
    title: post.title,
    url: `/${locale}/columns/${post.slug}`,
    summary: post.excerpt,
    body: [
      post.excerpt,
      post.bodyMarkdown,
      stripHtml(post.bodyHtml),
      post.author?.name,
      post.author?.title,
      post.category,
      ...(post.tags ?? []),
    ].filter(Boolean).join('\n'),
    publishedAt: post.publishedAt ?? post.updatedAt,
    tags: post.tags,
  }));
}

/**
 * Japanese columns live in `src/content/columns-ja` (file-backed, no builder
 * locale). Mirrors collectBlogDocsForLocale so /ja/search can surface them
 * with /ja/columns links.
 */
function collectJaColumnDocs(): SearchDoc[] {
  return getAllColumnPosts('ja').map((post): SearchDoc => ({
    id: `blog:ja:${post.slug}`,
    kind: 'blog',
    locale: 'ja',
    title: post.title,
    url: `/ja/columns/${post.slug}`,
    summary: post.summary,
    body: [post.summary, post.content, post.categoryLabel].filter(Boolean).join('\n'),
    publishedAt: post.date || undefined,
    tags: post.tags,
  }));
}

export async function collectAllSearchDocs(siteId = 'default'): Promise<SearchDoc[]> {
  const out: SearchDoc[] = [];
  for (const locale of locales) {
    // Authority/site failure must escape even when ancillary source collection is best-effort.
    const pageDocs = await collectPageDocsForLocale(siteId, locale);
    try {
      const [blogDocs, faqDocs, portfolioDocs] = await Promise.all([
        collectBlogDocsForLocale(locale),
        listFaqSearchDocs(locale),
        listPortfolioSearchDocs(locale),
      ]);
      out.push(...pageDocs, ...blogDocs, ...faqDocs, ...portfolioDocs);
    } catch (err) {
      console.warn('[search/source-collector] failed for locale', locale, err);
    }
  }
  // Japanese is file-backed only (no builder locale contract for ja) — collect
  // the columns-ja markdown directory instead of the builder sources above.
  try {
    out.push(...collectJaColumnDocs());
  } catch (err) {
    console.warn('[search/source-collector] failed for locale ja', err);
  }
  return out;
}
