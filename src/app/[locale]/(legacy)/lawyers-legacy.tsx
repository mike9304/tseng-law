import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { readBuilderDynamicTemplatePublishedBlockVisibility } from '@/lib/builder/dynamic-template-drafts';
import { buildSeoMetadata } from '@/lib/seo';
import type { SiteLocale } from '@/lib/locales';
import { LawyersLegacyPageBody } from './legacy-page-bodies';

const lawyerKeywords: Record<SiteLocale, string[]> = {
  ko: ['증준외 변호사', '법무법인 호정 변호사', '대만 변호사', '대만 법률팀'],
  'zh-hant': ['曾雋崴 律師', '昊鼎律師團隊', '台灣律師', '昊鼎業務團隊'],
  en: ['Wei Tseng lawyer', 'Taiwan attorney profile', 'Hovering legal team', 'Taiwan law firm team'],
  ja: ['曾雋崴弁護士', '台湾弁護士', '昊鼎国際法律事務所', '韓国語対応の台湾弁護士'],
};

export function getLawyersLegacyMetadata(locale: SiteLocale): Metadata {
  const copy = pageCopy[locale].lawyers;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/lawyers',
    keywords: lawyerKeywords[locale],
  });
}

export async function LawyersLegacyPage({ locale }: { locale: SiteLocale }) {
  if (locale === 'ja') {
    return <LawyersLegacyPageBody locale={locale} />;
  }

  const templateVisibility = await readBuilderDynamicTemplatePublishedBlockVisibility(
    'attorney-profiles.list-template',
    locale
  );

  return <LawyersLegacyPageBody locale={locale} visibleBlockIds={templateVisibility.visibleBlockIds} />;
}
