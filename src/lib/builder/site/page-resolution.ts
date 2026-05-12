import type { Locale } from '@/lib/locales';
import { projectPagesForLocale } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta } from '@/lib/builder/site/types';

function isHomePage(page: BuilderPageMeta, slugPath: string): boolean {
  return !slugPath && (page.isHomePage || page.slug === '');
}

function isSlugPage(page: BuilderPageMeta, slugPath: string): boolean {
  return Boolean(slugPath) && page.slug === slugPath;
}

export function findPageMetaForLocale(
  pages: BuilderPageMeta[],
  locale: Locale,
  slugPath: string,
): BuilderPageMeta | undefined {
  const visiblePages = projectPagesForLocale(pages, locale);
  const candidates = visiblePages.filter((page) => (
    isHomePage(page, slugPath) || isSlugPage(page, slugPath)
  ));

  return [...candidates].sort((left, right) => {
    const publishedDelta = Number(Boolean(right.publishedAt)) - Number(Boolean(left.publishedAt));
    if (publishedDelta !== 0) return publishedDelta;

    return (right.updatedAt || right.createdAt).localeCompare(left.updatedAt || left.createdAt);
  })[0];
}
