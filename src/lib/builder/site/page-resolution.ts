import type { Locale } from '@/lib/locales';
import { projectPagesForLocale } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta } from '@/lib/builder/site/types';

function isHomePage(page: BuilderPageMeta, slugPath: string): boolean {
  return !slugPath && (page.isHomePage || page.slug === '');
}

function isSlugPage(page: BuilderPageMeta, slugPath: string): boolean {
  return Boolean(slugPath) && page.slug === slugPath;
}

function sortPageCandidates(left: BuilderPageMeta, right: BuilderPageMeta): number {
  const publishedDelta = Number(Boolean(right.publishedAt)) - Number(Boolean(left.publishedAt));
  if (publishedDelta !== 0) return publishedDelta;

  return (right.updatedAt || right.createdAt).localeCompare(left.updatedAt || left.createdAt);
}

export interface BuilderResolvedPageMatch {
  page: BuilderPageMeta;
  dynamicItemRecordSlug?: string;
}

export function findPageMetaForLocaleWithDynamicContext(
  pages: BuilderPageMeta[],
  locale: Locale,
  slugPath: string,
): BuilderResolvedPageMatch | undefined {
  const visiblePages = projectPagesForLocale(pages, locale);
  const candidates = visiblePages.filter((page) => (
    isHomePage(page, slugPath) || isSlugPage(page, slugPath)
  ));

  const exactPage = [...candidates].sort(sortPageCandidates)[0];
  if (exactPage) return { page: exactPage };

  const dynamicItemCandidates = visiblePages
    .filter((page) => {
      if (!page.dynamicItem || !page.slug || !slugPath.startsWith(`${page.slug}/`)) return false;
      const recordSlug = slugPath.slice(page.slug.length + 1);
      return Boolean(recordSlug && !recordSlug.includes('/'));
    })
    .sort(sortPageCandidates);
  const dynamicItemPage = dynamicItemCandidates[0];
  if (!dynamicItemPage) return undefined;

  return {
    page: dynamicItemPage,
    dynamicItemRecordSlug: slugPath.slice(dynamicItemPage.slug.length + 1),
  };
}

export function findPageMetaForLocale(
  pages: BuilderPageMeta[],
  locale: Locale,
  slugPath: string,
): BuilderPageMeta | undefined {
  return findPageMetaForLocaleWithDynamicContext(pages, locale, slugPath)?.page;
}
