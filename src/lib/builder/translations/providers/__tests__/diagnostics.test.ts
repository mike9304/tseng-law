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

  it('fails closed for an explicitly selected mock provider in production even when a real provider is configured', () => {
    const report = buildTranslationProviderReadinessReport({
      NODE_ENV: 'production',
      TRANSLATION_PROVIDER: ' mock ',
      OPENAI_API_KEY: 'sk-configured',
      DEEPL_API_KEY: undefined,
    });

    expect(report.selectedProvider).toBe('mock');
    expect(report.providers).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'openai', configured: true, selected: false }),
    ]));
    expect(report.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'router_provider', status: 'fail' }),
    ]));
    expect(report.ok).toBe(false);
  });

  it('reports a normalized explicit mock provider as local/demo readiness outside production', () => {
    const report = buildTranslationProviderReadinessReport({
      NODE_ENV: 'development',
      TRANSLATION_PROVIDER: ' MoCk ',
      DEEPL_API_KEY: 'configured:fx',
    });

    expect(report.selectedProvider).toBe('mock');
    expect(report.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'router_provider', status: 'warn' }),
    ]));
    expect(report.ok).toBe(true);
  });
});
