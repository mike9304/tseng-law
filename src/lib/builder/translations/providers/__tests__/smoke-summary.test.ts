import { describe, expect, it } from 'vitest';
import { summarizeTranslationProviderSmokeHistory } from '../smoke-summary';

describe('translation provider smoke summary', () => {
  it('summarizes latest provider status and reviewer totals', () => {
    const summary = summarizeTranslationProviderSmokeHistory(
      [
        {
          checkedAt: '2026-06-20T10:02:00.000Z',
          ok: false,
          provider: 'deepl',
          status: 'unconfigured',
          sourceLocale: 'ko',
          targetLocale: 'en',
          durationMs: 1,
          reason: 'unconfigured',
        },
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
          provider: 'openai',
          status: 'fail',
          sourceLocale: 'ko',
          targetLocale: 'en',
          durationMs: 9,
          reason: 'provider_error',
        },
      ],
      ['openai', 'deepl'],
      new Date('2026-06-20T10:30:00.000Z'),
    );

    expect(summary).toEqual({
      total: 3,
      passed: 1,
      failed: 1,
      unconfigured: 1,
      lastCheckedAt: '2026-06-20T10:02:00.000Z',
      freshness: 'fresh',
      ageMinutes: 28,
      reviewerStatus: 'needs_attention',
      actionItems: ['inspect_failures', 'configure_provider'],
      providers: [
        {
          provider: 'openai',
          status: 'pass',
          checkedAt: '2026-06-20T10:01:00.000Z',
          durationMs: 42,
        },
        {
          provider: 'deepl',
          status: 'unconfigured',
          checkedAt: '2026-06-20T10:02:00.000Z',
          durationMs: 1,
        },
      ],
    });
  });

  it('marks providers without history as missing', () => {
    expect(summarizeTranslationProviderSmokeHistory([], ['openai'])).toEqual({
      total: 0,
      passed: 0,
      failed: 0,
      unconfigured: 0,
      freshness: 'missing',
      reviewerStatus: 'no_history',
      actionItems: ['run_provider_smoke'],
      providers: [
        {
          provider: 'openai',
          status: 'missing',
        },
      ],
    });
  });

  it('marks the smoke summary stale when the latest check misses the daily cron window', () => {
    const summary = summarizeTranslationProviderSmokeHistory(
      [
        {
          checkedAt: '2026-06-19T08:00:00.000Z',
          ok: false,
          provider: 'openai',
          status: 'unconfigured',
          sourceLocale: 'ko',
          targetLocale: 'en',
          durationMs: 1,
          reason: 'unconfigured',
        },
      ],
      ['openai'],
      new Date('2026-06-20T12:30:00.000Z'),
    );

    expect(summary).toMatchObject({
      freshness: 'stale',
      ageMinutes: 1710,
      reviewerStatus: 'stale',
      actionItems: ['check_scheduled_smoke', 'run_provider_smoke'],
    });
  });

  it('marks fresh all-provider passing evidence as healthy', () => {
    const summary = summarizeTranslationProviderSmokeHistory(
      [
        {
          checkedAt: '2026-06-20T10:02:00.000Z',
          ok: true,
          provider: 'openai',
          status: 'pass',
          sourceLocale: 'ko',
          targetLocale: 'en',
          durationMs: 42,
          translatedTextPreview: 'Provider smoke check',
        },
        {
          checkedAt: '2026-06-20T10:01:00.000Z',
          ok: true,
          provider: 'deepl',
          status: 'pass',
          sourceLocale: 'ko',
          targetLocale: 'en',
          durationMs: 24,
          translatedTextPreview: 'Provider smoke check',
        },
      ],
      ['openai', 'deepl'],
      new Date('2026-06-20T10:30:00.000Z'),
    );

    expect(summary).toMatchObject({
      freshness: 'fresh',
      reviewerStatus: 'healthy',
      actionItems: [],
    });
  });
});
