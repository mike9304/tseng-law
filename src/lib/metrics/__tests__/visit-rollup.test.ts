import { describe, expect, it } from 'vitest';

import { buildDailySummary } from '../visit-rollup';
import type { EnrichedVisitEvent } from '../visit-schema';

const events: EnrichedVisitEvent[] = [
  {
    v: 1,
    sid: 'search_session',
    ts: '2026-09-01T01:00:00.500Z',
    type: 'pageview',
    path: '/en/about',
    locale: 'en',
    firstLoad: false,
    receivedAt: '2026-09-01T01:02:01.000Z',
    channel: 'internal',
    source: null,
    keyword: null,
    country: 'KR',
  },
  {
    v: 1,
    sid: 'search_session',
    ts: '2026-09-01T01:00:00Z',
    type: 'pageview',
    path: '/ko/services',
    locale: 'ko',
    firstLoad: true,
    receivedAt: '2026-09-01T01:00:01.000Z',
    channel: 'search',
    source: 'naver',
    keyword: '국제 이혼 변호사',
    country: 'KR',
  },
  {
    v: 1,
    sid: 'search_session',
    ts: '2026-09-01T01:01:00.000Z',
    type: 'engagement',
    path: '/ko/services',
    dwellMs: 12_000,
    receivedAt: '2026-09-01T01:01:01.000Z',
    country: 'KR',
  },
  {
    v: 1,
    sid: 'search_session',
    ts: '2026-09-01T01:03:00.000Z',
    type: 'engagement',
    path: '/en/about',
    dwellMs: 18_000,
    receivedAt: '2026-09-01T01:03:01.000Z',
    country: 'KR',
  },
  {
    v: 1,
    sid: 'ai_session',
    ts: '2026-09-01T02:00:00.000Z',
    type: 'pageview',
    path: '/en/ai-landing',
    locale: 'en',
    firstLoad: true,
    receivedAt: '2026-09-01T02:00:01.000Z',
    channel: 'ai',
    source: 'chatgpt',
    keyword: null,
    country: 'US',
  },
  {
    v: 1,
    sid: 'ai_session',
    ts: '2026-09-01T02:01:00.000Z',
    type: 'engagement',
    path: '/en/ai-landing',
    dwellMs: 6_000,
    receivedAt: '2026-09-01T02:01:01.000Z',
    country: 'US',
  },
  {
    v: 1,
    sid: 'direct_session',
    ts: '2026-09-01T03:00:00.000Z',
    type: 'pageview',
    path: '/ja/contact',
    locale: 'ja',
    firstLoad: true,
    receivedAt: '2026-09-01T03:00:01.000Z',
    channel: 'direct',
    source: null,
    keyword: null,
    country: 'JP',
  },
];

