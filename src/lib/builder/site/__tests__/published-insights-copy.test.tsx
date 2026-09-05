import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { createHomeTextNode } from '@/lib/builder/canvas/decompose-home-shared';
import { CANVAS_SANDBOX_UPDATED_BY } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { PublishedSitePageView, type ResolvedPublishedSitePage } from '@/lib/builder/site/public-page';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import { ARCHIVE_INTRO_COPY } from '@/lib/insights/archive-copy';

vi.mock('next/navigation', () => ({
  usePathname: () => '/zh-hant',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const LEGACY_ZH_HANT_ARCHIVE_INTRO = '以下內容直接對應已整理的專欄原文與圖片素材。';

function publishedPage(slugPath: string, locale: Locale = 'zh-hant'): ResolvedPublishedSitePage {
  const now = '2026-09-05T00:00:00.000Z';
  return {
    locale,
    slugPath,
    canvas: {
      version: 1,
      locale,
      updatedAt: now,
      updatedBy: CANVAS_SANDBOX_UPDATED_BY,
      stageWidth: 1280,
      stageHeight: 400,
      nodes: [
        createHomeTextNode({
          id: 'home-insights-description',
          rect: { x: 0, y: 88, width: 720, height: 44 },
          zIndex: 0,
          text: LEGACY_ZH_HANT_ARCHIVE_INTRO,
          className: 'section-lede',
          as: 'p',
        }),
      ],
    },
    site: {
      version: 1,
      siteId: 'published-insights-copy-fixture',
      name: 'Published Insights Copy Fixture',
      locale,
      navigation: [],
      theme: DEFAULT_THEME,
      settings: { firmName: 'Published Insights Copy Fixture' },
      pages: [],
      createdAt: now,
      updatedAt: now,
    },
    pageMeta: {
      pageId: 'published-insights-copy-fixture',
      slug: slugPath,
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

describe('published insights archive intro projection', () => {
  it('projects leftover home seed copy through the public-page renderer', async () => {
    const element = await PublishedSitePageView({ resolved: publishedPage('') });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('data-node-id="home-insights-description"');
    expect(html).toContain(ARCHIVE_INTRO_COPY['zh-hant']);
    expect(html).not.toContain(LEGACY_ZH_HANT_ARCHIVE_INTRO);
  });

  it('does not project leftover seed copy on non-home routes', async () => {
    const element = await PublishedSitePageView({ resolved: publishedPage('pricing') });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('data-node-id="home-insights-description"');
    expect(html).toContain(LEGACY_ZH_HANT_ARCHIVE_INTRO);
    expect(html).not.toContain(ARCHIVE_INTRO_COPY['zh-hant']);
  });
});
