/**
 * F119 — Translation publish warnings.
 *
 * Surface every per-page × per-locale issue a publish operator should see
 * before promoting a multi-locale site. The detection runs off the site
 * document only (no deep canvas walk yet) so it stays cheap to call from a
 * polled panel; deeper broken-link detection across canvas nodes is tracked
 * as a TODO.
 *
 * Warning kinds:
 *   - 'untranslated': source page has no target-locale projection
 *   - 'outdated':     target page's updatedAt is older than the source's
 *   - 'broken-link':  source page's `linkedPageIds[targetLocale]` points to
 *                     a pageId that no longer exists in the site doc
 */

import { locales, defaultLocale, type Locale } from '@/lib/locales';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import type {
  TranslationPublishWarning,
  TranslationPublishWarningsPayload,
} from './publish-warning-types';

export type {
  TranslationPublishWarning,
  TranslationPublishWarningKind,
  TranslationPublishWarningsPayload,
  TranslationPublishWarningSeverity,
} from './publish-warning-types';

function sourceTitleFor(page: BuilderPageMeta, sourceLocale: Locale): string {
  return page.title[sourceLocale] || page.title[page.locale] || page.slug || page.pageId;
}

function findTargetPage(
  site: BuilderSiteDocument,
  source: BuilderPageMeta,
  target: Locale,
): BuilderPageMeta | null {
  const linkedId = source.linkedPageIds?.[target];
  if (linkedId) {
    const linked = site.pages.find((page) => page.pageId === linkedId);
    if (linked) return linked;
  }
  if (source.isHomePage) {
    const home = site.pages.find((page) => page.locale === target && page.isHomePage);
    if (home) return home;
  }
  return (
    site.pages.find((page) => page.locale === target && page.slug === source.slug) ?? null
  );
}

/**
 * Pure builder — exported for tests so callers can seed a synthetic site
 * doc without hitting persistence.
 */
export function buildTranslationPublishWarnings(
  site: BuilderSiteDocument,
  sourceLocale: Locale,
): TranslationPublishWarning[] {
  const targetLocales = locales.filter((locale) => locale !== sourceLocale);
  const sources = site.pages.filter((page) => page.locale === sourceLocale);
  const warnings: TranslationPublishWarning[] = [];

  for (const source of sources) {
    const sourceTitle = sourceTitleFor(source, sourceLocale);
    const sourceUpdated = Date.parse(source.updatedAt);

    for (const target of targetLocales) {
      // broken-link: explicit linkage to a pageId that no longer exists.
      const linkedId = source.linkedPageIds?.[target];
      if (linkedId && !site.pages.some((page) => page.pageId === linkedId)) {
        warnings.push({
          severity: 'error',
          kind: 'broken-link',
          pageId: source.pageId,
          locale: target,
          message:
            `"${sourceTitle}" links to a ${target} page (${linkedId}) that no longer exists.`,
        });
        // Skip further checks for this locale — the link is broken, the other
        // signals would be misleading.
        continue;
      }

      const targetPage = findTargetPage(site, source, target);

      if (!targetPage) {
        warnings.push({
          severity: 'warning',
          kind: 'untranslated',
          pageId: source.pageId,
          locale: target,
          message: `"${sourceTitle}" has no ${target} translation yet.`,
        });
        continue;
      }

      const targetUpdated = Date.parse(targetPage.updatedAt);
      if (
        Number.isFinite(sourceUpdated) &&
        Number.isFinite(targetUpdated) &&
        sourceUpdated > targetUpdated
      ) {
        warnings.push({
          severity: 'warning',
          kind: 'outdated',
          pageId: source.pageId,
          locale: target,
          message:
            `"${sourceTitle}" was updated after its ${target} translation — re-translate before publish.`,
        });
      }
    }
  }

  return warnings;
}

export async function buildTranslationPublishWarningsPayload(
  siteId: string,
  sourceLocale: Locale = defaultLocale,
): Promise<TranslationPublishWarningsPayload> {
  const site = await readSiteDocument(siteId, sourceLocale);
  return {
    ok: true,
    siteId,
    sourceLocale,
    syncedAt: new Date().toISOString(),
    warnings: buildTranslationPublishWarnings(site, sourceLocale),
  };
}
