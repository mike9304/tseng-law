import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import {
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  guidanceCanonicalUrl,
} from '@/lib/public-guidance';
import type { BuilderSitemapEntry } from '@/lib/builder/seo/sitemap-builder';
import { isEnglishNoindexPath } from '@/lib/seo-visibility';
import {
  resolveFileLastmod,
  resolveStaticPathLastmod,
} from '../sitemap-lastmod';

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

const ISO_8601 =
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/;

const STATIC_PATHS = [
  '',
  '/about',
  '/services',
  '/pricing',
  '/lawyers',
  '/columns',
  '/videos',
  '/faq',
  '/contact',
  '/taiwan-lawyer',
  '/taiwan-company-setup-lawyer',
  '/taiwan-litigation-lawyer',
  '/guides/taiwan-company-setup',
  '/korean-lawyer-in-taiwan',
  '/ai-intake',
  '/privacy',
  '/disclaimer',
  '/accessibility',
] as const;

describe('static sitemap lastmod helper', () => {
  it('returns an ISO-8601 git commit datetime for a tracked copy file', () => {
    const iso = resolveStaticPathLastmod('/contact');
    expect(iso).toMatch(ISO_8601);
    expect(iso).toMatch(/T/);
  });

  it('falls back to the provided build-time ISO when git is unavailable', () => {
    const fallback = '2026-09-14T12:00:00.000Z';
    expect(
      resolveFileLastmod('src/data/page-copy.ts', {
        gitLog: () => null,
        now: fallback,
      }),
    ).toBe(fallback);
    expect(
      resolveStaticPathLastmod('/columns', {
        gitLog: () => null,
        now: fallback,
      }),
    ).toBe(fallback);
  });
});

describe('sitemap static lastmod', () => {
  beforeEach(() => {
    sourceMocks.readAttorneyProfileSourceRecords.mockClear();
    sourceMocks.readServiceAreaSourceRecords.mockClear();
    sourceMocks.collectAllBuilderSitemapEntries.mockReset();
    sourceMocks.collectAllBuilderSitemapEntries.mockImplementation(async () => []);
  });

  it('gives STATIC_PATHS lastmod in ISO-8601, keeps column lastmod, and has unique loc', async () => {
    const posts = getAllColumnPosts('ko');
    const first = posts[0];
    const second = posts.find((post) => post.date !== first.date);
    expect(first.date).toBeTruthy();
    expect(second?.date).toBeTruthy();

    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    const missing = entries.filter((entry) => entry.lastModified == null);

    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      for (const path of STATIC_PATHS) {
        if (locale === 'en' && isEnglishNoindexPath(path)) continue;
        const url = `https://tseng-law.com/${locale}${path}`;
        const matches = entries.filter((entry) => entry.url === url);
        expect(matches, url).toHaveLength(1);
        const lastmod = matches[0]?.lastModified;
        const lastmodText = lastmod instanceof Date ? lastmod.toISOString() : String(lastmod);
        expect(lastmodText, url).toMatch(ISO_8601);
      }
    }

    const columnEntry = (slug: string) =>
      entries.find((entry) => entry.url.endsWith(`/ko/columns/${slug}`));
    expect(columnEntry(first.slug)?.lastModified).toBe(first.date);
    expect(columnEntry(second!.slug)?.lastModified).toBe(second!.date);

    expect(new Set(urls).size).toBe(urls.length);
    expect(missing.map((entry) => entry.url)).toEqual([]);
  });

  it('gives new-four core URLs an ISO-8601 lastmod', async () => {
    const { default: sitemap } = await import('../sitemap');
    const entries = await sitemap();

    for (const locale of GUIDANCE_LOCALES_4) {
      for (const pageKey of GUIDANCE_PAGE_KEYS) {
        const url = guidanceCanonicalUrl(locale, pageKey);
        const matches = entries.filter((entry) => entry.url === url);
        expect(matches).toHaveLength(1);
        const lastmod = matches[0]?.lastModified;
        const lastmodText = lastmod instanceof Date ? lastmod.toISOString() : String(lastmod);
        expect(lastmodText, url).toMatch(ISO_8601);
      }
    }
  });
});
