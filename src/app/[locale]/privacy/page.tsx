import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { legalPageContent } from '@/data/legal-pages';
import LegalPageSections from '@/components/LegalPageSections';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const content = legalPageContent[locale].privacy;

  return buildSeoMetadata({
    locale,
    title: content.title,
    description: content.description,
    path: '/privacy',
    keywords: locale === 'ko'
      ? ['개인정보 처리방침', '법무법인 호정 개인정보', '대만 변호사 개인정보']
      : locale === 'zh-hant'
        ? ['隱私權政策', '昊鼎個資', '台灣律師隱私']
        : ['privacy policy', 'Taiwan law firm privacy', 'legal consultation privacy'],
  });
}

export default function PrivacyPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const content = legalPageContent[locale].privacy;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: content.title, path: `/${locale}/privacy` },
        ])}
      />
      <LegalPageSections locale={locale} content={content} />
    </>
  );
}
