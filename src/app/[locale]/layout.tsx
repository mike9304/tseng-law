import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale, locales } from '@/lib/locales';
import JsonLd from '@/components/JsonLd';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocaleSetter from '@/components/LocaleSetter';
import ScrollTopButton from '@/components/ScrollTopButton';
import QuickContactWidget from '@/components/QuickContactWidget';
import YearEndEventPopup from '@/components/YearEndEventPopup';
import { getCmsLocaleContent } from '@/lib/cms/public';
import { getEnabledPublicBuilderDocument, resolveSharedHeaderContent } from '@/lib/cms/builder-public';
import { buildLegalServiceJsonLd, buildWebsiteJsonLd } from '@/lib/seo';

export const dynamicParams = false;

function resolveLocaleOrNotFound(locale: string): Locale {
  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = resolveLocaleOrNotFound(params.locale);
  const { siteContent } = await getCmsLocaleContent(locale);
  return {
    title: siteContent.meta.title,
    description: siteContent.meta.description
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = resolveLocaleOrNotFound(params.locale);
  const { siteContent } = await getCmsLocaleContent(locale);
  const publishedHomeBuilder = await getEnabledPublicBuilderDocument('home', locale);
  const sharedHeader = publishedHomeBuilder
    ? resolveSharedHeaderContent(publishedHomeBuilder, siteContent)
    : { siteContent, builderHeader: undefined };
  return (
    <div className="site" data-locale={locale} data-theme="parity">
      <LocaleSetter locale={locale} />
      <JsonLd data={buildWebsiteJsonLd(locale)} />
      <JsonLd data={buildLegalServiceJsonLd(locale)} />
      <Header locale={locale} content={sharedHeader.siteContent} builderHeader={sharedHeader.builderHeader} />
      <main id="main">{children}</main>
      <Footer locale={locale} content={sharedHeader.siteContent} />
      <QuickContactWidget locale={locale} content={sharedHeader.siteContent.quickContact} />
      <ScrollTopButton locale={locale} />
      <YearEndEventPopup locale={locale} />
    </div>
  );
}
