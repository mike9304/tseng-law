import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderCollectionWorkspaceShell from '@/components/builder/BuilderCollectionWorkspaceShell';
import {
  isBuilderCollectionId,
  readBuilderCollectionDetail,
} from '@/lib/builder/cms';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; collectionId: string };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Builder Collection Detail',
    description: 'Read-only collection detail inside the Hojeong builder.',
    path: `/builder/collections/${params.collectionId}`,
    noindex: true,
  });
}

export default async function BuilderCollectionDetailPage({
  params,
}: {
  params: { locale: Locale; collectionId: string };
}) {
  const locale = normalizeLocale(params.locale);
  if (!isBuilderCollectionId(params.collectionId)) {
    notFound();
  }

  const [overview, detail] = await Promise.all([
    readBuilderSiteOverview(locale),
    Promise.resolve(readBuilderCollectionDetail(params.collectionId, locale)),
  ]);

  return <BuilderCollectionWorkspaceShell locale={locale} overview={overview} detail={detail} />;
}
