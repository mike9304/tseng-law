import { isLocale, locales, type Locale } from '@/lib/locales';

/** Builder authoring locales that own an independent seeded canvas. */
export const BUILDER_AUTHORING_LOCALES = locales;

export function parseBuilderAuthoringLocale(value: unknown): Locale | null {
  return typeof value === 'string' && isLocale(value) ? value : null;
}

export function createIsolatedHomeSeedBody(locale: Locale): { locale: Locale } {
  return { locale };
}

export function createIsolatedHomeDecomposeBody(locale: Locale): { slug: ''; locale: Locale } {
  return { slug: '', locale };
}

export function createIsolatedHomePublishBody(
  pageId: string,
  locale: Locale,
): { pageIds: string[]; cmsCollectionIds: []; locale: Locale } {
  return { pageIds: [pageId], cmsCollectionIds: [], locale };
}
