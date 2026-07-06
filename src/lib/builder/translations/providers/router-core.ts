import crypto from 'node:crypto';
import { deeplProvider } from './deepl';
import { openaiProvider } from './openai';
import type {
  TranslationProvider,
  TranslationProviderArgs,
  TranslationProviderId,
  TranslationProviderResult,
} from './types';

const PROVIDERS: readonly TranslationProvider[] = [deeplProvider, openaiProvider];

const cache = new Map<string, TranslationProviderResult>();
const CACHE_CAP = 1024;

function cacheKey(provider: TranslationProviderId, args: TranslationProviderArgs): string {
  const digest = crypto.createHash('sha1').update(args.sourceText).digest('hex').slice(0, 16);
  return `${provider}:${args.sourceLocale}:${args.targetLocale}:${digest}`;
}

export function rememberResult(
  provider: TranslationProviderId,
  args: TranslationProviderArgs,
  result: TranslationProviderResult,
): void {
  if (!result.ok) return;
  const key = cacheKey(provider, args);
  if (cache.size >= CACHE_CAP) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, result);
}

export function readCache(
  provider: TranslationProviderId,
  args: TranslationProviderArgs,
): TranslationProviderResult | null {
  const key = cacheKey(provider, args);
  return cache.get(key) ?? null;
}

function envProviderId(): TranslationProviderId | null {
  const id = (process.env.TRANSLATION_PROVIDER ?? '').toLowerCase();
  if (id === 'deepl' || id === 'openai' || id === 'mock') return id;
  return null;
}

export function selectProvider(preferProvider?: TranslationProviderId): TranslationProvider | { readonly mock: true } {
  if (preferProvider === 'mock') return { mock: true };
  if (preferProvider) {
    const explicit = PROVIDERS.find((provider) => provider.id === preferProvider);
    if (explicit) return explicit;
  }
  const envId = envProviderId();
  if (envId === 'mock') return { mock: true };
  if (envId) {
    const fromEnv = PROVIDERS.find((provider) => provider.id === envId);
    if (fromEnv) return fromEnv;
  }
  for (const provider of PROVIDERS) {
    if (provider.isConfigured()) return provider;
  }
  return { mock: true };
}

export function clearTranslationCache(): void {
  cache.clear();
}

export function listAvailableProviders(): readonly { readonly id: TranslationProviderId; readonly configured: boolean }[] {
  return PROVIDERS.map((provider) => ({ id: provider.id, configured: provider.isConfigured() }));
}
