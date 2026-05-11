import type { Metadata } from 'next';
import { PublishedSitePageView, type ResolvedPublishedSitePage } from '@/lib/builder/site/public-page';
import { createFlexTestDocument } from '@/lib/builder/canvas/fixtures/flex-test';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { DEFAULT_THEME } from '@/lib/builder/site/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Builder flex layout dev fixture',
  robots: { index: false, follow: false },
};

export default function BuilderFlexDevPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const now = '2026-04-28T00:00:00.000Z';
  const resolved: ResolvedPublishedSitePage = {
    locale,
    slugPath: 'admin-builder/_dev/flex',
    canvas: createFlexTestDocument(locale),
    site: {
      version: 1,
      siteId: 'flex-test',
      name: 'Flex Test',
      locale,
      navigation: [],
      theme: DEFAULT_THEME,
      settings: {
        firmName: 'Flex Test',
      },
      pages: [],
      createdAt: now,
      updatedAt: now,
    },
    pageMeta: {
      pageId: 'flex-test-page',
      slug: 'admin-builder/_dev/flex',
      title: {
        ko: 'Flex 테스트',
        'zh-hant': 'Flex 測試',
        en: 'Flex Test',
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
  };

  return <PublishedSitePageView resolved={resolved} />;
}
