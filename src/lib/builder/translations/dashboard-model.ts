/**
 * F113 — Translation Manager dashboard data model.
 *
 * Computes a per-page × per-locale status grid from the shared
 * BuilderSiteDocument. There is no separate "per-locale site document"
 * in this codebase — each page meta carries its own `locale`, and
 * cross-locale linkage is via `linkedPageIds` (with a slug+locale
 * fallback that mirrors sync.ts `findTargetPage`).
 *
 * Status rules (using fields that exist today; see TODOs for upgrade
 * once a true `lastTranslatedAt` is added):
 *   - no linked target page                                  → 'untranslated'
 *   - target page exists, no publishedAt                     → 'draft'
 *   - target.publishedAt >= source.updatedAt                 → 'published'
 *   - source.updatedAt   >  target.updatedAt                 → 'outdated'
 *   - otherwise                                              → 'draft'
 */

import { locales, type Locale } from '@/lib/locales';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import type {
  BuilderPageMeta,
  BuilderSiteDocument,
} from '@/lib/builder/site/types';

export type TranslationRowStatus =
  | 'untranslated'
  | 'draft'
  | 'published'
  | 'outdated';

export interface TranslationDashboardEntry {
  locale: Locale;
  status: TranslationRowStatus;
  /** Target page id when a matching locale page exists. */
  targetPageId?: string;
  /**
   * Best-effort `lastTranslatedAt`. We use the target page's updatedAt
   * as a proxy until a dedicated field lands on BuilderPageMeta.
   */
  lastTranslatedAt?: string;
  /** Source page's updatedAt — used by clients to render "X days behind". */
  lastSourceUpdateAt?: string;
}

export interface TranslationDashboardRow {
  pageId: string;
  slug: string;
  sourceTitle: string;
  sourceLocale: Locale;
  /** Mirror of sourcePage.updatedAt for convenience. */
  sourceUpdatedAt: string;
  /** Mirror of sourcePage.publishedAt for convenience. */
  sourcePublishedAt?: string;
  entries: TranslationDashboardEntry[];
}

export interface TranslationDashboardPayload {
  ok: true;
  siteId: string;
  sourceLocale: Locale;
  targetLocales: Locale[];
  rows: TranslationDashboardRow[];
  syncedAt: string;
}

function titleForSource(page: BuilderPageMeta, sourceLocale: Locale): string {
  return (
    page.title[sourceLocale] ||
    page.title[page.locale] ||
    page.slug ||
    'Untitled'
  );
}

/**
 * Locate a target-locale equivalent for the given source page. Mirrors
 * the helper in sync.ts so we don't depend on internal exports.
 */
function findTargetPage(
  site: BuilderSiteDocument,
  sourcePage: BuilderPageMeta,
  targetLocale: Locale,
): BuilderPageMeta | null {
  const linkedId = sourcePage.linkedPageIds?.[targetLocale];
  if (linkedId) {
    const linked = site.pages.find((page) => page.pageId === linkedId);
    if (linked) return linked;
  }
  const homeMatch = sourcePage.isHomePage
    ? site.pages.find((page) => page.locale === targetLocale && page.isHomePage)
    : null;
  if (homeMatch) return homeMatch;
  return (
    site.pages.find(
      (page) => page.locale === targetLocale && page.slug === sourcePage.slug,
    ) ?? null
  );
}

function computeRowStatus(
  sourcePage: BuilderPageMeta,
  targetPage: BuilderPageMeta | null,
): TranslationRowStatus {
  if (!targetPage) return 'untranslated';

  const sourceUpdated = Date.parse(sourcePage.updatedAt);
  const targetUpdated = Date.parse(targetPage.updatedAt);
  const targetPublished = targetPage.publishedAt
    ? Date.parse(targetPage.publishedAt)
    : NaN;

  if (Number.isFinite(targetPublished)) {
    if (
      Number.isFinite(sourceUpdated) &&
      targetPublished >= sourceUpdated
    ) {
      return 'published';
    }
  }
  if (
    Number.isFinite(sourceUpdated) &&
    Number.isFinite(targetUpdated) &&
    sourceUpdated > targetUpdated
  ) {
    return 'outdated';
  }
  return 'draft';
}

/**
 * Pure builder — exported for unit tests so we can seed a synthetic site
 * doc without hitting persistence.
 */
export function buildTranslationDashboardFromSite(
  site: BuilderSiteDocument,
  sourceLocale: Locale,
): TranslationDashboardRow[] {
  const targetLocales = locales.filter((locale) => locale !== sourceLocale);
  const sourcePages = site.pages.filter(
    (page) => page.locale === sourceLocale,
  );
  return sourcePages.map((sourcePage) => {
    const entries: TranslationDashboardEntry[] = targetLocales.map(
      (locale) => {
        const targetPage = findTargetPage(site, sourcePage, locale);
        return {
          locale,
          status: computeRowStatus(sourcePage, targetPage),
          targetPageId: targetPage?.pageId,
          lastTranslatedAt: targetPage?.updatedAt,
          lastSourceUpdateAt: sourcePage.updatedAt,
        };
      },
    );
    return {
      pageId: sourcePage.pageId,
      slug: sourcePage.slug,
      sourceTitle: titleForSource(sourcePage, sourceLocale),
      sourceLocale,
      sourceUpdatedAt: sourcePage.updatedAt,
      sourcePublishedAt: sourcePage.publishedAt,
      entries,
    };
  });
}

export async function buildTranslationDashboard(
  siteId: string,
  sourceLocale: Locale,
): Promise<TranslationDashboardPayload> {
  const site = await readSiteDocument(siteId, sourceLocale);
  const rows = buildTranslationDashboardFromSite(site, sourceLocale);
  return {
    ok: true,
    siteId,
    sourceLocale,
    targetLocales: locales.filter((locale) => locale !== sourceLocale),
    rows,
    syncedAt: new Date().toISOString(),
  };
}