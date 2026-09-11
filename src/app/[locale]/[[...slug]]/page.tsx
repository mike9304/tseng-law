import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { isSiteLocale, normalizeSiteLocale, toBuilderLocale, type Locale, type SiteLocale } from '@/lib/locales';
import {
  buildPublishedSitePageMetadata,
  PublishedSitePageView,
  resolvePublishedSitePage,
} from '@/lib/builder/site/public-page';
import { emitPublicPageRenderHook } from '@/lib/builder/apps/lifecycle-emitters';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { checkAccess } from '@/lib/builder/members/members-engine';
import { getLegacyPageMetadata, renderLegacyPage } from '../(legacy)';
import { OPEN_GRAPH_LOCALE } from '@/lib/builder/seo/seo-model';
import { isJaFullStaticPath, isJaUnsupportedPath, JA_SAFE_FALLBACK } from '@/lib/public-route-policy';
import { buildLocalizedNotFoundMetadata } from '@/lib/not-found-copy';
import GuidancePageBody, {
  GuidanceRelatedGuides,
  type GuidanceRelatedColumn,
} from '@/components/GuidancePageBody';
import GuidanceHomeBody, {
  resolveGuidanceHomeColumns,
} from '@/components/GuidanceHomeBody';
import { getAllColumnPosts } from '@/lib/columns';
import { guidanceContent } from '@/data/international-guidance-content';
import {
  GUIDANCE_EXTRA_RELATED_COLUMN_SLUGS,
  getGuidancePage,
} from '@/data/international-guidance-extra';
import {
  buildGuidanceCoreLanguageAlternates,
  classifyGuidanceSlug,
  guidanceCanonicalUrl,
  isGuidanceExtraPageKey,
  isGuidanceLocale4,
  type GuidanceLocale4,
  type GuidancePageKey,
} from '@/lib/public-guidance';
import { getOpenGraphLocale, getOrganizationName, getSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

function resolveSlugPath(slug?: string[]): string {
  return slug?.join('/') || '';
}

function buildPublishedPath(locale: Locale, slugPath: string): string {
  return `/${locale}${slugPath ? `/${slugPath}` : ''}`;
}

function withOgLocale(metadata: Metadata, locale: Locale): Metadata {
  const base = metadata.openGraph;
  const baseOg = base && typeof base === 'object' ? base : {};
  return {
    ...metadata,
    openGraph: {
      ...baseOg,
      locale: OPEN_GRAPH_LOCALE[locale],
    },
  };
}

function resolvePublicLocale(raw: string): SiteLocale {
  if (!isSiteLocale(raw)) {
    notFound();
  }
  return normalizeSiteLocale(raw);
}

/**
 * This locale's own columns on a hub page's subject, in the editorial order of
 * {@link GUIDANCE_EXTRA_RELATED_COLUMN_SLUGS}.
 *
 * Titles come from each file's own frontmatter, so the list is in the reader's
 * language without anything being translated here. A slug with no markdown file
 * in this locale is dropped rather than linked: `/{locale}/columns/<slug>` 404s
 * when the file is absent, and the block must not manufacture that URL.
 */
function resolveGuidanceRelatedColumns(
  locale: GuidanceLocale4,
  pageKey: GuidancePageKey,
): GuidanceRelatedColumn[] {
  if (!isGuidanceExtraPageKey(pageKey)) return [];

  const slugs = GUIDANCE_EXTRA_RELATED_COLUMN_SLUGS[pageKey];
  if (slugs.length === 0) return [];

  const titleBySlug = new Map(
    getAllColumnPosts(locale).map((post) => [post.slug, post.title]),
  );
  return slugs.flatMap((slug) => {
    const title = titleBySlug.get(slug);
    return title ? [{ href: `/${locale}/columns/${slug}`, title }] : [];
  });
}

function buildGuidancePageMetadata(locale: GuidanceLocale4, slug?: string[]): Metadata {
  const classified = classifyGuidanceSlug(slug);
  if (classified.kind !== 'page') {
    const pack = guidanceContent[locale];
    return {
      title: { absolute: `${pack.notFoundTitle} | ${getOrganizationName('en')}` },
      description: pack.notFoundText,
      robots: { index: false, follow: false },
    };
  }

  // Core page bodies live in the translation-lane content module; page keys
  // added after the original ten live in `international-guidance-extra.ts`.
  const page = getGuidancePage(locale, classified.pageKey);
  const siteUrl = getSiteUrl();
  // Same "<page> | <firm>" shape the four site locales publish. The guidance
  // titles carried the page name alone, so a search result showed no firm.
  const brandName = getOrganizationName('en');
  const canonicalUrl = guidanceCanonicalUrl(locale, classified.pageKey, siteUrl);
  return {
    title: { absolute: `${page.title} | ${brandName}` },
    description: page.description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildGuidanceCoreLanguageAlternates(classified.pageKey, siteUrl),
    },
    // WO-O29 C: ko/zh-hant/en/ja publish `og:locale`; these ten guidance pages
    // published no Open Graph block at all. `og:locale:alternate` stays absent
    // because the four site locales emit none either.
    openGraph: {
      title: `${page.title} | ${brandName}`,
      description: page.description,
      url: canonicalUrl,
      siteName: brandName,
      locale: getOpenGraphLocale(locale),
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string; slug?: string[] }>;
  }
): Promise<Metadata> {
  const params = await props.params;

  if (isGuidanceLocale4(params.locale)) {
    return buildGuidancePageMetadata(params.locale, params.slug);
  }

  const locale = resolvePublicLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  // Japanese public surface: never project KO/EN builder pages onto /ja/*
  if (locale === 'ja') {
    if (isJaUnsupportedPath(slugPath)) {
      return buildLocalizedNotFoundMetadata(locale);
    }
    const legacyMetadata = getLegacyPageMetadata(slugPath, locale);
    if (legacyMetadata) return legacyMetadata;
    return buildLocalizedNotFoundMetadata(locale);
  }

  const builderLocale = toBuilderLocale(locale);
  const publishedMetadata = await buildPublishedSitePageMetadata(builderLocale, slugPath);
  if (publishedMetadata) return withOgLocale(publishedMetadata, builderLocale);

  const legacyMetadata = getLegacyPageMetadata(slugPath, locale);
  if (legacyMetadata) return legacyMetadata;

  return buildLocalizedNotFoundMetadata(locale);
}

