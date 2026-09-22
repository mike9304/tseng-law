/** Shared SSR/API current-publication binding. Local implementation; no cross-store atomicity claim. */
import type { SiteLocale } from '@/lib/locales';
import { loadSearchIndex, saveSearchIndex } from './index-storage';
import { buildSearchIndex } from './index-builder';
import { runSearchQuery } from './query-engine';
import { collectAllSearchDocs, createCurrentBuilderSearchReader, parseCurrentBuilderSearchTarget, SearchCurrentDataUnavailableError } from './source-collector';
import { augmentStaticDocs } from './augment-static-docs';
import { getPublicIntentSearchDocs } from './public-intent-docs';
import { SEARCH_DOC_KINDS, type SearchDoc, type SearchDocKind, type SearchIndex } from './types';
const SEARCH_INDEX_FRESHNESS_MS = 5 * 60 * 1000;
let searchIndexRefreshPromise: Promise<SearchIndex> | null = null;
export class SearchIndexUnavailableError extends Error {
  constructor(readonly cause: unknown) { super('search_index_failed'); }
}
function isFreshSearchIndex(builtAt: unknown): boolean {
  if (typeof builtAt !== 'string') return false;
  const builtAtMs = Date.parse(builtAt);
  const ageMs = Date.now() - builtAtMs;
  return Number.isFinite(builtAtMs) && ageMs >= 0 && ageMs <= SEARCH_INDEX_FRESHNESS_MS;
}

async function rebuildSearchIndex(): Promise<SearchIndex> {
  const index = buildSearchIndex(await collectAllSearchDocs('default'));
  try {
    await saveSearchIndex(index);
  } catch (error) {
    console.error('[public/search] index save failed:', error);
  }
  return index;
}

function refreshSearchIndex(): Promise<SearchIndex> {
  if (!searchIndexRefreshPromise) {
    searchIndexRefreshPromise = rebuildSearchIndex().finally(() => {
      searchIndexRefreshPromise = null;
    });
  }
  return searchIndexRefreshPromise;
}

/** Revalidate only bounded cached candidates; existing index discovery remains TTL-based. */
async function currentSearchHits(index: SearchIndex, query: string, locale: SiteLocale, limit: number, kinds: SearchDocKind[] | undefined, staticDocs: SearchDoc[]) {
  const candidates = runSearchQuery({ index, query, locale, limit: 50, kinds }).slice(0, 50);
  const current = new Map<string, SearchDoc>();
  const targets = new Map<string, SearchDoc>();
  // This registry comes from current code, never from an index source marker.
  const staticByIdentity = new Map(staticDocs.map(doc => [JSON.stringify([doc.locale, doc.id, doc.url]), doc]));
  for (const hit of candidates) {
    const doc = hit.doc;
    if (doc.locale !== locale) throw new SearchCurrentDataUnavailableError();
    if (doc.kind === 'page') {
      const staticDoc = staticByIdentity.get(JSON.stringify([doc.locale, doc.id, doc.url]));
      if (staticDoc) {
        // An old index may contain a matching URL with stale or forged text.
        // Only current file-backed content participates in final scoring.
        current.set(JSON.stringify([doc.locale, doc.id]), staticDoc);
        continue;
      }
      // Validate every selected target before starting any site/canvas IO.
      parseCurrentBuilderSearchTarget(doc);
      targets.set(JSON.stringify([doc.locale, doc.id]), doc);
    } else if (doc.id.startsWith('page:')) throw new SearchCurrentDataUnavailableError();
  }
  if (targets.size === 0 && current.size === 0) return candidates.slice(0, limit);
  const readCurrent = createCurrentBuilderSearchReader();
  const unique = [...targets.entries()];
  for (let offset = 0; offset < unique.length; offset += 4) {
    await Promise.all(unique.slice(offset, offset + 4).map(async ([key, doc]) => {
      const refreshed = await readCurrent(doc);
      if (refreshed) current.set(key, refreshed);
    }));
  }
  const refreshedHits = runSearchQuery({ index: buildSearchIndex([...current.values()]), query, locale, limit: 50, kinds });
  // No stale builder score/highlight survives. Other source hits keep their existing behavior.
  const combined = [...candidates.filter(hit => hit.doc.kind !== 'page'), ...refreshedHits];
  combined.sort((a, b) => b.score - a.score);
  return combined.slice(0, limit);
}


export async function searchCurrentPublication(input: {query: string; locale: SiteLocale; limit: number; kinds?: SearchDocKind[]}) {
  const query = Array.from(input.query.trim()).slice(0, 200).join('');
  if (!query) return {hits: [], indexMissing: false, availableKinds: [] as SearchDocKind[]};
  let index: SearchIndex;
  let storedIndex: SearchIndex | null;
  try {
    storedIndex = await loadSearchIndex();
    index = storedIndex && isFreshSearchIndex(storedIndex.builtAt) ? storedIndex : await refreshSearchIndex();
  } catch (cause) { throw new SearchIndexUnavailableError(cause); }
  const limit = Math.max(1, Math.min(50, input.limit || 20));
  const staticDocs = getPublicIntentSearchDocs(input.locale);
  let queryIndex = augmentStaticDocs(index, input.locale, staticDocs);
  if (staticDocs.length) {
    const byIdentity = new Map(staticDocs.map(doc => [JSON.stringify([doc.locale, doc.id, doc.url]), doc]));
    // URL deduplication in augmentation must not leave old text in discovery.
    const fresh = buildSearchIndex((queryIndex.byLocale[input.locale] ?? []).map(doc =>
      doc.kind === 'page' ? byIdentity.get(JSON.stringify([doc.locale, doc.id, doc.url])) ?? doc : doc));
    queryIndex = {
      ...queryIndex,
      byLocale: { ...queryIndex.byLocale, [input.locale]: fresh.byLocale[input.locale] },
      invertedByLocale: { ...queryIndex.invertedByLocale, [input.locale]: fresh.invertedByLocale[input.locale] },
    };
  }
  // Preserve discovery-based kind chips without a second index or site read.
  const availableKinds = SEARCH_DOC_KINDS.filter(kind => queryIndex.byLocale[input.locale]?.some(doc => doc.kind === kind));
  return {hits: await currentSearchHits(queryIndex, query, input.locale, limit, input.kinds, staticDocs), indexMissing: !storedIndex, availableKinds};
}
