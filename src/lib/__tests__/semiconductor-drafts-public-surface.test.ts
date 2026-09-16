import { describe, expect, it } from 'vitest';
import { listSemiconductorArticleDrafts } from '@/lib/semiconductor-drafts';
import { listBlogPosts } from '@/lib/builder/blog/column-adapter';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';

describe('semiconductor drafts stay off public surfaces', () => {
  it('are absent from sitemap, blog feed, and blob-merged public columns', async () => {
    const slugs = listSemiconductorArticleDrafts().map((item) => item.slug);
    const { default: sitemap } = await import('@/app/sitemap');
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const slug of slugs) {
      expect(urls.some((url) => url.includes(slug))).toBe(false);
      expect(urls.some((url) => url.includes('/services/semiconductor-companies'))).toBe(false);
    }

    const blog = await listBlogPosts('ko');
    const merged = await getAllColumnPostsIncludingBlob('ko');
    for (const slug of slugs) {
      expect(blog.some((post) => post.slug === slug)).toBe(false);
      expect(merged.some((post) => post.slug === slug)).toBe(false);
    }
  });
});
