import { describe, expect, it } from 'vitest';
import { enrichEvents } from '../enrich-events';
import type { VisitEvent } from '../visit-schema';

const now = new Date('2026-09-01T01:02:03.000Z');
const base = { v: 1 as const, sid: 'visitor_123', ts: '2026-09-01T01:00:00.000Z' };

describe('enrichEvents', () => {
  it('classifies first-load AI pageviews and stamps received metadata', () => {
    const [event] = enrichEvents([{ ...base, type: 'pageview', path: '/en', locale: 'en', ref: 'https://chatgpt.com/', firstLoad: true }], { now, country: ' KR ' });
    expect(event).toMatchObject({ receivedAt: now.toISOString(), country: ' KR ', channel: 'ai', source: 'chatgpt', keyword: null });
  });

  it('classifies search pageviews with a retained keyword', () => {
    const [event] = enrichEvents([{ ...base, type: 'pageview', path: '/ko', locale: 'ko', ref: 'https://search.naver.com/search.naver?query=%EB%B3%80%ED%98%B8%EC%82%AC', firstLoad: true }], { now });
    expect(event).toMatchObject({ channel: 'search', source: 'naver', keyword: '변호사' });
  });

  it('marks SPA pageviews internal', () => {
    const [event] = enrichEvents([{ ...base, type: 'pageview', path: '/ja', locale: 'ja', firstLoad: false }], { now });
    expect(event).toMatchObject({ channel: 'internal', source: null, keyword: null });
  });

  it('does not classify engagement events', () => {
    const [event] = enrichEvents([{ ...base, type: 'engagement', path: '/ko', dwellMs: 40, scrollPct: 10 }], { now, country: 'US' });
    expect(event).toEqual({ ...base, type: 'engagement', path: '/ko', dwellMs: 40, scrollPct: 10, receivedAt: now.toISOString(), country: 'US' });
    expect(event).not.toHaveProperty('channel');
  });

  it('does not mutate its input and omits an undefined country', () => {
    const input: VisitEvent[] = [{ ...base, type: 'engagement', path: '/ko', dwellMs: 0 }];
    const [event] = enrichEvents(input, { now });
    expect(event).not.toHaveProperty('country');
    expect(input).toEqual([{ ...base, type: 'engagement', path: '/ko', dwellMs: 0 }]);
  });

  it('preserves an explicitly provided empty country string', () => {
    const [event] = enrichEvents([{ ...base, type: 'engagement', path: '/ko', dwellMs: 0 }], { now, country: '' });
    expect(event).toHaveProperty('country', '');
  });
});
