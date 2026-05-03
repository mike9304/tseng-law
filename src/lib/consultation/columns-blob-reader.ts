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

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return false;
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

/**
 * In-memory cache of Blob-sourced posts, keyed by locale. Mirrors the
 * 5-minute TTL on the file cache in `column-knowledge.ts` so that the
 * merged list refreshes after a publish without forcing every chat
 * request to re-list the blob bucket.
 */
const CACHE_TTL_MS = 5 * 60 * 1000;
const blobPostsCache = new Map<Locale, { posts: ColumnPost[]; expires: number }>();

async function listBlobPostsForLocale(locale: Locale): Promise<ColumnPost[]> {
  const now = Date.now();
  const cached = blobPostsCache.get(locale);
  if (cached && cached.expires > now) return cached.posts;

  const out: ColumnPost[] = [];
  try {
    const result = await list({ prefix: `${BLOB_PREFIX}${locale}/` });
    // Only published variants — drafts live alongside but are skipped here.
    const publishedBlobs = result.blobs.filter((b) => b.pathname.endsWith('.published.json'));
    for (const blob of publishedBlobs) {
      try {
        const doc = await get(blob.pathname, { access: 'private', useCache: false });
        if (!doc || doc.statusCode !== 200 || !doc.stream) continue;
        const text = await new Response(doc.stream).text();
        const parsed = JSON.parse(text) as ColumnDocumentFromBlob;
        if (parsed.version !== 1 || !parsed.slug) continue;
        out.push(blobDocToColumnPost(parsed));
      } catch (error) {
        console.warn('[columns-blob-reader] failed to read blob', blob.pathname, error);
      }
    }
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

  // Merge: builder storage first (local/blob published overlays), then direct
  // Blob fallback, then file entries whose slug isn't already covered.
  const merged: ColumnPost[] = [...builderPosts, ...blobPosts];
  const seen = new Set(merged.map((p) => p.slug));
  for (const fp of filePosts) {
    if (seen.has(fp.slug)) continue;
    merged.push(fp);
    seen.add(fp.slug);
  }
  return merged;
}
