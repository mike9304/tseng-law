import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import FAQAccordion from '@/components/FAQAccordion';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  attorneyProfiles,
  primaryAttorneySlug,
  type AttorneyProfile,
} from '@/data/attorney-profiles';
import {
  normalizeAttorneyProfileSlug,
  readAttorneyProfileSourceRecordBySlug,
  readAttorneyProfileSourceRecords,
  type AttorneyProfileSourceRecord,
} from '@/lib/builder/lawyers/source';
import {
  buildDefaultAttorneyImageAltText,
  defaultAttorneyImageFocalPoint,
} from '@/lib/builder/lawyers/source-normalizers';
import {
  normalizeSiteLocale,
  siteLocales,
  type SiteLocale,
} from '@/lib/locales';
import {
  isBuilderDynamicTemplateBlockVisible,
  readBuilderDynamicTemplatePublishedBlockVisibility,
} from '@/lib/builder/dynamic-template-drafts';
import { buildBreadcrumbJsonLd, buildProfilePageJsonLd, buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const sectionLabels = {
  ko: {
    pageLabel: '변호사 프로필',
    facts: '핵심 정보',
    education: '학력',
    experience: '경력',
    matters: '대표 업무 및 사례',
    internalLinks: '관련 서비스 및 콘텐츠',
    externalProfiles: '외부 프로필 및 채널',
    contact: '상담 문의',
    searchTerms: '자주 찾는 검색 주제',
  },
  'zh-hant': {
    pageLabel: '律師簡介',
    facts: '重點資訊',
    education: '學歷',
    experience: '經歷',
    matters: '代表業務與案例',
    internalLinks: '相關服務與內容',
    externalProfiles: '外部簡介與頻道',
    contact: '聯絡諮詢',
    searchTerms: '常見搜尋主題',
  },
  en: {
    pageLabel: 'PROFILE',
    facts: 'Key Facts',
    education: 'Education',
    experience: 'Experience',
    matters: 'Representative Work',
    internalLinks: 'Related Services and Content',
    externalProfiles: 'External Profiles and Channels',
    contact: 'Book Consultation',
    searchTerms: 'Common Search Topics',
  },
  ja: {
    pageLabel: '弁護士プロフィール',
    facts: '基本情報',
    education: '学歴',
    experience: '経歴',
    matters: '主な取扱業務・実績',
    internalLinks: '関連サービス・コンテンツ',
    externalProfiles: '外部プロフィール・チャンネル',
    contact: '相談を申し込む',
    searchTerms: 'よく検索されるテーマ',
  },
} as const;

function adaptJapaneseProfile(profile: AttorneyProfile): AttorneyProfileSourceRecord {
  return {
    ...profile,
    sourceSlug: profile.slug,
    imageAltText: buildDefaultAttorneyImageAltText(profile.name, profile.role),
    imageFocalPoint: defaultAttorneyImageFocalPoint(),
  };
}

function getJapaneseProfileBySlug(slugInput: string): AttorneyProfileSourceRecord | null {
  const slug = normalizeAttorneyProfileSlug(slugInput);
  if (slug !== primaryAttorneySlug) {
    return null;
  }
  return adaptJapaneseProfile(attorneyProfiles.ja[primaryAttorneySlug]);
}

async function getProfile(locale: SiteLocale, slug: string): Promise<AttorneyProfileSourceRecord | null> {
  if (locale === 'ja') {
    return getJapaneseProfileBySlug(slug);
  }
  return readAttorneyProfileSourceRecordBySlug(DEFAULT_BUILDER_SITE_ID, locale, slug);
}

export async function generateStaticParams() {
  const slugs = (await readAttorneyProfileSourceRecords(DEFAULT_BUILDER_SITE_ID, 'ko')).map(
    (profile) => profile.slug,
  );
  return [
    ...(['ko', 'zh-hant', 'en'] as const).flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug })),
    ),
    { locale: 'ja', slug: primaryAttorneySlug },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: SiteLocale; slug: string };
}): Promise<Metadata> {
  const locale = normalizeSiteLocale(params.locale);
  const profile = await getProfile(locale, params.slug);

  if (!profile) {
    return {};
  }

  return buildSeoMetadata({
    locale,
    title: profile.title,
    description: profile.description,
    path: `/lawyers/${profile.slug}`,
    keywords: profile.keywords,
    images: profile.image,
    type: 'website',
    ...(locale === 'ja' ? { alternateLocales: siteLocales } : {}),
  });
}

