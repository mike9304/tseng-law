import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import { faqContent } from '@/data/faq-content';
import FAQAccordion from '@/components/FAQAccordion';
import JsonLd from '@/components/JsonLd';
import { buildSeoMetadata } from '@/lib/seo';

const faqKeywords: Record<Locale, string[]> = {
  ko: ['대만 변호사 FAQ', '대만 회사설립 FAQ', '대만 소송 상담', '법무법인 호정 FAQ'],
  'zh-hant': ['台灣律師 FAQ', '台灣公司設立 FAQ', '台灣訴訟諮詢', '昊鼎 FAQ'],
  en: ['Taiwan lawyer FAQ', 'Taiwan company setup FAQ', 'Taiwan consultation process', 'Hovering FAQ'],
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].faq;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/faq',
    keywords: faqKeywords[locale],
  });
}

export default function FaqPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].faq;
  const items = faqContent[locale];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <FAQAccordion locale={locale} items={items} />
      <JsonLd data={faqSchema} />
    </>
  );
}
