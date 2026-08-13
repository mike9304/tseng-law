import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderStarterTemplateWorkspaceShell from '@/components/builder/BuilderStarterTemplateWorkspaceShell';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import {
  decodeBuilderStarterTemplateParam,
  readBuilderStarterTemplateDetail,
} from '@/lib/builder/starter-templates';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const starterTemplateCopy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '빌더 스타터 템플릿 세부 정보',
    description: '호정 빌더 안의 템플릿 우선 스타터 상세 화면입니다.',
  },
  'zh-hant': {
    title: '建構器起始範本詳細資料',
    description: '昊鼎建構器中的範本優先起始詳細頁。',
  },
  en: {
    title: 'Builder Starter Template Detail',
    description: 'Template-first starter detail inside the Hojeong builder.',
  },
};

export async function generateMetadata(
  props: {
    params: Promise<{ locale: Locale; templateId: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = starterTemplateCopy[locale];
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: `/builder/starter-templates/${params.templateId}`,
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderStarterTemplateDetailPage(
  props: {
    params: Promise<{ locale: Locale; templateId: string }>;
  }
) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const templateId = decodeBuilderStarterTemplateParam(params.templateId);

  if (!templateId) {
    notFound();
  }

  const [overview, detail] = await Promise.all([
    readBuilderSiteOverview(locale),
    Promise.resolve(readBuilderStarterTemplateDetail(templateId, locale)),
  ]);

  return <BuilderStarterTemplateWorkspaceShell locale={locale} overview={overview} detail={detail} />;
}
