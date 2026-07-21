import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';

const sourceMocks = vi.hoisted(() => ({
  readAttorneyProfileSourceRecords: vi.fn(async () => []),
  readServiceAreaSourceRecords: vi.fn(async () => []),
  collectAllBuilderSitemapEntries: vi.fn(async () => []),
}));

vi.mock('@/lib/builder/lawyers/source', () => ({
  readAttorneyProfileSourceRecords: sourceMocks.readAttorneyProfileSourceRecords,
}));

vi.mock('@/lib/builder/services/source', () => ({
  readServiceAreaSourceRecords: sourceMocks.readServiceAreaSourceRecords,
}));

vi.mock('@/lib/builder/seo/sitemap-builder', () => ({
  collectAllBuilderSitemapEntries: sourceMocks.collectAllBuilderSitemapEntries,
}));

describe('sitemap column lastModified', () => {
  beforeEach(() => {
    sourceMocks.readAttorneyProfileSourceRecords.mockClear();
    sourceMocks.readServiceAreaSourceRecords.mockClear();
    sourceMocks.collectAllBuilderSitemapEntries.mockClear();
  });

  it('uses each column frontmatter lastmod and preserves distinct dates', async () => {
    const posts = getAllColumnPosts('ko');
    const first = posts[0];
    const second = posts.find((post) => post.date !== first.date);

    expect(first.date).toBeTruthy();
    expect(second?.date).toBeTruthy();

    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const columnEntry = (slug: string) =>
      entries.find((entry) => entry.url.endsWith(`/ko/columns/${slug}`));

    expect(columnEntry(first.slug)?.lastModified).toBe(first.date);
    expect(columnEntry(second!.slug)?.lastModified).toBe(second!.date);
    expect(columnEntry(first.slug)?.lastModified).not.toBe(
      columnEntry(second!.slug)?.lastModified,
    );
    expect(entries.every((entry) => entry.changeFrequency === undefined)).toBe(true);
  });
});
