import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/locales';
import { AboutLegacyPageBody } from './legacy-page-bodies';

const aboutKeywords: Record<Locale, string[]> = {
  ko: ['법무법인 호정 소개', '증준외 변호사', '대만 변호사 소개', '호정 업무팀'],
  'zh-hant': ['昊鼎介紹', '曾俊瑋 律師', '台灣律師介紹', '昊鼎團隊'],
  en: ['About Hovering', 'Wei Tseng attorney profile', 'Taiwan legal team', 'Hovering law firm'],
};

export function getAboutLegacyMetadata(locale: Locale): Metadata {
  const copy = pageCopy[locale].about;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/about',
    keywords: aboutKeywords[locale],
  });
}

export function AboutLegacyPage({ locale }: { locale: Locale }) {
  return <AboutLegacyPageBody locale={locale} />;
}
