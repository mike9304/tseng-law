import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { seedSitePages } from '@/lib/builder/canvas/seed-pages';
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

  await seedSitePages('default', locale);

  const publishedMetadata = await buildPublishedSitePageMetadata(locale, slugPath);
  if (publishedMetadata) return publishedMetadata;

  return getLegacyPageMetadata(slugPath, locale) ?? { title: 'Page not found' };
}

export default async function MainSiteCatchAllPage({
  params,
}: {
  params: { locale: string; slug?: string[] };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  await seedSitePages('default', locale);

  const publishedPage = await resolvePublishedSitePage(locale, slugPath);
  if (publishedPage) {
    return <PublishedSitePageView resolved={publishedPage} />;
  }

  const legacyPage = renderLegacyPage(slugPath, locale);
  if (legacyPage) return legacyPage;

  notFound();
}
