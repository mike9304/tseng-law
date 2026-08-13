import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import ColumnsGrid from '@/components/ColumnsGrid';
import { getAllColumnPosts } from '@/lib/columns';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { pageCopy } from '@/data/page-copy';
import { toBuilderLocale } from '@/lib/locales';
import {
  buildPublishedSitePageMetadata,
  PublishedSitePageView,
  resolvePublishedSitePage,
} from '@/lib/builder/site/public-page';
import { emitPublicPageRenderHook } from '@/lib/builder/apps/lifecycle-emitters';
import {
  isBuilderDynamicTemplateBlockVisible,
  readBuilderDynamicTemplatePublishedBlockVisibility,
} from '@/lib/builder/dynamic-template-drafts';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { checkAccess } from '@/lib/builder/members/members-engine';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildSeoMetadata } from '@/lib/seo';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

const COLUMNS_SLUG = 'columns';

type ColumnsSearchParams = Record<string, string | string[] | undefined>;

function buildPublishedPath(locale: SiteLocale): string {
  return `/${locale}/${COLUMNS_SLUG}`;
}

function firstSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toColumnGridFilters(searchParams?: ColumnsSearchParams) {
  return {
    category: firstSearchParamValue(searchParams?.category),
    author: firstSearchParamValue(searchParams?.author),
    q: firstSearchParamValue(searchParams?.q),
    year: firstSearchParamValue(searchParams?.year),
    month: firstSearchParamValue(searchParams?.month),
  };
}

const headerLabel: Record<SiteLocale, string> = {
  ko: '칼럼',
  'zh-hant': '專欄',
  en: 'COLUMNS',
  ja: 'コラム',
};

const columnKeywords: Record<SiteLocale, string[]> = {
  ko: ['대만 법률 칼럼', '대만 회사설립 정보', '대만 소송 사례', '대만 노동법', '대만 변호사 블로그'],
  'zh-hant': ['台灣法律專欄', '台灣公司設立資訊', '台灣訴訟案例', '台灣勞動法', '台灣律師文章'],
  en: ['Taiwan legal articles', 'Taiwan company setup guide', 'Taiwan litigation insights', 'Taiwan labor law', 'Taiwan legal blog'],
  ja: ['台湾法律コラム', '台湾会社設立', '台湾訴訟事例', '台湾労働法', '台湾弁護士ブログ'],
};

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  // JA is file-backed only — never project a KO builder page onto /ja/columns.
  if (locale !== 'ja') {
    const publishedMetadata = await buildPublishedSitePageMetadata(toBuilderLocale(locale), COLUMNS_SLUG);
    if (publishedMetadata) return publishedMetadata;
  }

  const copy = pageCopy[locale].insights;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/columns',
    keywords: columnKeywords[locale],
    alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
  });
}

export default async function ColumnsPage(
  props: {
    params: Promise<{ locale: SiteLocale }>;
    searchParams?: Promise<ColumnsSearchParams>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);

  const publishedPage =
    locale === 'ja' ? null : await resolvePublishedSitePage(toBuilderLocale(locale), COLUMNS_SLUG);
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
        slug: COLUMNS_SLUG,
        locale,
      },
    });

    return <PublishedSitePageView resolved={publishedPage} searchParams={searchParams} />;
  }

  const copy = pageCopy[locale].insights;
  const posts =
    locale === 'ja'
      ? getAllColumnPosts('ja')
      : await getAllColumnPostsIncludingBlob(toBuilderLocale(locale));
  const byline =
    locale === 'ko'
      ? '증준외 변호사'
      : locale === 'zh-hant'
        ? '曾雋崴律師'
        : locale === 'ja'
          ? '曾雋崴弁護士'
          : 'Attorney Wei Tseng';
  const templateVisibility = await readBuilderDynamicTemplatePublishedBlockVisibility(
    'columns.list-template',
    toBuilderLocale(locale)
  );
  const showHero = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.list.hero');
  const showRepeater = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.list.repeater');
  const showSeo = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'columns.list.seo');

  return (
    <>
      {showSeo ? (
        <>
          <JsonLd
            data={buildBreadcrumbJsonLd(locale, [
              { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : locale === 'ja' ? 'ホーム' : 'Home', path: `/${locale}` },
              { name: copy.title, path: `/${locale}/columns` },
            ])}
          />
          <JsonLd
            data={buildCollectionPageJsonLd({
              locale,
              path: `/${locale}/columns`,
              name: copy.title,
              description: copy.description,
              items: posts.slice(0, 20).map((post) => ({
                name: `${post.title} · ${byline}`,
                path: `/${locale}/columns/${post.slug}`,
                description: post.summary,
              })),
            })}
          />
        </>
      ) : null}
      {showHero ? (
        <PageHeader locale={locale} label={headerLabel[locale]} title={copy.title} description={copy.description} />
      ) : null}
      {showRepeater ? <ColumnsGrid locale={locale} posts={posts} initialFilters={toColumnGridFilters(searchParams)} /> : null}
    </>
  );
}
