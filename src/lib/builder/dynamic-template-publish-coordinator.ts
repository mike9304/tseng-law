/**
 * F22 / F26 — Atomic publish coordinator for dynamic template pages.
 *
 * Dynamic list/item pages are useless if the page snapshot publishes but
 * the CMS collection it references is still on a draft revision. This
 * coordinator inspects the site doc for pages whose `dynamicList` or
 * `dynamicItem` meta points at a collection, dedupes the referenced
 * collection ids, and delegates to `publishAtomic` so the page +
 * collection drafts publish (or roll back) as one transaction.
 *
 * Inputs
 * ------
 * - `siteId`, `locale`, and the page ids the editor explicitly chose.
 * - The coordinator always pulls the page's `pageMeta.dynamicList` /
 *   `dynamicItem` to determine the referenced collection; callers don't
 *   have to know.
 *
 * Outputs
 * -------
 * Returns the orchestrator's `AtomicPublishOutcome` plus a summary of how
 * the coordinator resolved each input page (which collection it pulled,
 * whether the page was static and skipped, etc.) for surfacing in admin UI.
 */
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { publishAtomic, type AtomicPublishOutcome } from '@/lib/builder/publish-gate/atomic-publish-orchestrator';
import { defaultLocale, type Locale } from '@/lib/locales';
import type { BuilderPageMeta } from '@/lib/builder/site/types';

export interface PublishDynamicTemplateInput {
  siteId: string;
  pageIds: string[];
  locale?: Locale;
  /** Additional CMS collection ids the caller wants to include regardless of page references. */
  extraCollectionIds?: string[];
}

export interface DynamicPageResolution {
  pageId: string;
  status: 'dynamic-list' | 'dynamic-item' | 'static' | 'missing';
  collectionId?: string;
}

export interface PublishDynamicTemplateOutcome {
  outcome: AtomicPublishOutcome;
  resolvedPages: DynamicPageResolution[];
  referencedCollectionIds: string[];
}

/**
 * Inspect the site doc, dedupe referenced CMS collections, and call
 * `publishAtomic` with the merged set. The coordinator never silently
 * publishes pages the caller didn't ask for — page ids that exist but
 * have no dynamic meta still appear in the page id list (so admin UIs
 * can choose to publish them anyway) but contribute zero collections.
 */
export async function publishDynamicTemplate(
  input: PublishDynamicTemplateInput,
): Promise<PublishDynamicTemplateOutcome> {
  const locale = input.locale ?? defaultLocale;
  const site = await readSiteDocument(input.siteId, locale);

  const pagesById = new Map<string, BuilderPageMeta>(
    (site.pages ?? []).map((page) => [page.pageId, page] as const),
  );

  const resolvedPages: DynamicPageResolution[] = input.pageIds.map((pageId) =>
    resolvePage(pageId, pagesById.get(pageId)),
  );

  const collectionIds = collectReferencedCollectionIds(
    resolvedPages,
    input.extraCollectionIds ?? [],
  );

  const outcome = await publishAtomic({
    siteId: input.siteId,
    locale,
    pageIds: [...input.pageIds],
    cmsCollectionIds: collectionIds,
  });

  return {
    outcome,
    resolvedPages,
    referencedCollectionIds: collectionIds,
  };
}

/**
 * Pure helper — given a list of page metas, compute the deduped list of
 * CMS collection ids those pages reference. Exposed for test coverage and
 * for admin UIs that want to render the impact summary before triggering
 * an actual publish.
 */
export function collectDynamicCollectionsForPages(
  pages: ReadonlyArray<BuilderPageMeta | undefined>,
): string[] {
  const resolutions = pages.map((page) => resolvePage(page?.pageId ?? '', page));
  return collectReferencedCollectionIds(resolutions, []);
}

function resolvePage(
  pageId: string,
  page: BuilderPageMeta | undefined,
): DynamicPageResolution {
  if (!page) {
    return { pageId, status: 'missing' };
  }
  if (page.dynamicList) {
    return {
      pageId: page.pageId,
      status: 'dynamic-list',
      collectionId: page.dynamicList.cmsCollectionId || page.dynamicList.collectionId,
    };
  }
  if (page.dynamicItem) {
    return {
      pageId: page.pageId,
      status: 'dynamic-item',
      collectionId: page.dynamicItem.cmsCollectionId || page.dynamicItem.collectionId,
    };
  }
  return { pageId: page.pageId, status: 'static' };
}

function collectReferencedCollectionIds(
  resolved: DynamicPageResolution[],
  extras: ReadonlyArray<string>,
): string[] {
  const seen = new Set<string>();
  const collected: string[] = [];
  for (const entry of resolved) {
    if (!entry.collectionId) continue;
    if (seen.has(entry.collectionId)) continue;
    seen.add(entry.collectionId);
    collected.push(entry.collectionId);
  }
  for (const extra of extras) {
    if (seen.has(extra)) continue;
    seen.add(extra);
    collected.push(extra);
  }
  return collected;
}
