import { NextRequest } from 'next/server';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getRecipientByToken,
  saveRecipient,
} from '@/lib/builder/marketing/campaign-storage';
import { dispatchMarketingAnalyticsEvent } from '@/lib/builder/marketing/analytics-integrations';
import { createMarketingClickSignature } from '@/lib/builder/marketing/marketing-click-signature';
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

const TEST_SECRET = 'test-marketing-tracking-secret';
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

describe('/api/marketing/track', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of SECRET_ENV_KEYS) delete process.env[key];
    process.env.MARKETING_TRACKING_SECRET = TEST_SECRET;
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 59, retryAfterMs: 0 });
    vi.mocked(getRecipientByToken).mockResolvedValue(null);
    vi.mocked(saveRecipient).mockResolvedValue(undefined);
    vi.mocked(dispatchMarketingAnalyticsEvent).mockResolvedValue(undefined);
  });

  afterAll(() => {
    for (const key of SECRET_ENV_KEYS) {
      const original = ORIGINAL_SECRET_ENV[key];
      if (original === undefined) delete process.env[key];
      else process.env[key] = original;
    }
  });

  it('allows a signed external http or https campaign target', async () => {
    const route = await import('../route');
    const response = await route.GET(makeSignedRequest('https://client.example/path?x=1'));

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://client.example/path?x=1');
  });

  it('rejects an unsigned campaign target without logging analytics', async () => {
    const route = await import('../route');
    const response = await route.GET(makeRequest('https://client.example/path', {
      token: 'recipient-token',
    }));

    expect(response.status).toBe(400);
    expect(getRecipientByToken).not.toHaveBeenCalled();
    expect(saveRecipient).not.toHaveBeenCalled();
    expect(dispatchMarketingAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('rejects a target tampered after signing without logging analytics', async () => {
    const route = await import('../route');
    const signature = createMarketingClickSignature(
      'recipient-token',
      'https://client.example/original',
      TEST_SECRET,
    );
    const response = await route.GET(makeRequest('https://client.example/tampered', {
      token: 'recipient-token',
      signature,
    }));

    expect(response.status).toBe(400);
    expect(getRecipientByToken).not.toHaveBeenCalled();
    expect(saveRecipient).not.toHaveBeenCalled();
    expect(dispatchMarketingAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('rejects a token tampered after signing without logging analytics', async () => {
    const route = await import('../route');
    const target = 'https://client.example/offer';
    const signature = createMarketingClickSignature('recipient-token', target, TEST_SECRET);
    const response = await route.GET(makeRequest(target, {
      token: 'tampered-token',
      signature,
    }));

    expect(response.status).toBe(400);
    expect(getRecipientByToken).not.toHaveBeenCalled();
    expect(saveRecipient).not.toHaveBeenCalled();
    expect(dispatchMarketingAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('rejects an unsafe campaign redirect protocol even when signed', async () => {
    const route = await import('../route');
    const response = await route.GET(
      makeSignedRequest('javascript:alert(document.domain)', { locale: 'zh-hant' }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認要前往的連結。',
      errorCode: 'invalid_redirect',
    });
    expect(getRecipientByToken).not.toHaveBeenCalled();
    expect(saveRecipient).not.toHaveBeenCalled();
    expect(dispatchMarketingAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('rejects a signed target when no tracking secret is configured', async () => {
    const target = 'https://client.example/offer';
    const signature = createMarketingClickSignature('recipient-token', target, TEST_SECRET);
    for (const key of SECRET_ENV_KEYS) delete process.env[key];
    const route = await import('../route');
    const response = await route.GET(makeRequest(target, {
      token: 'recipient-token',
      signature,
    }));

    expect(response.status).toBe(400);
    expect(getRecipientByToken).not.toHaveBeenCalled();
    expect(saveRecipient).not.toHaveBeenCalled();
    expect(dispatchMarketingAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('dispatches campaign-clicked analytics only on the first tracked click', async () => {
    const recipient = makeRecipient();
    vi.mocked(getRecipientByToken).mockResolvedValue(recipient);
    const route = await import('../route');
    const response = await route.GET(makeSignedRequest('https://client.example/offer'));

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

    await route.GET(makeSignedRequest('https://client.example/offer'));
    expect(dispatchMarketingAnalyticsEvent).not.toHaveBeenCalled();
  });
});

interface RequestOptions {
  token?: string;
  signature?: string;
  locale?: string;
}

function makeRequest(target: string, options: RequestOptions = {}): NextRequest {
  const url = new URL('https://law.example.test/api/marketing/track');
  if (options.token !== undefined) url.searchParams.set('token', options.token);
  url.searchParams.set('u', target);
  if (options.signature !== undefined) url.searchParams.set('sig', options.signature);
  if (options.locale) url.searchParams.set('locale', options.locale);
  return new NextRequest(url, {
    headers: { 'x-forwarded-for': '127.0.0.42' },
  });
}

function makeSignedRequest(target: string, options: Omit<RequestOptions, 'signature'> = {}): NextRequest {
  const token = options.token ?? 'recipient-token';
  return makeRequest(target, {
    ...options,
    token,
    signature: createMarketingClickSignature(token, target, TEST_SECRET),
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
