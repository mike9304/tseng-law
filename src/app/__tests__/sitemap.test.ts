import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { getAllColumnPosts } from '@/lib/columns';
import type { BuilderSitemapEntry } from '@/lib/builder/seo/sitemap-builder';
import {
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  buildGuidanceCoreLanguageAlternates,
  guidanceCanonicalUrl,
  guidancePublicPath,
  hreflangTagForPublicLocale,
  isPublicLocale8,
} from '@/lib/public-guidance';
import {
  absentOptionalColumnLocales,
  presentOptionalColumnLocales,
} from '@/data/__tests__/column-alternate-expectations';

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

const newFourTranslatedColumnCount = ['vi', 'id', 'th', 'fil'].reduce((total, locale) => {
  const dir = path.join(process.cwd(), 'src/content', `columns-${locale}`);
  if (!existsSync(dir)) return total;
  return total + readdirSync(dir).filter((name) => name.endsWith('.md')).length;
}, 0);

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
            'x-default': `https://tseng-law.com/en${path}`,
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
      // Base includes EN file-backed columns + JA home, /about, /services,
      // /pricing, /contact, /lawyers, /lawyers/wei-tseng, /faq, /videos,
      // /privacy, /disclaimer, /accessibility, three JA intent pages,
      // /korean-lawyer-in-taiwan, /ai-intake, /guides/taiwan-company-setup,
      // /columns archive, 17 JA column details, and all six JA service
      // details (+41). Builder fixtures still drop 9 EN-only noindex routes.
      // Plus 40 new-four core URLs (4 locales × 10 dictionary pages), plus one
      // URL per translated column file present in src/content/columns-{vi,id,th,fil}
      // (counted from disk so this assertion tracks the growing SEA corpus).
      beforeFiltering: 211 + newFourTranslatedColumnCount,
      afterFiltering: 202 + newFourTranslatedColumnCount,
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

  it('excludes builder-provided reviews pages in every locale and preserves other entries', async () => {
    const reviewEntries = ['ko', 'zh-hant', 'en', 'ja'].map((locale) => ({
      url: `https://tseng-law.com/${locale}/reviews`,
      lastModified: new Date('2026-07-24T00:00:00.000Z'),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          [locale]: `https://tseng-law.com/${locale}/reviews`,
        },
      },
    }));
    const sentinelUrl = 'https://tseng-law.com/ko/reviews-policy';
    sourceMocks.collectAllBuilderSitemapEntries.mockImplementationOnce(async () => [
      ...reviewEntries,
      {
        url: sentinelUrl,
        lastModified: new Date('2026-07-24T00:00:00.000Z'),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            ko: sentinelUrl,
          },
        },
      },
    ]);

    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const urls = new Set(entries.map((entry) => entry.url));

    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      expect(urls.has(`https://tseng-law.com/${locale}/reviews`)).toBe(false);
    }
    expect(urls.has(sentinelUrl)).toBe(true);
  });

  it('publishes Japanese About exactly once with eight-language core alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseAboutEntries = entries.filter(
      (entry) => entry.url === 'https://tseng-law.com/ja/about',
    );

    expect(japaneseAboutEntries).toHaveLength(1);
    expect(japaneseAboutEntries[0]?.alternates?.languages).toEqual(
      buildGuidanceCoreLanguageAlternates('about'),
    );
  });

  it('publishes AI-intake in all four locales exactly once with four-language alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const expectedLanguages = {
      ko: 'https://tseng-law.com/ko/ai-intake',
      'zh-Hant': 'https://tseng-law.com/zh-hant/ai-intake',
      en: 'https://tseng-law.com/en/ai-intake',
      ja: 'https://tseng-law.com/ja/ai-intake',
      'x-default': 'https://tseng-law.com/en/ai-intake',
    };

    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      const localeEntries = entries.filter(
        (entry) => entry.url === `https://tseng-law.com/${locale}/ai-intake`,
      );
      expect(localeEntries).toHaveLength(1);
      expect(localeEntries[0]?.alternates?.languages).toEqual(expectedLanguages);
    }
  });

  it('publishes Japanese services exactly once with eight-language core alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseServicesEntries = entries.filter(
      (entry) => entry.url === 'https://tseng-law.com/ja/services',
    );

    expect(japaneseServicesEntries).toHaveLength(1);
    expect(japaneseServicesEntries[0]?.alternates?.languages).toEqual(
      buildGuidanceCoreLanguageAlternates('services'),
    );
  });

  it('publishes only the approved Japanese service details with exact alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();

    for (const slug of ['investment', 'civil', 'family', 'labor', 'criminal', 'ip']) {
      const japaneseEntries = entries.filter(
        (entry) => entry.url === `https://tseng-law.com/ja/services/${slug}`,
      );

      expect(japaneseEntries).toHaveLength(1);
      expect(japaneseEntries[0]?.priority).toBe(0.72);
      expect(japaneseEntries[0]?.alternates?.languages).toEqual({
        ko: `https://tseng-law.com/ko/services/${slug}`,
        'zh-Hant': `https://tseng-law.com/zh-hant/services/${slug}`,
        en: `https://tseng-law.com/en/services/${slug}`,
        ja: `https://tseng-law.com/ja/services/${slug}`,
        'x-default': `https://tseng-law.com/en/services/${slug}`,
      });
    }
  });

  it('publishes Japanese pricing exactly once with eight-language core alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japanesePricingEntries = entries.filter(
      (entry) => entry.url === 'https://tseng-law.com/ja/pricing',
    );

    expect(japanesePricingEntries).toHaveLength(1);
    expect(japanesePricingEntries[0]?.alternates?.languages).toEqual(
      buildGuidanceCoreLanguageAlternates('pricing'),
    );
  });

  it('publishes Japanese contact exactly once with eight-language core alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseContactEntries = entries.filter(
      (entry) => entry.url === 'https://tseng-law.com/ja/contact',
    );

    expect(japaneseContactEntries).toHaveLength(1);
    expect(japaneseContactEntries[0]?.priority).toBe(0.8);
    expect(japaneseContactEntries[0]?.alternates?.languages).toEqual(
      buildGuidanceCoreLanguageAlternates('contact'),
    );
  });

  it('publishes Japanese /lawyers exactly once with eight-language core alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseEntries = entries.filter(
      (entry) => entry.url === 'https://tseng-law.com/ja/lawyers',
    );

    expect(japaneseEntries).toHaveLength(1);
    expect(japaneseEntries[0]?.alternates?.languages).toEqual(
      buildGuidanceCoreLanguageAlternates('lawyers'),
    );
  });

  it('publishes Japanese /lawyers/wei-tseng exactly once with four-language alternates', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseEntries = entries.filter(
      (entry) => entry.url === 'https://tseng-law.com/ja/lawyers/wei-tseng',
    );

    expect(japaneseEntries).toHaveLength(1);
    expect(japaneseEntries[0]?.alternates?.languages).toEqual({
      ko: 'https://tseng-law.com/ko/lawyers/wei-tseng',
      'zh-Hant': 'https://tseng-law.com/zh-hant/lawyers/wei-tseng',
      en: 'https://tseng-law.com/en/lawyers/wei-tseng',
      ja: 'https://tseng-law.com/ja/lawyers/wei-tseng',
      'x-default': 'https://tseng-law.com/en/lawyers/wei-tseng',
    });
    expect(japaneseEntries[0]?.alternates?.languages).not.toHaveProperty('vi');
    expect(japaneseEntries[0]?.alternates?.languages).not.toHaveProperty('id');
    expect(japaneseEntries[0]?.alternates?.languages).not.toHaveProperty('th');
    expect(japaneseEntries[0]?.alternates?.languages).not.toHaveProperty('fil');
  });

  it.each([
    '',
    '/faq',
    '/videos',
    '/privacy',
    '/disclaimer',
    '/accessibility',
    '/taiwan-lawyer',
    '/taiwan-company-setup-lawyer',
    '/taiwan-litigation-lawyer',
    '/korean-lawyer-in-taiwan',
    '/ai-intake',
    '/guides/taiwan-company-setup',
  ])('publishes Japanese %s exactly once', async (path) => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseEntries = entries.filter(
      (entry) => entry.url === `https://tseng-law.com/ja${path}`,
    );

    expect(japaneseEntries).toHaveLength(1);
    expect(japaneseEntries[0]?.alternates?.languages).toHaveProperty('ja');
    expect(japaneseEntries[0]?.alternates?.languages).toHaveProperty('x-default');
  });

  it('strips the en alternate from the Japanese faq entry (English-noindex path)', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const japaneseFaq = entries.find(
      (entry) => entry.url === 'https://tseng-law.com/ja/faq',
    );

    expect(japaneseFaq).toBeDefined();
    expect(japaneseFaq?.alternates?.languages).toEqual(
      buildGuidanceCoreLanguageAlternates('faq'),
    );
    expect(japaneseFaq?.alternates?.languages).not.toHaveProperty('en');
  });

  it('keeps Japanese store/portfolio/events routes out of the sitemap', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls.some((url) => url.includes('/ja/store'))).toBe(false);
    expect(urls.some((url) => url.includes('/ja/portfolio'))).toBe(false);
    expect(urls.some((url) => url.includes('/ja/events'))).toBe(false);
  });

  it('adds a reciprocal ja hreflang to every sibling of a published Japanese route', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const urls = new Set(entries.map((entry) => entry.url));
    const japaneseEntries = entries.filter((entry) => entry.url.includes('/ja'));

    expect(japaneseEntries.length).toBeGreaterThan(0);

    for (const japaneseEntry of japaneseEntries) {
      const japaneseUrl = new URL(japaneseEntry.url);
      const path = japaneseUrl.pathname.replace(/^\/ja(?=\/|$)/, '');

      for (const locale of ['ko', 'zh-hant', 'en'] as const) {
        const siblingUrl = `${japaneseUrl.origin}/${locale}${path}`;
        if (!urls.has(siblingUrl)) continue;

        const sibling = entries.find((entry) => entry.url === siblingUrl);
        expect(
          sibling?.alternates?.languages?.ja,
          `${siblingUrl} should point back to ${japaneseEntry.url}`,
        ).toBe(japaneseEntry.url);
      }
    }
  });

  it('publishes eight reciprocal languages for home and contact core URLs', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();

    for (const pageKey of ['home', 'contact'] as const) {
      const expected = buildGuidanceCoreLanguageAlternates(pageKey);
      expect(Object.keys(expected).filter((tag) => tag !== 'x-default')).toHaveLength(8);
      for (const locale of ['ko', 'zh-hant', 'en', 'ja', 'vi', 'id', 'th', 'fil'] as const) {
        const url = `https://tseng-law.com${guidancePublicPath(locale, pageKey)}`;
        const matches = entries.filter((entry) => entry.url === url);
        expect(matches).toHaveLength(1);
        expect(matches[0]?.alternates?.languages).toEqual(expected);
        const homeContactLanguages = matches[0]?.alternates?.languages as
          | Record<string, string>
          | undefined;
        expect(homeContactLanguages?.[hreflangTagForPublicLocale(locale)]).toBe(url);
      }
    }
  });

  it('publishes seven FAQ languages excluding English', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const expected = buildGuidanceCoreLanguageAlternates('faq');

    expect(expected).not.toHaveProperty('en');
    expect(Object.keys(expected).filter((tag) => tag !== 'x-default')).toHaveLength(7);
    expect(entries.some((entry) => entry.url === 'https://tseng-law.com/en/faq')).toBe(false);

    for (const locale of ['ko', 'zh-hant', 'ja', 'vi', 'id', 'th', 'fil'] as const) {
      const url = `https://tseng-law.com${guidancePublicPath(locale, 'faq')}`;
      const matches = entries.filter((entry) => entry.url === url);
      expect(matches).toHaveLength(1);
      expect(matches[0]?.alternates?.languages).toEqual(expected);
    }
  });

  it('does not invent vi/id/th/fil URLs or hreflang for deep articles or US landings', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    const posts = getAllColumnPosts('ko');
    // Derived, not frozen: pick a column that still has no vi/id/th/fil markdown
    // file, so landing new translations extends the sitemap instead of breaking
    // this "never invent an untranslated URL" guard.
    const firstArticle = posts.find(
      (post) => presentOptionalColumnLocales(post.slug).length === 0,
    );
    expect(firstArticle?.slug, 'expected a column with no vi/id/th/fil file').toBeTruthy();

    const usLandings = [
      '/taiwan-lawyer',
      '/taiwan-company-setup-lawyer',
      '/taiwan-litigation-lawyer',
      '/korean-lawyer-in-taiwan',
    ];

    for (const locale of GUIDANCE_LOCALES_4) {
      expect(urls.some((url) => url.includes(`/${locale}/columns/${firstArticle!.slug}`))).toBe(false);
      for (const path of usLandings) {
        expect(urls).not.toContain(`https://tseng-law.com/${locale}${path}`);
      }
    }

    const articleEntry = entries.find(
      (entry) => entry.url === `https://tseng-law.com/ko/columns/${firstArticle!.slug}`,
    );
    expect(articleEntry).toBeDefined();
    for (const locale of GUIDANCE_LOCALES_4) {
      expect(articleEntry?.alternates?.languages).not.toHaveProperty(locale);
    }

    // Every other column advertises exactly the new-locale files that exist.
    for (const post of posts) {
      const entry = entries.find(
        (candidate) => candidate.url === `https://tseng-law.com/ko/columns/${post.slug}`,
      );
      if (!entry) continue;
      const languages: Record<string, unknown> = { ...(entry.alternates?.languages ?? {}) };

      for (const locale of presentOptionalColumnLocales(post.slug)) {
        expect(languages[locale], `${post.slug} -> ${locale}`).toBe(
          `https://tseng-law.com/${locale}/columns/${post.slug}`,
        );
        expect(urls, `${post.slug} -> ${locale}`).toContain(
          `https://tseng-law.com/${locale}/columns/${post.slug}`,
        );
      }
      for (const locale of absentOptionalColumnLocales(post.slug)) {
        expect(Object.keys(languages), `${post.slug} -> ${locale}`).not.toContain(locale);
        expect(urls, `${post.slug} -> ${locale}`).not.toContain(
          `https://tseng-law.com/${locale}/columns/${post.slug}`,
        );
      }
    }

    const usLanding = entries.find((entry) => entry.url === 'https://tseng-law.com/en/taiwan-lawyer');
    expect(usLanding).toBeDefined();
    expect(usLanding?.alternates?.languages).not.toHaveProperty('vi');
    expect(usLanding?.alternates?.languages).not.toHaveProperty('id');
    expect(usLanding?.alternates?.languages).not.toHaveProperty('th');
    expect(usLanding?.alternates?.languages).not.toHaveProperty('fil');
  });

  it('appends exactly 40 unique self-canonical new-four core URLs and retains non-core routes', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    const newUrls = GUIDANCE_LOCALES_4.flatMap((locale) =>
      GUIDANCE_PAGE_KEYS.map((pageKey) => guidanceCanonicalUrl(locale, pageKey)),
    );

    expect(GUIDANCE_LOCALES_4).toHaveLength(4);
    expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);
    expect(newUrls).toHaveLength(40);
    expect(new Set(newUrls).size).toBe(40);
    expect(urls.some((url) => url.includes('__public-guidance'))).toBe(false);

    for (const url of newUrls) {
      const matches = entries.filter((entry) => entry.url === url);
      expect(matches).toHaveLength(1);
      expect(matches[0]?.lastModified).toBeUndefined();
      const route = new URL(url);
      const locale = route.pathname.split('/').filter(Boolean)[0];
      expect(isPublicLocale8(locale)).toBe(true);
      if (isPublicLocale8(locale)) {
        const newCoreLanguages = matches[0]?.alternates?.languages as
          | Record<string, string>
          | undefined;
        expect(newCoreLanguages?.[hreflangTagForPublicLocale(locale)]).toBe(url);
      }
    }

    expect(urls).toContain('https://tseng-law.com/ko/videos');
    expect(urls).toContain('https://tseng-law.com/en/taiwan-lawyer');
    expect(urls).toContain('https://tseng-law.com/ja/ai-intake');
    expect(urls).toContain('https://tseng-law.com/ko/accessibility');
    expect(urls).toContain('https://tseng-law.com/ja/lawyers/wei-tseng');
  });
});
