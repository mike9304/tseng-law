import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import VideoChannel from '@/components/VideoChannel';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';

const videoKeywords: Record<Locale, string[]> = {
  ko: ['대만 변호사 유튜브', '대만 법률 영상', '호정 미디어센터', '증준외 유튜브'],
  'zh-hant': ['台灣律師 YouTube', '台灣法律影片', '昊鼎影音', '曾雋崴 頻道'],
  en: ['Taiwan legal videos', 'Taiwan lawyer YouTube', 'Hovering media', 'Wei Tseng channel'],
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].videos;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/videos',
    keywords: videoKeywords[locale],
  });
}

export default function VideosPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].videos;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <VideoChannel locale={locale} />
    </>
  );
}
