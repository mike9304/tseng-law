import { describe, expect, it } from 'vitest';
import {
  aggregateAiIntakeMetrics,
  type AiIntakeOutcomeStage,
  type EventLogRecord,
} from '@/lib/consultation/admin/read-logs';

function outcome(
  stage: AiIntakeOutcomeStage,
  overrides: Partial<EventLogRecord> = {},
): EventLogRecord {
  return {
    timestamp: '2026-09-05T00:00:00.000Z',
    eventType: 'funnel',
    funnelStage: stage,
    sessionId: 'chatgpt',
    locale: 'en',
    ...overrides,
  };
}

describe('aggregateAiIntakeMetrics', () => {
  it('counts fresh sent outcomes while duplicates never increment sent or non-replay outcomes', () => {
    const metrics = aggregateAiIntakeMetrics([
      outcome('ai_intake_submit_sent'),
      outcome('ai_intake_submit_duplicate'),
      outcome('ai_intake_submit_duplicate'),
    ], ['chatgpt']);

    expect(metrics.total).toMatchObject({
      sent: 1,
      duplicate: 2,
      rejected: 0,
      failedUnknown: 0,
      totalOutcomes: 3,
      nonReplayOutcomes: 1,
      sentShareOfOutcomes: 33.3,
      duplicateShareOfOutcomes: 66.7,
      problemShareOfNonReplay: 0,
    });
  });

  it('computes mixed one-decimal shares with the specified denominators', () => {
    const metrics = aggregateAiIntakeMetrics([
      outcome('ai_intake_submit_sent'),
      outcome('ai_intake_submit_sent'),
      outcome('ai_intake_submit_duplicate'),
      outcome('ai_intake_submit_rejected'),
      outcome('ai_intake_submit_failed_unknown'),
    ], ['chatgpt']);

    expect(metrics.total).toEqual({
      sent: 2,
      duplicate: 1,
      rejected: 1,
      failedUnknown: 1,
      totalOutcomes: 5,
      nonReplayOutcomes: 4,
      sentShareOfOutcomes: 40,
      duplicateShareOfOutcomes: 20,
      problemShareOfNonReplay: 50,
    });
  });

  it('returns null for zero denominators and emits no zero-only dimension rows', () => {
    const empty = aggregateAiIntakeMetrics([], ['configured-but-unused']);
    expect(empty.total).toEqual({
      sent: 0,
      duplicate: 0,
      rejected: 0,
      failedUnknown: 0,
      totalOutcomes: 0,
      nonReplayOutcomes: 0,
      sentShareOfOutcomes: null,
      duplicateShareOfOutcomes: null,
      problemShareOfNonReplay: null,
    });
    expect(empty.byProvider).toEqual([]);
    expect(empty.byLocale).toEqual([]);
    expect(empty.byCategory).toEqual([]);
    expect(empty.recentOutcomes).toEqual([]);

    const duplicatesOnly = aggregateAiIntakeMetrics([
      outcome('ai_intake_submit_duplicate'),
      outcome('ai_intake_submit_duplicate'),
    ], ['chatgpt', 'configured-but-unused']);
    expect(duplicatesOnly.total).toMatchObject({
      sent: 0,
      duplicate: 2,
      totalOutcomes: 2,
      nonReplayOutcomes: 0,
      sentShareOfOutcomes: 0,
      duplicateShareOfOutcomes: 100,
      problemShareOfNonReplay: null,
    });
    expect(duplicatesOnly.byProvider.map((row) => row.provider)).toEqual(['chatgpt']);
  });

  it('ignores malformed type, stage, and timestamp while collapsing untrusted dimensions', () => {
    const events = [
      outcome('ai_intake_submit_sent', {
        eventType: 'chat',
        sessionId: 'ignored-provider',
      }),
      {
        ...outcome('ai_intake_submit_sent'),
        funnelStage: 'ai_intake_submit_sent<script>alert(1)</script>',
        sessionId: 'stage-injection-provider',
      } as unknown as EventLogRecord,
      outcome('ai_intake_submit_sent', {
        timestamp: 'not-a-timestamp<script>',
        sessionId: 'timestamp-injection-provider',
      }),
      outcome('ai_intake_submit_rejected', {
        sessionId: 'attacker@example.com',
        locale: 'en<script>alert(1)</script>',
      }),
      outcome('ai_intake_submit_failed_unknown', {
        sessionId: 'not-allowlisted',
        locale: 'xx-private-locale',
      }),
    ];

    const metrics = aggregateAiIntakeMetrics(events, ['chatgpt', 'bad configured id']);
    const serialized = JSON.stringify(metrics);

    expect(metrics.total).toMatchObject({ totalOutcomes: 2, rejected: 1, failedUnknown: 1 });
    expect(metrics.byProvider).toHaveLength(1);
    expect(metrics.byProvider[0]?.provider).toBe('unknown_provider');
    expect(metrics.byLocale).toHaveLength(1);
    expect(metrics.byLocale[0]?.locale).toBe('unknown_locale');
    expect(serialized).not.toContain('attacker@example.com');
    expect(serialized).not.toContain('not-allowlisted');
    expect(serialized).not.toContain('ignored-provider');
    expect(serialized).not.toContain('stage-injection-provider');
    expect(serialized).not.toContain('timestamp-injection-provider');
    expect(serialized).not.toContain('<script>');
    expect(serialized).not.toContain('xx-private-locale');
    expect(serialized).not.toContain('not-a-timestamp');
  });

  it('folds any number of unknown provider IDs into one fixed bucket', () => {
    const metrics = aggregateAiIntakeMetrics(
      Array.from({ length: 50 }, (_, index) => outcome('ai_intake_submit_sent', {
        sessionId: `untrusted-provider-${index}`,
      })),
      ['chatgpt'],
    );

    expect(metrics.byProvider).toHaveLength(1);
    expect(metrics.byProvider[0]).toMatchObject({
      provider: 'unknown_provider',
      sent: 50,
      totalOutcomes: 50,
    });
  });

  it('returns at most 20 newest sanitized outcomes and omits every forbidden field', () => {
    const events = Array.from({ length: 25 }, (_, index) => ({
      ...outcome('ai_intake_submit_sent', {
        timestamp: new Date(Date.UTC(2026, 8, 1, 0, 0, index)).toISOString(),
      }),
      intakeId: `forbidden-intake-${index}`,
      digest: `forbidden-digest-${index}`,
      metadataRedacted: `forbidden-metadata-${index}`,
      status: `forbidden-status-${index}`,
      durationMs: 900 + index,
      answers: `forbidden-answers-${index}`,
      subject: `forbidden-subject-${index}`,
      body: `forbidden-body-${index}`,
      consent: `forbidden-consent-${index}`,
      ipAddress: `forbidden-ip-${index}`,
      userAgent: `forbidden-ua-${index}`,
      url: `forbidden-url-${index}`,
      transcript: `forbidden-transcript-${index}`,
      category: `forbidden-category-${index}`,
      aiIntakeCategory: 'company_setup',
    })) as EventLogRecord[];

    const metrics = aggregateAiIntakeMetrics(events, ['chatgpt']);
    const serialized = JSON.stringify(metrics.recentOutcomes);

    expect(metrics.recentOutcomes).toHaveLength(20);
    expect(metrics.recentOutcomes[0]?.timestamp).toBe('2026-09-01T00:00:24.000Z');
    expect(metrics.recentOutcomes[19]?.timestamp).toBe('2026-09-01T00:00:05.000Z');
    expect(Object.keys(metrics.recentOutcomes[0] ?? {}).sort()).toEqual([
      'locale',
      'provider',
      'stage',
      'timestamp',
    ]);
    for (const forbidden of [
      'forbidden-intake',
      'forbidden-digest',
      'forbidden-metadata',
      'forbidden-status',
      'forbidden-answers',
      'forbidden-subject',
      'forbidden-body',
      'forbidden-consent',
      'forbidden-ip',
      'forbidden-ua',
      'forbidden-url',
      'forbidden-transcript',
      'durationMs',
      'aiIntakeCategory',
      'company_setup',
      'forbidden-category',
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it('sorts provider and locale rows by sent, problems, then fixed lexical label', () => {
    const metrics = aggregateAiIntakeMetrics([
      outcome('ai_intake_submit_sent', { sessionId: 'zeta', locale: 'ja' }),
      outcome('ai_intake_submit_sent', { sessionId: 'zeta', locale: 'ja' }),
      outcome('ai_intake_submit_sent', { sessionId: 'beta', locale: 'ko' }),
      outcome('ai_intake_submit_rejected', { sessionId: 'beta', locale: 'ko' }),
      outcome('ai_intake_submit_failed_unknown', { sessionId: 'beta', locale: 'ko' }),
      outcome('ai_intake_submit_sent', { sessionId: 'alpha', locale: 'en' }),
      outcome('ai_intake_submit_rejected', { sessionId: 'alpha', locale: 'en' }),
      outcome('ai_intake_submit_failed_unknown', { sessionId: 'alpha', locale: 'en' }),
      outcome('ai_intake_submit_sent', { sessionId: 'omega', locale: 'zh-hant' }),
      outcome('ai_intake_submit_rejected', { sessionId: 'omega', locale: 'zh-hant' }),
    ], ['alpha', 'beta', 'omega', 'zeta']);

    expect(metrics.byProvider.map((row) => row.provider)).toEqual([
      'zeta',
      'alpha',
      'beta',
      'omega',
    ]);
    expect(metrics.byLocale.map((row) => row.locale)).toEqual([
      'ja',
      'en',
      'ko',
      'zh-hant',
    ]);
  });

  it('aggregates all four outcome stages by trusted category with the same share denominators', () => {
    const metrics = aggregateAiIntakeMetrics([
      outcome('ai_intake_submit_sent', { aiIntakeCategory: 'labor' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_sent', { aiIntakeCategory: 'labor' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_duplicate', { aiIntakeCategory: 'labor' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_rejected', { aiIntakeCategory: 'labor' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_failed_unknown', { aiIntakeCategory: 'labor' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_sent', { aiIntakeCategory: 'company_setup' } as Partial<EventLogRecord>),
    ], ['chatgpt']);

    expect(metrics.total).toEqual({
      sent: 3,
      duplicate: 1,
      rejected: 1,
      failedUnknown: 1,
      totalOutcomes: 6,
      nonReplayOutcomes: 5,
      sentShareOfOutcomes: 50,
      duplicateShareOfOutcomes: 16.7,
      problemShareOfNonReplay: 40,
    });
    expect(metrics.byCategory).toHaveLength(2);
    expect(metrics.byCategory[0]).toMatchObject({
      category: 'labor',
      sent: 2,
      duplicate: 1,
      rejected: 1,
      failedUnknown: 1,
      totalOutcomes: 5,
      nonReplayOutcomes: 4,
      sentShareOfOutcomes: 40,
      duplicateShareOfOutcomes: 20,
      problemShareOfNonReplay: 50,
    });
    expect(metrics.byCategory[1]).toMatchObject({
      category: 'company_setup',
      sent: 1,
      duplicate: 0,
      rejected: 0,
      failedUnknown: 0,
      totalOutcomes: 1,
      nonReplayOutcomes: 1,
      sentShareOfOutcomes: 100,
      duplicateShareOfOutcomes: 0,
      problemShareOfNonReplay: 0,
    });
    expect(metrics.byProvider.map((row) => row.provider)).toEqual(['chatgpt']);
    expect(metrics.byLocale.map((row) => row.locale)).toEqual(['en']);
  });

  it('collapses missing, legacy, and hostile categories into one unknown_category row', () => {
    const events = [
      outcome('ai_intake_submit_sent'),
      {
        ...outcome('ai_intake_submit_duplicate'),
        classification: 'labor',
      } as EventLogRecord,
      outcome('ai_intake_submit_rejected', {
        aiIntakeCategory: 'company_setup<script>alert(1)</script>',
      } as EventLogRecord),
      outcome('ai_intake_submit_failed_unknown', {
        aiIntakeCategory: 'unknown_category',
      } as EventLogRecord),
      outcome('ai_intake_submit_sent', {
        aiIntakeCategory: 'not-a-real-category',
      } as EventLogRecord),
      outcome('ai_intake_submit_rejected', {
        aiIntakeCategory: '',
      } as EventLogRecord),
    ];

    const metrics = aggregateAiIntakeMetrics(events, ['chatgpt']);
    const serialized = JSON.stringify(metrics);

    expect(metrics.byCategory).toHaveLength(1);
    expect(metrics.byCategory[0]).toMatchObject({
      category: 'unknown_category',
      sent: 2,
      duplicate: 1,
      rejected: 2,
      failedUnknown: 1,
      totalOutcomes: 6,
    });
    expect(serialized).not.toContain('<script>');
    expect(serialized).not.toContain('not-a-real-category');
    expect(serialized).not.toContain('alert(1)');
    expect(serialized).not.toContain('"labor"');
  });

  it('sorts at most ten category labels without changing configured provider or locale rows', () => {
    const publicCategories = [
      'company_setup',
      'cosmetics',
      'criminal_investigation',
      'divorce_family',
      'general',
      'inheritance',
      'labor',
      'logistics',
      'traffic_accident',
    ] as const;
    const events: EventLogRecord[] = [
      outcome('ai_intake_submit_sent', { aiIntakeCategory: 'labor' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_sent', { aiIntakeCategory: 'labor' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_sent', { aiIntakeCategory: 'company_setup' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_rejected', { aiIntakeCategory: 'company_setup' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_sent', { aiIntakeCategory: 'general' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_rejected', { aiIntakeCategory: 'general' } as Partial<EventLogRecord>),
      outcome('ai_intake_submit_sent'),
      outcome('ai_intake_submit_rejected', { aiIntakeCategory: 'cosmetics' } as Partial<EventLogRecord>),
      ...publicCategories
        .filter((category) => !['labor', 'company_setup', 'general', 'cosmetics'].includes(category))
        .map((category) => outcome('ai_intake_submit_duplicate', { aiIntakeCategory: category } as Partial<EventLogRecord>)),
      outcome('ai_intake_submit_rejected', {
        aiIntakeCategory: 'hostile-one<script>',
      } as EventLogRecord),
      outcome('ai_intake_submit_failed_unknown', {
        aiIntakeCategory: 'hostile-two',
      } as EventLogRecord),
    ];

    const metrics = aggregateAiIntakeMetrics(events, ['chatgpt']);
    const serialized = JSON.stringify(metrics);

    expect(metrics.byCategory.map((row) => row.category)).toEqual([
      'labor',
      'unknown_category',
      'company_setup',
      'general',
      'cosmetics',
      'criminal_investigation',
      'divorce_family',
      'inheritance',
      'logistics',
      'traffic_accident',
    ]);
    expect(new Set(metrics.byCategory.map((row) => row.category)).size).toBeLessThanOrEqual(10);
    expect(metrics.byCategory).toHaveLength(10);
    expect(metrics.byProvider.map((row) => row.provider)).toEqual(['chatgpt']);
    expect(metrics.byLocale.map((row) => row.locale)).toEqual(['en']);
    expect(serialized).not.toContain('<script>');
    expect(serialized).not.toContain('hostile-one');
    expect(serialized).not.toContain('hostile-two');
  });
});
