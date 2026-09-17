import type { Metadata } from 'next';
import IntentLandingPage from '@/components/IntentLandingPage';
import { getIntentPage } from '@/data/intent-pages';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

const slug = 'taiwan-semiconductor-supplier-legal' as const;

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  const page = getIntentPage(locale, slug);

  if (!page) {
    return {};
  }

  return buildSeoMetadata({
    locale,
    // SEO 제목이 따로 있는 페이지만 <title>·og:title에 그 문구를 쓰고, 화면 H1은 page.title을 유지한다.
    title: page.seoTitle ?? page.title,
    description: page.description,
    path: `/${slug}`,
    keywords: page.keywords,
    alternateLocales: siteLocales,
  });
}

export default async function TaiwanSemiconductorSupplierLegalPage(props: { params: Promise<{ locale: SiteLocale }> }) {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);

  return <IntentLandingPage locale={locale} slug={slug} />;
}
