import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isSiteLocale, type SiteLocale, toBuilderLocale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import JsonLd from '@/components/JsonLd';
import DocumentLocaleSync from '@/components/DocumentLocaleSync';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollTopButton from '@/components/ScrollTopButton';
import QuickContactWidget from '@/components/QuickContactWidget';
import CinematicRouteShell from '@/components/CinematicRouteShell';
import VisitTracker from '@/components/metrics/VisitTracker';
import {
  getLocaleFontClassName,
  getManagedLocaleFontClassNames,
  type DocumentLanguage,
} from '@/app/fonts';
import { buildLegalServiceJsonLd, buildWebsiteJsonLd, getOrganizationName } from '@/lib/seo';
import { guidanceContent } from '@/data/international-guidance-content';
import {
  PUBLIC_LOCALES_8,
  isGuidanceLocale4,
  isPublicLocale8,
  publicDocumentLanguage,
  type PublicLocale8,
} from '@/lib/public-guidance';

export const dynamicParams = false;

const documentLanguageByLocale: Record<SiteLocale, DocumentLanguage> = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
};

function resolvePublicLocaleOrNotFound(locale: string): PublicLocale8 {
  if (!isPublicLocale8(locale)) {
    notFound();
  }

  return locale;
}

function resolveLocaleOrNotFound(locale: string): SiteLocale {
  if (!isSiteLocale(locale)) {
    notFound();
  }

  return locale;
}

export function generateStaticParams() {
  return PUBLIC_LOCALES_8.map((locale) => ({ locale }));
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const publicLocale = resolvePublicLocaleOrNotFound(params.locale);

  if (isGuidanceLocale4(publicLocale)) {
    const home = guidanceContent[publicLocale].pages.home;
    const organizationName = 'Hovering International Law Firm';
    return {
      title: {
        default: home.title,
        template: '%s',
      },
      description: home.description,
      applicationName: organizationName,
      authors: [{ name: organizationName }],
      creator: organizationName,
      publisher: organizationName,
    };
  }

  const locale = resolveLocaleOrNotFound(publicLocale);
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

  const publicLocale = resolvePublicLocaleOrNotFound(params.locale);

  if (isGuidanceLocale4(publicLocale)) {
    // Same chrome as the other four languages: shared header, footer and
    // scroll-top inside `CinematicRouteShell`. Only locale-scoped product
    // widgets (search overlay, members, quick contact) stay off, because the
    // guidance surface publishes ten pages and no member/search routes.
    const language = publicDocumentLanguage(publicLocale);
    return (
      <>
        <DocumentLocaleSync
          language={language}
          fontClassName={getLocaleFontClassName(language)}
          managedFontClassNames={getManagedLocaleFontClassNames()}
        />
        <CinematicRouteShell
          locale={publicLocale}
          header={<Header locale={publicLocale} />}
          footer={<Footer locale={publicLocale} />}
          scrollTop={<ScrollTopButton locale={publicLocale} />}
        >
          {children}
        </CinematicRouteShell>
      </>
    );
  }

  const locale = resolveLocaleOrNotFound(publicLocale);
  const language = documentLanguageByLocale[locale];
  // Hide non-JA product widgets on Japanese public surface (plan: columns+core pages first).
  const hideJaProductChrome = locale === 'ja';
  return (
    <>
      <link rel="describedby" href={`/${locale}/llms.txt`} />
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
        footer={<Footer locale={locale} />}
        quickContact={
          !hideJaProductChrome ? (
            <QuickContactWidget locale={toBuilderLocale(locale)} />
          ) : null
        }
        scrollTop={<ScrollTopButton locale={locale} />}
      >
        {children}
      </CinematicRouteShell>
      <VisitTracker locale={locale} />
    </>
  );
}
