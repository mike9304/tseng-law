/**
 * PR #19 — Provider router with in-memory cache.
 *
 * Selection order:
 *   1. Explicit `preferProvider` argument (test, mock, etc.).
 *   2. TRANSLATION_PROVIDER env (deepl | openai | mock).
 *   3. First configured provider in [deepl, openai].
 *   4. Mock fallback (returns source verbatim) when nothing is set.
 *
 * Caching uses an LRU-like map keyed by `${provider}:${source}:${target}:hash(text)`.
 * Cap is 1024 entries — plenty for editor flows, never paged.
 */

export type { RouterBatchArgs } from './batch-router';
export { translateBatchViaRouter } from './batch-router';
export { clearTranslationCache, listAvailableProviders } from './router-core';
export type { RouterArgs } from './single-router';
export { translateViaRouter } from './single-router';
export { getUsageSnapshot, recordUsage, resetUsage } from './usage';
