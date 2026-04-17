import type { Metadata } from 'next';
import { legalPageContent } from '@/data/legal-pages';
import { buildSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/locales';
import { PrivacyLegacyPageBody } from './legacy-page-bodies';

export function getPrivacyLegacyMetadata(locale: Locale): Metadata {
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

export function PrivacyLegacyPage({ locale }: { locale: Locale }) {
  return <PrivacyLegacyPageBody locale={locale} />;
}
