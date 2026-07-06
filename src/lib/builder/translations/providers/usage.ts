import type { TranslationProviderArgs, TranslationProviderId } from './types';

export interface UsageBucket {
  readonly total: number;
  readonly byProvider: Readonly<Partial<Record<TranslationProviderId, number>>>;
  readonly charactersBilled: number;
  readonly cacheHits: number;
  readonly errors: number;
}

type MutableUsageBucket = {
  total: number;
  byProvider: Partial<Record<TranslationProviderId, number>>;
  charactersBilled: number;
  cacheHits: number;
  errors: number;
};

const usage: MutableUsageBucket = {
  total: 0,
  byProvider: {},
  charactersBilled: 0,
  cacheHits: 0,
  errors: 0,
};

export function recordUsage(
  provider: TranslationProviderId,
  args: TranslationProviderArgs,
  kind: 'hit' | 'miss' | 'error',
): void {
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
  return {
    total: usage.total,
    byProvider: { ...usage.byProvider },
    charactersBilled: usage.charactersBilled,
    cacheHits: usage.cacheHits,
    errors: usage.errors,
  };
}

export function resetUsage(): void {
  usage.total = 0;
  usage.byProvider = {};
  usage.charactersBilled = 0;
  usage.cacheHits = 0;
  usage.errors = 0;
}
