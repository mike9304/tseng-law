import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getRecipientByToken,
  saveRecipient,
} from '@/lib/builder/marketing/campaign-storage';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 59, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/marketing/campaign-storage', () => ({
  getRecipientByToken: vi.fn(async () => null),
  saveRecipient: vi.fn(async () => undefined),
}));

describe('/api/marketing/track', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 59, retryAfterMs: 0 });
    vi.mocked(getRecipientByToken).mockResolvedValue(null);
    vi.mocked(saveRecipient).mockResolvedValue(undefined);
  });

  it('redirects to http and https campaign targets only', async () => {
    const route = await import('../route');
    const response = await route.GET(makeRequest('https://client.example/path?x=1'));

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://client.example/path?x=1');
  });

  it('rejects unsafe campaign redirect protocols', async () => {
    const route = await import('../route');
    const response = await route.GET(makeRequest('javascript:alert(document.domain)'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Invalid redirect');
  });
});

function makeRequest(target: string): NextRequest {
  const url = new URL('https://law.example.test/api/marketing/track');
  url.searchParams.set('token', 'recipient-token');
  url.searchParams.set('u', target);
  return new NextRequest(url, {
    headers: { 'x-forwarded-for': '127.0.0.42' },
  });
}
