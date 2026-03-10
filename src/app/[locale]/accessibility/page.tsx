import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { legalPageContent } from '@/data/legal-pages';
import LegalPageSections from '@/components/LegalPageSections';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const content = legalPageContent[locale].accessibility;

  return buildSeoMetadata({
    locale,
    title: content.title,
    description: content.description,
    path: '/accessibility',
    keywords: locale === 'ko'
      ? ['웹 접근성', '법무법인 호정 접근성', '대만 변호사 사이트 접근성']
      : locale === 'zh-hant'
        ? ['無障礙聲明', '昊鼎網站可近用性', '法律網站無障礙']
        : ['accessibility statement', 'law firm accessibility', 'accessible legal website'],
  });
}

export default function AccessibilityPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const content = legalPageContent[locale].accessibility;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: content.title, path: `/${locale}/accessibility` },
        ])}
      />
      <LegalPageSections locale={locale} content={content} />
    </>
  );
}
