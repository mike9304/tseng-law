import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';
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

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug?: string[] };
}): Promise<Metadata> {
  const locale: Locale = normalizeLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  const publishedMetadata = await buildPublishedSitePageMetadata(locale, slugPath);
  if (publishedMetadata) return withOgLocale(publishedMetadata, locale);

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
  const locale: Locale = normalizeLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  const publishedPage = await resolvePublishedSitePage(locale, slugPath);
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
        const currentPath = buildPublishedPath(locale, slugPath);
        redirect(access.redirectPath || `/${locale}/login?next=${encodeURIComponent(currentPath)}`);
      }
    }

    emitPublicPageRenderHook({
      kind: 'public.page-render',
      payload: {
        siteId: publishedPage.site.siteId,
        pageId: publishedPage.pageMeta.pageId,
        slug: slugPath,
        locale,
      },
    });

    return <PublishedSitePageView resolved={publishedPage} searchParams={searchParams} />;
  }

  const legacyPage = await renderLegacyPage(slugPath, locale);
  if (legacyPage) return legacyPage;

  notFound();
}
