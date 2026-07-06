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
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 119, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/marketing/campaign-storage', () => ({
  getRecipientByToken: vi.fn(async () => null),
  saveRecipient: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/marketing/analytics-integrations', () => ({
  dispatchMarketingAnalyticsEvent: vi.fn(async () => undefined),
}));

describe('/api/marketing/track/pixel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 119, retryAfterMs: 0 });
    vi.mocked(getRecipientByToken).mockResolvedValue(null);
    vi.mocked(saveRecipient).mockResolvedValue(undefined);
    vi.mocked(dispatchMarketingAnalyticsEvent).mockResolvedValue(undefined);
  });

  it('returns the pixel and dispatches campaign-opened analytics on the first open', async () => {
    const recipient = makeRecipient();
    vi.mocked(getRecipientByToken).mockResolvedValue(recipient);
    const route = await import('../route');
    const response = await route.GET(makeRequest());

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/gif');
    expect(saveRecipient).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'opened', openedAt: expect.any(String) }),
    );
    expect(dispatchMarketingAnalyticsEvent).toHaveBeenCalledWith({
      kind: 'campaign-opened',
      occurredAt: expect.any(String),
      recipient: expect.objectContaining({ status: 'opened', openedAt: expect.any(String) }),
      payload: { source: 'tracking-pixel' },
    });
  });

  it('does not dispatch duplicate campaign-opened analytics when already opened', async () => {
    vi.mocked(getRecipientByToken).mockResolvedValue({
      ...makeRecipient(),
      status: 'opened',
      openedAt: '2026-06-18T00:00:00.000Z',
    });
    const route = await import('../route');

    await route.GET(makeRequest());

    expect(saveRecipient).not.toHaveBeenCalled();
    expect(dispatchMarketingAnalyticsEvent).not.toHaveBeenCalled();
  });
});

function makeRequest(): NextRequest {
  const url = new URL('https://law.example.test/api/marketing/track/pixel');
  url.searchParams.set('token', 'recipient-token');
  return new NextRequest(url, {
    headers: { 'x-forwarded-for': '127.0.0.77' },
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
