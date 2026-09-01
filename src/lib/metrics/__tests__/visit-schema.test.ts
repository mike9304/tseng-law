import { describe, expect, it } from 'vitest';

import {
  collectRequestSchema,
  engagementEventSchema,
  pageviewEventSchema,
} from '@/lib/metrics/visit-schema';

const validPageview = {
  v: 1 as const,
  sid: 'session_123',
  ts: '2026-09-01T05:00:00.000Z',
  type: 'pageview' as const,
  path: '/ko/services',
  locale: 'ko' as const,
  ref: 'https://www.google.com/',
  utm: {
    source: 'google',
    medium: 'organic',
    campaign: 'legal-services',
  },
  lang: 'ko-KR',
  vw: 1440,
  firstLoad: true,
};

const validEngagement = {
  v: 1 as const,
  sid: 'session_123',
  ts: '2026-09-01T05:02:00.000Z',
  type: 'engagement' as const,
  path: '/ko/services',
  dwellMs: 120_000,
  scrollPct: 80,
};

describe('visit event schemas', () => {
  it('accepts a valid pageview event', () => {
    expect(pageviewEventSchema.safeParse(validPageview).success).toBe(true);
  });

  it('accepts a valid engagement event', () => {
    expect(engagementEventSchema.safeParse(validEngagement).success).toBe(true);
  });

  it.each([
    ['too short', 'short'],
    ['too long', 'a'.repeat(65)],
    ['invalid characters', 'session.bad'],
  ])('rejects a sid that is %s', (_case, sid) => {
    expect(pageviewEventSchema.safeParse({ ...validPageview, sid }).success).toBe(
      false,
    );
  });

  it('rejects dwellMs above the 30 minute ceiling', () => {
    expect(
      engagementEventSchema.safeParse({
        ...validEngagement,
        dwellMs: 1_800_001,
      }).success,
    ).toBe(false);
  });

  it('rejects a request containing 26 events', () => {
    expect(
      collectRequestSchema.safeParse({
        events: Array.from({ length: 26 }, () => ({ ...validPageview })),
      }).success,
    ).toBe(false);
  });

  it.each([
    ['pageview', pageviewEventSchema, validPageview],
    ['engagement', engagementEventSchema, validEngagement],
  ])('rejects a %s path that does not begin with /', (_type, schema, event) => {
    expect(schema.safeParse({ ...event, path: 'ko/services' }).success).toBe(
      false,
    );
  });
});
