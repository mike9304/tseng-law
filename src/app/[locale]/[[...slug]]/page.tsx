import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  buildPublishedSitePageMetadata,
  PublishedSitePageView,
  resolvePublishedSitePage,
} from '@/lib/builder/site/public-page';
import { getLegacyPageMetadata, renderLegacyPage } from '../(legacy)';

export const dynamic = 'force-dynamic';

function resolveSlugPath(slug?: string[]): string {
  return slug?.join('/') || '';
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug?: string[] };
}): Promise<Metadata> {
  const locale: Locale = normalizeLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  const legacyMetadata = getLegacyPageMetadata(slugPath, locale);
  if (legacyMetadata) return legacyMetadata;

  const publishedMetadata = await buildPublishedSitePageMetadata(locale, slugPath);
  if (publishedMetadata) return publishedMetadata;

  return { title: 'Page not found' };
}

export default async function MainSiteCatchAllPage({
  params,
}: {
  params: { locale: string; slug?: string[] };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  const legacyPage = renderLegacyPage(slugPath, locale);
  if (legacyPage) return legacyPage;

  const publishedPage = await resolvePublishedSitePage(locale, slugPath);
  if (publishedPage) {
    return <PublishedSitePageView resolved={publishedPage} />;
  }

  notFound();
}
