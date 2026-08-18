import type { Metadata } from 'next';
import ColumnListView from '@/components/builder/columns/ColumnListView';
import { listColumns } from '@/lib/builder/columns/storage';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { getColumnsCopy } from './columns-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  props: {
    params: Promise<{ locale: Locale }>;
  }
): Promise<Metadata> {
  const params = await props.params;
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

export default async function BuilderColumnsAdminPage(
  props: {
    params: Promise<{ locale: Locale }>;
    searchParams?: Promise<{ contentLocale?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
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
