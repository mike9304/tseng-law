import type { Metadata } from 'next';
import IntentLandingPage from '@/components/IntentLandingPage';
import { getIntentPage } from '@/data/intent-pages';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

const slug = 'taiwan-litigation-lawyer' as const;

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const page = getIntentPage(locale, slug);

  if (!page) {
    return {};
  }

  return buildSeoMetadata({
    locale,
    title: page.title,
    description: page.description,
    path: `/${slug}`,
    keywords: page.keywords,
  });
}

export default function TaiwanLitigationLawyerPage({ params }: { params: { locale: Locale } }) {
  return <IntentLandingPage locale={normalizeLocale(params.locale)} slug={slug} />;
}