describe('buildDailySummary', () => {
  it('rolls up sessions, entries, locales, dwell, and rankings', () => {
    const summary = buildDailySummary('2026-09-01', events);

    expect(summary.day).toBe('2026-09-01');
    expect(summary.totals).toEqual({
      pageviews: 4,
      sessions: 3,
      avgDwellMs: 12_000,
      bounceSessions: 2,
    });
    expect(summary.byChannel).toEqual({ search: 1, ai: 1, direct: 1 });
    expect(summary.bySource).toEqual({ naver: 1, chatgpt: 1 });
    expect(summary.aiBySource).toEqual({ chatgpt: 1 });
    expect(summary.aiLandingPages).toEqual({ '/en/ai-landing': 1 });
    expect(summary.byLocale).toEqual({ en: 2, ko: 1, ja: 1 });
    expect(summary.byCountry).toEqual({ KR: 1, US: 1, JP: 1 });
    expect(summary.localeSwitchSessions).toBe(1);
    expect(summary.topPages).toEqual([
      { path: '/en/about', views: 1, avgDwellMs: 18_000 },
      { path: '/en/ai-landing', views: 1, avgDwellMs: 6_000 },
      { path: '/ja/contact', views: 1, avgDwellMs: 0 },
      { path: '/ko/services', views: 1, avgDwellMs: 12_000 },
    ]);
    expect(summary.topEntryPages).toEqual([
      { path: '/en/ai-landing', count: 1 },
      { path: '/ja/contact', count: 1 },
      { path: '/ko/services', count: 1 },
    ]);
    expect(summary.keywords).toEqual([
      { keyword: '국제 이혼 변호사', source: 'naver', count: 1 },
    ]);
    expect(summary.contactIntent).toEqual({
      trackingVersion: 1,
      trackedSessions: 0,
      intentSessions: 0,
      events: 0,
      unattributedEvents: 0,
      byAction: {},
    });
    expect(summary.acquisitionCohorts).toEqual([
      {
        country: 'JP',
        locale: 'ja',
        entryPath: '/ja/contact',
        channel: 'direct',
        source: null,
        sessions: 1,
        trackedSessions: 0,
        intentSessions: 0,
      },
      {
        country: 'KR',
        locale: 'ko',
        entryPath: '/ko/services',
        channel: 'search',
        source: 'naver',
        sessions: 1,
        trackedSessions: 0,
        intentSessions: 0,
      },
      {
        country: 'US',
        locale: 'en',
        entryPath: '/en/ai-landing',
        channel: 'ai',
        source: 'chatgpt',
        sessions: 1,
        trackedSessions: 0,
        intentSessions: 0,
      },
    ]);
  });

  it('returns the complete empty summary shape', () => {
    expect(buildDailySummary('2026-09-02', [])).toEqual({
      day: '2026-09-02',
      totals: { pageviews: 0, sessions: 0, avgDwellMs: 0, bounceSessions: 0 },
      byChannel: {},
      bySource: {},
      aiBySource: {},
      aiLandingPages: {},
      byLocale: {},
      byCountry: {},
      topPages: [],
      topEntryPages: [],
      keywords: [],
      localeSwitchSessions: 0,
      contactIntent: {
        trackingVersion: 1,
        trackedSessions: 0,
        intentSessions: 0,
        events: 0,
        unattributedEvents: 0,
        byAction: {},
      },
      acquisitionCohorts: [],
    });
  });
});

function pageview(
  overrides: Partial<Extract<EnrichedVisitEvent, { type: 'pageview' }>> & { sid: string; ts: string },
): EnrichedVisitEvent {
  return {
    v: 1,
    type: 'pageview',
    path: '/en',
    locale: 'en',
    firstLoad: true,
    receivedAt: '2026-09-03T00:00:01.000Z',
    channel: 'direct',
    source: null,
    keyword: null,
    ...overrides,
  };
}

function engagement(
  overrides: Partial<Extract<EnrichedVisitEvent, { type: 'engagement' }>> & { sid: string; ts: string },
): EnrichedVisitEvent {
  return {
    v: 1,
    type: 'engagement',
    path: '/en',
    dwellMs: 5_000,
    receivedAt: '2026-09-03T00:00:01.000Z',
    ...overrides,
  };
}

function contactIntent(
  overrides: Partial<Extract<EnrichedVisitEvent, { type: 'contact_intent' }>> & { sid: string; ts: string },
): EnrichedVisitEvent {
  return {
    v: 1,
    type: 'contact_intent',
    action: 'email_compose',
    path: '/en/contact',
    locale: 'en',
    receivedAt: '2026-09-03T00:00:01.000Z',
    ...overrides,
  };
}

