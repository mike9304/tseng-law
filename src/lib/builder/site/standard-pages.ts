import { defaultLocale, type Locale } from '@/lib/locales';

export const REQUIRED_STANDARD_PAGE_SLUGS = [
  '',
  'about',
  'services',
  'contact',
  'lawyers',
  'faq',
  'pricing',
  'reviews',
  'columns',
  'videos',
  'privacy',
  'disclaimer',
] as const;

type StandardPageSeedCandidate = {
  slug: string;
  isHomePage?: boolean;
  locale?: Locale;
};

function pageLocale(page: StandardPageSeedCandidate): Locale {
  return page.locale ?? defaultLocale;
}

export function matchesStandardPageSlugForLocale(
  page: StandardPageSeedCandidate,
  locale: Locale,
  slug: string,
): boolean {
  if (pageLocale(page) !== locale) return false;
  if (slug === '') return page.isHomePage || page.slug === '';
  return page.slug === slug;
}

export function isStandardPageSlug(slug: string): boolean {
  return REQUIRED_STANDARD_PAGE_SLUGS.some((standardSlug) => standardSlug === slug);
}

export function needsStandardPageSeedForLocale(
  sitePages: StandardPageSeedCandidate[],
  locale: Locale,
): boolean {
  if (sitePages.length === 0) return true;
  return REQUIRED_STANDARD_PAGE_SLUGS.some((slug) => (
    !sitePages.some((page) => matchesStandardPageSlugForLocale(page, locale, slug))
  ));
}
