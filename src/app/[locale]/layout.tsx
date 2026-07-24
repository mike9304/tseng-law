import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isSiteLocale, type SiteLocale, siteLocales, toBuilderLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import JsonLd from '@/components/JsonLd';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollTopButton from '@/components/ScrollTopButton';
import QuickContactWidget from '@/components/QuickContactWidget';
import YearEndEventPopup from '@/components/YearEndEventPopup';
import { buildLegalServiceJsonLd, buildWebsiteJsonLd } from '@/lib/seo';

export const dynamicParams = false;

function resolveLocaleOrNotFound(locale: string): SiteLocale {
  if (!isSiteLocale(locale)) {
    notFound();
  }

  return locale;
}

export function generateStaticParams() {
  return siteLocales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = resolveLocaleOrNotFound(params.locale);
  const content = siteContent[locale];
  return {
    title: content.meta.title,
    description: content.meta.description
  };
}

export default function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = resolveLocaleOrNotFound(params.locale);
  // Hide non-JA product widgets on Japanese public surface (plan: columns+core pages first).
  const hideJaProductChrome = locale === 'ja';
  return (
    <div className="site" data-locale={locale} data-theme="parity">
      <JsonLd data={buildWebsiteJsonLd(toBuilderLocale(locale))} />
      <JsonLd data={buildLegalServiceJsonLd(toBuilderLocale(locale))} />
      <div data-legacy-chrome>
        <Header locale={locale} />
      </div>
      <main id="main">{children}</main>
      <div data-legacy-chrome>
        <Footer locale={locale as never} />
      </div>
      {!hideJaProductChrome ? (
        <div data-legacy-chrome>
          <QuickContactWidget locale={toBuilderLocale(locale)} />
        </div>
      ) : null}
      <div data-legacy-chrome>
        <ScrollTopButton locale={locale as never} />
      </div>
      {!hideJaProductChrome ? (
        <div data-legacy-chrome>
          <YearEndEventPopup locale={toBuilderLocale(locale)} />
        </div>
      ) : null}
    </div>
  );
}
