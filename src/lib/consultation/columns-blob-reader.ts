import { get, list } from '@vercel/blob';
import type { Locale } from '@/lib/locales';
import type { ColumnPost, ColumnCategory } from '@/lib/columns';
import {
  formatColumnPublicationDate,
  getAllColumnPosts,
  parseColumnPublicationDate,
  sortColumnPostsNewestFirst,
} from '@/lib/columns';
import { estimateColumnReadTimeLabel, listColumnBundles } from '@/lib/builder/columns/storage';
import type { ColumnDocument } from '@/lib/builder/columns/types';
import { filterPublicColumnPosts } from '@/lib/builder/columns/public-post-filter';
import { resolveColumnTopic } from '@/lib/column-topics';
import { removeColumnBoldEmphasis } from '@/lib/column-emphasis';

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
    dateDisplay?: string;
    readTime?: string;
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
    typography?: {
      presetId?: string;
      bodySize?: 'sm' | 'md' | 'lg';
      headingWeight?: '500' | '600' | '700';
      lineHeight?: 'tight' | 'normal' | 'relaxed';
    };
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
  const dateIso = doc.frontmatter?.lastmod || doc.updatedAt || '';
  const publicationDate = parseColumnPublicationDate(doc.frontmatter?.publishedAt)
    || parseColumnPublicationDate(doc.frontmatter?.dateDisplay);
  const dateDisplay = formatColumnPublicationDate(
    publicationDate,
    doc.locale,
    doc.frontmatter?.dateDisplay || '',
  );
  // Body is whatever the editor produced — prefer markdown for AI ingestion
  // since the column-knowledge stripMarkdown flow expects markdown-ish text.
  const content = removeColumnBoldEmphasis(doc.bodyMarkdown || stripHtml(doc.bodyHtml || '') || doc.summary || '');
  const typography = normalizeTypography(doc.frontmatter?.typography);
  return {
    slug: doc.slug,
    title: removeColumnBoldEmphasis(doc.title || doc.slug),
    publicationDate,
    date: dateIso,
    dateDisplay,
    readTime: doc.frontmatter?.readTime || estimateReadTime(content, doc.locale),
    category,
    categoryLabel: categoryLabel(category, doc.locale),
    topic: resolveColumnTopic(doc.slug, (doc.frontmatter as { topic?: unknown } | undefined)?.topic
      ?? getAllColumnPosts(doc.locale).find((post) => post.slug === doc.slug)?.topic, category),
    blogCategory: doc.frontmatter?.blogCategory || legacyCategoryToBlogCategory(category),
    authorName: doc.frontmatter?.author?.name,
    tags: doc.frontmatter?.tags ?? [],
    featuredImage: doc.frontmatter?.featuredImage || '',
    content,
    summary: removeColumnBoldEmphasis(doc.summary || ''),
    ...(typography
      ? {
          typography,
          typographyPresetId: typography.presetId,
        }
      : {}),
  };
}

function builderDocToColumnPost(doc: ColumnDocument): ColumnPost {
  const category: ColumnCategory =
    doc.frontmatter.category === 'formation' || doc.frontmatter.category === 'legal' || doc.frontmatter.category === 'case'
      ? doc.frontmatter.category
      : 'legal';
  const content = removeColumnBoldEmphasis(doc.bodyMarkdown || stripHtml(doc.bodyHtml || '') || doc.summary || '');
  const dateIso = doc.frontmatter.lastmod || doc.updatedAt;
  const publicationDate = parseColumnPublicationDate(doc.frontmatter.publishedAt)
    || parseColumnPublicationDate(doc.frontmatter.dateDisplay);
  const typography = normalizeTypography(doc.frontmatter.typography);
  return {
    slug: doc.slug,
    title: removeColumnBoldEmphasis(doc.title || doc.slug),
    publicationDate,
    date: dateIso,
    dateDisplay: formatColumnPublicationDate(
      publicationDate,
      doc.locale,
      doc.frontmatter.dateDisplay || '',
    ),
    readTime: doc.frontmatter.readTime || estimateReadTime(content, doc.locale),
    category,
    categoryLabel: categoryLabel(category, doc.locale),
    topic: resolveColumnTopic(doc.slug, (doc.frontmatter as { topic?: unknown }).topic
      ?? getAllColumnPosts(doc.locale).find((post) => post.slug === doc.slug)?.topic, category),
    blogCategory: doc.frontmatter.blogCategory || legacyCategoryToBlogCategory(category),
    authorName: doc.frontmatter.author?.name,
    tags: doc.frontmatter.tags ?? [],
    featuredImage: doc.frontmatter.featuredImage || '',
    content,
    summary: removeColumnBoldEmphasis(doc.summary || ''),
    ...(typography
      ? {
          typography,
          typographyPresetId: typography.presetId,
        }
      : {}),
  };
}

