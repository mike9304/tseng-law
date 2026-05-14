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
    unsubscribeToken: 'tok-unsub',
    source: 'public-form',
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T00:00:00Z',
    ...overrides,
  };
}

function getRequest(token: string): NextRequest {
  const url = new URL('https://law.example.test/api/marketing/verify');
  if (token) url.searchParams.set('token', token);
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
      expect.objectContaining({ status: 'subscribed' }),
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
    const response = await route.GET(getRequest(''));
    expect(response.status).toBe(400);
  });

  it('returns 404 when token does not resolve to a subscriber', async () => {
    vi.mocked(getSubscriberByDoubleOptInToken).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.GET(getRequest('tok-unknown'));
    expect(response.status).toBe(404);
  });

  it('returns 429 when the verify rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 6000 });
    const route = await import('../route');
    const response = await route.GET(getRequest('tok-double'));
    expect(response.status).toBe(429);
  });
});
