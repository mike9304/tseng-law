import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JsonLd from '@/components/JsonLd';
import FaqPublicExplorer from '@/components/faq/FaqPublicExplorer';
import { pageCopy } from '@/data/page-copy';
import {
  buildPublishedSitePageMetadata,
  PublishedSitePageView,
  resolvePublishedSitePage,
} from '@/lib/builder/site/public-page';
import { emitPublicPageRenderHook } from '@/lib/builder/apps/lifecycle-emitters';
import {
  faqItemsToSchemaItems,
  listFaqCategories,
  listFaqItems,
} from '@/lib/builder/faq/faq-engine';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { checkAccess } from '@/lib/builder/members/members-engine';
import { generateFAQSchema } from '@/lib/builder/seo/schema-org';
import {
  normalizeSiteLocale,
  siteLocales,
  type Locale,
  type SiteLocale,
} from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const FAQ_SLUG = 'faq';

type FaqSearchParams = Record<string, string | string[] | undefined>;

function firstSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildPublishedPath(locale: Locale): string {
  return `/${locale}/${FAQ_SLUG}`;
}

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  if (locale === 'ja') {
    const copy = pageCopy.ja.faq;
    return buildSeoMetadata({
      locale,
      title: copy.title,
      description: copy.description,
      path: '/faq',
      alternateLocales: siteLocales,
    });
  }

  const publishedMetadata = await buildPublishedSitePageMetadata(locale, FAQ_SLUG);
  if (publishedMetadata) return publishedMetadata;

  const copy = pageCopy[locale].faq;
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/faq',
    noindex: locale === 'en',
  });
}

export default async function FaqPage(
  props: {
    params: Promise<{ locale: SiteLocale }>;
    searchParams?: Promise<FaqSearchParams>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale = normalizeSiteLocale(params.locale);
  if (locale === 'ja') {
    const copy = pageCopy.ja.faq;
    const categories = listFaqCategories();
    const items = await listFaqItems({
      locale: 'ja',
      status: 'published',
      categoryId: firstSearchParamValue(searchParams?.category),
      q: firstSearchParamValue(searchParams?.q),
    });
    const schemaItems = faqItemsToSchemaItems(items);

    return (
      <>
        <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
        <FaqPublicExplorer
          locale={locale}
          categories={categories}
          items={items}
          initialCategory={firstSearchParamValue(searchParams?.category)}
          initialQuery={firstSearchParamValue(searchParams?.q)}
        />
        {schemaItems.length > 0 ? <JsonLd data={generateFAQSchema(schemaItems)} /> : null}
      </>
    );
  }

  const publishedPage = await resolvePublishedSitePage(locale, FAQ_SLUG);
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
        slug: FAQ_SLUG,
        locale,
      },
    });

    return <PublishedSitePageView resolved={publishedPage} searchParams={searchParams} />;
  }

  const copy = pageCopy[locale].faq;
  const categories = listFaqCategories();
  const items = await listFaqItems({
    locale,
    status: 'published',
    categoryId: firstSearchParamValue(searchParams?.category),
    q: firstSearchParamValue(searchParams?.q),
  });
  const schemaItems = faqItemsToSchemaItems(items);

  return (
    <>
      <PageHeader locale={locale} label={copy.label} title={copy.title} description={copy.description} />
      <FaqPublicExplorer
        locale={locale}
        categories={categories}
        items={items}
        initialCategory={firstSearchParamValue(searchParams?.category)}
        initialQuery={firstSearchParamValue(searchParams?.q)}
      />
      {schemaItems.length > 0 ? <JsonLd data={generateFAQSchema(schemaItems)} /> : null}
    </>
  );
}
