import { describe, expect, it, vi } from 'vitest';
import boardColumns from '@/data/semiconductor-board-columns.json';
import { listBlogPosts } from '@/lib/builder/blog/column-adapter';
import { COLUMN_TOPIC_LABELS } from '@/lib/column-topics';
import { getColumnPost } from '@/lib/columns';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { siteLocales } from '@/lib/locales';
import {
  PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS,
  UNPUBLISHED_SEMICONDUCTOR_COLUMN_SLUGS,
  listPublicSemiconductorColumns,
  semiconductorColumnBadge,
  semiconductorGuideCopy,
} from '@/lib/semiconductor-public';

const BOARD_SLUGS: Partial<Record<string, readonly string[]>> = boardColumns;

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

  it.each([...siteLocales])('keeps the lawyer-reviewed column and no unpublished draft on the %s board', (locale) => {
    const posts = listPublicSemiconductorColumns(locale);
    const slugs = posts.map((post) => post.slug);
    expect(slugs).toEqual(expect.arrayContaining([...PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS]));
    for (const slug of UNPUBLISHED_SEMICONDUCTOR_COLUMN_SLUGS) {
      expect(slugs).not.toContain(slug);
    }
    expect(new Set(slugs).size).toBe(slugs.length);

    const entry = posts.find((post) => post.slug === PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS[0]);
    expect(entry && semiconductorColumnBadge(entry, locale)).toBe(semiconductorGuideCopy[locale].topicLabel);
  });

  it.each([...siteLocales])('lists every %s board slug that has a column file first, in JSON order', (locale) => {
    const expected = [
      ...new Set((BOARD_SLUGS[locale] ?? []).flatMap((slug) => getColumnPost(slug, locale)?.slug ?? [])),
    ];
    const slugs = listPublicSemiconductorColumns(locale).map((post) => post.slug);
    expect(slugs.slice(0, expected.length)).toEqual(expected);
  });

  it('puts board slugs before the reviewed column, de-duplicates, and skips slugs without a file', async () => {
    vi.resetModules();
    vi.doMock('@/data/semiconductor-board-columns.json', () => ({
      default: {
        ko: [
          'taiwan-company-subsidiary-vs-branch',
          'no-such-semiconductor-column',
          'taiwan-semiconductor-market-entry',
          'taiwan-company-subsidiary-vs-branch',
        ],
        'zh-hant': [],
        en: [],
        ja: [],
      },
    }));
    try {
      const board = await import('@/lib/semiconductor-public');
      const posts = board.listPublicSemiconductorColumns('ko');
      expect(posts.map((post) => post.slug)).toEqual([
        'taiwan-company-subsidiary-vs-branch',
        'taiwan-semiconductor-market-entry',
      ]);
      expect(board.semiconductorColumnBadge(posts[0]!, 'ko')).toBe(COLUMN_TOPIC_LABELS.ko.company);
      expect(board.listPublicSemiconductorColumns('ja').map((post) => post.slug)).toEqual([
        ...PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS,
      ]);
    } finally {
      vi.doUnmock('@/data/semiconductor-board-columns.json');
      vi.resetModules();
    }
  });

  it('includes the public semiconductor guide board in the sitemap', async () => {
    const { default: sitemap } = await import('@/app/sitemap');
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain('https://tseng-law.com/ko/semiconductor');
    expect(urls).toContain('https://tseng-law.com/ja/semiconductor');
    expect(urls.some((url) => url.includes('/services/semiconductor-companies'))).toBe(false);
  });
});
