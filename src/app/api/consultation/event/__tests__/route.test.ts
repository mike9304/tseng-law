import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { logConsultationFunnelEvent } from '@/lib/consultation/log-store';
import { checkChatRateLimit } from '@/lib/consultation/rate-limit';

vi.mock('@/lib/consultation/log-store', () => ({
  logConsultationFunnelEvent: vi.fn(async () => undefined),
}));

vi.mock('@/lib/consultation/rate-limit', () => ({
  checkChatRateLimit: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
}));

describe('/api/consultation/event', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkChatRateLimit).mockReturnValue({ allowed: true, retryAfterMs: 0 });
  });

  it.each([
    ['missing Origin and Referer', undefined],
    ['a cross-origin Origin', 'https://attacker.example'],
  ])('rejects %s before rate limiting or log storage', async (_label, origin) => {
    const route = await import('../route');
    const response = await route.POST(makeRequest(origin));

    expect(response.status).toBe(403);
    expect(checkChatRateLimit).not.toHaveBeenCalled();
    expect(logConsultationFunnelEvent).not.toHaveBeenCalled();
  });

  it('allows a same-origin request through the existing rate and logging flow', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest('https://tseng-law.com'));

    expect(response.status).toBe(200);
    expect(checkChatRateLimit).toHaveBeenCalledOnce();
    expect(logConsultationFunnelEvent).toHaveBeenCalledOnce();
  });
});

function makeRequest(origin?: string): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (origin) headers.set('origin', origin);
  return new NextRequest('https://tseng-law.com/api/consultation/event', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locale: 'ko',
      sessionId: 'session-123',
      stage: 'session_started',
    }),
  });
}
