import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';
import { siteLocales, type SiteLocale } from '@/lib/locales';
import { AboutLegacyPageBody } from './legacy-page-bodies';

const aboutKeywords: Record<SiteLocale, string[]> = {
  ko: ['법무법인 호정 소개', '증준외 변호사', '대만 변호사 소개', '호정 업무팀'],
  'zh-hant': ['昊鼎介紹', '曾雋崴 律師', '台灣律師介紹', '昊鼎團隊'],
  en: ['About Hovering', 'Wei Tseng attorney profile', 'Taiwan legal team', 'Hovering law firm'],
  ja: ['昊鼎国際法律事務所', '曾雋崴弁護士', '台湾弁護士', '韓国・台湾業務チーム'],
};

export function getAboutLegacyMetadata(locale: SiteLocale): Metadata {
  const copy = pageCopy[locale].about;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/about',
    keywords: aboutKeywords[locale],
    ...(locale === 'ja' ? { alternateLocales: siteLocales } : {}),
  });
}

export function AboutLegacyPage({ locale }: { locale: SiteLocale }) {
  return <AboutLegacyPageBody locale={locale} />;
}
