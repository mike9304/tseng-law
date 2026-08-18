import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { createHomePageCanvasDocumentDecomposed } from '@/lib/builder/canvas/seed-home';
import { PublishedSitePageView, type ResolvedPublishedSitePage } from '@/lib/builder/site/public-page';
import { DEFAULT_THEME } from '@/lib/builder/site/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Builder decomposed home fixture',
  robots: { index: false, follow: false },
};

function createDecomposedHomeFixtureDocument(locale: Locale, updatedAt: string): BuilderCanvasDocument {
  const document = createHomePageCanvasDocumentDecomposed(locale);
  return {
    ...document,
    updatedAt,
    updatedBy: 'decomposed-home-fixture',
  };
}

export default async function BuilderDecomposedHomeFixturePage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale: Locale = normalizeLocale(params.locale);
  const now = '2026-07-03T00:00:00.000Z';
  const resolved: ResolvedPublishedSitePage = {
    locale,
    slugPath: '',
    canvas: createDecomposedHomeFixtureDocument(locale, now),
    site: {
      version: 1,
      siteId: 'decomposed-home-fixture',
      name: 'Decomposed Home Fixture',
      locale,
      navigation: [],
      theme: DEFAULT_THEME,
      settings: {
        firmName: 'Decomposed Home Fixture',
      },
      pages: [],
      createdAt: now,
      updatedAt: now,
    },
    pageMeta: {
      pageId: 'decomposed-home-fixture-page',
      slug: '',
      title: {
        ko: 'Decomposed Home Fixture',
        'zh-hant': 'Decomposed Home Fixture',
        en: 'Decomposed Home Fixture',
      },
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

  return <PublishedSitePageView resolved={resolved} />;
}
