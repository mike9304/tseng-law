import { get, list } from '@vercel/blob';
import type { Locale } from '@/lib/locales';
import type { ColumnPost, ColumnCategory } from '@/lib/columns';
import { getAllColumnPosts } from '@/lib/columns';
import { listColumnBundles } from '@/lib/builder/columns/storage';
import type { ColumnDocument } from '@/lib/builder/columns/types';

/**
 * Blob-aware column reader that merges file-based legal columns
 * (`src/content/columns/*.md`) with newly authored columns stored in
 * Vercel Blob (`consultation-columns/{locale}/{slug}.published.json`).
 *
 * Background: Sprint 0 of the builder plan ships a CMS that lets the
 * lawyer publish legal columns at runtime through Vercel Blob. Those
 * columns must flow into the AI consultant the same way the existing
 * file-based columns do — same `ColumnPost` shape, same caching, same
 * embedding rebuild path. This module is the single bridge.
 *
 * Backend selector mirrors `log-storage.ts` (Wave 5b):
 * - `BLOB_READ_WRITE_TOKEN` not set → file-only (CI / local without token)
 * - `CONSULTATION_LOG_BACKEND=local` → file-only (local review)
 * - otherwise → file + Blob merge
 *
 * Slug collisions: Blob takes priority over file. Rationale: a file
 * column can be re-authored in the CMS to fix a typo, and the new
 * version should win. The file copy stays as a fallback if the Blob
 * read errors out.
 */

const BLOB_PREFIX = 'consultation-columns/';
const VISUAL_LOAD_MORE_TEST_SLUG_PREFIX = 'visual-load-more';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
  if (process.env.BUILDER_COLUMNS_BACKEND === 'local') return false;
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return false;
  return true;
}

/**
 * Shape of a column document persisted by the Sprint 0 column CMS.
 * The S0-02 endpoint writes this; we only read it here.
 *
 * NOTE: this interface is duplicated from the Sprint 0 task spec on
 * purpose — we don't depend on the builder package to keep the
 * consultation engine independent. If S0-02 changes the shape, this
 * file is the canonical reader and must be updated in lockstep.
 */
interface ColumnDocumentFromBlob {
  version: 1;
  slug: string;
  locale: Locale;
  title: string;
  summary: string;
  bodyMarkdown?: string;
  bodyHtml?: string;
  frontmatter?: {
    lastmod?: string;
    attorneyReviewStatus?: 'pending' | 'reviewed' | 'needs-revision';
    freshness?: 'fresh' | 'review_needed' | 'unknown';
    category?: string;
    blogCategory?: string;
    tags?: string[];
    author?: {
      name?: string;
      title?: string;
      bio?: string;
      photo?: string;
    };
    featuredImage?: string;
    publishedAt?: string;
  };
  linkedSlugs?: { ko?: string; 'zh-hant'?: string; en?: string };
  draft?: boolean;
  revision?: number;
  updatedAt?: string;
  updatedBy?: string;
}

/** Convert a Blob-stored column document into the internal ColumnPost shape. */
function blobDocToColumnPost(doc: ColumnDocumentFromBlob): ColumnPost {
  const category: ColumnCategory =
    doc.frontmatter?.category === 'formation' || doc.frontmatter?.category === 'legal' || doc.frontmatter?.category === 'case'
      ? doc.frontmatter.category
      : 'legal';
  const dateIso = doc.frontmatter?.lastmod || doc.updatedAt || new Date().toISOString();
  const dateDisplay = dateIso.slice(0, 10);
  // Body is whatever the editor produced — prefer markdown for AI ingestion
  // since the column-knowledge stripMarkdown flow expects markdown-ish text.
  const content = doc.bodyMarkdown || stripHtml(doc.bodyHtml || '') || doc.summary || '';
  return {
    slug: doc.slug,
    title: doc.title || doc.slug,
    date: dateIso,
    dateDisplay,
    readTime: estimateReadTime(content),
    category,
    categoryLabel: categoryLabel(category, doc.locale),
    blogCategory: doc.frontmatter?.blogCategory || legacyCategoryToBlogCategory(category),
    authorName: doc.frontmatter?.author?.name,
    tags: doc.frontmatter?.tags ?? [],
    featuredImage: doc.frontmatter?.featuredImage || '',
    content,
    summary: doc.summary || '',
  };
}

