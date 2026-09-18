import { describe, expect, it } from 'vitest';
import { listBlogPosts } from '@/lib/builder/blog/column-adapter';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import {
  PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS,
  UNPUBLISHED_SEMICONDUCTOR_COLUMN_SLUGS,
  listPublicSemiconductorColumns,
} from '@/lib/semiconductor-public';

describe('semiconductor drafts stay off public surfaces', () => {
  it('keeps unpublished semiconductor articles out of sitemap, blog, and public columns', async () => {
    const { default: sitemap } = await import('@/app/sitemap');
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const slug of UNPUBLISHED_SEMICONDUCTOR_COLUMN_SLUGS) {
      expect(urls.some((url) => url.includes(slug))).toBe(false);
    }

    const blog = await listBlogPosts('ko');
    const merged = await getAllColumnPostsIncludingBlob('ko');
    for (const slug of UNPUBLISHED_SEMICONDUCTOR_COLUMN_SLUGS) {
      expect(blog.some((post) => post.slug === slug)).toBe(false);
      expect(merged.some((post) => post.slug === slug)).toBe(false);
    }
  });

  it('publishes only the lawyer-reviewed semiconductor column on the public board', () => {
    const posts = listPublicSemiconductorColumns('ko');
    expect(posts.map((post) => post.slug)).toEqual([...PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS]);
    expect(posts.map((post) => post.slug)).not.toEqual(
      expect.arrayContaining([...UNPUBLISHED_SEMICONDUCTOR_COLUMN_SLUGS]),
    );
  });

  it('includes the public semiconductor guide board in the sitemap', async () => {
    const { default: sitemap } = await import('@/app/sitemap');
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain('https://tseng-law.com/ko/semiconductor');
    expect(urls).toContain('https://tseng-law.com/ja/semiconductor');
    expect(urls.some((url) => url.includes('/services/semiconductor-companies'))).toBe(false);
  });
});
