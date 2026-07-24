import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import type { BuilderSitemapEntry } from '@/lib/builder/seo/sitemap-builder';

const sourceMocks = vi.hoisted(() => ({
  readAttorneyProfileSourceRecords: vi.fn(async () => []),
  readServiceAreaSourceRecords: vi.fn(async () => []),
  collectAllBuilderSitemapEntries: vi.fn<() => Promise<BuilderSitemapEntry[]>>(
    async () => [],
  ),
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
    sourceMocks.collectAllBuilderSitemapEntries.mockReset();
    sourceMocks.collectAllBuilderSitemapEntries.mockImplementation(async () => []);
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

  it('excludes English-only noindex routes and removes their English hreflang', async () => {
    const affectedPaths = [
      '/faq',
      '/columns/client-alert',
      '/portfolio',
      '/portfolio/cross-border-matter',
      '/events',
      '/events/taipei-seminar',
      '/store',
      '/store/categories/guides',
      '/store/products/taiwan-business-guide',
    ];
    const indexablePath = '/columns';
    const locales = ['ko', 'zh-hant', 'en'] as const;
    const builderEntries = [...affectedPaths, indexablePath].flatMap((path) =>
      locales.map((locale) => ({
        url: `https://tseng-law.com/${locale}${path}`,
        lastModified: new Date('2026-07-21T00:00:00.000Z'),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: {
            ko: `https://tseng-law.com/ko${path}`,
            'zh-Hant': `https://tseng-law.com/zh-hant${path}`,
            en: `https://tseng-law.com/en${path}`,
            'x-default': `https://tseng-law.com/ko${path}`,
          },
        },
      })),
    );
    sourceMocks.collectAllBuilderSitemapEntries.mockImplementationOnce(
      async () => builderEntries,
    );

    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();

    const afterFilteringUrls = new Set(entries.map((entry) => entry.url));
    const expectedRemovedUrls = affectedPaths.map(
      (path) => `https://tseng-law.com/en${path}`,
    );
    const beforeFilteringUrls = new Set([
      ...afterFilteringUrls,
      ...expectedRemovedUrls,
    ]);
    expect({
      beforeFiltering: beforeFilteringUrls.size,
      afterFiltering: afterFilteringUrls.size,
      removed: beforeFilteringUrls.size - afterFilteringUrls.size,
    }).toEqual({
      // Base includes EN file-backed columns + JA /about, /services, /lawyers,
      // /lawyers/wei-tseng, /columns archive, and 17 JA column details (+22).
      // Builder fixtures still drop 9 EN-only noindex routes.
      beforeFiltering: 151,
      afterFiltering: 142,
      removed: 9,
    });

    for (const path of affectedPaths) {
      expect(entries.some((entry) => entry.url === `https://tseng-law.com/en${path}`)).toBe(false);

      for (const locale of ['ko', 'zh-hant'] as const) {
        const entry = entries.find(
          (candidate) => candidate.url === `https://tseng-law.com/${locale}${path}`,
        );
        expect(entry, `${locale}${path} should remain in the sitemap`).toBeDefined();
        expect(entry?.alternates?.languages).not.toHaveProperty('en');
        expect(entry?.alternates?.languages).toHaveProperty('ko');
        expect(entry?.alternates?.languages).toHaveProperty('zh-Hant');
      }
    }

    const englishColumnsListing = entries.find(
      (entry) => entry.url === `https://tseng-law.com/en${indexablePath}`,
    );
    expect(englishColumnsListing).toBeDefined();
    expect(englishColumnsListing?.alternates?.languages).toHaveProperty('en');
  });

  it('publishes Japanese About exactly once with four-language alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseAboutEntries = entries.filter(
      (entry) => entry.url === 'https://tseng-law.com/ja/about',
    );

    expect(japaneseAboutEntries).toHaveLength(1);
    expect(japaneseAboutEntries[0]?.alternates?.languages).toEqual({
      ko: 'https://tseng-law.com/ko/about',
      'zh-Hant': 'https://tseng-law.com/zh-hant/about',
      en: 'https://tseng-law.com/en/about',
      ja: 'https://tseng-law.com/ja/about',
      'x-default': 'https://tseng-law.com/ko/about',
    });
  });

  it('publishes Japanese services exactly once with four-language alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseServicesEntries = entries.filter(
      (entry) => entry.url === 'https://tseng-law.com/ja/services',
    );

    expect(japaneseServicesEntries).toHaveLength(1);
    expect(japaneseServicesEntries[0]?.alternates?.languages).toEqual({
      ko: 'https://tseng-law.com/ko/services',
      'zh-Hant': 'https://tseng-law.com/zh-hant/services',
      en: 'https://tseng-law.com/en/services',
      ja: 'https://tseng-law.com/ja/services',
      'x-default': 'https://tseng-law.com/ko/services',
    });
  });

  it.each([
    '/lawyers',
    '/lawyers/wei-tseng',
  ])('publishes Japanese %s exactly once with four-language alternates', async (path) => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseEntries = entries.filter(
      (entry) => entry.url === `https://tseng-law.com/ja${path}`,
    );

    expect(japaneseEntries).toHaveLength(1);
    expect(japaneseEntries[0]?.alternates?.languages).toEqual({
      ko: `https://tseng-law.com/ko${path}`,
      'zh-Hant': `https://tseng-law.com/zh-hant${path}`,
      en: `https://tseng-law.com/en${path}`,
      ja: `https://tseng-law.com/ja${path}`,
      'x-default': `https://tseng-law.com/ko${path}`,
    });
  });
});
