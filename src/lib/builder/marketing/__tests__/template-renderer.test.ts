import { describe, expect, it } from 'vitest';
import { renderCampaignForSubscriber } from '@/lib/builder/marketing/template-renderer';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';
import type { Subscriber } from '@/lib/builder/marketing/subscriber-types';

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
  it('substitutes {{email}} variable and picks locale-specific subject', () => {
    const rendered = renderCampaignForSubscriber({
      campaign: makeCampaign(),
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(rendered.subject).toBe('봄 안내');
    expect(rendered.html).toContain('user@example.com');
  });

  it('rewrites external anchors to go through the tracking redirect', () => {
    const rendered = renderCampaignForSubscriber({
      campaign: makeCampaign(),
      subscriber: makeSubscriber(),
      trackingToken: 'trk',
      baseUrl: 'https://tseng-law.com',
    });
    expect(rendered.html).toContain('/api/marketing/track?token=trk');
    expect(rendered.html).toContain('u=https%3A%2F%2Fexample.com%2Fpost');
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

  it('leaves mailto: and tel: links untouched', () => {
    const campaign = makeCampaign({
      bodyHtml: {
        ko: '<a href="mailto:hi@example.com">hi</a> <a href="tel:+8210">phone</a>',
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
    expect(rendered.html).not.toMatch(/track\?token=trk[^"]+mailto/);
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
