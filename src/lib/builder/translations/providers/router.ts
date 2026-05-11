import crypto from 'node:crypto';
import { deeplProvider } from './deepl';
import { openaiProvider } from './openai';
import type {
  TranslationProvider,
  TranslationProviderArgs,
  TranslationProviderId,
  TranslationProviderResult,
} from './types';

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

const PROVIDERS: TranslationProvider[] = [deeplProvider, openaiProvider];

const cache = new Map<string, TranslationProviderResult>();
const CACHE_CAP = 1024;

function cacheKey(provider: TranslationProviderId, args: TranslationProviderArgs): string {
  const digest = crypto.createHash('sha1').update(args.sourceText).digest('hex').slice(0, 16);
  return `${provider}:${args.sourceLocale}:${args.targetLocale}:${digest}`;
}

function rememberResult(provider: TranslationProviderId, args: TranslationProviderArgs, result: TranslationProviderResult): void {
  if (!result.ok) return;
  const key = cacheKey(provider, args);
  if (cache.size >= CACHE_CAP) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, result);
}

function readCache(provider: TranslationProviderId, args: TranslationProviderArgs): TranslationProviderResult | null {
  const key = cacheKey(provider, args);
  return cache.get(key) ?? null;
}

function envProviderId(): TranslationProviderId | null {
  const id = (process.env.TRANSLATION_PROVIDER ?? '').toLowerCase();
  if (id === 'deepl' || id === 'openai' || id === 'mock') return id;
  return null;
}

function selectProvider(preferProvider?: TranslationProviderId): TranslationProvider | { mock: true } {
  if (preferProvider === 'mock') return { mock: true };
  if (preferProvider) {
    const explicit = PROVIDERS.find((p) => p.id === preferProvider);
    if (explicit) return explicit;
  }
  const envId = envProviderId();
  if (envId === 'mock') return { mock: true };
  if (envId) {
    const fromEnv = PROVIDERS.find((p) => p.id === envId);
    if (fromEnv) return fromEnv;
  }
  for (const provider of PROVIDERS) {
    if (provider.isConfigured()) return provider;
  }
  return { mock: true };
}

export interface RouterArgs extends TranslationProviderArgs {
  preferProvider?: TranslationProviderId;
}

export async function translateViaRouter(args: RouterArgs): Promise<TranslationProviderResult> {
  if (args.sourceLocale === args.targetLocale) {
    return { ok: true, provider: 'mock', text: args.sourceText };
  }
  const selected = selectProvider(args.preferProvider);
  if ('mock' in selected) {
    return { ok: true, provider: 'mock', text: args.sourceText };
  }
  const cached = readCache(selected.id, args);
  if (cached) {
    recordUsage(selected.id, args, 'hit');
    return cached;
  }
  const result = await selected.translate(args);
  rememberResult(selected.id, args, result);
  recordUsage(selected.id, args, result.ok ? 'miss' : 'error');
  return result;
}

export function clearTranslationCache(): void {
  cache.clear();
}

export function listAvailableProviders(): Array<{ id: TranslationProviderId; configured: boolean }> {
  return PROVIDERS.map((p) => ({ id: p.id, configured: p.isConfigured() }));
}

interface UsageBucket {
  total: number;
  byProvider: Partial<Record<TranslationProviderId, number>>;
  charactersBilled: number;
  cacheHits: number;
  errors: number;
}

const usage: UsageBucket = { total: 0, byProvider: {}, charactersBilled: 0, cacheHits: 0, errors: 0 };

export function recordUsage(provider: TranslationProviderId, args: TranslationProviderArgs, kind: 'hit' | 'miss' | 'error'): void {
  if (kind === 'hit') {
    usage.cacheHits += 1;
    return;
  }
  if (kind === 'error') {
    usage.errors += 1;
    return;
  }
  usage.total += 1;
  usage.byProvider[provider] = (usage.byProvider[provider] ?? 0) + 1;
  usage.charactersBilled += args.sourceText.length;
}

export function getUsageSnapshot(): UsageBucket {
  return JSON.parse(JSON.stringify(usage)) as UsageBucket;
}

export function resetUsage(): void {
  usage.total = 0;
  usage.byProvider = {};
  usage.charactersBilled = 0;
  usage.cacheHits = 0;
  usage.errors = 0;
}
