import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { readBuilderDynamicTemplatePublishedBlockVisibility } from '@/lib/builder/dynamic-template-drafts';
import { buildSeoMetadata } from '@/lib/seo';
import { locales, siteLocales, type SiteLocale } from '@/lib/locales';
import { ServicesLegacyPageBody } from './legacy-page-bodies';

const servicesKeywords: Record<SiteLocale, string[]> = {
  ko: ['대만 회사설립', '대만 투자 법률', '대만 민사소송', '대만 형사소송', '대만 노동법'],
  'zh-hant': ['台灣公司設立', '台灣投資法務', '台灣民事訴訟', '台灣刑事訴訟', '台灣勞動法'],
  en: ['Taiwan company setup', 'Taiwan investment law', 'Taiwan litigation', 'Taiwan employment disputes', 'Taiwan legal services'],
  ja: ['台湾会社設立', '台湾投資法務', '台湾民事訴訟', '台湾刑事事件', '台湾労働法'],
};

export function getServicesLegacyMetadata(locale: SiteLocale): Metadata {
  const copy = pageCopy[locale].services;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/services',
    keywords: servicesKeywords[locale],
    alternateLocales: locale === 'ja' ? siteLocales : locales,
  });
}

export async function ServicesLegacyPage({ locale }: { locale: SiteLocale }) {
  if (locale === 'ja') {
    return <ServicesLegacyPageBody locale={locale} />;
  }

  const templateVisibility = await readBuilderDynamicTemplatePublishedBlockVisibility(
    'service-areas.list-template',
    locale
  );

  return <ServicesLegacyPageBody locale={locale} visibleBlockIds={templateVisibility.visibleBlockIds} />;
}
