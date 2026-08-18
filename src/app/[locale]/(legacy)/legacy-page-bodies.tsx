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
  ATTORNEY_PERSON_ID,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildPersonJsonLd,
  getOrganizationName,
} from '@/lib/seo';
import type { Locale, SiteLocale } from '@/lib/locales';
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

export function AboutLegacyPageBody({ locale }: { locale: SiteLocale }) {
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
  locale: SiteLocale;
  visibleBlockIds?: string[];
}) {
  const copy = pageCopy[locale].services;
  const showHero = locale === 'ja'
    || isTemplateBlockVisible(visibleBlockIds, 'service-areas.list.hero');
  const showRepeater = locale === 'ja'
    || isTemplateBlockVisible(visibleBlockIds, 'service-areas.list.repeater');
  return (
    <>
      {showHero ? (
        <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      ) : null}
      {showRepeater ? <ServicesBento locale={locale} /> : null}
    </>
  );
}

export function ContactLegacyPageBody({ locale }: { locale: SiteLocale }) {
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

const attorneyFactLabels = {
  ko: {
    heading: '증준외 변호사 기본 정보',
    qualification: '자격 · 소속',
    practice: '주요 취급 분야',
    languages: '상담 언어',
  },
  'zh-hant': {
    heading: '曾雋崴律師 基本資料',
    qualification: '資格與所屬',
    practice: '主要服務領域',
    languages: '諮詢語言',
  },
  en: {
    heading: 'Attorney Wei Tseng — Key Facts',
    qualification: 'Qualification and Firm',
    practice: 'Core Practice Areas',
    languages: 'Consultation Languages',
  },
  ja: {
    heading: '曾雋崴弁護士 基本情報',
    qualification: '資格・所属',
    practice: '主な取扱分野',
    languages: '相談言語',
  },
} as const;

function buildAttorneyQualificationSentence(locale: SiteLocale, name: string, firm: string): string {
  switch (locale) {
    case 'ko':
      return `${name}는 대만 변호사 자격을 보유한 ${firm}의 대표 변호사입니다.`;
    case 'zh-hant':
      return `${name}為具備台灣律師資格的${firm}代表律師。`;
    case 'ja':
      return `${name}は、台湾弁護士の資格を有する${firm}の代表弁護士です。`;
    default:
      return `${name} is a qualified Taiwan attorney and the managing attorney of ${firm}.`;
  }
}

/**
 * Plain, verifiable sentences about the primary attorney rendered into the
 * initial HTML of the lawyers page (ko/zh-hant/ja/en). Every value is read from
 * the existing attorney profile record — no claims are introduced here.
 *
 * This block is intentionally rendered outside the canvas-modelled attorney
 * card so the Visual CMS geometry contracts for the attorney section stay
 * untouched.
 */
function AttorneyFactSummary({ locale }: { locale: SiteLocale }) {
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);

  if (!profile) {
    return null;
  }

  const labels = attorneyFactLabels[locale];
  const firm = getOrganizationName(locale);
  const separator = locale === 'ko' || locale === 'en' ? ', ' : '、';

  return (
    <section className="section section--light attorney-facts-section" id="attorney-facts">
      <div className="container">
        <h2 className="section-title">{labels.heading}</h2>
        <div className="attorney-card-section">
          <div className="attorney-card-label">{labels.qualification}</div>
          <p>{buildAttorneyQualificationSentence(locale, profile.name, firm)}</p>
        </div>
        <div className="attorney-card-section">
          <div className="attorney-card-label">{labels.practice}</div>
          <p>{profile.practiceAreas.join(separator)}</p>
        </div>
        <div className="attorney-card-section">
          <div className="attorney-card-label">{labels.languages}</div>
          <p>{profile.languages.join(separator)}</p>
        </div>
      </div>
    </section>
  );
}

export function LawyersLegacyPageBody({
  locale,
  visibleBlockIds,
}: {
  locale: SiteLocale;
  visibleBlockIds?: string[];
}) {
  const copy = pageCopy[locale].lawyers;
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);
  const showHero = locale === 'ja'
    || isTemplateBlockVisible(visibleBlockIds, 'attorney-profiles.list.hero');
  const showRepeater = locale === 'ja'
    || isTemplateBlockVisible(visibleBlockIds, 'attorney-profiles.list.repeater');
  const showSeo = locale === 'ja'
    || isTemplateBlockVisible(visibleBlockIds, 'attorney-profiles.list.seo');

  return (
    <>
      {showSeo ? (
        <>
          <JsonLd
            data={buildBreadcrumbJsonLd(locale, [
              {
                name: locale === 'ko'
                  ? '홈'
                  : locale === 'zh-hant'
                    ? '首頁'
                    : locale === 'ja'
                      ? 'ホーム'
                      : 'Home',
                path: `/${locale}`,
              },
              { name: copy.title, path: `/${locale}/lawyers` },
            ])}
          />
          {profile ? (
            <>
              <JsonLd
                data={buildPersonJsonLd({
                  locale,
                  path: `/${locale}/lawyers/${profile.slug}`,
                  // One canonical Person node across ko/zh-hant/ja lawyers pages.
                  id: ATTORNEY_PERSON_ID,
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
      {showRepeater ? <AttorneyFactSummary locale={locale} /> : null}
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

export function PricingLegacyPageBody({ locale }: { locale: SiteLocale }) {
  const copy = pageCopy[locale].pricing;
  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <PricingCards locale={locale} />
    </>
  );
}

export function ReviewsLegacyPageBody({ locale }: { locale: SiteLocale }) {
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
  locale: SiteLocale;
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

export function PrivacyLegacyPageBody({ locale }: { locale: SiteLocale }) {
  const content = legalPageContent[locale].privacy;
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          {
            name: locale === 'ko'
              ? '홈'
              : locale === 'zh-hant'
                ? '首頁'
                : locale === 'ja'
                  ? 'ホーム'
                  : 'Home',
            path: `/${locale}`,
          },
          { name: content.title, path: `/${locale}/privacy` },
        ])}
      />
      <LegalPageSections locale={locale} content={content} />
    </>
  );
}

export function DisclaimerLegacyPageBody({ locale }: { locale: SiteLocale }) {
  const content = legalPageContent[locale].disclaimer;
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          {
            name: locale === 'ko'
              ? '홈'
              : locale === 'zh-hant'
                ? '首頁'
                : locale === 'ja'
                  ? 'ホーム'
                  : 'Home',
            path: `/${locale}`,
          },
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
