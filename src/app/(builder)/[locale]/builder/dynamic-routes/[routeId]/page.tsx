import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderDynamicRouteWorkspaceShell from '@/components/builder/BuilderDynamicRouteWorkspaceShell';
import {
  decodeBuilderDynamicRouteParam,
  readBuilderDynamicRouteDetail,
} from '@/lib/builder/dynamic-routes';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const dynamicRouteCopy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '빌더 동적 경로 세부 정보',
    description: '호정 빌더 안의 읽기 전용 동적 경로 레지스트리와 미리보기 접합 화면입니다.',
  },
  'zh-hant': {
    title: '建構器動態路由詳細資料',
    description: '昊鼎建構器中的唯讀動態路由登錄與預覽情境接縫頁。',
  },
  en: {
    title: 'Builder Dynamic Route Detail',
    description: 'Read-only dynamic route registry and preview context seam inside the Hojeong builder.',
  },
};

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; routeId: string };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = dynamicRouteCopy[locale];
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: `/builder/dynamic-routes/${params.routeId}`,
    alternateLocales: locales,
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
