import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getSubscriberByDoubleOptInToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import type { Subscriber } from '@/lib/builder/marketing/subscriber-types';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 19, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/marketing/subscriber-storage', () => ({
  getSubscriberByDoubleOptInToken: vi.fn(),
  saveSubscriber: vi.fn(async () => undefined),
}));

function makeSubscriber(overrides: Partial<Subscriber> = {}): Subscriber {
  return {
    subscriberId: 'sub-1',
    email: 'visitor@example.test',
    status: 'pending',
    preferredLocale: 'ko',
    tags: [],
    doubleOptInToken: 'tok-double',
    doubleOptInTokenCreatedAt: '2026-06-19T00:00:00.000Z',
    doubleOptInTokenExpiresAt: '2099-06-26T00:00:00.000Z',
    unsubscribeToken: 'tok-unsub',
    source: 'public-form',
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T00:00:00Z',
    ...overrides,
  };
}

function getRequest(token: string, locale?: string): NextRequest {
  const url = new URL('https://law.example.test/api/marketing/verify');
  if (token) url.searchParams.set('token', token);
  if (locale) url.searchParams.set('locale', locale);
  return new NextRequest(url, { headers: { 'x-forwarded-for': '127.0.0.11' } });
}

describe('/api/marketing/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 19, retryAfterMs: 0 });
  });

  it('promotes a pending subscriber to subscribed on a valid token', async () => {
    vi.mocked(getSubscriberByDoubleOptInToken).mockResolvedValue(makeSubscriber());
    const route = await import('../route');
    const response = await route.GET(getRequest('tok-double'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.verified).toBe(true);
    expect(saveSubscriber).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'subscribed', doubleOptInVerifiedAt: expect.any(String) }),
    );
  });

  it('returns alreadyVerified without re-writing when already subscribed', async () => {
    vi.mocked(getSubscriberByDoubleOptInToken).mockResolvedValue(makeSubscriber({ status: 'subscribed' }));
    const route = await import('../route');
    const response = await route.GET(getRequest('tok-double'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.alreadyVerified).toBe(true);
    expect(saveSubscriber).not.toHaveBeenCalled();
  });

  it('returns 400 when token is missing', async () => {
    const route = await import('../route');
    const response = await route.GET(getRequest('', 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '需要確認權杖。',
      errorCode: 'missing_token',
    });
  });

  it('returns 404 when token does not resolve to a subscriber', async () => {
    vi.mocked(getSubscriberByDoubleOptInToken).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.GET(getRequest('tok-unknown', 'en'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toMatchObject({
      ok: false,
      error: 'The confirmation token is invalid.',
      errorCode: 'invalid_token',
    });
  });

  it('returns 410 when a pending subscriber verification token is expired', async () => {
    vi.mocked(getSubscriberByDoubleOptInToken).mockResolvedValue(
      makeSubscriber({ doubleOptInTokenExpiresAt: '2000-01-01T00:00:00.000Z' }),
    );
    const route = await import('../route');
    const response = await route.GET(getRequest('tok-double', 'en'));
    const payload = await response.json();

    expect(response.status).toBe(410);
    expect(payload).toMatchObject({
      ok: false,
      error: 'The confirmation link has expired. Please subscribe again.',
      errorCode: 'expired_token',
    });
    expect(saveSubscriber).not.toHaveBeenCalled();
  });

  it('returns 429 when the verify rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 6000 });
    const route = await import('../route');
    const response = await route.GET(getRequest('tok-double', 'en'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload.errorCode).toBe('too_many_requests');
  });
});
