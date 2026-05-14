import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getSubscriberByUnsubscribeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import type { Subscriber } from '@/lib/builder/marketing/subscriber-types';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 29, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/marketing/subscriber-storage', () => ({
  getSubscriberByUnsubscribeToken: vi.fn(),
  saveSubscriber: vi.fn(async () => undefined),
}));

function makeSubscriber(overrides: Partial<Subscriber> = {}): Subscriber {
  return {
    subscriberId: 'sub-1',
    email: 'visitor@example.test',
    status: 'subscribed',
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
  const url = new URL('https://law.example.test/api/marketing/unsubscribe');
  if (token) url.searchParams.set('token', token);
  return new NextRequest(url, { headers: { 'x-forwarded-for': '127.0.0.12' } });
}

function postRequest(token: string): NextRequest {
  const url = new URL('https://law.example.test/api/marketing/unsubscribe');
  if (token) url.searchParams.set('token', token);
  return new NextRequest(url, { method: 'POST', headers: { 'x-forwarded-for': '127.0.0.12' } });
}

describe('/api/marketing/unsubscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 29, retryAfterMs: 0 });
  });

  it('GET renders an HTML confirmation form (no mutation)', async () => {
    vi.mocked(getSubscriberByUnsubscribeToken).mockResolvedValue(makeSubscriber());
    const route = await import('../route');
    const response = await route.GET(getRequest('tok-unsub'));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(html).toContain('구독 해지를 확인해주세요');
    expect(saveSubscriber).not.toHaveBeenCalled();
  });

  it('GET shows "already unsubscribed" state without offering re-confirmation', async () => {
    vi.mocked(getSubscriberByUnsubscribeToken).mockResolvedValue(
      makeSubscriber({ status: 'unsubscribed' }),
    );
    const route = await import('../route');
    const response = await route.GET(getRequest('tok-unsub'));
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain('이미 구독이 해지된 상태');
  });

  it('GET returns 400 when token is missing (email prefetch guard)', async () => {
    const route = await import('../route');
    const response = await route.GET(getRequest(''));
    expect(response.status).toBe(400);
  });

  it('POST actually marks the subscriber as unsubscribed', async () => {
    vi.mocked(getSubscriberByUnsubscribeToken).mockResolvedValue(makeSubscriber());
    const route = await import('../route');
    const response = await route.POST(postRequest('tok-unsub'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.unsubscribed).toBe(true);
    expect(saveSubscriber).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'unsubscribed' }),
    );
  });

  it('POST is idempotent when subscriber is already unsubscribed', async () => {
    vi.mocked(getSubscriberByUnsubscribeToken).mockResolvedValue(
      makeSubscriber({ status: 'unsubscribed' }),
    );
    const route = await import('../route');
    const response = await route.POST(postRequest('tok-unsub'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.unsubscribed).toBe(true);
    expect(saveSubscriber).not.toHaveBeenCalled();
  });

  it('POST returns 404 when token does not resolve to a subscriber', async () => {
    vi.mocked(getSubscriberByUnsubscribeToken).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.POST(postRequest('tok-unknown'));
    expect(response.status).toBe(404);
  });
});
