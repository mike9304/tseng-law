import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isSiteLocale, siteLocales } from '@/lib/locales';
import { buildCollectionPageJsonLd, buildSeoMetadata, getLocalizedPath } from '@/lib/seo';
import { TRAFFIC_PATH, trafficHubCopy } from '@/data/traffic-hub';
import { parseTrafficBoardQuery, type TrafficSearchParams } from '@/lib/traffic-collection';
import { loadTrafficCollection } from '@/lib/traffic-collection-server';
import TrafficPageView from './TrafficPageView';

// Published CMS columns join the board at runtime, and the board reads its filters from the query string.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  const copy = trafficHubCopy[locale];
  // The canonical is always the bare hub path, never a filtered query URL.
  return buildSeoMetadata({ locale, title: copy.title.replace('\n', ' '), description: copy.description,
    path: TRAFFIC_PATH, alternateLocales: siteLocales });
}

export default async function TrafficAccidentPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<TrafficSearchParams>;
}) {
  const { locale } = await params;
  if (!isSiteLocale(locale)) notFound();
  const copy = trafficHubCopy[locale];
  const [items, query] = await Promise.all([
    loadTrafficCollection(locale),
    Promise.resolve(searchParams).then(parseTrafficBoardQuery),
  ]);
  const collectionJsonLd = buildCollectionPageJsonLd({
    locale,
    path: getLocalizedPath(locale, TRAFFIC_PATH),
    name: copy.columns,
    description: copy.description,
    items: items.map((item) => ({ name: item.title, path: item.href, ...(item.summary ? { description: item.summary } : {}) })),
  });
  return <TrafficPageView locale={locale} items={items} query={query} copy={copy} collectionJsonLd={collectionJsonLd} />;
}
