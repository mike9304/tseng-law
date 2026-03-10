import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import ContactBlocks from '@/components/ContactBlocks';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import FirmIntroductionSection from '@/components/FirmIntroductionSection';
import { buildSeoMetadata } from '@/lib/seo';

const aboutKeywords: Record<Locale, string[]> = {
  ko: ['법무법인 호정 소개', '증준외 변호사', '대만 변호사 소개', '호정 업무팀'],
  'zh-hant': ['昊鼎介紹', '曾雋崴 律師', '台灣律師介紹', '昊鼎團隊'],
  en: ['About Hovering', 'Wei Tseng attorney profile', 'Taiwan legal team', 'Hovering law firm'],
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].about;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/about',
    keywords: aboutKeywords[locale],
  });
}

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].about;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <FirmIntroductionSection locale={locale} />
      <AttorneyProfileSection locale={locale} />
      <ContactBlocks locale={locale} />
    </>
  );
}
