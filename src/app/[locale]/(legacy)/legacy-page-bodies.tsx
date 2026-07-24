'use client';

import PageHeader from '@/components/PageHeader';
import ContactBlocks from '@/components/ContactBlocks';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import FirmIntroductionSection from '@/components/FirmIntroductionSection';
import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import MessengerChatSection from '@/components/MessengerChatSection';
import PricingCards from '@/components/PricingCards';
import ReviewBoard from '@/components/ReviewBoard';
import ColumnsGrid, { type ColumnsGridFilters } from '@/components/ColumnsGrid';
import AttorneyMediaHubView from '@/components/AttorneyMediaHubView';
import LegalPageSections from '@/components/LegalPageSections';
import ServicesBento from '@/components/ServicesBento';
import FAQAccordion from '@/components/FAQAccordion';
import VideoChannel from '@/components/VideoChannel';
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
import type { ColumnPost } from '@/lib/columns';
import OfficeMapTabs from '@/components/OfficeMapTabs';

type ColumnsSearchParams = Record<string, string | string[] | undefined>;

function firstSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toColumnGridFilters(searchParams?: ColumnsSearchParams): ColumnsGridFilters {
  return {
    category: firstSearchParamValue(searchParams?.category),
    author: firstSearchParamValue(searchParams?.author),
    q: firstSearchParamValue(searchParams?.q),
    year: firstSearchParamValue(searchParams?.year),
    month: firstSearchParamValue(searchParams?.month),
  };
}

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

export function ServicesLegacyPageBody({
  locale,
  visibleBlockIds,
}: {
  locale: Locale;
  visibleBlockIds?: string[];
}) {
  const copy = pageCopy[locale].services;
  const showHero = isTemplateBlockVisible(visibleBlockIds, 'service-areas.list.hero');
  const showRepeater = isTemplateBlockVisible(visibleBlockIds, 'service-areas.list.repeater');
  return (
    <>
      {showHero ? (
        <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      ) : null}
      {showRepeater ? <ServicesBento locale={locale} /> : null}
    </>
  );
}

export function ContactLegacyPageBody({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale].contact;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <ConsultationGuideSection locale={locale} />
      <MessengerChatSection locale={locale} />
      <ContactBlocks locale={locale} showMainHeader={false} />
      <OfficeMapTabs locale={locale} />
    </>
  );
}

export function LawyersLegacyPageBody({
  locale,
  visibleBlockIds,
}: {
  locale: Locale;
  visibleBlockIds?: string[];
}) {
  const copy = pageCopy[locale].lawyers;
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);
  const showHero = isTemplateBlockVisible(visibleBlockIds, 'attorney-profiles.list.hero');
  const showRepeater = isTemplateBlockVisible(visibleBlockIds, 'attorney-profiles.list.repeater');
  const showSeo = isTemplateBlockVisible(visibleBlockIds, 'attorney-profiles.list.seo');

  return (
    <>
      {showSeo ? (
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
        </>
      ) : null}
      {showHero ? (
        <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      ) : null}
      {showRepeater ? <AttorneyProfileSection locale={locale} showIntro={false} /> : null}
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

export function ColumnsLegacyPageBody({
  locale,
  posts,
  searchParams,
  visibleBlockIds,
}: {
  locale: Locale;
  posts: ColumnPost[];
  searchParams?: ColumnsSearchParams;
  visibleBlockIds?: string[];
}) {
  const copy = pageCopy[locale].insights;
  const headerLabel: Record<Locale, string> = {
    ko: '칼럼',
    'zh-hant': '專欄',
    en: 'COLUMNS',
  };
  const showHero = isTemplateBlockVisible(visibleBlockIds, 'columns.list.hero');
  const showRepeater = isTemplateBlockVisible(visibleBlockIds, 'columns.list.repeater');

  return (
    <>
      {showHero ? (
        <PageHeader locale={locale} label={headerLabel[locale]} title={copy.title} description={copy.description} />
      ) : null}
      {showRepeater ? (
        <ColumnsGrid locale={locale} posts={posts} initialFilters={toColumnGridFilters(searchParams)} />
      ) : null}
    </>
  );
}

export function VideosLegacyPageBody({
  columnCount,
  locale,
}: {
  columnCount: number;
  locale: Locale;
}) {
  const copy = pageCopy[locale].videos;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <AttorneyMediaHubView locale={locale} columnCount={columnCount} />
      <VideoChannel locale={locale} />
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

function isTemplateBlockVisible(visibleBlockIds: string[] | undefined, blockId: string): boolean {
  return !visibleBlockIds || visibleBlockIds.includes(blockId);
}
