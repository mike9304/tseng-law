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
import { IS_STATIC_SITE } from '@/lib/static-site';
import { PublicColumnLanguageLinksProvider } from '@/components/PublicColumnLanguageLinksContext';
import LocaleSuggestion from '@/components/LocaleSuggestion';
import { publicColumnSwitcherData } from '@/lib/column-language-links';
import {
  getLocaleFontClassName,
  getLocaleFontStylesheets,
  getManagedLocaleFontClassNames,
  type DocumentLanguage,
} from '@/app/fonts';
import {
  buildGuidanceWebsiteJsonLd,
  buildLegalServiceJsonLd,
  buildWebsiteJsonLd,
  getOrganizationName,
  getPageTitleBrand,
} from '@/lib/seo';
import { guidanceContent } from '@/data/international-guidance-content';
import {
  PUBLIC_LOCALES_8,
  isGuidanceLocale4,
  isPublicLocale8,
  publicDocumentLanguage,
  type PublicLocale8,
} from '@/lib/public-guidance';
import { folioChrome } from '@/data/intl-design-chrome';
import { INTL_DESIGN_ROOT_CLASS } from '@/lib/intl-design-locales';

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
      publisher: organizationName,
    };
  }

  const locale = resolveLocaleOrNotFound(publicLocale);
  const content = siteContent[locale];
  const organizationName = getOrganizationName(locale);
  return {
    title: {
      default: organizationName,
      template: `%s | ${getPageTitleBrand(locale)}`,
    },
    description: content.meta.description,
    applicationName: organizationName,
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
  // WO-O22 A: read once per render so the client language switchers can link a
  // column article to its published versions and leave out languages without
  // one. Only this language's columns are sent, not the whole column index.
  const { index: columnIndex, columnLocales } = publicColumnSwitcherData(publicLocale);

  if (isGuidanceLocale4(publicLocale)) {
    // Same chrome as the other four languages: shared header, footer and
    // scroll-top inside `CinematicRouteShell`. Only locale-scoped product
    // widgets (search overlay, members, quick contact) stay off, because the
    // guidance surface publishes ten pages and no member/search routes.
    const language = publicDocumentLanguage(publicLocale);
    // Folio locales (id, th, European): design root class and chrome labels go to the shared client components as
    // props, so those components import nothing new (new shared modules re-ordered every locale's CSS chunks).
    const folioLabels = folioChrome(publicLocale);
    return (
      <PublicColumnLanguageLinksProvider index={columnIndex} columnLocales={columnLocales}>
        {/* WO-O28: the site-wide `WebSite` / `Organization` / logo
            `ImageObject` the four site locales emit below. Without it every
            guidance page was missing those three types. `SearchAction` is
            deliberately omitted — vi/id/th/fil publish no `/search` route. */}
        <JsonLd data={buildGuidanceWebsiteJsonLd(publicLocale)} />
        <DocumentLocaleSync
          language={language}
          fontClassName={getLocaleFontClassName(language)}
          fontStylesheets={getLocaleFontStylesheets(language)}
          managedFontClassNames={getManagedLocaleFontClassNames()}
        />
        <CinematicRouteShell
          locale={publicLocale}
          {...(folioLabels ? { designClassName: INTL_DESIGN_ROOT_CLASS } : {})}
          header={
            <Header
              locale={publicLocale}
              {...(folioLabels
                ? { folioLabels: { home: folioLabels.home, mainMenu: folioLabels.mainMenu, utilityMenu: folioLabels.utilityMenu } }
                : {})}
            />
          }
          footer={<Footer locale={publicLocale} />}
          scrollTop={<ScrollTopButton locale={publicLocale} {...(folioLabels ? { folioLabel: folioLabels.backToTop } : {})} />}
        >
          {children}
        </CinematicRouteShell>
        <LocaleSuggestion locale={publicLocale} />
      </PublicColumnLanguageLinksProvider>
    );
  }

  const locale = resolveLocaleOrNotFound(publicLocale);
  const language = documentLanguageByLocale[locale];
  // Hide non-JA product widgets on Japanese public surface (plan: columns+core pages first).
  const hideJaProductChrome = locale === 'ja';
  return (
    <PublicColumnLanguageLinksProvider index={columnIndex} columnLocales={columnLocales}>
      <link rel="describedby" href={`/${locale}/llms.txt`} />
      <DocumentLocaleSync
        language={language}
        fontClassName={getLocaleFontClassName(language)}
        fontStylesheets={getLocaleFontStylesheets(language)}
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
      {/* The static site has no metrics API (src/lib/static-site.ts). */}
      {IS_STATIC_SITE ? null : <VisitTracker locale={locale} />}
      <LocaleSuggestion locale={locale} />
    </PublicColumnLanguageLinksProvider>
  );
}