function builderDocToColumnPost(doc: ColumnDocument): ColumnPost {
  const category: ColumnCategory =
    doc.frontmatter.category === 'formation' || doc.frontmatter.category === 'legal' || doc.frontmatter.category === 'case'
      ? doc.frontmatter.category
      : 'legal';
  const content = doc.bodyMarkdown || stripHtml(doc.bodyHtml || '') || doc.summary || '';
  const dateIso = doc.frontmatter.publishedAt || doc.frontmatter.lastmod || doc.updatedAt;
  return {
    slug: doc.slug,
    title: doc.title || doc.slug,
    date: dateIso,
    dateDisplay: dateIso.slice(0, 10),
    readTime: estimateReadTime(content),
    category,
    categoryLabel: categoryLabel(category, doc.locale),
    blogCategory: doc.frontmatter.blogCategory || legacyCategoryToBlogCategory(category),
    authorName: doc.frontmatter.author?.name,
    tags: doc.frontmatter.tags ?? [],
    featuredImage: doc.frontmatter.featuredImage || '',
    content,
    summary: doc.summary || '',
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function estimateReadTime(content: string): string {
  // ~200 chars per "minute" of reading for mixed CJK / latin legal text.
  const minutes = Math.max(1, Math.round(content.length / 200));
  return `${minutes} min`;
}

function categoryLabel(category: ColumnCategory, locale: Locale): string {
  if (locale === 'zh-hant') {
    const map: Record<ColumnCategory, string> = { formation: '公司設立', legal: '法律資訊', case: '訴訟案例' };
    return map[category];
  }
  if (locale === 'en') {
    const map: Record<ColumnCategory, string> = { formation: 'Company Setup', legal: 'Legal Information', case: 'Case Study' };
    return map[category];
  }
  const map: Record<ColumnCategory, string> = { formation: '법인설립', legal: '법률정보', case: '소송사례' };
  return map[category];
}

function legacyCategoryToBlogCategory(category: ColumnCategory): string {
  if (category === 'formation') return 'company-formation';
  return 'general';
}

function isMirroredLoadMoreTestPost(post: ColumnPost): boolean {
  // Hard-coded quarantine for one-off visual load-more QA posts that were
  // accidentally mirrored into the local Blob data; real authored columns do
  // not use this slug prefix.
  return post.slug.startsWith(VISUAL_LOAD_MORE_TEST_SLUG_PREFIX);
}

/**
 * In-memory cache of Blob-sourced posts, keyed by locale.
 *
 * TTL is deliberately SHORT: this cache is per-lambda-instance, so
 * invalidateBlobColumnsCache() after a publish/delete only reaches the
 * instance that handled the mutation — every other instance keeps serving
 * the stale list until expiry. At the previous 5-minute TTL a deleted
 * column stayed publicly readable (200, full body) for up to 5 minutes
 * (measured 2026-07-07 on post-mrabyzjk). 45s keeps the blob list cost
 * negligible while admin actions reflect near-immediately.
 */
const CACHE_TTL_MS = 45 * 1000;
const blobPostsCache = new Map<Locale, { posts: ColumnPost[]; expires: number }>();

async function listBlobPostsForLocale(locale: Locale): Promise<ColumnPost[]> {
  const now = Date.now();
  const cached = blobPostsCache.get(locale);
  if (cached && cached.expires > now) return cached.posts;

  let out: ColumnPost[] = [];
  try {
    const result = await list({ prefix: `${BLOB_PREFIX}${locale}/` });
    // Only published variants — drafts live alongside but are skipped here.
    const publishedBlobs = result.blobs.filter((b) => b.pathname.endsWith('.published.json'));
    // Fetch in parallel: the previous sequential loop cost ~100ms × N posts
    // (3–4s page loads on the column manager and public archive with 30+
    // published columns).
    const fetched = await Promise.all(publishedBlobs.map(async (blob) => {
      try {
        const doc = await get(blob.pathname, { access: 'private', useCache: false });
        if (!doc || doc.statusCode !== 200 || !doc.stream) return null;
        const text = await new Response(doc.stream).text();
        const parsed = JSON.parse(text) as ColumnDocumentFromBlob;
        if (parsed.version !== 1 || !parsed.slug) return null;
        return blobDocToColumnPost(parsed);
      } catch (error) {
        console.warn('[columns-blob-reader] failed to read blob', blob.pathname, error);
        return null;
      }
    }));
    out = fetched.filter((post): post is ColumnPost => post !== null);
  } catch (error) {
    // List failure (auth, network, missing token) — degrade silently to
    // file-only. The caller already handles an empty blob list.
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[columns-blob-reader] blob list failed:', error);
    }
  }

  blobPostsCache.set(locale, { posts: out, expires: now + CACHE_TTL_MS });
  return out;
}

async function listBuilderStoragePostsForLocale(locale: Locale): Promise<ColumnPost[]> {
  try {
    const bundles = await listColumnBundles(locale);
    return bundles
      .map((bundle) => bundle.published)
      .filter((doc): doc is ColumnDocument => Boolean(doc))
      .map(builderDocToColumnPost);
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[columns-blob-reader] builder storage list failed:', error);
    }
    return [];
  }
}

