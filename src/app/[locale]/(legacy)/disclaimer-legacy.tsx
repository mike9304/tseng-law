import type { Metadata } from 'next';
import { legalPageContent } from '@/data/legal-pages';
import { buildSeoMetadata } from '@/lib/seo';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import { DisclaimerLegacyPageBody } from './legacy-page-bodies';

export function getDisclaimerLegacyMetadata(locale: SiteLocale): Metadata {
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
        : locale === 'ja'
          ? [
              '台湾 法律事務所 免責事項',
              '台湾 法律情報 免責',
              '昊鼎国際法律事務所 免責',
            ]
          : ['disclaimer', 'law firm disclaimer', 'Taiwan legal information disclaimer'],
    ...(locale === 'ja' ? { alternateLocales: siteLocales } : {}),
  });
}

export function DisclaimerLegacyPage({ locale }: { locale: SiteLocale }) {
  return <DisclaimerLegacyPageBody locale={locale} />;
}