export default async function MainSiteCatchAllPage(
  props: {
    params: Promise<{ locale: string; slug?: string[] }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  if (isGuidanceLocale4(params.locale)) {
    const classified = classifyGuidanceSlug(params.slug);
    if (classified.kind !== 'page') {
      notFound();
    }
    if (classified.pageKey === 'home') {
      // Same section sequence as the English home. Columns come from the
      // locale's own files when the translation pipeline has written any, and
      // otherwise from the first source language that has files, always behind
      // an explicit "original language" badge.
      const columns = resolveGuidanceHomeColumns(params.locale, (source) =>
        getAllColumnPosts(source),
      );
      // The related-guidance links are appended here rather than inside
      // `GuidanceHomeBody`: the home body is composed entirely of
      // translation-lane copy, and this block reads from the extra-page module.
      return (
        <>
          <GuidanceHomeBody locale={params.locale} columns={columns} />
          <GuidanceRelatedGuides locale={params.locale} pageKey="home" />
        </>
      );
    }
    return (
      <GuidancePageBody
        locale={params.locale}
        pageKey={classified.pageKey}
        relatedColumns={resolveGuidanceRelatedColumns(params.locale, classified.pageKey)}
      />
    );
  }

  const locale = resolvePublicLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  // --- Japanese public routes (file/legacy only, no builder projection) ---
  if (locale === 'ja') {
    if (isJaUnsupportedPath(slugPath)) {
      redirect(JA_SAFE_FALLBACK);
    }
    // Known static pages only
    if (!isJaFullStaticPath(slugPath) && slugPath !== '') {
      // allow only exact static keys; multi-segment JA (except handled elsewhere) → fallback
      if (slugPath.includes('/')) {
        notFound();
      }
      if (!isJaFullStaticPath(slugPath)) {
        notFound();
      }
    }
    const legacy = await renderLegacyPage(slugPath, locale);
    if (legacy) return legacy;
    notFound();
  }

  // --- ko / zh-hant / en: existing builder-first path ---
  const builderLocale = toBuilderLocale(locale);
  const publishedPage = await resolvePublishedSitePage(builderLocale, slugPath);
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
        const currentPath = buildPublishedPath(builderLocale, slugPath);
        redirect(access.redirectPath || `/${builderLocale}/login?next=${encodeURIComponent(currentPath)}`);
      }
    }

    emitPublicPageRenderHook({
      kind: 'public.page-render',
      payload: {
        siteId: publishedPage.site.siteId,
        pageId: publishedPage.pageMeta.pageId,
        slug: slugPath,
        locale: builderLocale,
      },
    });

    return <PublishedSitePageView resolved={publishedPage} searchParams={searchParams} />;
  }

  const legacy = await renderLegacyPage(slugPath, locale);
  if (legacy) return legacy;

  notFound();
}
