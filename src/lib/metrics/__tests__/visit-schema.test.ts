import { describe, expect, it } from 'vitest';

import {
  collectRequestSchema,
  contactIntentEventSchema,
  engagementEventSchema,
  inquirySubmittedEventSchema,
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

const validContactIntent = {
  v: 1 as const,
  sid: 'session_123',
  ts: '2026-09-01T05:03:00.000Z',
  type: 'contact_intent' as const,
  action: 'email_compose' as const,
  path: '/ko/contact',
  locale: 'ko' as const,
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

  it('accepts a legacy pageview without contactTracking', () => {
    expect(pageviewEventSchema.safeParse(validPageview).success).toBe(true);
  });

  it('accepts a pageview with contactTracking 1', () => {
    expect(
      pageviewEventSchema.safeParse({ ...validPageview, contactTracking: 1 }).success,
    ).toBe(true);
  });

  it.each([0, 2, true, '1'])('rejects contactTracking %s', (contactTracking) => {
    expect(
      pageviewEventSchema.safeParse({ ...validPageview, contactTracking }).success,
    ).toBe(false);
  });

  it('accepts a valid contact_intent event', () => {
    expect(contactIntentEventSchema.safeParse(validContactIntent).success).toBe(true);
  });

  it.each(['ko', 'zh-hant', 'en', 'ja'] as const)(
    'accepts contact_intent locale %s',
    (locale) => {
      expect(
        contactIntentEventSchema.safeParse({ ...validContactIntent, locale, path: `/${locale}` }).success,
      ).toBe(true);
    },
  );

  it.each([
    ['query string', '/ko/contact?utm=1'],
    ['fragment', '/ko/contact#write'],
    ['protocol-relative', '//hoveringlaw.com.tw'],
    ['admin-builder segment', '/ko/admin-builder'],
    ['admin-consultation segment', '/admin-consultation/inbox'],
    ['nested admin-builder', '/en/admin-builder/pages'],
  ])('rejects a contact_intent path with %s', (_case, path) => {
    expect(contactIntentEventSchema.safeParse({ ...validContactIntent, path }).success).toBe(
      false,
    );
  });

  it.each([
    ['href', { href: 'mailto:wei@hoveringlaw.com.tw' }],
    ['email', { email: 'wei@hoveringlaw.com.tw' }],
    ['subject', { subject: 'hello' }],
    ['body', { body: 'inquiry' }],
    ['clickedText', { clickedText: 'email us' }],
    ['query', { query: 'subject=x' }],
    ['fragment', { fragment: 'compose' }],
    ['to', { to: 'wei@hoveringlaw.com.tw' }],
  ])('rejects a contact_intent payload that includes %s', (_case, extra) => {
    expect(
      contactIntentEventSchema.safeParse({ ...validContactIntent, ...extra }).success,
    ).toBe(false);
  });

  it('accepts a mixed collect batch including contact_intent', () => {
    expect(
      collectRequestSchema.safeParse({
        events: [
          { ...validPageview, contactTracking: 1 },
          validEngagement,
          validContactIntent,
        ],
      }).success,
    ).toBe(true);
  });
});

describe('inquiry_submitted server-side event schema', () => {
  const validInquirySubmitted = {
    v: 1 as const,
    sid: 'inq_0123456789abcdef',
    ts: '2026-09-24T05:00:00.000Z',
    type: 'inquiry_submitted' as const,
    locale: 'ja' as const,
    path: '/ja/contact',
  };

  it('accepts a minimal locale/path event', () => {
    expect(inquirySubmittedEventSchema.safeParse(validInquirySubmitted).success).toBe(true);
  });

  it('accepts an event without a path (no same-origin referer)', () => {
    const { path: _path, ...withoutPath } = validInquirySubmitted;
    expect(inquirySubmittedEventSchema.safeParse(withoutPath).success).toBe(true);
  });

  it.each(['ko', 'en', 'ja', 'zh-hant', 'vi', 'fil'] as const)('accepts inquiry locale %s', (locale) => {
    expect(inquirySubmittedEventSchema.safeParse({ ...validInquirySubmitted, locale }).success).toBe(true);
  });

  it('rejects an unknown locale', () => {
    expect(inquirySubmittedEventSchema.safeParse({ ...validInquirySubmitted, locale: 'xx' }).success).toBe(false);
  });

  it.each([
    ['name', { name: 'Ada Lovelace' }],
    ['email', { email: 'ada@example.test' }],
    ['originalText', { originalText: 'Need help' }],
    ['body', { body: 'Need help' }],
    ['message', { message: 'Need help' }],
    ['ip', { ip: '203.0.113.1' }],
    ['requestId', { requestId: '8a6e0804-2bd0-4672-b79d-d53ae2e86c4e' }],
    ['intakeId', { intakeId: '8a6e0804-2bd0-4672-b79d-d53ae2e86c4e' }],
    ['originalLanguage', { originalLanguage: 'Cebuano' }],
    ['matterType free text', { matterType: 'my divorce with John' }],
  ])('rejects an inquiry_submitted payload that includes %s', (_case, extra) => {
    expect(inquirySubmittedEventSchema.safeParse({ ...validInquirySubmitted, ...extra }).success).toBe(false);
  });

  it.each([
    ['query string', '/ja/contact?email=ada@example.test'],
    ['fragment', '/ja/contact#form'],
    ['protocol-relative', '//evil.example/ja'],
    ['admin segment', '/ko/admin-consultation'],
  ])('rejects an inquiry_submitted path with %s', (_case, path) => {
    expect(inquirySubmittedEventSchema.safeParse({ ...validInquirySubmitted, path }).success).toBe(false);
  });

  it('is server-only: the public collect endpoint schema rejects inquiry_submitted', () => {
    expect(collectRequestSchema.safeParse({ events: [validInquirySubmitted] }).success).toBe(false);
  });
});
