import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { renderCampaignForSubscriber } from '@/lib/builder/marketing/template-renderer';
import { verifyMarketingClickSignature } from '@/lib/builder/marketing/marketing-click-signature';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';
import type { Subscriber } from '@/lib/builder/marketing/subscriber-types';

const SECRET_ENV_KEYS = [
  'MARKETING_TRACKING_SECRET',
  'CRM_TRACKING_SECRET',
  'CRM_WEBHOOK_SECRET',
  'NEXTAUTH_SECRET',
  'BUILDER_WEBHOOK_SECRET',
] as const;
const ORIGINAL_SECRET_ENV = Object.fromEntries(
  SECRET_ENV_KEYS.map((key) => [key, process.env[key]]),
) as Record<(typeof SECRET_ENV_KEYS)[number], string | undefined>;

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    campaignId: 'camp_1',
    name: 'Spring',
    subject: { ko: '봄 안내', 'zh-hant': '春季公告', en: 'Spring update' },
    bodyHtml: {
      ko: '<p>안녕 {{email}}, <a href="https://example.com/post">자세히</a></p>',
      'zh-hant': '<p>Hi {{email}} <a href="https://example.com/post">link</a></p>',
      en: '<p>Hi {{email}} <a href="https://example.com/post">link</a></p>',
    },
    bodyText: { ko: '안녕 {{email}}', 'zh-hant': 'Hi', en: 'Hi' },
    segmentTags: [],
    fromName: '호정국제',
    fromAddress: 'bookings@hoveringlaw.com.tw',
    status: 'draft',
    stats: { recipients: 0, opens: 0, clicks: 0, unsubscribes: 0, bounces: 0 },
    createdAt: '2026-05-11T00:00:00.000Z',
    updatedAt: '2026-05-11T00:00:00.000Z',
    ...overrides,
  };
}

function makeSubscriber(overrides: Partial<Subscriber> = {}): Subscriber {
  return {
    subscriberId: 'sub_1',
    email: 'user@example.com',
    status: 'subscribed',
    tags: [],
    preferredLocale: 'ko',
    unsubscribeToken: 'unsub-token',
    source: 'test',
    createdAt: '2026-05-11T00:00:00.000Z',
    updatedAt: '2026-05-11T00:00:00.000Z',
    ...overrides,
  };
}

