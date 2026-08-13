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
import CinematicRouteShell from '@/components/CinematicRouteShell';
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

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = resolveLocaleOrNotFound(params.locale);
  const content = siteContent[locale];
  const organizationName = getOrganizationName(locale);
  return {
    title: {
      default: organizationName,
      template: `%s | ${organizationName}`,
    },
    description: content.meta.description,
    applicationName: organizationName,
    authors: [{ name: organizationName }],
    creator: organizationName,
    publisher: organizationName,
  };
}

export default async function LocaleLayout(
  props: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const locale = resolveLocaleOrNotFound(params.locale);
  const language = documentLanguageByLocale[locale];
  // Hide non-JA product widgets on Japanese public surface (plan: columns+core pages first).
  const hideJaProductChrome = locale === 'ja';
  return (
    <>
      <DocumentLocaleSync
        language={language}
        fontClassName={getLocaleFontClassName(language)}
        managedFontClassNames={getManagedLocaleFontClassNames()}
      />
      <JsonLd data={buildWebsiteJsonLd(locale)} />
      <JsonLd data={buildLegalServiceJsonLd(locale)} />
      <CinematicRouteShell
        locale={locale}
        header={<Header locale={locale} />}
        footer={<Footer locale={locale as never} />}
        quickContact={
          !hideJaProductChrome ? (
            <QuickContactWidget locale={toBuilderLocale(locale)} />
          ) : null
        }
        scrollTop={<ScrollTopButton locale={locale as never} />}
        eventPopup={
          !hideJaProductChrome ? (
            <YearEndEventPopup locale={toBuilderLocale(locale)} />
          ) : null
        }
      >
        {children}
      </CinematicRouteShell>
    </>
  );
}
