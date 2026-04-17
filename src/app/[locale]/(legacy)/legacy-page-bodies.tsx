'use client';

import PageHeader from '@/components/PageHeader';
import ContactBlocks from '@/components/ContactBlocks';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import FirmIntroductionSection from '@/components/FirmIntroductionSection';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import PricingCards from '@/components/PricingCards';
import ReviewBoard from '@/components/ReviewBoard';
import LegalPageSections from '@/components/LegalPageSections';
import ServicesBento from '@/components/ServicesBento';
import FAQAccordion from '@/components/FAQAccordion';
import JsonLd from '@/components/JsonLd';
import { pageCopy } from '@/data/page-copy';
import { faqContent } from '@/data/faq-content';
import { legalPageContent } from '@/data/legal-pages';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildPersonJsonLd,
} from '@/lib/seo';
import type { Locale } from '@/lib/locales';
import OfficeMapTabs from '@/components/OfficeMapTabs';

export function AboutLegacyPageBody({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale].about;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <FirmIntroductionSection locale={locale} />
      <AttorneyProfileSection locale={locale} />
      <ContactBlocks locale={locale} />
    </>
  );
}

export function ServicesLegacyPageBody({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale].services;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <ServicesBento locale={locale} />
    </>
  );
}

export function ContactLegacyPageBody({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale].contact;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <ConsultationGuideSection locale={locale} />
      <ContactBlocks locale={locale} showMainHeader={false} />
      <OfficeMapTabs locale={locale} />
    </>
  );
}

export function LawyersLegacyPageBody({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale].lawyers;
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: copy.title, path: `/${locale}/lawyers` },
        ])}
      />
      {profile ? (
        <>
          <JsonLd
            data={buildPersonJsonLd({
              locale,
              path: `/${locale}/lawyers/${profile.slug}`,
              name: profile.name,
              alternateName: profile.alternateNames,
              description: profile.description,
              image: profile.image,
              email: profile.email,
              jobTitle: profile.role,
              sameAs: profile.sameAs,
              knowsLanguage: profile.languages,
              knowsAbout: profile.practiceAreas,
              alumniOf: profile.education,
            })}
          />
          <JsonLd
            data={buildCollectionPageJsonLd({
              locale,
              path: `/${locale}/lawyers`,
              name: copy.title,
              description: copy.description,
              items: [
                {
                  name: profile.name,
                  path: `/${locale}/lawyers/${profile.slug}`,
                  description: profile.description,
                },
              ],
            })}
          />
        </>
      ) : null}
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <AttorneyProfileSection locale={locale} />
    </>
  );
}

export function FaqLegacyPageBody({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale].faq;
  const items = faqContent[locale];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <FAQAccordion locale={locale} items={items} />
      <JsonLd data={faqSchema} />
    </>
  );
}

export function PricingLegacyPageBody({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale].pricing;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <PricingCards locale={locale} />
    </>
  );
}

export function ReviewsLegacyPageBody({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale].reviews;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <ReviewBoard locale={locale} />
    </>
  );
}

export function PrivacyLegacyPageBody({ locale }: { locale: Locale }) {
  const content = legalPageContent[locale].privacy;
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: content.title, path: `/${locale}/privacy` },
        ])}
      />
      <LegalPageSections locale={locale} content={content} />
    </>
  );
}

export function DisclaimerLegacyPageBody({ locale }: { locale: Locale }) {
  const content = legalPageContent[locale].disclaimer;
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: content.title, path: `/${locale}/disclaimer` },
        ])}
      />
      <LegalPageSections locale={locale} content={content} />
    </>
  );
}
