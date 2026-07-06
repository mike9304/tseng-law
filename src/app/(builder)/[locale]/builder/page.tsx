import type { Metadata } from 'next';
import BuilderWorkspaceDashboard from '@/components/builder/BuilderWorkspaceDashboard';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const builderDashboardSeoCopy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '빌더 작업 공간',
    description: '호정 빌더 작업 공간 대시보드입니다.',
  },
  'zh-hant': {
    title: '建構器工作區',
    description: '昊鼎建構器工作區儀表板。',
  },
  en: {
    title: 'Builder Workspace',
    description: 'Workspace dashboard for the Tseng Law builder.',
  },
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = builderDashboardSeoCopy[locale];

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/builder',
    noindex: true,
  });
}

export default async function BuilderWorkspacePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  const overview = await readBuilderSiteOverview(locale);

  return <BuilderWorkspaceDashboard locale={locale} overview={overview} />;
}
