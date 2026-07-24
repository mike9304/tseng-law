import type { Metadata } from 'next';
import type { SiteLocale } from '@/lib/locales';
import { toBuilderLocale } from '@/lib/locales';
import { AboutLegacyPage, getAboutLegacyMetadata } from './about-legacy';
import { ContactLegacyPage, getContactLegacyMetadata } from './contact-legacy';
import { DisclaimerLegacyPage, getDisclaimerLegacyMetadata } from './disclaimer-legacy';
import { FaqLegacyPage, getFaqLegacyMetadata } from './faq-legacy';
import { HomeLegacyPage, getHomeLegacyMetadata } from './home-legacy';
import { LawyersLegacyPage, getLawyersLegacyMetadata } from './lawyers-legacy';
import { PricingLegacyPage, getPricingLegacyMetadata } from './pricing-legacy';
import { PrivacyLegacyPage, getPrivacyLegacyMetadata } from './privacy-legacy';
import { ReviewsLegacyPage, getReviewsLegacyMetadata } from './reviews-legacy';
import { ServicesLegacyPage, getServicesLegacyMetadata } from './services-legacy';

/** Map SiteLocale → builder Locale for legacy pages that still expect Locale. */
function asLegacyLocale(locale: SiteLocale) {
  return toBuilderLocale(locale);
}

export function getLegacyPageMetadata(slugPath: string, locale: SiteLocale): Metadata | null {
  // Home/About/FAQ accept SiteLocale for Japanese body selection
  switch (slugPath) {
    case '':
      return getHomeLegacyMetadata(locale);
    case 'about':
      return getAboutLegacyMetadata(locale);
    case 'services':
      return getServicesLegacyMetadata(locale);
    case 'contact':
      return getContactLegacyMetadata(asLegacyLocale(locale));
    case 'lawyers':
      return getLawyersLegacyMetadata(asLegacyLocale(locale));
    case 'faq':
      return getFaqLegacyMetadata(locale as never);
    case 'pricing':
      return getPricingLegacyMetadata(asLegacyLocale(locale));
    case 'reviews':
      return getReviewsLegacyMetadata(asLegacyLocale(locale));
    case 'privacy':
      return getPrivacyLegacyMetadata(asLegacyLocale(locale));
    case 'disclaimer':
      return getDisclaimerLegacyMetadata(asLegacyLocale(locale));
    default:
      return null;
  }
}

export async function renderLegacyPage(slugPath: string, locale: SiteLocale) {
  switch (slugPath) {
    case '':
      return <HomeLegacyPage locale={locale} />;
    case 'about':
      return <AboutLegacyPage locale={locale} />;
    case 'services':
      return <ServicesLegacyPage locale={locale} />;
    case 'contact':
      return <ContactLegacyPage locale={asLegacyLocale(locale)} />;
    case 'lawyers':
      return <LawyersLegacyPage locale={asLegacyLocale(locale)} />;
    case 'faq':
      return <FaqLegacyPage locale={locale as never} />;
    case 'pricing':
      return <PricingLegacyPage locale={asLegacyLocale(locale)} />;
    case 'reviews':
      return <ReviewsLegacyPage locale={asLegacyLocale(locale)} />;
    case 'privacy':
      return <PrivacyLegacyPage locale={asLegacyLocale(locale)} />;
    case 'disclaimer':
      return <DisclaimerLegacyPage locale={asLegacyLocale(locale)} />;
    default:
      return null;
  }
}
