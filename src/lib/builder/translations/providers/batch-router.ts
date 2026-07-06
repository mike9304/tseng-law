import {
  batchUsageProgressFields,
  emitBatchProgress,
  emitProviderResultProgress,
  summarizeBatchResult,
} from './progress';
import { readCache, rememberResult, selectProvider } from './router-core';
import { translateViaRouter, type RouterArgs } from './single-router';
import { recordUsage } from './usage';
import type {
  TranslationProviderBatchArgs,
  TranslationProviderBatchEntryResult,
  TranslationProviderBatchItem,
  TranslationProviderBatchPartial,
  TranslationProviderBatchProgress,
  TranslationProviderBatchResult,
  TranslationProviderId,
} from './types';

export interface RouterBatchArgs extends TranslationProviderBatchArgs {
  readonly preferProvider?: TranslationProviderId;
  readonly onProgress?: (progress: TranslationProviderBatchProgress) => void;
}

function argsForBatchItem(args: RouterBatchArgs, item: TranslationProviderBatchItem): RouterArgs {
  return {
    sourceLocale: args.sourceLocale,
    targetLocale: args.targetLocale,
    sourceText: item.sourceText,
    preferProvider: args.preferProvider,
  };
}

function mockBatchResult(args: RouterBatchArgs): TranslationProviderBatchResult {
  const results: TranslationProviderBatchEntryResult[] = [];
  for (const item of args.items) {
    results.push({
      key: item.key,
      ok: true,
      provider: 'mock',
      text: item.sourceText,
    });
    emitProviderResultProgress(args.onProgress, {
      provider: 'mock',
      mode: 'native-batch',
      requested: args.items.length,
      cached: 0,
      sent: args.items.length,
      succeeded: results.length,
      failed: 0,
    });
  }
  emitBatchProgress(args.onProgress, {
    provider: 'mock',
    mode: 'native-batch',
    requested: args.items.length,
    cached: 0,
    sent: 0,
    succeeded: args.items.length,
    failed: 0,
    name: 'mock-complete',
  });
  return {
    results,
    summary: {
      provider: 'mock',
      mode: 'native-batch',
      requested: args.items.length,
      succeeded: results.length,
      failed: 0,
    },
  };
}

async function translateBatchWithSingles(
  args: RouterBatchArgs,
  provider: TranslationProviderId,
): Promise<TranslationProviderBatchResult> {
  emitBatchProgress(args.onProgress, {
    provider,
    mode: 'single-fallback',
    requested: args.items.length,
    cached: 0,
    sent: args.items.length,
    succeeded: 0,
    failed: 0,
    name: 'single-fallback',
  });
  const results = await Promise.all(
    args.items.map(async (item): Promise<TranslationProviderBatchEntryResult> => {
      const result = await translateViaRouter(argsForBatchItem(args, item));
      if (result.ok) {
        return { key: item.key, ok: true, provider: result.provider, text: result.text };
      }
      return {
        key: item.key,
        ok: false,
        provider: result.provider,
        reason: result.reason,
        error: result.error,
      };
    }),
  );
  return summarizeBatchResult(results[0]?.provider ?? 'mock', 'single-fallback', results);
}

export async function translateBatchViaRouter(args: RouterBatchArgs): Promise<TranslationProviderBatchResult> {
  if (args.sourceLocale === args.targetLocale) return mockBatchResult(args);
  const selected = selectProvider(args.preferProvider);
  if ('mock' in selected) return mockBatchResult(args);
  if (!selected.translateBatch) return translateBatchWithSingles(args, selected.id);

  emitBatchProgress(args.onProgress, {
    provider: selected.id,
    mode: 'native-batch',
    requested: args.items.length,
    cached: 0,
    sent: 0,
    succeeded: 0,
    failed: 0,
    name: 'provider-selected',
  });

  const cachedResults: TranslationProviderBatchEntryResult[] = [];
  const missingItems: TranslationProviderBatchItem[] = [];
  for (const item of args.items) {
    const itemArgs = argsForBatchItem(args, item);
    const cached = readCache(selected.id, itemArgs);
    if (cached?.ok) {
      cachedResults.push({ key: item.key, ok: true, provider: selected.id, text: cached.text });
      recordUsage(selected.id, itemArgs, 'hit');
    } else {
      missingItems.push(item);
    }
  }

  emitBatchProgress(args.onProgress, {
    provider: selected.id,
    mode: 'native-batch',
    requested: args.items.length,
    cached: cachedResults.length,
    sent: missingItems.length,
    succeeded: cachedResults.length,
    failed: 0,
    name: 'cache-checked',
  });

  if (missingItems.length === 0) return summarizeBatchResult(selected.id, 'native-batch', cachedResults);

  emitBatchProgress(args.onProgress, {
    provider: selected.id,
    mode: 'native-batch',
    requested: args.items.length,
    cached: cachedResults.length,
    sent: missingItems.length,
    succeeded: cachedResults.length,
    failed: 0,
    name: 'provider-request',
  });
  const requestStartedAt = Date.now();
  let latestPartial: TranslationProviderBatchPartial | undefined;
  const batch = await selected.translateBatch({
    sourceLocale: args.sourceLocale,
    targetLocale: args.targetLocale,
    items: missingItems,
    onPartial: args.onProgress
      ? (partial) => {
          latestPartial = partial;
          emitBatchProgress(args.onProgress, {
            provider: selected.id,
            mode: 'native-batch',
            requested: args.items.length,
            cached: cachedResults.length,
            sent: missingItems.length,
            succeeded: cachedResults.length,
            failed: 0,
            name: 'provider-partial',
            durationMs: partial.durationMs,
            chunkCount: partial.chunkCount,
            partialCharacters: partial.partialCharacters,
          });
        }
      : undefined,
  });
  const requestDurationMs = Math.max(0, Date.now() - requestStartedAt);

  let providerResultSucceeded = cachedResults.length;
  let providerResultFailed = 0;
  for (const result of batch.results) {
    const item = missingItems.find((candidate) => candidate.key === result.key);
    if (!item) continue;
    const itemArgs = argsForBatchItem(args, item);
    if (result.ok) {
      providerResultSucceeded += 1;
      rememberResult(selected.id, itemArgs, {
        ok: true,
        provider: selected.id,
        text: result.text,
      });
      recordUsage(selected.id, itemArgs, 'miss');
    } else {
      providerResultFailed += 1;
      recordUsage(selected.id, itemArgs, 'error');
    }
    emitProviderResultProgress(args.onProgress, {
      provider: selected.id,
      mode: 'native-batch',
      requested: args.items.length,
      cached: cachedResults.length,
      sent: missingItems.length,
      succeeded: providerResultSucceeded,
      failed: providerResultFailed,
      durationMs: requestDurationMs,
    });
  }

  const combinedResult = summarizeBatchResult(selected.id, 'native-batch', [...cachedResults, ...batch.results]);
  emitBatchProgress(args.onProgress, {
    provider: selected.id,
    mode: 'native-batch',
    requested: args.items.length,
    cached: cachedResults.length,
    sent: missingItems.length,
    succeeded: combinedResult.summary.succeeded,
    failed: combinedResult.summary.failed,
    name: 'provider-response',
    durationMs: requestDurationMs,
    ...(latestPartial === undefined
      ? {}
      : {
          chunkCount: latestPartial.chunkCount,
          partialCharacters: latestPartial.partialCharacters,
        }),
    ...batchUsageProgressFields(batch.usage),
  });
  return combinedResult;
}
