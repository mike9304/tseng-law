import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import { getAttorneyProfile, getAttorneyProfilePath, getAttorneyProfileSlugs } from '@/data/attorney-profiles';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildBreadcrumbJsonLd, buildProfilePageJsonLd, buildSeoMetadata } from '@/lib/seo';

const sectionLabels = {
  ko: {
    pageLabel: 'PROFILE',
    facts: '핵심 정보',
    education: '학력',
    experience: '경력',
    matters: '대표 업무 및 사례',
    internalLinks: '관련 서비스 및 콘텐츠',
    externalProfiles: '외부 프로필 및 채널',
    contact: '상담 문의',
  },
  'zh-hant': {
    pageLabel: 'PROFILE',
    facts: '重點資訊',
    education: '學歷',
    experience: '經歷',
    matters: '代表業務與案例',
    internalLinks: '相關服務與內容',
    externalProfiles: '外部簡介與頻道',
    contact: '聯絡諮詢',
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
  },
} as const;

export function generateStaticParams() {
  const slugs = getAttorneyProfileSlugs();
  return ['ko', 'zh-hant', 'en'].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const profile = getAttorneyProfile(locale, params.slug);

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
  });
}

export default function LawyerProfilePage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = normalizeLocale(params.locale);
  const profile = getAttorneyProfile(locale, params.slug);
  const labels = sectionLabels[locale];

  if (!profile) {
    return notFound();
  }

  const profilePath = getAttorneyProfilePath(locale, profile.slug);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: locale === 'ko' ? '변호사소개' : locale === 'zh-hant' ? '律師團隊' : 'Lawyers', path: `/${locale}/lawyers` },
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

      <PageHeader
        locale={locale}
        label={labels.pageLabel}
        title={profile.title}
        description={profile.description}
      />

      <section className="section section--light">
        <div className="container">
          <div className="profile-hero-card">
            <div className="profile-hero-photo">
              <Image
                src={profile.image}
                alt={`${profile.name} ${profile.role}`}
                fill
                sizes="(max-width: 900px) 100vw, 360px"
                style={{ objectFit: 'cover' }}
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
    </>
  );
}
