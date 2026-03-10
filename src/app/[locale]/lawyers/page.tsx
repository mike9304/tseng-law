import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import AttorneyProfileSection from '@/components/AttorneyProfileSection';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildPersonJsonLd, buildSeoMetadata } from '@/lib/seo';

const lawyerKeywords: Record<Locale, string[]> = {
  ko: ['증준외 변호사', '법무법인 호정 변호사', '대만 변호사', '대만 법률팀'],
  'zh-hant': ['曾俊瑋 律師', '昊鼎律師團隊', '台灣律師', '昊鼎業務團隊'],
  en: ['Wei Tseng lawyer', 'Taiwan attorney profile', 'Hovering legal team', 'Taiwan law firm team'],
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].lawyers;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/lawyers',
    keywords: lawyerKeywords[locale],
  });
}

export default function LawyersPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
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
