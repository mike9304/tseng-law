import type { Locale } from '@/lib/locales';

export type TranslationProviderId = 'openai' | 'deepl' | 'mock';

export interface TranslationProviderArgs {
  sourceLocale: Locale;
  targetLocale: Locale;
  sourceText: string;
}

export type TranslationProviderResult =
  | { ok: true; text: string; provider: TranslationProviderId }
  | { ok: false; reason: 'unconfigured' | 'send' | 'parse' | 'network'; provider: TranslationProviderId; error?: string };

export interface TranslationProviderBatchItem {
  readonly key: string;
  readonly sourceText: string;
}

export interface TranslationProviderBatchArgs {
  readonly sourceLocale: Locale;
  readonly targetLocale: Locale;
  readonly items: readonly TranslationProviderBatchItem[];
  readonly onPartial?: (partial: TranslationProviderBatchPartial) => void;
}

export type TranslationProviderBatchEntryResult =
  | { readonly key: string; readonly ok: true; readonly text: string; readonly provider: TranslationProviderId }
  | {
      readonly key: string;
      readonly ok: false;
      readonly reason: 'unconfigured' | 'send' | 'parse' | 'network';
      readonly provider: TranslationProviderId;
      readonly error?: string;
    };

export interface TranslationProviderBatchSummary {
  readonly provider: TranslationProviderId;
  readonly mode: 'native-batch' | 'single-fallback';
  readonly requested: number;
  readonly succeeded: number;
  readonly failed: number;
}

export interface TranslationProviderUsage {
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly totalTokens: number;
  readonly estimatedCostUsd?: number;
}

export type TranslationProviderBatchStepName =
  | 'provider-selected'
  | 'cache-checked'
  | 'provider-request'
  | 'provider-partial'
  | 'provider-result'
  | 'provider-response'
  | 'single-fallback'
  | 'mock-complete';

export interface TranslationProviderBatchStepTelemetry {
  readonly name: TranslationProviderBatchStepName;
  readonly provider: TranslationProviderId;
  readonly mode: TranslationProviderBatchSummary['mode'];
  readonly requested: number;
  readonly cached: number;
  readonly sent: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly durationMs?: number;
  readonly chunkCount?: number;
  readonly partialCharacters?: number;
  readonly promptTokens?: number;
  readonly completionTokens?: number;
  readonly totalTokens?: number;
  readonly estimatedCostUsd?: number;
}

export interface TranslationProviderBatchProgress extends TranslationProviderBatchSummary {
  readonly step?: TranslationProviderBatchStepTelemetry;
}

export interface TranslationProviderBatchPartial {
  readonly chunkCount: number;
  readonly partialCharacters: number;
  readonly durationMs: number;
}

export interface TranslationProviderBatchResult {
  readonly results: readonly TranslationProviderBatchEntryResult[];
  readonly summary: TranslationProviderBatchSummary;
  readonly usage?: TranslationProviderUsage;
}

export interface TranslationProvider {
  id: TranslationProviderId;
  isConfigured(): boolean;
  translate(args: TranslationProviderArgs): Promise<TranslationProviderResult>;
  translateBatch?(args: TranslationProviderBatchArgs): Promise<TranslationProviderBatchResult>;
}
