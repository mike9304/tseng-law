import type { Locale } from '@/lib/locales';
import { projectPagesForLocale } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
import { isInternalSandboxPage } from '@/lib/builder/site/internal-pages';

function isHomePage(page: BuilderPageMeta, slugPath: string): boolean {
  return !slugPath && (page.isHomePage || page.slug === '');
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

export interface ResolvePageMetaOptions {
  /**
   * When true, internal sandbox/QA/probe pages remain resolvable by slug.
   * Editor-side callers (e.g. publish pre-flight validation that looks a page
   * up by slug) may opt in. The public routing path leaves this false (the
   * default) so a leaked internal page is never served even when publishedAt
   * is set.
   */
  includeInternalSandbox?: boolean;
}

export function findPageMetaForLocaleWithDynamicContext(
  pages: BuilderPageMeta[],
  locale: Locale,
  slugPath: string,
  options: ResolvePageMetaOptions = {},
): BuilderResolvedPageMatch | undefined {
  const visiblePages = projectPagesForLocale(pages, locale).filter((page) => (
    options.includeInternalSandbox || !isInternalSandboxPage(page)
  ));
  const candidates = visiblePages.filter((page) => (
    isHomePage(page, slugPath) || resolveLocaleSlug(page, locale) === slugPath
  ));

  const exactPage = [...candidates].sort(sortPageCandidates)[0];
  if (exactPage) return { page: exactPage };

  const dynamicItemCandidates = visiblePages
    .filter((page) => {
      const effectiveSlug = resolveLocaleSlug(page, locale);
      if (!page.dynamicItem || !effectiveSlug || !slugPath.startsWith(`${effectiveSlug}/`)) return false;
      const recordSlug = slugPath.slice(effectiveSlug.length + 1);
      return Boolean(recordSlug && !recordSlug.includes('/'));
    })
    .sort(sortPageCandidates);
  const dynamicItemPage = dynamicItemCandidates[0];
  if (!dynamicItemPage) return undefined;

  return {
    page: dynamicItemPage,
    dynamicItemRecordSlug: slugPath.slice(resolveLocaleSlug(dynamicItemPage, locale).length + 1),
  };
}

export function findPageMetaForLocale(
  pages: BuilderPageMeta[],
  locale: Locale,
  slugPath: string,
  options: ResolvePageMetaOptions = {},
): BuilderPageMeta | undefined {
  return findPageMetaForLocaleWithDynamicContext(pages, locale, slugPath, options)?.page;
}
