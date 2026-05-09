import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import {
  clearInsightsPreviewPostsCache,
  loadInsightsPreviewPosts,
} from '../insights-preview-cache';

function blogPost(postId: string, locale: BlogPost['locale'] = 'ko'): BlogPost {
  return {
    postId,
    slug: postId,
    locale,
    title: `Post ${postId}`,
    excerpt: 'Excerpt',
    bodyHtml: '<p>Body</p>',
    bodyMarkdown: 'Body',
    author: { name: 'Hojung' },
    category: 'general',
    tags: [],
    readingTimeMinutes: 1,
    updatedAt: '2026-05-09T00:00:00.000Z',
    featured: false,
  };
}

function stubPostsFetch(posts: BlogPost[]) {
  const fetchMock = vi.fn(async (url: string | URL | Request) => {
    void url;
    return {
      json: async () => ({ ok: true, posts }),
    };
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  clearInsightsPreviewPostsCache();
});

describe('insights archive preview cache', () => {
  it('deduplicates concurrent same-locale preview fetches and reuses cached posts', async () => {
    const posts = [blogPost('first'), blogPost('second')];
    const fetchMock = stubPostsFetch(posts);

    const [first, second] = await Promise.all([
      loadInsightsPreviewPosts('ko'),
      loadInsightsPreviewPosts('ko'),
    ]);
    const third = await loadInsightsPreviewPosts('ko');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe('/api/builder/blog/posts?locale=ko&sort=newest&limit=100&scope=all');
    expect(first).toBe(posts);
    expect(second).toBe(posts);
    expect(third).toBe(posts);
  });

  it('keeps separate caches per locale', async () => {
    const koPost = blogPost('ko-post', 'ko');
    const enPost = blogPost('en-post', 'en');
    const fetchMock = vi.fn(async (url: string) => ({
      json: async () => ({
        ok: true,
        posts: url.includes('locale=en') ? [enPost] : [koPost],
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadInsightsPreviewPosts('ko')).resolves.toEqual([koPost]);
    await expect(loadInsightsPreviewPosts('en')).resolves.toEqual([enPost]);
    await loadInsightsPreviewPosts('ko');
    await loadInsightsPreviewPosts('en');

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not cache a failed request so the next mount can retry', async () => {
    const retryPost = blogPost('retry');
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce({
        json: async () => ({ ok: true, posts: [retryPost] }),
      });
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadInsightsPreviewPosts('ko')).resolves.toEqual([]);
    await expect(loadInsightsPreviewPosts('ko')).resolves.toEqual([retryPost]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