/** For testing/admin endpoints — drop the Blob cache so the next read goes to network. */
export function invalidateBlobColumnsCache(locale?: Locale): void {
  if (locale) {
    blobPostsCache.delete(locale);
  } else {
    blobPostsCache.clear();
  }
}

/**
 * Merged column reader: file-based posts + Blob-sourced posts in a
 * single deduped array. Slug collisions resolve to the Blob version
 * (newer authoring source). When Blob backend is disabled (no token /
 * `CONSULTATION_LOG_BACKEND=local`), this returns the file list as-is.
 *
 * This is the function the AI consultant retrieval and embedding
 * builder should call instead of `getAllColumnPosts` directly.
 */
export async function getAllColumnPostsIncludingBlob(locale: Locale): Promise<ColumnPost[]> {
  const filePosts = getAllColumnPosts(locale);
  const builderPosts = await listBuilderStoragePostsForLocale(locale);
  const blobPosts = isBlobBackend() ? await listBlobPostsForLocale(locale) : [];

  if (builderPosts.length === 0 && blobPosts.length === 0) return filePosts;

  // faq lives only in file frontmatter (src/content/columns/*.md); it is not
  // part of the builder/Blob ColumnDocument shape. A builder/Blob post that
  // shadows a file post by slug would therefore drop the FAQ and break the
  // FAQPage JSON-LD, so backfill faq from the file copy by slug.
  const fileFaqBySlug = new Map<string, NonNullable<ColumnPost['faq']>>();
  for (const post of filePosts) {
    if (post.faq && post.faq.length > 0) fileFaqBySlug.set(post.slug, post.faq);
  }

  // Merge: builder storage first (local/blob published overlays), then direct
  // Blob fallback, then file entries whose slug isn't already covered.
  const merged: ColumnPost[] = [];
  const seen = new Set<string>();
  for (const post of [...builderPosts, ...blobPosts, ...filePosts]) {
    if (isMirroredLoadMoreTestPost(post)) continue;
    if (seen.has(post.slug)) continue;
    const faq = post.faq ?? fileFaqBySlug.get(post.slug);
    merged.push(faq ? { ...post, faq } : post);
    seen.add(post.slug);
  }
  return merged;
}
