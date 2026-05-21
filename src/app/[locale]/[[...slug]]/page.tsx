import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  buildPublishedSitePageMetadata,
  PublishedSitePageView,
  resolvePublishedSitePage,
} from '@/lib/builder/site/public-page';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { checkAccess } from '@/lib/builder/members/members-engine';
import { getLegacyPageMetadata, renderLegacyPage } from '../(legacy)';

export const dynamic = 'force-dynamic';

function resolveSlugPath(slug?: string[]): string {
  return slug?.join('/') || '';
}

function buildPublishedPath(locale: Locale, slugPath: string): string {
  return `/${locale}${slugPath ? `/${slugPath}` : ''}`;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug?: string[] };
}): Promise<Metadata> {
  const locale: Locale = normalizeLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  const legacyMetadata = getLegacyPageMetadata(slugPath, locale);
  if (legacyMetadata) return legacyMetadata;

  const publishedMetadata = await buildPublishedSitePageMetadata(locale, slugPath);
  if (publishedMetadata) return publishedMetadata;

  return { title: 'Page not found' };
}

export default async function MainSiteCatchAllPage({
  params,
}: {
  params: { locale: string; slug?: string[] };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const slugPath = resolveSlugPath(params.slug);

  const legacyPage = await renderLegacyPage(slugPath, locale);
  if (legacyPage) return legacyPage;

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

    return <PublishedSitePageView resolved={publishedPage} />;
  }

  notFound();
}
