import { afterEach, describe, expect, it } from 'vitest';
import {
  buildTranslationProviderReadinessReport,
  clearTranslationProviderSmokeHistory,
  recordTranslationProviderSmokeResult,
} from '@/lib/builder/translations/providers/diagnostics';

describe('translation provider diagnostics history', () => {
  afterEach(() => {
    clearTranslationProviderSmokeHistory();
  });

  it('includes recent smoke runs in newest-first readiness reports', () => {
    clearTranslationProviderSmokeHistory();

    recordTranslationProviderSmokeResult({
      ok: false,
      provider: 'deepl',
      status: 'unconfigured',
      sourceLocale: 'ko',
      targetLocale: 'en',
      durationMs: 0,
      reason: 'unconfigured',
    }, new Date('2026-06-20T10:00:00.000Z'));
    recordTranslationProviderSmokeResult({
      ok: true,
      provider: 'openai',
      status: 'pass',
      sourceLocale: 'ko',
      targetLocale: 'en',
      durationMs: 42,
      translatedTextPreview: 'Provider smoke check',
    }, new Date('2026-06-20T10:01:00.000Z'));

    const report = buildTranslationProviderReadinessReport({
      NODE_ENV: 'production',
      TRANSLATION_PROVIDER: 'openai',
      OPENAI_API_KEY: 'sk-secret',
      DEEPL_API_KEY: undefined,
    });

    expect(report.smokeHistory).toEqual([
      {
        checkedAt: '2026-06-20T10:01:00.000Z',
        ok: true,
        provider: 'openai',
        status: 'pass',
        sourceLocale: 'ko',
        targetLocale: 'en',
        durationMs: 42,
        translatedTextPreview: 'Provider smoke check',
      },
      {
        checkedAt: '2026-06-20T10:00:00.000Z',
        ok: false,
        provider: 'deepl',
        status: 'unconfigured',
        sourceLocale: 'ko',
        targetLocale: 'en',
        durationMs: 0,
        reason: 'unconfigured',
      },
    ]);
  });
});
