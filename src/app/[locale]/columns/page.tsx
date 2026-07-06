import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import ColumnsGrid from '@/components/ColumnsGrid';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import { pageCopy } from '@/data/page-copy';
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
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

const COLUMNS_SLUG = 'columns';

type ColumnsSearchParams = Record<string, string | string[] | undefined>;

function buildPublishedPath(locale: Locale): string {
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

const headerLabel: Record<Locale, string> = {
  ko: '칼럼',
  'zh-hant': '專欄',
  en: 'COLUMNS',
};

const columnKeywords: Record<Locale, string[]> = {
  ko: ['대만 법률 칼럼', '대만 회사설립 정보', '대만 소송 사례', '대만 노동법', '대만 변호사 블로그'],
  'zh-hant': ['台灣法律專欄', '台灣公司設立資訊', '台灣訴訟案例', '台灣勞動法', '台灣律師文章'],
  en: ['Taiwan legal articles', 'Taiwan company setup guide', 'Taiwan litigation insights', 'Taiwan labor law', 'Taiwan legal blog'],
};

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const publishedMetadata = await buildPublishedSitePageMetadata(locale, COLUMNS_SLUG);
  if (publishedMetadata) return publishedMetadata;

  const copy = pageCopy[locale].insights;

  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/columns',
    keywords: columnKeywords[locale],
  });
}

export default async function ColumnsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: ColumnsSearchParams;
}) {
  const locale = normalizeLocale(params.locale);

  const publishedPage = await resolvePublishedSitePage(locale, COLUMNS_SLUG);
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
  const posts = await getAllColumnPostsIncludingBlob(locale);
  const byline = locale === 'ko' ? '증준외 변호사' : locale === 'zh-hant' ? '曾俊瑋律師' : 'Attorney Wei Tseng';
  const templateVisibility = await readBuilderDynamicTemplatePublishedBlockVisibility(
    'columns.list-template',
    locale
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
              { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
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
