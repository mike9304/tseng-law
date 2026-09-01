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
    });
  });
});