function normalizeTypography(value: unknown): ColumnPost['typography'] | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const presetId = typeof record.presetId === 'string' ? record.presetId.trim() : '';
  if (!presetId) return undefined;
  return {
    presetId,
    ...(record.bodySize === 'sm' || record.bodySize === 'md' || record.bodySize === 'lg'
      ? { bodySize: record.bodySize }
      : {}),
    ...(record.headingWeight === '500' || record.headingWeight === '600' || record.headingWeight === '700'
      ? { headingWeight: record.headingWeight }
      : {}),
    ...(record.lineHeight === 'tight' || record.lineHeight === 'normal' || record.lineHeight === 'relaxed'
      ? { lineHeight: record.lineHeight }
      : {}),
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function estimateReadTime(content: string, locale: Locale): string {
  return estimateColumnReadTimeLabel(content, locale);
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

  if (builderPosts.length === 0 && blobPosts.length === 0) {
    return filterPublicColumnPosts(filePosts);
  }

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
  const sourceOrderBySlug = new Map(filePosts.map((post, index) => [post.slug, index]));
  let nextSourceOrder = sourceOrderBySlug.size;
  for (const post of [...builderPosts, ...blobPosts]) {
    if (!sourceOrderBySlug.has(post.slug)) {
      sourceOrderBySlug.set(post.slug, nextSourceOrder);
      nextSourceOrder += 1;
    }
  }
  // Likewise `audience`, `author: legal-ai-assistant` and the file number are
  // frontmatter/file-only: keep them when a builder/Blob copy shadows the file
  // so per-locale recommendations and AI bylines survive publishing.
  const fileBySlug = new Map(filePosts.map((post) => [post.slug, post]));
  for (const post of filterPublicColumnPosts([...builderPosts, ...blobPosts, ...filePosts])) {
    if (seen.has(post.slug)) continue;
    const faq = post.faq ?? fileFaqBySlug.get(post.slug);
    const file = fileBySlug.get(post.slug);
    const fileMeta = file && file !== post
      ? {
        ...(post.audience ?? file.audience ? { audience: post.audience ?? file.audience } : {}),
        ...(post.aiAuthored ?? file.aiAuthored ? { aiAuthored: true } : {}),
        ...(post.columnNumber ?? file.columnNumber ? { columnNumber: post.columnNumber ?? file.columnNumber } : {}),
        ...(post.diagramVideo ?? file.diagramVideo ? { diagramVideo: post.diagramVideo ?? file.diagramVideo } : {}),
        // File-derived builder records do not carry image descriptions. Only
        // backfill when the image is identical; a CMS replacement must never
        // inherit the old image's caption, alt or social rendition.
        ...(post.featuredImage === file.featuredImage ? {
          ...(post.featuredImageAlt ?? file.featuredImageAlt ? { featuredImageAlt: post.featuredImageAlt ?? file.featuredImageAlt } : {}),
          ...(post.featuredImageCaption ?? file.featuredImageCaption ? { featuredImageCaption: post.featuredImageCaption ?? file.featuredImageCaption } : {}),
          ...(post.socialImage ?? file.socialImage ? { socialImage: post.socialImage ?? file.socialImage } : {}),
        } : {}),
      }
      : {};
    merged.push(faq || Object.keys(fileMeta).length ? { ...post, ...fileMeta, ...(faq ? { faq } : {}) } : post);
    seen.add(post.slug);
  }
  return sortColumnPostsNewestFirst(merged, sourceOrderBySlug);
}
