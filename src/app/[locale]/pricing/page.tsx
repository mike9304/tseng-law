import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import PricingCards from '@/components/PricingCards';
import { buildSeoMetadata } from '@/lib/seo';

const pricingKeywords: Record<Locale, string[]> = {
  ko: ['대만 변호사 비용', '대만 회사설립 수임료', '대만 소송 비용', '법무법인 호정 비용안내'],
  'zh-hant': ['台灣律師費用', '台灣公司設立收費', '台灣訴訟費用', '昊鼎收費'],
  en: ['Taiwan lawyer fees', 'Taiwan company setup fee', 'Taiwan litigation cost', 'Hovering pricing'],
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].pricing;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/pricing',
    keywords: pricingKeywords[locale],
  });
}

export default function PricingPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].pricing;

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <PricingCards locale={locale} />
    </>
  );
}
