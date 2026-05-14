import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getSubscriberByEmail,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import { sendTestEmail } from '@/lib/builder/marketing/dispatcher';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 5, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/marketing/subscriber-storage', () => ({
  getSubscriberByEmail: vi.fn(async () => null),
  saveSubscriber: vi.fn(async () => undefined),
  makeSubscriberId: vi.fn(() => 'sub-new-1'),
  makeToken: vi.fn(() => 'tok-test'),
}));

vi.mock('@/lib/builder/marketing/dispatcher', () => ({
  sendTestEmail: vi.fn(async () => undefined),
}));

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/marketing/subscribe', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.10' },
    body: JSON.stringify(body),
  });
}

describe('/api/marketing/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 5, retryAfterMs: 0 });
    vi.mocked(getSubscriberByEmail).mockResolvedValue(null);
  });

  it('creates a pending subscriber and triggers the opt-in email on happy path', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ email: 'visitor@example.test', preferredLocale: 'ko', tags: ['newsletter'], source: 'footer-form' }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.requiresVerification).toBe(true);
    expect(saveSubscriber).toHaveBeenCalledTimes(1);
    expect(saveSubscriber).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'visitor@example.test', status: 'pending', source: 'footer-form' }),
    );
    expect(sendTestEmail).toHaveBeenCalled();
  });

  it('returns alreadySubscribed when the email is already subscribed', async () => {
    vi.mocked(getSubscriberByEmail).mockResolvedValue({
      subscriberId: 'sub-existing',
      email: 'visitor@example.test',
      status: 'subscribed',
      preferredLocale: 'ko',
      tags: [],
      doubleOptInToken: 'tok-existing',
      unsubscribeToken: 'unsub-existing',
      source: 'public-form',
      createdAt: '2026-05-13T00:00:00Z',
      updatedAt: '2026-05-13T00:00:00Z',
    });
    const route = await import('../route');
    const response = await route.POST(postRequest({ email: 'visitor@example.test' }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.alreadySubscribed).toBe(true);
    expect(saveSubscriber).not.toHaveBeenCalled();
    expect(sendTestEmail).not.toHaveBeenCalled();
  });

  it('honors honeypot company field with silent ok', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ email: 'bot@example.test', company: 'Acme Corp' }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(saveSubscriber).not.toHaveBeenCalled();
    expect(sendTestEmail).not.toHaveBeenCalled();
  });

  it('rejects malformed email with 400', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ email: 'not-an-email' }));

    expect(response.status).toBe(400);
    expect(saveSubscriber).not.toHaveBeenCalled();
  });

  it('returns 429 when the subscribe rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 8000 });
    const route = await import('../route');
    const response = await route.POST(postRequest({ email: 'visitor@example.test' }));

    expect(response.status).toBe(429);
  });
});
