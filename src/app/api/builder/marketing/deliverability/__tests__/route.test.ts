import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { sendMarketingEmail } from '@/lib/builder/marketing/email-provider';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'manage-campaigns' })),
}));

vi.mock('@/lib/builder/marketing/email-provider', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/builder/marketing/email-provider')>();
  return {
    ...original,
    sendMarketingEmail: vi.fn(async () => ({ ok: true, provider: 'resend', id: 'rs-test' })),
  };
});

function request(path: string, body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.31' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

describe('/api/builder/marketing/deliverability', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://tseng-law.com',
    };
    delete process.env.MARKETING_EMAIL_PROVIDER;
    delete process.env.RESEND_API_KEY;
    delete process.env.MAILCHIMP_TRANSACTIONAL_API_KEY;
  });

  it('returns a guarded production readiness report without exposing provider secrets', async () => {
    process.env.MARKETING_EMAIL_PROVIDER = 'resend';
    process.env.RESEND_API_KEY = 'rs-secret';
    const route = await import('../route');
    const response = await route.GET(request('/api/builder/marketing/deliverability?locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      report: {
        provider: 'resend',
        ok: true,
      },
    });
    expect(JSON.stringify(payload)).not.toContain('rs-secret');
    expect(guardMutation).toHaveBeenCalled();
  });

  it('sends a guarded deliverability test message through the configured provider', async () => {
    process.env.MARKETING_EMAIL_PROVIDER = 'resend';
    process.env.RESEND_API_KEY = 'rs-secret';
    const route = await import('../route');
    const response = await route.POST(
      request('/api/builder/marketing/deliverability?locale=en', {
        testEmail: 'owner@example.test',
        fromAddress: 'bookings@tseng-law.com',
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ ok: true, mode: 'test', provider: 'resend' });
    expect(sendMarketingEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'owner@example.test',
        fromAddress: 'bookings@tseng-law.com',
      }),
    );
  });

  it('blocks production test-send when no real provider is configured', async () => {
    const route = await import('../route');
    const response = await route.POST(
      request('/api/builder/marketing/deliverability?locale=en', {
        testEmail: 'owner@example.test',
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toMatchObject({
      ok: false,
      errorCode: 'deliverability_check_failed',
    });
    expect(sendMarketingEmail).not.toHaveBeenCalled();
  });

  it('refuses anonymous callers', async () => {
    vi.mocked(guardMutation).mockResolvedValueOnce(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.GET(request('/api/builder/marketing/deliverability'));

    expect(response.status).toBe(401);
  });
});
