import type { BlogPost } from '@/lib/builder/blog/blog-engine';

export type InsightsPreviewLocale = 'ko' | 'zh-hant' | 'en';

type BuilderBlogPostsPayload = {
  ok?: boolean;
  posts?: unknown;
};

type InsightsPreviewCacheEntry = {
  promise: Promise<BlogPost[]>;
  posts?: BlogPost[];
};

const insightsPreviewPostsCache = new Map<InsightsPreviewLocale, InsightsPreviewCacheEntry>();

function insightsPreviewPostsUrl(locale: InsightsPreviewLocale): string {
  const params = new URLSearchParams({
    locale,
    sort: 'newest',
    limit: '100',
    scope: 'all',
  });
  return `/api/builder/blog/posts?${params.toString()}`;
}

function isBlogPostList(value: unknown): value is BlogPost[] {
  return Array.isArray(value);
}

export function clearInsightsPreviewPostsCache(): void {
  insightsPreviewPostsCache.clear();
}

export function loadInsightsPreviewPosts(locale: InsightsPreviewLocale): Promise<BlogPost[]> {
  const cached = insightsPreviewPostsCache.get(locale);
  if (cached?.posts) return Promise.resolve(cached.posts);
  if (cached) return cached.promise;

  const promise = fetch(insightsPreviewPostsUrl(locale))
    .then((response) => response.json() as Promise<BuilderBlogPostsPayload>)
    .then((payload) => {
      const posts = payload.ok && isBlogPostList(payload.posts) ? payload.posts : [];
      const current = insightsPreviewPostsCache.get(locale);
      if (current) current.posts = posts;
      return posts;
    })
    .catch(() => {
      insightsPreviewPostsCache.delete(locale);
      return [];
    });

  insightsPreviewPostsCache.set(locale, { promise });
  return promise;
}
