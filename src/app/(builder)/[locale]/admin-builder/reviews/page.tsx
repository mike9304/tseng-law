import type { Metadata } from 'next';
import ReviewsModerationClient from '@/components/builder/reviews/ReviewsModerationClient';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { readReviews } from '@/lib/reviews/storage';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: locale === 'en' ? 'Review Moderation' : locale === 'zh-hant' ? '評價管理' : '후기 관리',
    description: 'Moderate public client reviews.',
    path: '/admin-builder/reviews',
    noindex: true,
  });
}

export default async function BuilderReviewsAdminPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  const reviews = await readReviews();

  return (
    <ReviewsModerationClient
      initialReviews={reviews}
      locale={locale}
    />
  );
}
