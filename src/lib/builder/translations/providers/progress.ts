import type {
  TranslationProviderBatchEntryResult,
  TranslationProviderBatchProgress,
  TranslationProviderBatchResult,
  TranslationProviderBatchStepName,
  TranslationProviderBatchSummary,
  TranslationProviderBatchStepTelemetry,
  TranslationProviderId,
  TranslationProviderUsage,
} from './types';

type BatchMode = TranslationProviderBatchSummary['mode'];

interface BatchProgressInput {
  readonly provider: TranslationProviderId;
  readonly mode: BatchMode;
  readonly requested: number;
  readonly cached: number;
  readonly sent: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly name: TranslationProviderBatchStepName;
  readonly durationMs?: number;
  readonly chunkCount?: number;
  readonly partialCharacters?: number;
  readonly promptTokens?: number;
  readonly completionTokens?: number;
  readonly totalTokens?: number;
  readonly estimatedCostUsd?: number;
}

interface ProviderResultProgressInput {
  readonly provider: TranslationProviderId;
  readonly mode: 'native-batch';
  readonly requested: number;
  readonly cached: number;
  readonly sent: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly durationMs?: number;
}

function countSuccessful(results: readonly TranslationProviderBatchEntryResult[]): number {
  return results.filter((result) => result.ok).length;
}

export function summarizeBatchResult(
  provider: TranslationProviderId,
  mode: BatchMode,
  results: readonly TranslationProviderBatchEntryResult[],
): TranslationProviderBatchResult {
  const succeeded = countSuccessful(results);
  return {
    results,
    summary: {
      provider,
      mode,
      requested: results.length,
      succeeded,
      failed: results.length - succeeded,
    },
  };
}

export function batchUsageProgressFields(
  usage: TranslationProviderUsage | undefined,
): Partial<Pick<
  TranslationProviderBatchStepTelemetry,
  'promptTokens' | 'completionTokens' | 'totalTokens' | 'estimatedCostUsd'
>> {
  if (!usage) return {};
  return {
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    totalTokens: usage.totalTokens,
    ...(usage.estimatedCostUsd === undefined ? {} : { estimatedCostUsd: usage.estimatedCostUsd }),
  };
}

export function buildBatchProgress({
  provider,
  mode,
  requested,
  cached,
  sent,
  succeeded,
  failed,
  name,
  durationMs,
  chunkCount,
  partialCharacters,
  promptTokens,
  completionTokens,
  totalTokens,
  estimatedCostUsd,
}: BatchProgressInput): TranslationProviderBatchProgress {
  const step = {
    name,
    provider,
    mode,
    requested,
    cached,
    sent,
    succeeded,
    failed,
    ...(durationMs === undefined ? {} : { durationMs }),
    ...(chunkCount === undefined ? {} : { chunkCount }),
    ...(partialCharacters === undefined ? {} : { partialCharacters }),
    ...(promptTokens === undefined ? {} : { promptTokens }),
    ...(completionTokens === undefined ? {} : { completionTokens }),
    ...(totalTokens === undefined ? {} : { totalTokens }),
    ...(estimatedCostUsd === undefined ? {} : { estimatedCostUsd }),
  };
  return {
    provider,
    mode,
    requested,
    succeeded,
    failed,
    step,
  };
}

export function emitBatchProgress(
  onProgress: ((progress: TranslationProviderBatchProgress) => void) | undefined,
  input: BatchProgressInput,
): void {
  onProgress?.(buildBatchProgress(input));
}

export function emitProviderResultProgress(
  onProgress: ((progress: TranslationProviderBatchProgress) => void) | undefined,
  input: ProviderResultProgressInput,
): void {
  emitBatchProgress(onProgress, {
    ...input,
    name: 'provider-result',
  });
}
