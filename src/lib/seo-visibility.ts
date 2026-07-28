/**
 * Shared per-locale indexability rules for public routes.
 *
 * Used by both hreflang generation (src/lib/seo.ts) and the sitemap
 * (src/app/sitemap.ts) so an English-noindex route never leaks an `en`
 * alternate into final output, regardless of which alternateLocales the
 * caller passed.
 *
 * NOTE: this module must stay client-bundle safe — src/lib/seo.ts is
 * imported by client components, so no `fs`-backed imports (e.g.
 * src/lib/columns.ts) are allowed here. The file-backed English column
 * check needs the filesystem, so callers that have it (the sitemap)
 * inject it via `isFileBackedEnglishColumn`; without a checker, column
 * detail paths keep their existing alternates untouched.
 */

export type FileBackedEnglishColumnChecker = (path: string) => boolean;

/** Paths whose page metadata is noindex only for the English locale. */
export function isEnglishNoindexPath(
  path: string,
  isFileBackedEnglishColumn?: FileBackedEnglishColumnChecker,
): boolean {
  // Full EN file-backed columns (columns-en) are indexable.
  // Builder/Blob EN column drafts without a file translation stay excluded.
  // Without a checker (client bundle / page metadata) column paths keep
  // their previous behavior; the sitemap always passes one.
  if (/^\/columns\/[^/]+$/.test(path)) {
    if (!isFileBackedEnglishColumn) return false;
    return !isFileBackedEnglishColumn(path);
  }
  return path === '/faq'
    || path === '/portfolio'
    || /^\/portfolio\/[^/]+$/.test(path)
    || path === '/events'
    || /^\/events\/[^/]+$/.test(path)
    || path === '/store'
    || /^\/store\/(?:categories|products)\/[^/]+$/.test(path);
}
