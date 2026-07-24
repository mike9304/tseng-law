import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isSiteLocale, type SiteLocale, siteLocales, toBuilderLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import JsonLd from '@/components/JsonLd';
import DocumentLocaleSync from '@/components/DocumentLocaleSync';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollTopButton from '@/components/ScrollTopButton';
import QuickContactWidget from '@/components/QuickContactWidget';
import YearEndEventPopup from '@/components/YearEndEventPopup';
import {
  getLocaleFontClassName,
  getManagedLocaleFontClassNames,
  type DocumentLanguage,
} from '@/app/fonts';
import { buildLegalServiceJsonLd, buildWebsiteJsonLd, getOrganizationName } from '@/lib/seo';

export const dynamicParams = false;

const documentLanguageByLocale: Record<SiteLocale, DocumentLanguage> = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
};

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
  const organizationName = getOrganizationName(locale);
  return {
    title: content.meta.title,
    description: content.meta.description,
    applicationName: organizationName,
    authors: [{ name: organizationName }],
    creator: organizationName,
    publisher: organizationName,
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
  const language = documentLanguageByLocale[locale];
  // Hide non-JA product widgets on Japanese public surface (plan: columns+core pages first).
  const hideJaProductChrome = locale === 'ja';
  return (
    <div className="site" data-locale={locale} data-theme="parity">
      <DocumentLocaleSync
        language={language}
        fontClassName={getLocaleFontClassName(language)}
        managedFontClassNames={getManagedLocaleFontClassNames()}
      />
      <JsonLd data={buildWebsiteJsonLd(locale)} />
      <JsonLd data={buildLegalServiceJsonLd(locale)} />
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
