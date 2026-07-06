import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getSubscriberByEmail,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import { sendTestEmail } from '@/lib/builder/marketing/dispatcher';
import { linkSubscriberToCrmContact } from '@/lib/builder/marketing/subscriber-crm-link';

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

vi.mock('@/lib/builder/marketing/subscriber-crm-link', () => ({
  linkSubscriberToCrmContact: vi.fn(async () => ({ contactId: 'ct_linked', created: true })),
}));

function postRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/marketing/subscribe${query}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'vitest-browser',
      'x-forwarded-for': '127.0.0.10',
    },
    body: JSON.stringify(body),
  });
}

function postRawRequest(body: string, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/marketing/subscribe${query}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.10' },
    body,
  });
}

describe('/api/marketing/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 5, retryAfterMs: 0 });
    vi.mocked(getSubscriberByEmail).mockResolvedValue(null);
    vi.mocked(linkSubscriberToCrmContact).mockResolvedValue({ contactId: 'ct_linked', created: true });
  });

  it('creates a pending subscriber and triggers the opt-in email on happy path', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        email: 'visitor@example.test',
        preferredLocale: 'ko',
        tags: ['newsletter'],
        source: 'footer-form',
        marketingConsent: true,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.requiresVerification).toBe(true);
    expect(saveSubscriber).toHaveBeenCalledTimes(1);
    expect(saveSubscriber).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'visitor@example.test',
        contactId: 'ct_linked',
        status: 'pending',
        source: 'footer-form',
        marketingConsent: expect.objectContaining({
          source: 'footer-form',
          preferredLocale: 'ko',
          ipAddress: '127.0.0.10',
          userAgent: 'vitest-browser',
        }),
        doubleOptInTokenCreatedAt: expect.any(String),
        doubleOptInTokenExpiresAt: expect.any(String),
      }),
    );
    expect(linkSubscriberToCrmContact).toHaveBeenCalledWith({
      email: 'visitor@example.test',
      preferredLocale: 'ko',
      source: 'footer-form',
      tags: ['newsletter'],
    });
    expect(sendTestEmail).toHaveBeenCalled();
    expect(vi.mocked(sendTestEmail).mock.calls[0]?.[0].campaign.bodyText.ko).toContain(
      '/api/marketing/verify?token=tok-test&locale=ko',
    );
  });

  it('returns alreadySubscribed when the email is already subscribed', async () => {
    vi.mocked(getSubscriberByEmail).mockResolvedValue({
      subscriberId: 'sub-existing',
      email: 'visitor@example.test',
      contactId: 'ct-existing',
      status: 'subscribed',
      preferredLocale: 'ko',
      tags: [],
      doubleOptInToken: 'tok-existing',
      unsubscribeToken: 'unsub-existing',
      source: 'public-form',
      marketingConsent: {
        acceptedAt: '2026-05-13T00:00:00Z',
        source: 'public-form',
        preferredLocale: 'ko',
        ipAddress: '127.0.0.1',
        text: 'Accepted marketing updates.',
      },
      createdAt: '2026-05-13T00:00:00Z',
      updatedAt: '2026-05-13T00:00:00Z',
    });
    const route = await import('../route');
    const response = await route.POST(postRequest({ email: 'visitor@example.test', marketingConsent: true }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.alreadySubscribed).toBe(true);
    expect(saveSubscriber).not.toHaveBeenCalled();
    expect(linkSubscriberToCrmContact).not.toHaveBeenCalled();
    expect(sendTestEmail).not.toHaveBeenCalled();
  });

  it('backfills a missing contactId when an existing subscriber is already subscribed', async () => {
    vi.mocked(getSubscriberByEmail).mockResolvedValue({
      subscriberId: 'sub-existing',
      email: 'visitor@example.test',
      status: 'subscribed',
      preferredLocale: 'ko',
      tags: ['legacy'],
      doubleOptInToken: 'tok-existing',
      unsubscribeToken: 'unsub-existing',
      source: 'public-form',
      createdAt: '2026-05-13T00:00:00Z',
      updatedAt: '2026-05-13T00:00:00Z',
    });
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ email: 'visitor@example.test', tags: ['newsletter'], marketingConsent: true }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.alreadySubscribed).toBe(true);
    expect(linkSubscriberToCrmContact).toHaveBeenCalledWith({
      email: 'visitor@example.test',
      preferredLocale: 'ko',
      source: 'public-form',
      tags: ['legacy', 'newsletter'],
    });
    expect(saveSubscriber).toHaveBeenCalledWith(
      expect.objectContaining({
        subscriberId: 'sub-existing',
        contactId: 'ct_linked',
        marketingConsent: expect.objectContaining({ source: 'public-form' }),
      }),
    );
    expect(sendTestEmail).not.toHaveBeenCalled();
  });

  it('honors honeypot company field with silent ok', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ email: 'bot@example.test', company: 'Acme Corp', marketingConsent: true }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true });
    expect(saveSubscriber).not.toHaveBeenCalled();
    expect(sendTestEmail).not.toHaveBeenCalled();
  });

  it('rejects malformed email with 400', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ email: 'not-an-email', preferredLocale: 'zh-hant', marketingConsent: true }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.errorCode).toBe('invalid_subscribe_payload');
    expect(payload.error).toBe('請確認訂閱資料。');
    expect(saveSubscriber).not.toHaveBeenCalled();
  });

  it('rejects public subscribe requests without explicit marketing consent', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ email: 'visitor@example.test', preferredLocale: 'en' }, '?locale=en'),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.errorCode).toBe('invalid_subscribe_payload');
    expect(saveSubscriber).not.toHaveBeenCalled();
    expect(linkSubscriberToCrmContact).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for invalid request bodies', async () => {
    const route = await import('../route');
    const response = await route.POST(postRawRequest('{', '?locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: 'Check the request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns 429 when the subscribe rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 8000 });
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ email: 'visitor@example.test', marketingConsent: true }, '?locale=en'),
    );
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload).toMatchObject({
      ok: false,
      error: 'Try again shortly.',
      errorCode: 'too_many_requests',
    });
  });
});
