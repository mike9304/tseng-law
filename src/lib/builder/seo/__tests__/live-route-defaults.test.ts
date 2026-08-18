import { describe, expect, it, vi } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import {
  DEFAULT_THEME,
  type BuilderPageMeta,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { buildHreflangAlternates } from '@/lib/builder/seo/hreflang';
import { buildPageSeo } from '@/lib/builder/seo/seo-model';
import { buildPublishedSitePageMetadata } from '@/lib/builder/site/public-page';
import {
  readFooterCanvas,
  readHeaderCanvas,
  readLightboxCanvas,
  readSiteDocument,
} from '@/lib/builder/site/persistence';
import { readPublishedPageCanvas } from '@/lib/builder/site/published-canvas';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { buildLocalizedPageTitle, DEFAULT_SOCIAL_IMAGE_PATH } from '@/lib/seo';

vi.mock('@/lib/builder/site/persistence', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/site/persistence')>();
  return {
    ...actual,
    readFooterCanvas: vi.fn(),
    readHeaderCanvas: vi.fn(),
    readLightboxCanvas: vi.fn(),
    readSiteDocument: vi.fn(),
  };
});

vi.mock('@/lib/builder/site/published-canvas', () => ({
  readPublishedPageCanvas: vi.fn(),
}));

vi.mock('@/lib/builder/persistence', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/persistence')>();
  return {
    ...actual,
    readBuilderPageSnapshot: vi.fn(),
  };
});

vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  getAllColumnPostsIncludingBlob: vi.fn(),
}));

vi.mock('@/lib/builder/datasets', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/datasets')>();
  return {
    ...actual,
    // Metadata resolution does not consume dataset samples. Isolate it from
    // locale content records so this test covers every published locale.
    readBuilderPageDatasetOverviews: vi.fn(() => []),
  };
});

const now = '2026-07-06T00:00:00.000Z';

function makePage(overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: 'page-1',
    slug: 'services',
    title: { ko: '업무분야', 'zh-hant': '服務領域', en: 'Practice Areas' },
    locale: 'ko',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    ...overrides,
  };
}

function makeSite(pages: BuilderPageMeta[]): BuilderSiteDocument {
  return {
    version: 1,
    siteId: 'tseng-law-main-site',
    name: '호정국제',
    locale: 'ko',
    navigation: [],
    theme: DEFAULT_THEME,
    pages,
    createdAt: now,
    updatedAt: now,
  };
}

function makePublishedCanvas(): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: now,
    updatedBy: 'published-seo-test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      {
        id: 'published-home-spacer',
        kind: 'spacer',
        rect: { x: 0, y: 0, width: 1280, height: 720 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: { size: 32 },
      },
    ],
  };
}

function mockPublishedMetadataInputs(site: BuilderSiteDocument): void {
  vi.mocked(readSiteDocument).mockResolvedValue(site);
  vi.mocked(readPublishedPageCanvas).mockResolvedValue(makePublishedCanvas());
  vi.mocked(readHeaderCanvas).mockResolvedValue(null);
  vi.mocked(readFooterCanvas).mockResolvedValue(null);
  vi.mocked(readLightboxCanvas).mockResolvedValue(null);
  vi.mocked(readBuilderPageSnapshot).mockRejectedValue(new Error('No persisted home dataset'));
  vi.mocked(getAllColumnPostsIncludingBlob).mockResolvedValue([]);
}

