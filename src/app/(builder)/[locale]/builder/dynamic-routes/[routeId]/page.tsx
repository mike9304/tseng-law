import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderDynamicRouteWorkspaceShell from '@/components/builder/BuilderDynamicRouteWorkspaceShell';
import {
  decodeBuilderDynamicRouteParam,
  readBuilderDynamicRouteDetail,
} from '@/lib/builder/dynamic-routes';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; routeId: string };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Builder Dynamic Route Detail',
    description: 'Read-only dynamic route registry and preview context seam inside the Hojeong builder.',
    path: `/builder/dynamic-routes/${params.routeId}`,
    noindex: true,
  });
}

export default async function BuilderDynamicRouteDetailPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; routeId: string };
  searchParams?: { previewRecordId?: string };
}) {
  const locale = normalizeLocale(params.locale);
  const routeId = decodeBuilderDynamicRouteParam(params.routeId);

  if (!routeId) {
    notFound();
  }

  const [overview, detail] = await Promise.all([
    readBuilderSiteOverview(locale),
    Promise.resolve(readBuilderDynamicRouteDetail(routeId, locale, searchParams?.previewRecordId)),
  ]);

  return <BuilderDynamicRouteWorkspaceShell locale={locale} overview={overview} detail={detail} />;
}