describe('buildDailySummary contact intent and cohorts', () => {
  it('does not let contact events inflate legacy sessions, pageviews, dwell, or bounce', () => {
    const summary = buildDailySummary('2026-09-01', [
      ...events,
      contactIntent({ sid: 'search_session', ts: '2026-09-01T01:04:00.000Z', path: '/ko/contact', locale: 'ko' }),
      contactIntent({ sid: 'search_session', ts: '2026-09-01T01:04:01.000Z', path: '/ko/contact', locale: 'ko' }),
      contactIntent({ sid: 'search_session', ts: '2026-09-01T01:04:02.000Z', path: '/ko/contact', locale: 'ko' }),
      contactIntent({ sid: 'orphan_intent', ts: '2026-09-01T04:00:00.000Z', path: '/ja/contact', locale: 'ja' }),
    ]);

    expect(summary.totals).toEqual({
      pageviews: 4,
      sessions: 3,
      avgDwellMs: 12_000,
      bounceSessions: 2,
    });
    expect(summary.contactIntent).toEqual({
      trackingVersion: 1,
      trackedSessions: 0,
      intentSessions: 0,
      events: 4,
      unattributedEvents: 4,
      byAction: { email_compose: 4 },
    });
  });

  it('attributes one first-entry cohort and ignores later country/locale changes', () => {
    const summary = buildDailySummary('2026-09-03', [
      pageview({
        sid: 'switcher',
        ts: '2026-09-03T01:00:00.000Z',
        path: '/en/about?utm=later',
        locale: 'en',
        country: 'US',
        channel: 'search',
        source: 'google',
        contactTracking: 1,
      }),
      pageview({
        sid: 'switcher',
        ts: '2026-09-03T01:05:00.000Z',
        path: '/ja/contact',
        locale: 'ja',
        country: 'JP',
        channel: 'referral',
        source: 'example',
        firstLoad: false,
        contactTracking: 1,
      }),
      pageview({
        sid: 'stable',
        ts: '2026-09-03T02:00:00.000Z',
        path: '/ko/services#hero',
        locale: 'ko',
        country: 'KR',
        channel: 'direct',
        source: null,
        contactTracking: 1,
      }),
    ]);

    expect(summary.localeSwitchSessions).toBe(1);
    expect(summary.byCountry).toEqual({ US: 1, KR: 1 });
    expect(summary.byLocale).toEqual({ en: 1, ja: 1, ko: 1 });
    expect(summary.acquisitionCohorts).toEqual([
      {
        country: 'KR',
        locale: 'ko',
        entryPath: '/ko/services',
        channel: 'direct',
        source: null,
        sessions: 1,
        trackedSessions: 1,
        intentSessions: 0,
      },
      {
        country: 'US',
        locale: 'en',
        entryPath: '/en/about',
        channel: 'search',
        source: 'google',
        sessions: 1,
        trackedSessions: 1,
        intentSessions: 0,
      },
    ]);
  });

  it('counts repeated email clicks as events but one intent session', () => {
    const summary = buildDailySummary('2026-09-03', [
      pageview({
        sid: 'repeat',
        ts: '2026-09-03T01:00:00.000Z',
        path: '/ja/contact',
        locale: 'ja',
        country: 'JP',
        contactTracking: 1,
      }),
      contactIntent({ sid: 'repeat', ts: '2026-09-03T01:01:00.000Z', path: '/ja/contact', locale: 'ja' }),
      contactIntent({ sid: 'repeat', ts: '2026-09-03T01:01:01.000Z', path: '/ja/contact', locale: 'ja' }),
      contactIntent({ sid: 'repeat', ts: '2026-09-03T01:01:02.000Z', path: '/ja/contact', locale: 'ja' }),
    ]);

    expect(summary.contactIntent).toMatchObject({
      trackedSessions: 1,
      intentSessions: 1,
      events: 3,
      unattributedEvents: 0,
      byAction: { email_compose: 3 },
    });
    expect(summary.acquisitionCohorts).toBeDefined();
    const repeatCohorts = summary.acquisitionCohorts;
    if (repeatCohorts == null) {
      throw new Error('expected acquisitionCohorts to be defined');
    }
    expect(repeatCohorts[0]?.intentSessions).toBe(1);
  });

  it('treats an orphan contact event as unattributed, not a fictitious eligible session', () => {
    const summary = buildDailySummary('2026-09-03', [
      contactIntent({ sid: 'orphan_intent', ts: '2026-09-03T01:00:00.000Z' }),
    ]);

    expect(summary.totals).toEqual({
      pageviews: 0,
      sessions: 0,
      avgDwellMs: 0,
      bounceSessions: 0,
    });
    expect(summary.contactIntent).toEqual({
      trackingVersion: 1,
      trackedSessions: 0,
      intentSessions: 0,
      events: 1,
      unattributedEvents: 1,
      byAction: { email_compose: 1 },
    });
    expect(summary.acquisitionCohorts).toEqual([]);
  });

  it('keeps mixed legacy/new coverage honest', () => {
    const summary = buildDailySummary('2026-09-03', [
      pageview({
        sid: 'instrumented',
        ts: '2026-09-03T01:00:00.000Z',
        path: '/en/contact',
        locale: 'en',
        country: 'US',
        channel: 'search',
        source: 'google',
        contactTracking: 1,
      }),
      contactIntent({ sid: 'instrumented', ts: '2026-09-03T01:01:00.000Z' }),
      pageview({
        sid: 'legacy',
        ts: '2026-09-03T02:00:00.000Z',
        path: '/ko/contact',
        locale: 'ko',
        country: 'KR',
        channel: 'direct',
        source: null,
      }),
      contactIntent({ sid: 'legacy', ts: '2026-09-03T02:01:00.000Z', path: '/ko/contact', locale: 'ko' }),
      pageview({
        sid: 'instrumented_no_click',
        ts: '2026-09-03T03:00:00.000Z',
        path: '/ja',
        locale: 'ja',
        country: 'JP',
        contactTracking: 1,
      }),
    ]);

    expect(summary.totals.sessions).toBe(3);
    expect(summary.contactIntent).toEqual({
      trackingVersion: 1,
      trackedSessions: 2,
      intentSessions: 1,
      events: 2,
      unattributedEvents: 1,
      byAction: { email_compose: 2 },
    });
    expect(summary.acquisitionCohorts).toBeDefined();
    const mixedCohorts = summary.acquisitionCohorts;
    if (mixedCohorts == null) {
      throw new Error('expected acquisitionCohorts to be defined');
    }
    expect(mixedCohorts.map((cohort) => ({
      country: cohort.country,
      trackedSessions: cohort.trackedSessions,
      intentSessions: cohort.intentSessions,
    }))).toEqual([
      { country: 'JP', trackedSessions: 1, intentSessions: 0 },
      { country: 'KR', trackedSessions: 0, intentSessions: 0 },
      { country: 'US', trackedSessions: 1, intentSessions: 1 },
    ]);
  });

  it('sorts contact-before-pageview into the later pageview session without dwell pollution', () => {
    const summary = buildDailySummary('2026-09-03', [
      contactIntent({ sid: 'late_pv', ts: '2026-09-03T01:00:00.000Z', path: '/en/contact', locale: 'en' }),
      pageview({
        sid: 'late_pv',
        ts: '2026-09-03T01:02:00.000Z',
        path: '/en/contact',
        locale: 'en',
        country: 'US',
        channel: 'direct',
        source: null,
        contactTracking: 1,
      }),
      engagement({
        sid: 'late_pv',
        ts: '2026-09-03T01:03:00.000Z',
        path: '/en/contact',
        dwellMs: 9_000,
      }),
    ]);

    expect(summary.totals).toEqual({
      pageviews: 1,
      sessions: 1,
      avgDwellMs: 9_000,
      bounceSessions: 1,
    });
    expect(summary.topPages).toEqual([
      { path: '/en/contact', views: 1, avgDwellMs: 9_000 },
    ]);
    expect(summary.contactIntent).toEqual({
      trackingVersion: 1,
      trackedSessions: 1,
      intentSessions: 1,
      events: 1,
      unattributedEvents: 0,
      byAction: { email_compose: 1 },
    });
  });
});
