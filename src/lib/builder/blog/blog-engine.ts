/**
 * Phase 14 — Blog Module.
 *
 * BLG-01: Blog feed page model
 * BLG-02: Post detail page template
 * BLG-03: Categories & tags
 * BLG-04: CMS-backed blog on top of existing column system
 *
 * The blog module extends the existing Column CMS (Sprint 0) with
 * blog-specific features: feed layouts, categories, author info,
 * reading time, featured posts.
 */

import type { Locale } from '@/lib/locales';

// ─── Blog Post Model (extends ColumnDocument) ─────────────────────

export interface BlogPost {
  postId: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  bodyHtml: string;
  bodyMarkdown: string;
  featuredImage?: string;
  author: BlogAuthor;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  publishedAt?: string;
  updatedAt: string;
  featured: boolean;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  linkedPosts?: Partial<Record<Locale, string>>;
}

export interface BlogAuthor {
  name: string;
  photo?: string;
  title?: string;
  bio?: string;
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: Record<Locale, string>;
  description?: Record<Locale, string>;
  color?: string;
  postCount: number;
}

// ─── Feed Layout ──────────────────────────────────────────────────

export type BlogFeedLayout = 'grid' | 'list' | 'masonry' | 'featured-hero';

export interface BlogFeedConfig {
  layout: BlogFeedLayout;
  postsPerPage: number;
  showExcerpt: boolean;
  showAuthor: boolean;
  showDate: boolean;
  showReadingTime: boolean;
  showCategory: boolean;
  showTags: boolean;
  showFeaturedImage: boolean;
  filterByCategory?: string;
  filterByTag?: string;
  sortBy: 'newest' | 'oldest' | 'featured-first';
}

export const DEFAULT_FEED_CONFIG: BlogFeedConfig = {
  layout: 'grid',
  postsPerPage: 9,
  showExcerpt: true,
  showAuthor: true,
  showDate: true,
  showReadingTime: true,
  showCategory: true,
  showTags: false,
  showFeaturedImage: true,
  sortBy: 'newest',
};

// ─── Reading Time ─────────────────────────────────────────────────

export function estimateReadingTime(text: string): number {
  // ~200 chars per minute for mixed CJK/Latin legal text
  return Math.max(1, Math.round(text.length / 200));
}

// ─── Post Sorting/Filtering ───────────────────────────────────────

export function sortPosts(posts: BlogPost[], sortBy: BlogFeedConfig['sortBy']): BlogPost[] {
  const sorted = [...posts];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => (b.publishedAt || b.updatedAt).localeCompare(a.publishedAt || a.updatedAt));
    case 'oldest':
      return sorted.sort((a, b) => (a.publishedAt || a.updatedAt).localeCompare(b.publishedAt || b.updatedAt));
    case 'featured-first':
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.publishedAt || b.updatedAt).localeCompare(a.publishedAt || a.updatedAt);
      });
    default:
      return sorted;
  }
}

export function filterPosts(
  posts: BlogPost[],
  config: { category?: string; tag?: string; locale?: Locale },
): BlogPost[] {
  let filtered = posts;
  if (config.locale) {
    filtered = filtered.filter((p) => p.locale === config.locale);
  }
  if (config.category) {
    filtered = filtered.filter((p) => p.category === config.category);
  }
  if (config.tag) {
    filtered = filtered.filter((p) => p.tags.includes(config.tag!));
  }
  return filtered;
}

export function paginatePosts(
  posts: BlogPost[],
  page: number,
  perPage: number,
): { posts: BlogPost[]; totalPages: number; currentPage: number } {
  const totalPages = Math.ceil(posts.length / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * perPage;
  return {
    posts: posts.slice(start, start + perPage),
    totalPages,
    currentPage,
  };
}

// ─── Default categories for law firm ──────────────────────────────

export const DEFAULT_BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'company', slug: 'company-setup', name: { ko: '회사설립', 'zh-hant': '公司設立', en: 'Company Setup' }, postCount: 0, color: '#3b82f6' },
  { id: 'traffic', slug: 'traffic-accident', name: { ko: '교통사고', 'zh-hant': '交通事故', en: 'Traffic Accident' }, postCount: 0, color: '#ef4444' },
  { id: 'labor', slug: 'labor', name: { ko: '노동법', 'zh-hant': '勞動法', en: 'Labor Law' }, postCount: 0, color: '#10b981' },
  { id: 'family', slug: 'family-law', name: { ko: '이혼/가사', 'zh-hant': '離婚/家事', en: 'Family Law' }, postCount: 0, color: '#f59e0b' },
  { id: 'criminal', slug: 'criminal', name: { ko: '형사', 'zh-hant': '刑事', en: 'Criminal' }, postCount: 0, color: '#8b5cf6' },
  { id: 'inheritance', slug: 'inheritance', name: { ko: '상속', 'zh-hant': '繼承', en: 'Inheritance' }, postCount: 0, color: '#06b6d4' },
  { id: 'general', slug: 'general', name: { ko: '일반', 'zh-hant': '一般', en: 'General' }, postCount: 0, color: '#6b7280' },
];
