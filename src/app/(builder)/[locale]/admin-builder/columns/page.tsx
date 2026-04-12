import type { Metadata } from 'next';
import ColumnListView from '@/components/builder/columns/ColumnListView';
import { listColumns } from '@/lib/builder/columns/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const builderColumnsSeoCopy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: 'Builder Columns Admin',
    description: '칼럼 초안 목록과 생성 관리 화면입니다.',
  },
  'zh-hant': {
    title: 'Builder Columns Admin',
    description: '欄目草稿列表與建立管理頁面。',
  },
  en: {
    title: 'Builder Columns Admin',
    description: 'Column draft list and creation admin surface.',
  },
};

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = builderColumnsSeoCopy[locale];

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/admin-builder/columns',
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
