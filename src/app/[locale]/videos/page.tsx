import type { Metadata } from 'next';
import AttorneyMediaHub from '@/components/AttorneyMediaHub';
import JsonLd from '@/components/JsonLd';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PageHeader from '@/components/PageHeader';
import VideoChannel from '@/components/VideoChannel';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildPersonJsonLd, buildSeoMetadata } from '@/lib/seo';

const videoKeywords: Record<Locale, string[]> = {
  ko: ['증준외 변호사', '대만 변호사 유튜브', '대만 법률 영상', '증준외 유튜브'],
  'zh-hant': ['曾俊瑋 律師', '台灣律師 YouTube', '台灣法律影片', '曾俊瑋 頻道'],
  en: ['Attorney Wei Tseng', 'Taiwan legal videos', 'Taiwan lawyer YouTube', 'Wei Tseng channel'],
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].videos;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/videos',
    keywords: videoKeywords[locale],
  });
}

export default function VideosPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = pageCopy[locale].videos;
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);
  const videos = siteContent[locale].videos;
  const items = [videos.featured, ...videos.items].map((item) => ({
    name: item.title,
    path: item.href,
    description: item.duration,
  }));

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: copy.title, path: `/${locale}/videos` },
        ])}
      />
      <JsonLd
        data={buildCollectionPageJsonLd({
          locale,
          path: `/${locale}/videos`,
          name: copy.title,
          description: copy.description,
          items,
        })}
      />
      {profile ? (
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
      ) : null}
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <AttorneyMediaHub locale={locale} />
      <VideoChannel locale={locale} />
    </>
  );
}