export default async function LawyerProfilePage({
  params,
}: {
  params: { locale: SiteLocale; slug: string };
}) {
  const locale = normalizeSiteLocale(params.locale);
  const profile = await getProfile(locale, params.slug);
  const labels = sectionLabels[locale];

  if (!profile) {
    return notFound();
  }

  if (normalizeAttorneyProfileSlug(params.slug) !== profile.slug) {
    permanentRedirect(`/${locale}/lawyers/${profile.slug}`);
  }

  const profilePath = `/${locale}/lawyers/${profile.slug}`;
  const templateVisibility = locale === 'ja'
    ? null
    : await readBuilderDynamicTemplatePublishedBlockVisibility(
        'attorney-profiles.item-template',
        locale
      );
  const showHero = templateVisibility
    ? isBuilderDynamicTemplateBlockVisible(templateVisibility, 'attorney-profiles.item.hero')
    : true;
  const showBody = templateVisibility
    ? isBuilderDynamicTemplateBlockVisible(templateVisibility, 'attorney-profiles.item.body')
    : true;
  const showSeo = templateVisibility
    ? isBuilderDynamicTemplateBlockVisible(templateVisibility, 'attorney-profiles.item.seo')
    : true;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: profile.faq.map((item) => ({
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
              {
                name: locale === 'ko'
                  ? '변호사소개'
                  : locale === 'zh-hant'
                    ? '律師團隊'
                    : locale === 'ja'
                      ? '弁護士紹介'
                      : 'Lawyers',
                path: `/${locale}/lawyers`,
              },
              { name: profile.name, path: profilePath },
            ])}
          />
          <JsonLd
            data={buildProfilePageJsonLd({
              locale,
              path: profilePath,
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
          <JsonLd data={faqSchema} />
        </>
      ) : null}

      {showHero ? (
        <PageHeader
          locale={locale}
          label={labels.pageLabel}
          title={profile.title}
          description={profile.description}
        />
      ) : null}

      {showBody ? (
        <>
          <section className="section section--light">
            <div className="container">
              <div className="profile-hero-card">
                <div className="profile-hero-photo">
                  <Image
                    src={profile.image}
                    alt={profile.imageAltText}
                    fill
                    sizes="(max-width: 900px) 100vw, 360px"
                    className="person-photo"
                    style={{
                      objectFit: 'cover',
                      objectPosition: `${profile.imageFocalPoint.x * 100}% ${profile.imageFocalPoint.y * 100}%`,
                    }}
                  />
                </div>
                <div className="profile-hero-body">
                  <div className="section-label">{labels.facts}</div>
                  <h2 className="section-title profile-hero-title">{profile.name}</h2>
                  <p className="profile-hero-role">{profile.role}</p>
                  <a href={`mailto:${profile.email}`} className="attorney-card-email">{profile.email}</a>
                  <div className="profile-summary-list">
                    {profile.summary.map((line) => (
                      <p key={line} className="split-text">{line}</p>
                    ))}
                  </div>
                  <div className="profile-chip-group">
                    {profile.languages.map((language) => (
                      <span key={language} className="profile-chip">
                        {language}
                      </span>
                    ))}
                  </div>
                  <Link href={`/${locale}/contact`} className="button profile-hero-cta">
                    {labels.contact}
                  </Link>
                </div>
              </div>

              <article className="profile-entity-card">
                <div className="section-label">{labels.searchTerms}</div>
                <div className="profile-chip-group">
                  {profile.searchTerms.map((term) => (
                    <span key={term} className="profile-chip profile-chip--entity">
                      {term}
                    </span>
                  ))}
                </div>
              </article>

              <div className="profile-proof-grid">
                {profile.proofPoints.map((item) => (
                  <article key={item} className="profile-proof-card">
                    <p className="profile-proof-text">{item}</p>
                  </article>
                ))}
              </div>

              <div className="profile-card-grid">
                <article className="profile-info-card">
                  <h3 className="profile-card-title">{labels.facts}</h3>
                  <ul className="attorney-list">
                    {profile.practiceAreas.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article className="profile-info-card">
                  <h3 className="profile-card-title">{labels.matters}</h3>
                  <ul className="attorney-list">
                    {profile.notableMatters.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article className="profile-info-card">
                  <h3 className="profile-card-title">{labels.internalLinks}</h3>
                  <ul className="profile-link-list">
                    {profile.internalLinks.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="link-underline">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="profile-info-card">
                  <h3 className="profile-card-title">{labels.externalProfiles}</h3>
                  <ul className="profile-link-list">
                    {profile.externalProfiles.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} className="link-underline" target="_blank" rel="noreferrer">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className="profile-card-grid">
                <article className="profile-info-card">
                  <h3 className="profile-card-title">{labels.education}</h3>
                  <ul className="attorney-list">
                    {profile.education.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article className="profile-info-card">
                  <h3 className="profile-card-title">{labels.experience}</h3>
                  <ul className="attorney-list">
                    {profile.experience.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <FAQAccordion locale={locale} items={profile.faq} sectionClassName="section section--gray" />
        </>
      ) : null}
    </>
  );
}
