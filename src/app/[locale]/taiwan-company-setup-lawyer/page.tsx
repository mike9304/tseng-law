import type { Metadata } from 'next';
import IntentLandingPage from '@/components/IntentLandingPage';
import { getIntentPage } from '@/data/intent-pages';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

const slug = 'taiwan-company-setup-lawyer' as const;

export function generateMetadata({ params }: { params: { locale: SiteLocale } }): Metadata {
  const locale = normalizeSiteLocale(params.locale);
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
    alternateLocales: siteLocales,
  });
}

export default function TaiwanCompanySetupLawyerPage({ params }: { params: { locale: SiteLocale } }) {
  const locale = normalizeSiteLocale(params.locale);

  return <IntentLandingPage locale={locale} slug={slug} />;
}
