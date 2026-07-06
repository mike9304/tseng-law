import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

export function findTargetPageMeta(
  site: BuilderSiteDocument,
  sourcePageId: string,
  targetLocale: Locale,
): BuilderPageMeta | null {
  const sourcePage = site.pages.find((page) => page.pageId === sourcePageId);
  if (!sourcePage) return null;
  if (sourcePage.locale === targetLocale) return sourcePage;

  const linkedId = sourcePage.linkedPageIds?.[targetLocale];
  if (linkedId) {
    const linked = site.pages.find((page) => page.pageId === linkedId);
    if (linked) return linked;
  }

  if (sourcePage.isHomePage) {
    const home = site.pages.find((page) => page.locale === targetLocale && page.isHomePage);
    if (home) return home;
  }

  return (
    site.pages.find((page) => page.locale === targetLocale && page.slug === sourcePage.slug)
    ?? null
  );
}
