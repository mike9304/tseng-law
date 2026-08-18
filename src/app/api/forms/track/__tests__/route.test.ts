import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { appendFunnelEvent } from '@/lib/builder/forms/funnel/storage';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/forms/funnel/storage', () => ({
  appendFunnelEvent: vi.fn(async () => undefined),
}));

function request(origin: string | null = 'https://tseng-law.com'): NextRequest {
  return new NextRequest('https://tseng-law.com/api/forms/track', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.10',
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify({ formId: 'contact-form', kind: 'submit', stepIndex: 1 }),
  });
}

describe('/api/forms/track', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, retryAfterMs: 0 } as never);
  });

  it('records same-origin funnel events', async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(checkRateLimit).toHaveBeenCalledTimes(1);
    expect(appendFunnelEvent).toHaveBeenCalledWith(expect.objectContaining({
      formId: 'contact-form',
      kind: 'submit',
      stepIndex: 1,
    }));
  });

  it('rejects cross-origin requests before rate limiting or event storage', async () => {
    const response = await POST(request('https://attacker.example'));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({ ok: false, error: 'csrf_origin_mismatch', code: 'csrf_origin_mismatch' });
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(appendFunnelEvent).not.toHaveBeenCalled();
  });
});
