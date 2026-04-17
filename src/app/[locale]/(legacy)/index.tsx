import type { Metadata } from 'next';
import type { Locale } from '@/lib/locales';
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

export function getLegacyPageMetadata(slugPath: string, locale: Locale): Metadata | null {
  switch (slugPath) {
    case '':
      return getHomeLegacyMetadata(locale);
    case 'about':
      return getAboutLegacyMetadata(locale);
    case 'services':
      return getServicesLegacyMetadata(locale);
    case 'contact':
      return getContactLegacyMetadata(locale);
    case 'lawyers':
      return getLawyersLegacyMetadata(locale);
    case 'faq':
      return getFaqLegacyMetadata(locale);
    case 'pricing':
      return getPricingLegacyMetadata(locale);
    case 'reviews':
      return getReviewsLegacyMetadata(locale);
    case 'privacy':
      return getPrivacyLegacyMetadata(locale);
    case 'disclaimer':
      return getDisclaimerLegacyMetadata(locale);
    default:
      return null;
  }
}

export function renderLegacyPage(slugPath: string, locale: Locale) {
  switch (slugPath) {
    case '':
      return <HomeLegacyPage locale={locale} />;
    case 'about':
      return <AboutLegacyPage locale={locale} />;
    case 'services':
      return <ServicesLegacyPage locale={locale} />;
    case 'contact':
      return <ContactLegacyPage locale={locale} />;
    case 'lawyers':
      return <LawyersLegacyPage locale={locale} />;
    case 'faq':
      return <FaqLegacyPage locale={locale} />;
    case 'pricing':
      return <PricingLegacyPage locale={locale} />;
    case 'reviews':
      return <ReviewsLegacyPage locale={locale} />;
    case 'privacy':
      return <PrivacyLegacyPage locale={locale} />;
    case 'disclaimer':
      return <DisclaimerLegacyPage locale={locale} />;
    default:
      return null;
  }
}
