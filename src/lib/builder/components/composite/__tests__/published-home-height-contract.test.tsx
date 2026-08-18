import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { createHomePageCanvasDocumentDecomposed } from '@/lib/builder/canvas/seed-home';
import type { Locale } from '@/lib/locales';
import { PublishedSitePageView, type ResolvedPublishedSitePage } from '@/lib/builder/site/public-page';
import { DEFAULT_THEME } from '@/lib/builder/site/types';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ko',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function serializeCanvas<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function publishedHomeResolved(locale: Locale): ResolvedPublishedSitePage {
  const now = '2026-08-13T00:00:00.000Z';
  return {
    locale,
    slugPath: '',
    canvas: serializeCanvas(createHomePageCanvasDocumentDecomposed(locale)),
    site: {
      version: 1,
      siteId: `${locale}-home-height-fixture`,
      name: `${locale} Home Height Fixture`,
      locale,
      navigation: [],
      theme: DEFAULT_THEME,
      settings: { firmName: `${locale} Home Height Fixture` },
      pages: [],
      createdAt: now,
      updatedAt: now,
    },
    pageMeta: {
      pageId: `${locale}-home-height-fixture`,
      slug: '',
      title: { ko: '홈', 'zh-hant': '首頁', en: 'Home' },
      locale,
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
      noIndex: true,
    },
    lightboxes: [],
    popups: [],
    cookieConsent: null,
    headerCanvas: null,
    footerCanvas: null,
    datasetPreviewTargets: [],
    columnPosts: [],
    faqCategories: [],
    faqItems: [],
  };
}

function readPx(style: string, property: 'min-height' | 'height'): number {
  return Number(style.match(new RegExp(`${property}:\\s*(\\d+)px`))?.[1] ?? 0);
}

describe('published decomposed home height contract', () => {
  it.each(['ko', 'zh-hant'] as const)(
    'keeps serialized %s public main min-height at or under 7124 without dropping insights',
    async (locale) => {
      const resolved = publishedHomeResolved(locale);
      expect(resolved.canvas.stageHeight).toBeLessThanOrEqual(7124);

      const element = await PublishedSitePageView({ resolved });
      const html = renderToStaticMarkup(element);
      const mainStyle = html.match(/class="builder-pub-main"[^>]*style="([^"]*)"/)?.[1] ?? '';
      const insightsStyle = html.match(/data-node-id="home-insights-root"[^>]*style="([^"]*)"/)?.[1] ?? '';
      const mainMinHeight = readPx(mainStyle, 'min-height');
      const insightsMinHeight = readPx(insightsStyle, 'min-height');

      expect(mainMinHeight).toBeGreaterThan(7000);
      expect(mainMinHeight).toBeLessThanOrEqual(7124);
      expect(insightsMinHeight).toBe(820);
      expect(html).toContain('data-node-id="home-hero-title"');
    },
  );
});
