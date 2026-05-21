import type { Locale } from '@/lib/locales';
import type { ColumnDocumentBundle, ColumnFrontmatter } from '@/lib/builder/columns/types';
import { estimateReadingTime } from '@/lib/builder/blog/blog-engine';

export type NativeBlogPostStatus = 'draft' | 'scheduled' | 'published';

export interface NativeBlogAdminPost {
  postId: string;
  slug: string;
  locale: Locale;
  title: string;
  summary: string;
  status: NativeBlogPostStatus;
  hasDraft: boolean;
  hasPublished: boolean;
  draftRevision: number | null;
  publishedRevision: number | null;
  category: string;
  tags: string[];
  authorName: string;
  authorTitle?: string;
  featured: boolean;
  readingTimeMinutes: number;
  scheduledFor?: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface NativeBlogTaxonomySummary {
  id: string;
  label: string;
  count: number;
}

export interface NativeBlogAdminModel {
  locale: Locale;
  posts: NativeBlogAdminPost[];
  authors: NativeBlogTaxonomySummary[];
  categories: NativeBlogTaxonomySummary[];
  tags: NativeBlogTaxonomySummary[];
  counts: {
    total: number;
    draft: number;
    scheduled: number;
    published: number;
  };
}

function futureIso(value: string | undefined, now: Date): string | undefined {
  if (!value) return undefined;
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return undefined;
  return time > now.getTime() ? new Date(time).toISOString() : undefined;
}

export function resolveNativeBlogPostStatus(
  frontmatter: ColumnFrontmatter,
  hasDraft: boolean,
  hasPublished: boolean,
  now = new Date(),
): NativeBlogPostStatus {
  if (futureIso(frontmatter.publishedAt, now)) return 'scheduled';
  if (hasDraft) return 'draft';
  if (hasPublished) return 'published';
  return 'draft';
}

function summarize(values: string[]): NativeBlogTaxonomySummary[] {
  const counts = new Map<string, number>();
  for (const raw of values) {
    const value = raw.trim();
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([id, count]) => ({ id, label: id, count }));
}

export function columnBundleToNativeBlogAdminPost(
  bundle: ColumnDocumentBundle,
  now = new Date(),
): NativeBlogAdminPost | null {
  const preferred = bundle.preferred;
  if (!preferred) return null;
  const frontmatter = preferred.frontmatter;
  const scheduledFor = futureIso(frontmatter.publishedAt, now);
  const status = resolveNativeBlogPostStatus(
    frontmatter,
    Boolean(bundle.draft),
    Boolean(bundle.published),
    now,
  );
  return {
    postId: `${preferred.locale}:${preferred.slug}`,
    slug: preferred.slug,
    locale: preferred.locale,
    title: preferred.title,
    summary: preferred.summary,
    status,
    hasDraft: Boolean(bundle.draft),
    hasPublished: Boolean(bundle.published),
    draftRevision: bundle.draft?.revision ?? null,
    publishedRevision: bundle.published?.revision ?? null,
    category: frontmatter.blogCategory ?? frontmatter.category ?? 'general',
    tags: frontmatter.tags ?? [],
    authorName: frontmatter.author?.name ?? '호정국제 법률사무소',
    ...(frontmatter.author?.title ? { authorTitle: frontmatter.author.title } : {}),
    featured: Boolean(frontmatter.featured),
    readingTimeMinutes: estimateReadingTime(`${preferred.summary} ${preferred.bodyMarkdown} ${preferred.bodyHtml}`),
    ...(scheduledFor ? { scheduledFor } : {}),
    ...(frontmatter.publishedAt ? { publishedAt: frontmatter.publishedAt } : {}),
    updatedAt: preferred.updatedAt,
  };
}

export function buildNativeBlogAdminModel(
  locale: Locale,
  bundles: ColumnDocumentBundle[],
  now = new Date(),
): NativeBlogAdminModel {
  const posts = bundles
    .map((bundle) => columnBundleToNativeBlogAdminPost(bundle, now))
    .filter((post): post is NativeBlogAdminPost => Boolean(post))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

  const counts = {
    total: posts.length,
    draft: posts.filter((post) => post.status === 'draft').length,
    scheduled: posts.filter((post) => post.status === 'scheduled').length,
    published: posts.filter((post) => post.status === 'published').length,
  };

  return {
    locale,
    posts,
    authors: summarize(posts.map((post) => post.authorName)),
    categories: summarize(posts.map((post) => post.category)),
    tags: summarize(posts.flatMap((post) => post.tags)),
    counts,
  };
}
