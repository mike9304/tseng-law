import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/locales';
import { LawyersLegacyPageBody } from './legacy-page-bodies';

const lawyerKeywords: Record<Locale, string[]> = {
  ko: ['증준외 변호사', '법무법인 호정 변호사', '대만 변호사', '대만 법률팀'],
  'zh-hant': ['曾俊瑋 律師', '昊鼎律師團隊', '台灣律師', '昊鼎業務團隊'],
  en: ['Wei Tseng lawyer', 'Taiwan attorney profile', 'Hovering legal team', 'Taiwan law firm team'],
};

export function getLawyersLegacyMetadata(locale: Locale): Metadata {
  const copy = pageCopy[locale].lawyers;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/lawyers',
    keywords: lawyerKeywords[locale],
  });
}

export function LawyersLegacyPage({ locale }: { locale: Locale }) {
  return <LawyersLegacyPageBody locale={locale} />;
}
