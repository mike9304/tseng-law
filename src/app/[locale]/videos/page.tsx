import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getAllColumnPosts } from '@/lib/columns';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildPersonJsonLd, buildSeoMetadata } from '@/lib/seo';
import { VideosLegacyPageBody } from '@/app/[locale]/(legacy)/legacy-page-bodies';
import {
  buildPublishedSitePageMetadata,
  PublishedSitePageView,
  resolvePublishedSitePage,
} from '@/lib/builder/site/public-page';
import { emitPublicPageRenderHook } from '@/lib/builder/apps/lifecycle-emitters';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { checkAccess } from '@/lib/builder/members/members-engine';

export const dynamic = 'force-dynamic';

const VIDEOS_SLUG = 'videos';

const videoKeywords: Record<Locale, string[]> = {
  ko: ['증준외 변호사', '대만 변호사 유튜브', '대만 법률 영상', '증준외 유튜브'],
  'zh-hant': ['曾俊瑋 律師', '台灣律師 YouTube', '台灣法律影片', '曾俊瑋 頻道'],
  en: ['Attorney Wei Tseng', 'Taiwan legal videos', 'Taiwan lawyer YouTube', 'Wei Tseng channel'],
};

function buildPublishedPath(locale: Locale): string {
  return `/${locale}/${VIDEOS_SLUG}`;
}

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const publishedMetadata = await buildPublishedSitePageMetadata(locale, VIDEOS_SLUG);
  if (publishedMetadata) return publishedMetadata;

  const copy = pageCopy[locale].videos;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/videos',
    keywords: videoKeywords[locale],
  });
}

export default async function VideosPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const publishedPage = await resolvePublishedSitePage(locale, VIDEOS_SLUG);
  if (publishedPage) {
    const access = publishedPage.pageMeta.memberAccess;
    if (access?.requireLogin) {
      const member = await getCurrentSiteMember();
      const allowed = checkAccess(
        {
          pageId: publishedPage.pageMeta.pageId,
          requireLogin: true,
          allowedRoles: access.allowedRoles ?? [],
          redirectUrl: access.redirectPath,
        },
        member,
      );

      if (!allowed) {
        const currentPath = buildPublishedPath(locale);
        redirect(access.redirectPath || `/${locale}/login?next=${encodeURIComponent(currentPath)}`);
      }
    }

    emitPublicPageRenderHook({
      kind: 'public.page-render',
      payload: {
        siteId: publishedPage.site.siteId,
        pageId: publishedPage.pageMeta.pageId,
        slug: VIDEOS_SLUG,
        locale,
      },
    });

    return <PublishedSitePageView resolved={publishedPage} />;
  }

  const copy = pageCopy[locale].videos;
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);
  const videos = siteContent[locale].videos;
  const columnCount = getAllColumnPosts(locale).length;
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
      <VideosLegacyPageBody locale={locale} columnCount={columnCount} />
    </>
  );
}
