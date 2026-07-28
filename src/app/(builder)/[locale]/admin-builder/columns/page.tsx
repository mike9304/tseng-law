import type { Metadata } from 'next';
import ColumnListView from '@/components/builder/columns/ColumnListView';
import { listColumns } from '@/lib/builder/columns/storage';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { getColumnsCopy } from './columns-copy';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = getColumnsCopy(locale);

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/admin-builder/columns',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderColumnsAdminPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { contentLocale?: string };
}) {
  const locale = normalizeLocale(params.locale);
  const contentLocale = normalizeLocale(searchParams?.contentLocale ?? locale);
  const initialColumns = await listColumns(contentLocale);

  return (
    <ColumnListView
      routeLocale={locale}
      contentLocale={contentLocale}
      initialColumns={initialColumns}
    />
  );
}
