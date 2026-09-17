import type { Metadata } from 'next';
import SemiconductorGuidePublic from '@/components/semiconductor-drafts/SemiconductorGuidePublic';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import { SEMICONDUCTOR_GUIDE_PATH, semiconductorGuideCopy } from '@/lib/semiconductor-public';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {
  params: Promise<{ locale: SiteLocale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const copy = semiconductorGuideCopy[locale];

  return buildSeoMetadata({
    locale,
    title: copy.metaTitle,
    description: copy.description,
    path: SEMICONDUCTOR_GUIDE_PATH,
    keywords:
      locale === 'ko'
        ? ['반도체', '대만 진출', '자회사', '지사', '실무가이드']
        : locale === 'zh-hant'
          ? ['半導體', '進入台灣', '子公司', '分公司']
          : locale === 'ja'
            ? ['半導体', '台湾進出', '子会社', '支店']
            : ['semiconductor', 'Taiwan entry', 'subsidiary', 'branch'],
    alternateLocales: siteLocales,
  });
}

export default async function SemiconductorGuidePage(props: {
  params: Promise<{ locale: SiteLocale }>;
}) {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  return <SemiconductorGuidePublic locale={locale} />;
}
