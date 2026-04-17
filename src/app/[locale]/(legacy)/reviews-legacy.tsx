import type { Metadata } from 'next';
import { pageCopy } from '@/data/page-copy';
import { buildSeoMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/locales';
import { ReviewsLegacyPageBody } from './legacy-page-bodies';

const reviewKeywords: Record<Locale, string[]> = {
  ko: ['법무법인 호정 후기', '대만 변호사 후기', '대만 회사설립 후기', '대만 소송 후기'],
  'zh-hant': ['昊鼎評價', '台灣律師評價', '台灣公司設立評價', '台灣訴訟評價'],
  en: ['Hovering reviews', 'Taiwan lawyer reviews', 'Taiwan legal service testimonials', 'Taiwan law firm feedback'],
};

export function getReviewsLegacyMetadata(locale: Locale): Metadata {
  const copy = pageCopy[locale].reviews;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/reviews',
    keywords: reviewKeywords[locale],
    noindex: true,
  });
}

export function ReviewsLegacyPage({ locale }: { locale: Locale }) {
  return <ReviewsLegacyPageBody locale={locale} />;
}