describe('live route SEO defaults', () => {
  it('uses live home SEO copy before generic builder templates', () => {
    const home = makePage({
      pageId: 'home-ko',
      slug: '',
      isHomePage: true,
      title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
    });

    const seo = buildPageSeo(home, 'https://tseng-law.com', 'ko', [home]);

    expect(seo.title).toBe('대만 변호사·회사설립·소송');
    expect(seo.description).toBe(
      '대만 회사설립, 대만 소송, 대만 투자 법률 자문을 한국어와 일본어로 안내하는 법무법인 호정 공식 사이트입니다.',
    );
    expect(seo.ogTitle).toBe(seo.title);
    expect(seo.ogDescription).toBe(seo.description);
    expect(seo.twitterTitle).toBe(seo.title);
    expect(seo.twitterDescription).toBe(seo.description);
  });

  it('resolves persisted Korean homepage SEO through the published metadata path', async () => {
    const home = makePage({
      pageId: 'home-ko',
      slug: '',
      isHomePage: true,
      title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
      seo: {
        title: '대만 변호사·회사설립·소송',
        ogTitle: '대만 변호사·회사설립·소송',
        twitterTitle: '대만 변호사·회사설립·소송',
        localizedOverrides: {
          ko: {
            title: '대만 변호사·회사설립·소송',
            ogTitle: '대만 변호사·회사설립·소송',
            twitterTitle: '대만 변호사·회사설립·소송',
          },
        },
      },
    });
    mockPublishedMetadataInputs(makeSite([home]));

    const metadata = await buildPublishedSitePageMetadata('ko', '');

    expect(metadata).not.toBeNull();
    expect(metadata?.title).toBe('대만 변호사·회사설립·소송');
    expect(buildLocalizedPageTitle(String(metadata?.title), 'ko')).toBe(
      '대만 변호사·회사설립·소송 | 법무법인 호정',
    );
    expect(metadata?.openGraph?.title).toBe('대만 변호사·회사설립·소송');
    expect(metadata?.twitter?.title).toBe('대만 변호사·회사설립·소송');
  });

  it.each(['ko', 'zh-hant', 'en'] as const)(
    'uses the dedicated social image as the published %s fallback',
    async (locale) => {
      const page = makePage({
        pageId: `services-${locale}`,
        locale,
        slug: 'services',
      });
      mockPublishedMetadataInputs(makeSite([page]));

      const metadata = await buildPublishedSitePageMetadata(locale, 'services');
      const expectedImage = `https://tseng-law.com${DEFAULT_SOCIAL_IMAGE_PATH}`;

      expect(metadata?.openGraph?.images).toEqual([expectedImage]);
      expect(metadata?.twitter?.images).toEqual([expectedImage]);
    },
  );

  it('keeps configured page and site social images ahead of the fallback', async () => {
    const pageImage = 'https://cdn.example.test/page-og.webp';
    const twitterImage = 'https://cdn.example.test/page-twitter.webp';
    const page = makePage({
      seo: { ogImage: pageImage, twitterImage },
    });
    mockPublishedMetadataInputs(makeSite([page]));

    const pageMetadata = await buildPublishedSitePageMetadata('ko', 'services');
    expect(pageMetadata?.openGraph?.images).toEqual([pageImage]);
    expect(pageMetadata?.twitter?.images).toEqual([twitterImage]);

    const siteImage = 'https://cdn.example.test/site-og.webp';
    mockPublishedMetadataInputs({
      ...makeSite([makePage()]),
      settings: { ogImage: siteImage },
    });
    const siteMetadata = await buildPublishedSitePageMetadata('ko', 'services');
    expect(siteMetadata?.openGraph?.images).toEqual([siteImage]);
    expect(siteMetadata?.twitter?.images).toEqual([siteImage]);
  });

  it.each([
    ['zh-hant', '台灣律師・台灣訴訟・台灣公司設立 | 昊鼎國際法律事務所'],
    ['en', 'Taiwan Lawyer, Litigation & Company Setup | Hovering International Law Firm'],
  ] as const)('keeps the %s homepage title on its localized brand pattern', (locale, expected) => {
    const home = makePage({
      pageId: `home-${locale}`,
      slug: '',
      isHomePage: true,
      locale,
      title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
    });

    const seo = buildPageSeo(home, 'https://tseng-law.com', locale, [home]);

    expect(buildLocalizedPageTitle(seo.title, locale)).toBe(expected);
  });

  it('uses live route descriptions for standard published pages without explicit SEO', () => {
    const services = makePage();

    const seo = buildPageSeo(services, 'https://tseng-law.com', 'ko', [services]);

    expect(seo.title).toBe('업무분야');
    expect(seo.description).toBe('대만 투자, 소송, 자문 전반을 구조화하여 제공합니다.');
    expect(seo.ogDescription).toBe(seo.description);
    expect(seo.twitterDescription).toBe(seo.description);
  });

  it('keeps explicit page SEO above live route defaults', () => {
    const services = makePage({
      seo: {
        title: 'Custom services title',
        description: 'Custom services description',
      },
    });

    const seo = buildPageSeo(services, 'https://tseng-law.com', 'ko', [services]);

    expect(seo.title).toBe('Custom services title');
    expect(seo.description).toBe('Custom services description');
  });

  it('advertises all locale alternates for public columns and videos routes', () => {
    const videosZh = makePage({
      pageId: 'videos-zh',
      slug: 'videos',
      locale: 'zh-hant',
      title: { ko: '미디어', 'zh-hant': '影音', en: 'Videos' },
    });

    const alternates = buildHreflangAlternates(videosZh, 'https://tseng-law.com', [videosZh]);

    expect(alternates.map((entry) => entry.hreflang)).toEqual(
      expect.arrayContaining(['ko', 'zh-Hant', 'en', 'x-default']),
    );
    expect(alternates.find((entry) => entry.hreflang === 'ko')?.href).toBe(
      'https://tseng-law.com/ko/videos',
    );
    expect(alternates.find((entry) => entry.hreflang === 'en')?.href).toBe(
      'https://tseng-law.com/en/videos',
    );
    expect(alternates.find((entry) => entry.hreflang === 'x-default')?.href).toBe(
      'https://tseng-law.com/ko/videos',
    );
  });
});
