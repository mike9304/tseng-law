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
import InternationalGuidance from '@/components/InternationalGuidance';
import { guidanceContent } from '@/data/international-guidance-content';
import {
  buildGuidanceCoreLanguageAlternates,
  classifyGuidanceSlug,
  guidanceCanonicalUrl,
  isGuidanceLocale4,
  type GuidanceLocale4,
} from '@/lib/public-guidance';
import { getSiteUrl } from '@/lib/seo';

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

function buildGuidancePageMetadata(locale: GuidanceLocale4, slug?: string[]): Metadata {
  const classified = classifyGuidanceSlug(slug);
  if (classified.kind !== 'page') {
    const pack = guidanceContent[locale];
    return {
      title: { absolute: pack.notFoundTitle },
      description: pack.notFoundText,
      robots: { index: false, follow: false },
    };
  }

  const page = guidanceContent[locale].pages[classified.pageKey];
  const siteUrl = getSiteUrl();
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: {
      canonical: guidanceCanonicalUrl(locale, classified.pageKey, siteUrl),
      languages: buildGuidanceCoreLanguageAlternates(classified.pageKey, siteUrl),
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
    return <InternationalGuidance locale={params.locale} pageKey={classified.pageKey} />;
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
