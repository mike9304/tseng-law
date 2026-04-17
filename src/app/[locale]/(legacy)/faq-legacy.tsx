import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/locales';
import { FaqLegacyPageBody } from './legacy-page-bodies';

const faqKeywords: Record<Locale, string[]> = {
  ko: ['대만 변호사 FAQ', '대만 회사설립 FAQ', '대만 소송 상담', '법무법인 호정 FAQ'],
  'zh-hant': ['台灣律師 FAQ', '台灣公司設立 FAQ', '台灣訴訟諮詢', '昊鼎 FAQ'],
  en: ['Taiwan lawyer FAQ', 'Taiwan company setup FAQ', 'Taiwan consultation process', 'Hovering FAQ'],
};

export function getFaqLegacyMetadata(locale: Locale): Metadata {
  const copy = pageCopy[locale].faq;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/faq',
    keywords: faqKeywords[locale],
  });
}

export function FaqLegacyPage({ locale }: { locale: Locale }) {
  return <FaqLegacyPageBody locale={locale} />;
}
