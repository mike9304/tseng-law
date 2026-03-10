import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import { buildSeoMetadata } from '@/lib/seo';

const lawyerKeywords: Record<Locale, string[]> = {
  ko: ['증준외 변호사', '법무법인 호정 변호사', '대만 변호사', '대만 법률팀'],
  'zh-hant': ['曾雋崴 律師', '昊鼎律師團隊', '台灣律師', '昊鼎業務團隊'],
  en: ['Wei Tseng lawyer', 'Taiwan attorney profile', 'Hovering legal team', 'Taiwan law firm team'],
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].lawyers;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/lawyers',
    keywords: lawyerKeywords[locale],
  });
}

export default function LawyersPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].lawyers;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <AttorneyProfileSection locale={locale} />
    </>
  );
}
