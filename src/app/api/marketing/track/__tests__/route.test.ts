import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getRecipientByToken,
  saveRecipient,
} from '@/lib/builder/marketing/campaign-storage';
import { dispatchMarketingAnalyticsEvent } from '@/lib/builder/marketing/analytics-integrations';
import type { CampaignRecipient } from '@/lib/builder/marketing/campaign-types';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 59, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/marketing/campaign-storage', () => ({
  getRecipientByToken: vi.fn(async () => null),
  saveRecipient: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/marketing/analytics-integrations', () => ({
  dispatchMarketingAnalyticsEvent: vi.fn(async () => undefined),
}));

describe('/api/marketing/track', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 59, retryAfterMs: 0 });
    vi.mocked(getRecipientByToken).mockResolvedValue(null);
    vi.mocked(saveRecipient).mockResolvedValue(undefined);
    vi.mocked(dispatchMarketingAnalyticsEvent).mockResolvedValue(undefined);
  });

  it('redirects to http and https campaign targets only', async () => {
    const route = await import('../route');
    const response = await route.GET(makeRequest('https://client.example/path?x=1'));

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://client.example/path?x=1');
  });

  it('rejects unsafe campaign redirect protocols', async () => {
    const route = await import('../route');
    const response = await route.GET(makeRequest('javascript:alert(document.domain)', 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認要前往的連結。',
      errorCode: 'invalid_redirect',
    });
  });

  it('dispatches campaign-clicked analytics only on the first tracked click', async () => {
    const recipient = makeRecipient();
    vi.mocked(getRecipientByToken).mockResolvedValue(recipient);
    const route = await import('../route');
    const response = await route.GET(makeRequest('https://client.example/offer'));

    expect(response.status).toBe(302);
    expect(saveRecipient).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'clicked', clickedAt: expect.any(String) }),
    );
    expect(dispatchMarketingAnalyticsEvent).toHaveBeenCalledWith({
      kind: 'campaign-clicked',
      occurredAt: expect.any(String),
      recipient: expect.objectContaining({ status: 'clicked', clickedAt: expect.any(String) }),
      payload: { targetUrl: 'https://client.example/offer' },
    });

    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 59, retryAfterMs: 0 });
    vi.mocked(getRecipientByToken).mockResolvedValue({
      ...recipient,
      clickedAt: '2026-06-18T00:00:00.000Z',
      status: 'clicked',
    });

    await route.GET(makeRequest('https://client.example/offer'));
    expect(dispatchMarketingAnalyticsEvent).not.toHaveBeenCalled();
  });
});

function makeRequest(target: string, locale?: string): NextRequest {
  const url = new URL('https://law.example.test/api/marketing/track');
  url.searchParams.set('token', 'recipient-token');
  url.searchParams.set('u', target);
  if (locale) url.searchParams.set('locale', locale);
  return new NextRequest(url, {
    headers: { 'x-forwarded-for': '127.0.0.42' },
  });
}

function makeRecipient(): CampaignRecipient {
  return {
    campaignId: 'camp_1',
    subscriberId: 'sub_1',
    email: 'lead@example.test',
    status: 'sent',
    attempts: 1,
    sentAt: '2026-06-18T00:00:00.000Z',
    trackingToken: 'recipient-token',
  };
}
