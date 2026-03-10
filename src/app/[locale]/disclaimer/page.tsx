import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { legalPageContent } from '@/data/legal-pages';
import LegalPageSections from '@/components/LegalPageSections';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const content = legalPageContent[locale].disclaimer;

  return buildSeoMetadata({
    locale,
    title: content.title,
    description: content.description,
    path: '/disclaimer',
    keywords: locale === 'ko'
      ? ['면책 고지', '법무법인 호정 면책', '법률정보 면책']
      : locale === 'zh-hant'
        ? ['免責聲明', '昊鼎免責', '法律資訊免責']
        : ['disclaimer', 'law firm disclaimer', 'Taiwan legal information disclaimer'],
  });
}

export default function DisclaimerPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const content = legalPageContent[locale].disclaimer;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: content.title, path: `/${locale}/disclaimer` },
        ])}
      />
      <LegalPageSections locale={locale} content={content} />
    </>
  );
}
