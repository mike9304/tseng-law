import { isProductionEnvironment, readCache, rememberResult, selectProvider } from './router-core';
import { recordUsage } from './usage';
import type {
  TranslationProviderArgs,
  TranslationProviderId,
  TranslationProviderResult,
} from './types';

export interface RouterArgs extends TranslationProviderArgs {
  readonly preferProvider?: TranslationProviderId;
}

function mockResult(args: TranslationProviderArgs): TranslationProviderResult {
  if (isProductionEnvironment()) {
    return { ok: false, reason: 'unconfigured', provider: 'mock' };
  }
  return { ok: true, provider: 'mock', text: args.sourceText };
}

export async function translateViaRouter(args: RouterArgs): Promise<TranslationProviderResult> {
  if (args.sourceLocale === args.targetLocale) {
    return { ok: true, provider: 'mock', text: args.sourceText };
  }
  const selected = selectProvider(args.preferProvider);
  if ('mock' in selected) {
    return mockResult(args);
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
