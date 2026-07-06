import type { Locale } from '@/lib/locales';
import {
  recordTranslationProviderSmokeResult,
  runTranslationProviderSmoke,
  translationProviderDiagnosticIds,
  type TranslationProviderDiagnosticId,
  type TranslationProviderSmokeHistoryEntry,
  type TranslationProviderSmokeResult,
} from './diagnostics';
import { appendTranslationProviderSmokeHistory } from './smoke-history';

export interface ScheduledTranslationProviderSmokeInput {
  readonly sourceLocale: Locale;
  readonly targetLocale: Locale;
  readonly sourceText: string;
}

export interface ScheduledTranslationProviderSmokeSummary {
  readonly checked: number;
  readonly passed: number;
  readonly failed: number;
  readonly unconfigured: number;
  readonly results: readonly TranslationProviderSmokeHistoryEntry[];
}

function failedSmokeResult(
  provider: TranslationProviderDiagnosticId,
  input: ScheduledTranslationProviderSmokeInput,
  durationMs: number,
): TranslationProviderSmokeResult {
  return {
    ok: false,
    provider,
    status: 'fail',
    sourceLocale: input.sourceLocale,
    targetLocale: input.targetLocale,
    durationMs,
    reason: 'exception',
    error: 'Unexpected provider smoke failure.',
  };
}

async function runProviderSmoke(
  provider: TranslationProviderDiagnosticId,
  input: ScheduledTranslationProviderSmokeInput,
): Promise<TranslationProviderSmokeHistoryEntry> {
  const startedAt = Date.now();
  let smoke: TranslationProviderSmokeResult;
  try {
    smoke = await runTranslationProviderSmoke({
      provider,
      sourceLocale: input.sourceLocale,
      targetLocale: input.targetLocale,
      sourceText: input.sourceText,
    });
  } catch (error) {
    if (error instanceof Error) {
      smoke = failedSmokeResult(provider, input, Date.now() - startedAt);
    } else {
      throw error;
    }
  }
  const entry = recordTranslationProviderSmokeResult(smoke);
  await appendTranslationProviderSmokeHistory(entry);
  return entry;
}

export async function runScheduledTranslationProviderSmoke(
  input: ScheduledTranslationProviderSmokeInput,
): Promise<ScheduledTranslationProviderSmokeSummary> {
  const results: TranslationProviderSmokeHistoryEntry[] = [];
  let passed = 0;
  let failed = 0;
  let unconfigured = 0;

  for (const provider of translationProviderDiagnosticIds) {
    const entry = await runProviderSmoke(provider, input);
    results.push(entry);
    switch (entry.status) {
      case 'pass':
        passed += 1;
        break;
      case 'fail':
        failed += 1;
        break;
      case 'unconfigured':
        unconfigured += 1;
        break;
    }
  }

  return {
    checked: results.length,
    passed,
    failed,
    unconfigured,
    results,
  };
}
