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

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug?: string[] };
}): Promise<Metadata> {
  const locale = resolvePublicLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  // Japanese public surface: never project KO/EN builder pages onto /ja/*
  if (locale === 'ja') {
    if (isJaUnsupportedPath(slugPath)) {
      return { title: 'Page not found' };
    }
    const legacyMetadata = getLegacyPageMetadata(slugPath, locale);
    if (legacyMetadata) return legacyMetadata;
    return { title: 'Page not found' };
  }

  const builderLocale = toBuilderLocale(locale);
  const publishedMetadata = await buildPublishedSitePageMetadata(builderLocale, slugPath);
  if (publishedMetadata) return withOgLocale(publishedMetadata, builderLocale);

  const legacyMetadata = getLegacyPageMetadata(slugPath, locale);
  if (legacyMetadata) return legacyMetadata;

  return { title: 'Page not found' };
}

export default async function MainSiteCatchAllPage({
  params,
  searchParams,
}: {
  params: { locale: string; slug?: string[] };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
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
