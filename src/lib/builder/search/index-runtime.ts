import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { loadSearchIndex, saveSearchIndex } from '@/lib/builder/search/index-storage';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import type { SearchIndex } from '@/lib/builder/search/types';

const SEARCH_INDEX_FRESHNESS_MS = 5 * 60 * 1000;

let searchIndexRefreshPromise: Promise<SearchIndex> | null = null;

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

export async function loadFreshSearchIndex(): Promise<{
  index: SearchIndex;
  storedIndex: SearchIndex | null;
}> {
  const storedIndex = await loadSearchIndex();
  if (storedIndex && isFreshSearchIndex(storedIndex.builtAt)) {
    return { index: storedIndex, storedIndex };
  }
  return { index: await refreshSearchIndex(), storedIndex };
}

export async function rebuildSearchIndexBestEffort(): Promise<void> {
  try {
    await rebuildSearchIndex();
  } catch (err) {
    console.warn('[publish] search index rebuild failed', err);
  }
}
