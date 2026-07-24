import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';
import { locales, siteLocales, type SiteLocale } from '@/lib/locales';
import { ContactLegacyPageBody } from './legacy-page-bodies';

const contactKeywords: Record<SiteLocale, string[]> = {
  ko: ['대만 변호사 상담', '법무법인 호정 연락처', '대만 회사설립 문의', '대만 소송 상담'],
  'zh-hant': ['台灣律師諮詢', '昊鼎聯絡方式', '台灣公司設立詢問', '台灣訴訟諮詢'],
  en: ['Taiwan lawyer contact', 'Taiwan legal consultation', 'Hovering contact', 'Taiwan company setup inquiry'],
  ja: ['台湾法律相談', '台湾弁護士相談', '昊鼎国際法律事務所', '台湾会社設立相談'],
};

export function getContactLegacyMetadata(locale: SiteLocale): Metadata {
  const copy = pageCopy[locale].contact;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/contact',
    keywords: contactKeywords[locale],
    alternateLocales: locale === 'ja' ? siteLocales : locales,
  });
}

export function ContactLegacyPage({ locale }: { locale: SiteLocale }) {
  return <ContactLegacyPageBody locale={locale} />;
}
