/**
 * Phase 14 — Column → BlogPost adapter.
 *
 * Bridges the Sprint-0 Column CMS to the new Blog widget system.
 * Reads frontmatter blog meta added in Phase 14 (blogCategory, tags,
 * author, featuredImage, featured, publishedAt, seo) with safe fallbacks
 * for legacy columns that predate those fields.
 */

import type { Locale } from '@/lib/locales';
import { listColumnBundles } from '@/lib/builder/columns/storage';
import type { ColumnDocument } from '@/lib/builder/columns/types';
import { estimateReadingTime, type BlogPost } from './blog-engine';

const DEFAULT_AUTHOR = { name: '호정국제 법률사무소' } as const;

export function columnToBlogPost(column: ColumnDocument): BlogPost {
  const fm = column.frontmatter ?? ({} as ColumnDocument['frontmatter']);

  // Map legacy `category` (formation/legal/case) onto a stable slug if
  // blogCategory isn't set — keeps existing posts grouped sensibly.
  const legacyCategoryFallback = fm.category
    ? fm.category === 'formation'
      ? 'company-setup'
      : fm.category === 'case'
        ? 'general'
        : 'general'
    : 'general';

  return {
    postId: column.slug,
    slug: column.slug,
    locale: column.locale,
    title: column.title,
    excerpt: column.summary,
    bodyHtml: column.bodyHtml,
    bodyMarkdown: column.bodyMarkdown,
    featuredImage: fm.featuredImage,
    author: fm.author ?? { ...DEFAULT_AUTHOR },
    category: fm.blogCategory ?? legacyCategoryFallback,
    tags: fm.tags ?? [],
    readingTimeMinutes: estimateReadingTime(column.bodyMarkdown || column.summary || ''),
    publishedAt: fm.publishedAt,
    updatedAt: column.updatedAt,
    featured: fm.featured ?? false,
    seo: fm.seo
      ? {
          title: fm.seo.title,
          description: fm.seo.description,
          ogImage: fm.seo.ogImage,
        }
      : undefined,
  };
}

/**
 * List ALL posts (draft + published) — admin/builder consumption.
 */
export async function listAllBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const bundles = await listColumnBundles(locale);
  return bundles
    .map((bundle) => bundle.preferred)
    .filter((doc): doc is ColumnDocument => Boolean(doc))
    .map(columnToBlogPost);
}

/**
 * List PUBLISHED-ONLY posts — public consumption (blog feed on live site).
 * Filters out drafts so unpublished content never leaks.
 */
export async function listBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const bundles = await listColumnBundles(locale);
  return bundles
    .map((bundle) => bundle.published)
    .filter((doc): doc is ColumnDocument => Boolean(doc))
    .map(columnToBlogPost);
}
