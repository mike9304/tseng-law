import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_BUILDER_SITE_ID,
  LEGACY_BUILDER_SITE_ID,
} from '@/lib/builder/constants';
import type {
  BuilderPageMeta,
  BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

type ReadSiteDocument = (
  siteId: string,
  locale: string,
) => Promise<BuilderSiteDocument>;
const readSiteDocumentMock = vi.fn<ReadSiteDocument>();

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: (siteId: string, locale: string) =>
    readSiteDocumentMock(siteId, locale),
}));

const SITE_URL = 'https://tseng-law.example';

function makePage(overrides: Partial<BuilderPageMeta> & { pageId: string }): BuilderPageMeta {
  return {
    slug: overrides.slug ?? '',
    title: overrides.title ?? { ko: '페이지', 'zh-hant': '頁面', en: 'Page' },
    locale: overrides.locale ?? 'ko',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-06-01T00:00:00.000Z',
    publishedAt: '2024-06-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('collectBuilderSitemapEntriesForLocale — main site resolver', () => {
  beforeEach(() => {
    readSiteDocumentMock.mockReset();
    // Deterministic absolute URLs without depending on CI env vars.
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it('reads the primary site (tseng-law-main-site), never the legacy default', async () => {
    readSiteDocumentMock.mockImplementation(async (siteId) => {
      // If the collector ever passes the legacy 'default' id we'd be reading
      // the wrong doc — assert the resolver is the active main site.
      expect(siteId).toBe(DEFAULT_BUILDER_SITE_ID);
      expect(siteId).not.toBe(LEGACY_BUILDER_SITE_ID);
      return createDefaultSiteDocument('ko', siteId);
    });

    const { collectBuilderSitemapEntriesForLocale } = await import(
      '../sitemap-builder'
    );
    await collectBuilderSitemapEntriesForLocale('ko');

    expect(readSiteDocumentMock).toHaveBeenCalledTimes(1);
    expect(readSiteDocumentMock.mock.calls[0][0]).toBe(DEFAULT_BUILDER_SITE_ID);
  });

  it('emits entries only for public pages and skips noIndex/password/unpublished/cross-locale', async () => {
    const doc = createDefaultSiteDocument('ko', DEFAULT_BUILDER_SITE_ID);
    const home = doc.pages[0];
    home.isHomePage = true;
    home.publishedAt = '2024-06-01T00:00:00.000Z';

    const about = makePage({
      pageId: 'p-about',
      slug: 'about',
      locale: 'ko',
    });

    const noIndexPage = makePage({
      pageId: 'p-noindex',
      slug: 'secret',
      locale: 'ko',
      noIndex: true,
    });

    const seoNoIndexPage = makePage({
      pageId: 'p-seo-noindex',
      slug: 'seo-secret',
      locale: 'ko',
      seo: { noIndex: true },
    });

    const passwordPage = makePage({
      pageId: 'p-password',
      slug: 'locked',
      locale: 'ko',
      password: 'hunter2',
    });

    const unpublishedPage = makePage({
      pageId: 'p-draft',
      slug: 'draft',
      locale: 'ko',
      publishedAt: undefined,
    });

    const otherLocalePage = makePage({
      pageId: 'p-en',
      slug: 'en-only',
      locale: 'en' as Locale,
    });

    doc.pages = [
      home,
      about,
      noIndexPage,
      seoNoIndexPage,
      passwordPage,
      unpublishedPage,
      otherLocalePage,
    ];

    readSiteDocumentMock.mockResolvedValue(doc);

    const { collectBuilderSitemapEntriesForLocale } = await import(
      '../sitemap-builder'
    );
    const entries = await collectBuilderSitemapEntriesForLocale('ko');

    const urls = entries.map((e) => e.url).sort();
    expect(urls).toEqual(
      [`${SITE_URL}/ko`, `${SITE_URL}/ko/about`].sort(),
    );

    const homeEntry = entries.find((e) => e.url === `${SITE_URL}/ko`);
    expect(homeEntry).toBeDefined();
    expect(homeEntry?.priority).toBe(1);
    expect(homeEntry?.changeFrequency).toBe('daily');

    const aboutEntry = entries.find((e) => e.url === `${SITE_URL}/ko/about`);
    expect(aboutEntry).toBeDefined();
    expect(aboutEntry?.priority).toBe(0.7);
    expect(aboutEntry?.changeFrequency).toBe('weekly');
    expect(aboutEntry?.lastModified).toEqual(new Date('2024-06-01T00:00:00.000Z'));
  });

  it('returns an empty list (instead of throwing) when the site doc is unavailable', async () => {
    readSiteDocumentMock.mockRejectedValue(new Error('blob unavailable'));

    const { collectBuilderSitemapEntriesForLocale } = await import(
      '../sitemap-builder'
    );
    const entries = await collectBuilderSitemapEntriesForLocale('ko');

    expect(entries).toEqual([]);
    expect(readSiteDocumentMock).toHaveBeenCalledTimes(1);
    expect(readSiteDocumentMock.mock.calls[0][0]).toBe(DEFAULT_BUILDER_SITE_ID);
  });

  it('excludes published internal sandbox/QA/probe pages but keeps real pages', async () => {
    const doc = createDefaultSiteDocument('ko', DEFAULT_BUILDER_SITE_ID);
    const home = doc.pages[0];
    home.isHomePage = true;
    home.publishedAt = '2024-06-01T00:00:00.000Z';

    const about = makePage({ pageId: 'p-about', slug: 'about', locale: 'ko' });
    const leakedTemplate = makePage({
      pageId: 'p-leak-template',
      slug: 'visual-template-pet-home-mqzemq7q',
      locale: 'ko',
    });
    const leakedAnimation = makePage({
      pageId: 'p-leak-animation',
      slug: 'public-animation-mqzrfcqb',
      locale: 'ko',
    });
    const leakedPreview = makePage({
      pageId: 'p-leak-preview',
      slug: 'custom-preview-mr0kw8u4',
      locale: 'ko',
    });
    const leakedProbe = makePage({
      pageId: 'p-leak-probe',
      slug: 'db-probe-1783017761',
      locale: 'ko',
    });

    doc.pages = [home, about, leakedTemplate, leakedAnimation, leakedPreview, leakedProbe];
    readSiteDocumentMock.mockResolvedValue(doc);

    const { collectBuilderSitemapEntriesForLocale } = await import('../sitemap-builder');
    const entries = await collectBuilderSitemapEntriesForLocale('ko');

    const urls = entries.map((e) => e.url).sort();
    expect(urls).toEqual([`${SITE_URL}/ko`, `${SITE_URL}/ko/about`].sort());
    expect(urls).not.toContain(`${SITE_URL}/ko/visual-template-pet-home-mqzemq7q`);
    expect(urls).not.toContain(`${SITE_URL}/ko/public-animation-mqzrfcqb`);
    expect(urls).not.toContain(`${SITE_URL}/ko/custom-preview-mr0kw8u4`);
    expect(urls).not.toContain(`${SITE_URL}/ko/db-probe-1783017761`);
  });
});

describe('buildSitemapEntries — legacy SEO model helper', () => {
  it('excludes published internal sandbox/QA/probe pages but keeps real pages', async () => {
    const { buildSitemapEntries } = await import('../seo-model');

    const home = makePage({ pageId: 'home', slug: '', locale: 'ko', isHomePage: true });
    const about = makePage({ pageId: 'p-about', slug: 'about', locale: 'ko' });
    const leakedTemplate = makePage({
      pageId: 'p-leak-template',
      slug: 'visual-template-pet-home-mqzemq7q',
      locale: 'ko',
    });
    const leakedAnimation = makePage({
      pageId: 'p-leak-animation',
      slug: 'public-animation-mqzrfcqb',
      locale: 'ko',
    });
    const leakedPreview = makePage({
      pageId: 'p-leak-preview',
      slug: 'custom-preview-mr0kw8u4',
      locale: 'ko',
    });

    const entries = buildSitemapEntries(
      [home, about, leakedTemplate, leakedAnimation, leakedPreview],
      SITE_URL,
    );
    const locs = entries.map((e) => e.loc).sort();

    expect(locs).toEqual([`${SITE_URL}/ko`, `${SITE_URL}/ko/about`].sort());
    expect(locs).not.toContain(`${SITE_URL}/ko/visual-template-pet-home-mqzemq7q`);
    expect(locs).not.toContain(`${SITE_URL}/ko/public-animation-mqzrfcqb`);
    expect(locs).not.toContain(`${SITE_URL}/ko/custom-preview-mr0kw8u4`);
  });
});
