import type { Metadata } from 'next';
import IntentLandingPage from '@/components/IntentLandingPage';
import { getIntentPage } from '@/data/intent-pages';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

const slug = 'taiwan-litigation-lawyer' as const;

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const params = await props.params;
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

export default async function TaiwanLitigationLawyerPage(props: { params: Promise<{ locale: SiteLocale }> }) {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);

  return <IntentLandingPage locale={locale} slug={slug} />;
}
