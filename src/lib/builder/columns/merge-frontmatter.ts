import type { ColumnFrontmatter, ColumnTypography } from '@/lib/builder/columns/types';
import { columnTypographySchema } from '@/lib/builder/columns/types';

/**
 * Merge PATCH frontmatter onto the base document frontmatter.
 * - undefined field: preserve
 * - null: clear optional field
 * - value: set (with light validation for enums / typography)
 * Always refreshes lastmod to `now` unless incoming.lastmod is a string.
 */
export function mergeFrontmatter(
  base: ColumnFrontmatter,
  incoming: Record<string, unknown> | undefined,
  now: string,
): ColumnFrontmatter {
  const next: ColumnFrontmatter = {
    ...base,
    lastmod: now,
  };
  if (!incoming) return next;

  if (typeof incoming.lastmod === 'string') next.lastmod = incoming.lastmod;
  if (
    incoming.attorneyReviewStatus === 'pending' ||
    incoming.attorneyReviewStatus === 'reviewed' ||
    incoming.attorneyReviewStatus === 'needs-revision'
  ) {
    next.attorneyReviewStatus = incoming.attorneyReviewStatus;
  }
  if (
    incoming.freshness === 'fresh' ||
    incoming.freshness === 'review_needed' ||
    incoming.freshness === 'unknown'
  ) {
    next.freshness = incoming.freshness;
  }
  if (incoming.category === null) {
    delete next.category;
  } else if (
    incoming.category === 'formation' ||
    incoming.category === 'legal' ||
    incoming.category === 'case'
  ) {
    next.category = incoming.category;
  }

  // Phase 14 blog meta — null clears, undefined preserves, value sets.
  if ('blogCategory' in incoming) {
    if (incoming.blogCategory === null) delete next.blogCategory;
    else if (typeof incoming.blogCategory === 'string') next.blogCategory = incoming.blogCategory;
  }
  if ('tags' in incoming) {
    if (incoming.tags === null) delete next.tags;
    else if (Array.isArray(incoming.tags)) {
      next.tags = incoming.tags.filter((t): t is string => typeof t === 'string');
    }
  }
  if ('author' in incoming) {
    if (incoming.author === null) delete next.author;
    else if (incoming.author && typeof incoming.author === 'object') {
      next.author = incoming.author as ColumnFrontmatter['author'];
    }
  }
  if ('featuredImage' in incoming) {
    if (incoming.featuredImage === null) delete next.featuredImage;
    else if (typeof incoming.featuredImage === 'string') next.featuredImage = incoming.featuredImage;
  }
  if ('featured' in incoming) {
    if (incoming.featured === null) delete next.featured;
    else if (typeof incoming.featured === 'boolean') next.featured = incoming.featured;
  }
  if ('publishedAt' in incoming) {
    if (incoming.publishedAt === null) delete next.publishedAt;
    else if (typeof incoming.publishedAt === 'string') next.publishedAt = incoming.publishedAt;
  }
  if ('seo' in incoming) {
    if (incoming.seo === null) delete next.seo;
    else if (incoming.seo && typeof incoming.seo === 'object') {
      next.seo = incoming.seo as ColumnFrontmatter['seo'];
    }
  }

  // Typography presets — null clears (locale default at render); invalid values ignored (preserve).
  if ('typography' in incoming) {
    if (incoming.typography === null) {
      delete next.typography;
    } else if (incoming.typography && typeof incoming.typography === 'object') {
      const parsed = columnTypographySchema.safeParse(incoming.typography);
      if (parsed.success) {
        next.typography = parsed.data as ColumnTypography;
      }
    }
  }

  return next;
}
