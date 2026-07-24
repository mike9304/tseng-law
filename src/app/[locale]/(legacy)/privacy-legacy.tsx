import type { Metadata } from 'next';
import { legalPageContent } from '@/data/legal-pages';
import { buildSeoMetadata } from '@/lib/seo';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import { PrivacyLegacyPageBody } from './legacy-page-bodies';

export function getPrivacyLegacyMetadata(locale: SiteLocale): Metadata {
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
        : locale === 'ja'
          ? [
              '台湾 法律事務所 プライバシーポリシー',
              '昊鼎国際法律事務所 個人情報',
              '台湾 法律相談 プライバシー',
            ]
          : ['privacy policy', 'Taiwan law firm privacy', 'legal consultation privacy'],
    ...(locale === 'ja' ? { alternateLocales: siteLocales } : {}),
  });
}

export function PrivacyLegacyPage({ locale }: { locale: SiteLocale }) {
  return <PrivacyLegacyPageBody locale={locale} />;
}
