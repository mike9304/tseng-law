import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import { filterPosts, sortPosts } from '@/lib/builder/blog/blog-engine';
import type { BuilderBlogFeedCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import type { BlogFeedCopy } from './blog-feed-copy';

export interface FeedItem {
  postId: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  featured: boolean;
  featuredImage?: string;
  authorName: string;
  date: string;
  href: string;
}

interface BlogPostsPayload {
  posts: BlogPost[];
  total: number;
}

function fmtDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBlogPost(value: unknown): value is BlogPost {
  if (!isRecord(value) || !isRecord(value.author)) return false;
  return typeof value.postId === 'string'
    && typeof value.slug === 'string'
    && typeof value.locale === 'string'
    && typeof value.title === 'string'
    && typeof value.excerpt === 'string'
    && typeof value.bodyHtml === 'string'
    && typeof value.bodyMarkdown === 'string'
    && typeof value.category === 'string'
    && Array.isArray(value.tags)
    && typeof value.readingTimeMinutes === 'number'
    && typeof value.updatedAt === 'string'
    && typeof value.featured === 'boolean'
    && typeof value.author.name === 'string';
}

export function parseBlogPostsPayload(value: unknown): BlogPostsPayload | null {
  if (!isRecord(value) || value.ok !== true || !Array.isArray(value.posts) || typeof value.total !== 'number') {
    return null;
  }

  return {
    posts: value.posts.filter(isBlogPost),
    total: value.total,
  };
}

export function toFeedItem(post: BlogPost, isBuilder: boolean, locale: Locale): FeedItem {
  return {
    postId: post.postId,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags ?? [],
    readingTimeMinutes: post.readingTimeMinutes,
    featured: post.featured,
    featuredImage: post.featuredImage,
    authorName: post.author?.name ?? '',
    date: fmtDate(post.publishedAt ?? post.updatedAt),
    href: isBuilder ? `#${post.slug}` : `/${locale}/columns/${post.slug}`,
  };
}

function createMockPosts(locale: Locale, copy: BlogFeedCopy): BlogPost[] {
  return copy.element.mockPosts.map((post, index) => ({
    postId: `mock-${index + 1}`,
    slug: `mock-${index + 1}`,
    locale,
    title: post.title,
    excerpt: post.excerpt,
    bodyHtml: '',
    bodyMarkdown: '',
    category: post.category,
    tags: post.tags,
    readingTimeMinutes: post.readingTimeMinutes,
    featured: post.featured,
    author: { name: copy.element.mockAuthorName },
    publishedAt: post.publishedAt,
    updatedAt: post.publishedAt,
  }));
}

export function getMockPosts(
  content: BuilderBlogFeedCanvasNode['content'],
  postsPerPage: number,
  locale: Locale,
  copy: BlogFeedCopy,
): BlogPost[] {
  const filtered = filterPosts(createMockPosts(locale, copy), {
    category: content.filterByCategory,
    tag: content.filterByTag,
    locale,
  });
  return sortPosts(filtered, content.sortBy).slice(0, postsPerPage);
}
