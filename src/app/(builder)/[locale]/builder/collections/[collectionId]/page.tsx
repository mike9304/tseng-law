import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderCollectionWorkspaceShell from '@/components/builder/BuilderCollectionWorkspaceShell';
import {
  isBuilderCollectionId,
  readBuilderCollectionDetailForSite,
} from '@/lib/builder/cms';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const collectionCopy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '빌더 컬렉션 세부 정보',
    description: '호정 빌더 안의 읽기 전용 컬렉션 상세 화면입니다.',
  },
  'zh-hant': {
    title: '建構器集合詳細資料',
    description: '昊鼎建構器中的唯讀集合詳細頁。',
  },
  en: {
    title: 'Builder Collection Detail',
    description: 'Read-only collection detail inside the Hojeong builder.',
  },
};

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; collectionId: string };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = collectionCopy[locale];
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: `/builder/collections/${params.collectionId}`,
    alternateLocales: locales,
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
    readBuilderCollectionDetailForSite(DEFAULT_BUILDER_SITE_ID, params.collectionId, locale),
  ]);

  return <BuilderCollectionWorkspaceShell locale={locale} overview={overview} detail={detail} />;
}
