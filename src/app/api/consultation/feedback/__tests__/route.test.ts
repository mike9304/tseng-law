import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordConsultationFeedback } from '@/lib/consultation/feedback-store';
import { logConsultationFunnelEvent } from '@/lib/consultation/log-store';
import { checkChatRateLimit } from '@/lib/consultation/rate-limit';
import { sendNegativeFeedbackAlert } from '@/lib/email/send-consultation-email';

vi.mock('@/lib/consultation/feedback-store', () => ({
  clipFeedbackComment: vi.fn((comment: string) => comment),
  recordConsultationFeedback: vi.fn(async () => ({ accepted: true })),
}));

vi.mock('@/lib/consultation/log-store', () => ({
  logConsultationFunnelEvent: vi.fn(async () => undefined),
}));

vi.mock('@/lib/consultation/rate-limit', () => ({
  checkChatRateLimit: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/email/send-consultation-email', () => ({
  sendNegativeFeedbackAlert: vi.fn(async () => undefined),
}));

describe('/api/consultation/feedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkChatRateLimit).mockReturnValue({ allowed: true, retryAfterMs: 0 });
    vi.mocked(recordConsultationFeedback).mockResolvedValue({ accepted: true });
  });

  it.each([
    ['missing Origin and Referer', undefined],
    ['a cross-origin Origin', 'https://attacker.example'],
  ])('rejects %s before rate limiting, storage, logging, or email', async (_label, origin) => {
    const route = await import('../route');
    const response = await route.POST(makeRequest(origin));

    expect(response.status).toBe(403);
    expect(checkChatRateLimit).not.toHaveBeenCalled();
    expect(recordConsultationFeedback).not.toHaveBeenCalled();
    expect(logConsultationFunnelEvent).not.toHaveBeenCalled();
    expect(sendNegativeFeedbackAlert).not.toHaveBeenCalled();
  });

  it('allows a same-origin request through the existing rate and storage flow', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest('https://tseng-law.com'));

    expect(response.status).toBe(200);
    expect(checkChatRateLimit).toHaveBeenCalledOnce();
    expect(recordConsultationFeedback).toHaveBeenCalledOnce();
    expect(logConsultationFunnelEvent).toHaveBeenCalledOnce();
    expect(sendNegativeFeedbackAlert).not.toHaveBeenCalled();
  });
});

function makeRequest(origin?: string): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (origin) headers.set('origin', origin);
  return new NextRequest('https://tseng-law.com/api/consultation/feedback', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locale: 'ko',
      sessionId: 'session-123',
      messageId: 'message-123',
      rating: 'helpful',
    }),
  });
}
