import type { Metadata } from 'next';
import {
  normalizeSiteLocale,
  siteLocales,
  type SiteLocale,
} from '@/lib/locales';
import { legalPageContent } from '@/data/legal-pages';
import LegalPageSections from '@/components/LegalPageSections';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo';

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
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
        : locale === 'ja'
          ? [
              'ウェブアクセシビリティ',
              '昊鼎国際法律事務所 アクセシビリティ',
              '台湾 法律サイト アクセシビリティ',
            ]
          : ['accessibility statement', 'law firm accessibility', 'accessible legal website'],
    ...(locale === 'ja' ? { alternateLocales: siteLocales } : {}),
  });
}

export default async function AccessibilityPage(props: { params: Promise<{ locale: SiteLocale }> }) {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const content = legalPageContent[locale].accessibility;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          {
            name: locale === 'ko'
              ? '홈'
              : locale === 'zh-hant'
                ? '首頁'
                : locale === 'ja'
                  ? 'ホーム'
                  : 'Home',
            path: `/${locale}`,
          },
          { name: content.title, path: `/${locale}/accessibility` },
        ])}
      />
      <LegalPageSections locale={locale} content={content} />
    </>
  );
}