describe('renderCampaignForSubscriber', () => {
  beforeEach(() => {
    for (const key of SECRET_ENV_KEYS) delete process.env[key];
  });

  afterAll(() => {
    for (const key of SECRET_ENV_KEYS) {
      const original = ORIGINAL_SECRET_ENV[key];
      if (original === undefined) delete process.env[key];
      else process.env[key] = original;
    }
  });

  it('substitutes {{email}} variable and picks locale-specific subject', () => {
    const rendered = renderCampaignForSubscriber({
      campaign: makeCampaign(),
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    // Korean advertising mail must begin with the (광고) prefix
    // (정보통신망법 시행령 별표 6), so the stored subject is prefixed at render time.
    expect(rendered.subject).toBe('(광고) 봄 안내');
    expect(rendered.html).toContain('user@example.com');
  });

  it('keeps the (광고) prefix off transactional system campaigns and off non-Korean locales', () => {
    const optIn = renderCampaignForSubscriber({
      campaign: { ...makeCampaign(), campaignId: 'system-opt-in' },
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(optIn.subject).toBe('봄 안내');

    const english = renderCampaignForSubscriber({
      campaign: makeCampaign(),
      subscriber: { ...makeSubscriber(), preferredLocale: 'en' },
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(english.subject).not.toContain('(광고)');
  });

  it('does not double-prefix a subject that already carries the ad label', () => {
    const rendered = renderCampaignForSubscriber({
      campaign: {
        ...makeCampaign(),
        subject: { ko: '(광고) 봄 안내', 'zh-hant': '春季通知', en: 'Spring update' },
      },
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(rendered.subject).toBe('(광고) 봄 안내');
  });

  it('puts the required display items and ad label in the footer of marketing mail', () => {
    const rendered = renderCampaignForSubscriber({
      campaign: makeCampaign(),
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    for (const body of [rendered.html, rendered.text]) {
      expect(body).toContain('廣告');
      expect(body).toContain('曾雋崴');
      expect(body).toContain('광고책임변호사');
      expect(body).toContain('103臺北市大同區承德路一段35號7樓之2');
      expect(body).toContain('+886-4-2326-1862');
      expect(body).toContain('wei@hoveringlaw.com.tw');
    }
    expect(rendered.html).not.toContain('Hoyering');
    expect(rendered.text).toContain('구독 해지 / Unsubscribe');
  });

  it('drops the ad label from transactional campaigns but keeps the firm details', () => {
    const rendered = renderCampaignForSubscriber({
      campaign: { ...makeCampaign(), campaignId: 'system-opt-in' },
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(rendered.text).not.toContain('— 廣告');
    expect(rendered.text).toContain('曾雋崴');
  });

  it('emits one-click unsubscribe headers pointing at the subscriber token', () => {
    const rendered = renderCampaignForSubscriber({
      campaign: makeCampaign(),
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(rendered.headers['List-Unsubscribe']).toBe(
      '<https://tseng-law.com/api/marketing/unsubscribe?token=unsub-token>',
    );
    expect(rendered.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
  });

  it('rewrites external anchors with a signed tracking redirect', () => {
    process.env.MARKETING_TRACKING_SECRET = 'test-marketing-secret';
    const rendered = renderCampaignForSubscriber({
      campaign: makeCampaign(),
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(rendered.html).toContain('/api/marketing/track?token=trk');
    expect(rendered.html).toContain('u=https%3A%2F%2Fexample.com%2Fpost');
    expect(rendered.html).toMatch(/(?:&|&amp;)sig=[A-Za-z0-9_-]{43}/);
  });

  it('normalizes a relative href to an absolute destination before signing', () => {
    const secret = 'test-marketing-secret';
    process.env.MARKETING_TRACKING_SECRET = secret;
    const campaign = makeCampaign({
      bodyHtml: {
        ko: '<a href="/ko/services?topic=tax#fees">서비스</a>',
        'zh-hant': '<a href="/zh-hant/services">服務</a>',
        en: '<a href="/en/services">Services</a>',
      },
    });
    const rendered = renderCampaignForSubscriber({
      campaign,
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    const trackingHref = rendered.html.match(/href="([^"]*\/api\/marketing\/track[^"]+)"/)?.[1];

    expect(trackingHref).toBeDefined();
    const trackingUrl = new URL(trackingHref!.replace(/&amp;/g, '&'));
    const destination = trackingUrl.searchParams.get('u');
    const signature = trackingUrl.searchParams.get('sig');
    expect(destination).toBe('https://tseng-law.com/ko/services?topic=tax#fees');
    expect(signature).not.toBeNull();
    expect(verifyMarketingClickSignature('trk', destination!, signature!, secret)).toBe(true);
  });

  it('leaves the exact relative href direct when no tracking secret is configured', () => {
    const campaign = makeCampaign({
      bodyHtml: {
        ko: '<a href="/ko/services?topic=tax#fees">서비스</a>',
        'zh-hant': '<a href="/zh-hant/services">服務</a>',
        en: '<a href="/en/services">Services</a>',
      },
    });
    const rendered = renderCampaignForSubscriber({
      campaign,
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });

    expect(rendered.html).toContain('href="/ko/services?topic=tax#fees"');
    expect(rendered.html).not.toContain('/api/marketing/track?');
  });

  it('appends an unsubscribe link and tracking pixel to every email', () => {
    const rendered = renderCampaignForSubscriber({
      campaign: makeCampaign(),
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(rendered.html).toContain('/api/marketing/unsubscribe?token=unsub-token');
    expect(rendered.html).toContain('/api/marketing/track/pixel?token=trk');
    expect(rendered.text).toContain('구독 해지');
  });

  it('leaves mailto:, tel:, fragments, and other non-http schemes untouched', () => {
    process.env.MARKETING_TRACKING_SECRET = 'test-marketing-secret';
    const campaign = makeCampaign({
      bodyHtml: {
        ko: '<a href="mailto:hi@example.com">hi</a> <a href="tel:+8210">phone</a> <a href="#fees">fees</a> <a href="ftp://files.example.com/doc">file</a>',
        'zh-hant': '<a href="mailto:hi@example.com">hi</a>',
        en: '<a href="mailto:hi@example.com">hi</a>',
      },
    });
    const rendered = renderCampaignForSubscriber({
      campaign,
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(rendered.html).toContain('mailto:hi@example.com');
    expect(rendered.html).toContain('tel:+8210');
    expect(rendered.html).toContain('href="#fees"');
    expect(rendered.html).toContain('href="ftp://files.example.com/doc"');
    expect(rendered.html).not.toContain('/api/marketing/track?');
  });

  it('uses subscriber preferredLocale for footer copy', () => {
    const rendered = renderCampaignForSubscriber({
      campaign: makeCampaign(),
      subscriber: makeSubscriber({ preferredLocale: 'zh-hant' }),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(rendered.html).toContain('取消訂閱');
  });
});
