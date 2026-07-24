import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';
import { locales, siteLocales, type SiteLocale } from '@/lib/locales';
import { PricingLegacyPageBody } from './legacy-page-bodies';

const pricingKeywords: Record<SiteLocale, string[]> = {
  ko: ['대만 변호사 비용', '대만 회사설립 수임료', '대만 소송 비용', '법무법인 호정 비용안내'],
  'zh-hant': ['台灣律師費用', '台灣公司設立收費', '台灣訴訟費用', '昊鼎收費'],
  en: ['Taiwan lawyer fees', 'Taiwan company setup fee', 'Taiwan litigation cost', 'Hovering pricing'],
  ja: ['台湾弁護士費用', '台湾会社設立費用', '台湾訴訟費用', '昊鼎国際法律事務所 費用'],
};

export function getPricingLegacyMetadata(locale: SiteLocale): Metadata {
  const copy = pageCopy[locale].pricing;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/pricing',
    keywords: pricingKeywords[locale],
    alternateLocales: locale === 'ja' ? siteLocales : locales,
  });
}

export function PricingLegacyPage({ locale }: { locale: SiteLocale }) {
  return <PricingLegacyPageBody locale={locale} />;
}
