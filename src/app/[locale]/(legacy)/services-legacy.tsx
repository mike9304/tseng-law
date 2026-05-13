import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { readBuilderDynamicTemplatePublishedBlockVisibility } from '@/lib/builder/dynamic-template-drafts';
import { buildSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/locales';
import { ServicesLegacyPageBody } from './legacy-page-bodies';

const servicesKeywords: Record<Locale, string[]> = {
  ko: ['대만 회사설립', '대만 투자 법률', '대만 민사소송', '대만 형사소송', '대만 노동법'],
  'zh-hant': ['台灣公司設立', '台灣投資法務', '台灣民事訴訟', '台灣刑事訴訟', '台灣勞動法'],
  en: ['Taiwan company setup', 'Taiwan investment law', 'Taiwan litigation', 'Taiwan employment disputes', 'Taiwan legal services'],
};

export function getServicesLegacyMetadata(locale: Locale): Metadata {
  const copy = pageCopy[locale].services;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/services',
    keywords: servicesKeywords[locale],
  });
}

export async function ServicesLegacyPage({ locale }: { locale: Locale }) {
  const templateVisibility = await readBuilderDynamicTemplatePublishedBlockVisibility(
    'service-areas.list-template',
    locale
  );

  return <ServicesLegacyPageBody locale={locale} visibleBlockIds={templateVisibility.visibleBlockIds} />;
}
