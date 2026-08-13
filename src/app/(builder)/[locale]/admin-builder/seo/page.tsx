import type { Metadata } from 'next';
import SeoDashboardView from '@/components/builder/seo/SeoDashboardView';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { buildBuilderSeoOverview } from '@/lib/builder/seo/overview';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

function getSeoDashboardMetadata(locale: Locale): Metadata {
  return {
    title: locale === 'ko' ? 'SEO 대시보드' : locale === 'zh-hant' ? 'SEO 儀表板' : 'SEO Dashboard',
    robots: { index: false, follow: false },
  };
}

export default async function BuilderSeoDashboardPage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);
  const site = await readSiteDocument('default', locale);
  const canvasesByPageId = new Map<string, BuilderCanvasDocument | null>();

  await Promise.all(site.pages.map(async (page) => {
    canvasesByPageId.set(page.pageId, await readPageCanvas('default', page.pageId, 'draft'));
  }));

  return (
    <SeoDashboardView
      locale={locale}
      initialOverview={buildBuilderSeoOverview({ site, canvasesByPageId })}
    />
  );
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);
  return getSeoDashboardMetadata(locale);
}
