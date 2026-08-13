import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isSafeRedirectUrl,
  logClickEvent,
  resolveTrackingSecret,
  verifyTrackingToken,
} from '@/lib/builder/crm/tracking-model';

vi.mock('@/lib/builder/crm/tracking-model', () => ({
  isSafeRedirectUrl: vi.fn(() => true),
  logClickEvent: vi.fn(async () => undefined),
  resolveTrackingSecret: vi.fn(() => 'test-secret'),
  verifyTrackingToken: vi.fn(() => ({
    kind: 'click',
    contactId: 'contact-1',
    campaignId: 'campaign-1',
    url: 'https://client.example/path',
    iat: Date.now(),
  })),
}));

function getRequest(locale?: string): NextRequest {
  const url = new URL('https://law.example.test/api/builder/crm/tracking/click/token-1');
  if (locale) url.searchParams.set('locale', locale);
  return new NextRequest(url, {
    headers: {
      'user-agent': 'Unit Test',
      'x-forwarded-for': '127.0.0.31',
    },
  });
}

describe('/api/builder/crm/tracking/click/[token]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isSafeRedirectUrl).mockReturnValue(true);
    vi.mocked(resolveTrackingSecret).mockReturnValue('test-secret');
    vi.mocked(verifyTrackingToken).mockReturnValue({
      kind: 'click',
      contactId: 'contact-1',
      campaignId: 'campaign-1',
      url: 'https://client.example/path',
      iat: Date.now(),
    });
  });

  it('returns localized stable-code JSON when tracking is not configured', async () => {
    vi.mocked(resolveTrackingSecret).mockReturnValue(null);
    const route = await import('../route');
    const response = await route.GET(getRequest('zh-hant'), {
      params: Promise.resolve({ token: 'token-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      ok: false,
      error: '追蹤設定尚未完成。',
      errorCode: 'tracking_not_configured',
    });
  });

  it('returns localized stable-code JSON for invalid tracking tokens', async () => {
    vi.mocked(verifyTrackingToken).mockReturnValue(null);
    const route = await import('../route');
    const response = await route.GET(getRequest('ko'), {
      params: Promise.resolve({ token: 'bad-token' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toMatchObject({
      ok: false,
      error: '유효하지 않은 추적 토큰입니다.',
      errorCode: 'tracking_invalid_token',
    });
  });

  it('logs the click and redirects when the token is valid', async () => {
    const route = await import('../route');
    const response = await route.GET(getRequest(), {
      params: Promise.resolve({ token: 'token-1' }),
    });

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://client.example/path');
    expect(logClickEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        contactId: 'contact-1',
        campaignId: 'campaign-1',
        url: 'https://client.example/path',
        userAgent: 'Unit Test',
        ip: '127.0.0.31',
      }),
    );
  });
});
