import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  appendMessage,
  saveConversation,
} from '@/lib/builder/live-chat/storage';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 5, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/live-chat/storage', () => ({
  saveConversation: vi.fn(async () => undefined),
  appendMessage: vi.fn(async () => undefined),
  makeConversationId: vi.fn(() => 'cnv-test-1'),
  makeMessageId: vi.fn(() => 'msg-test-1'),
  makeVisitorToken: vi.fn(() => 'tok-test-1'),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  emitEvent: vi.fn(),
}));

function makeRequest(body: unknown, localeQuery = '', origin: string | null = 'https://tseng-law.com'): NextRequest {
  const query = localeQuery ? `?locale=${localeQuery}` : '';
  return new NextRequest(`https://tseng-law.com/api/live-chat/start${query}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '127.0.0.7',
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe('/api/live-chat/start', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 5, retryAfterMs: 0 });
  });

  it('creates a conversation, persists initial visitor message, and emits contact event', async () => {
    const route = await import('../route');
    const response = await route.POST(
      makeRequest({
        visitorName: '김민수',
        visitorEmail: 'kim@example.test',
        pagePath: '/ko/contact',
        message: '상담 가능한가요?',
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.conversationId).toBe('cnv-test-1');
    expect(payload.visitorToken).toBe('tok-test-1');
    expect(saveConversation).toHaveBeenCalledTimes(1);
    expect(appendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'visitor', body: '상담 가능한가요?' }),
    );
    expect(emitEvent).toHaveBeenCalledWith(
      'contact.created',
      expect.objectContaining({ source: 'live-chat', conversationId: 'cnv-test-1' }),
    );
  });

  it('rejects cross-origin requests before rate limiting, persistence, or events', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest({ message: '상담 가능한가요?' }, '', 'https://attacker.example'));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({ ok: false, error: 'csrf_origin_mismatch', code: 'csrf_origin_mismatch' });
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(saveConversation).not.toHaveBeenCalled();
    expect(appendMessage).not.toHaveBeenCalled();
    expect(emitEvent).not.toHaveBeenCalled();
  });

  it('returns localized 429 when the start rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 5000 });
    const route = await import('../route');
    const response = await route.POST(makeRequest({ message: '안녕하세요' }, 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload.errorCode).toBe('too_many_requests');
    expect(payload.error).toBe('請稍後再試。');
    expect(payload.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
    expect(saveConversation).not.toHaveBeenCalled();
  });

  it('rejects empty message with localized 400', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest({ message: '', locale: 'en' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.errorCode).toBe('invalid_payload');
    expect(payload.error).toBe('Check your message and try again.');
    expect(payload.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
    expect(saveConversation).not.toHaveBeenCalled();
  });

  it('rejects a body that is not valid JSON with 400', async () => {
    const route = await import('../route');
    const request = new NextRequest('https://tseng-law.com/api/live-chat/start?locale=en', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '127.0.0.7',
        origin: 'https://tseng-law.com',
      },
      body: 'not-json',
    });

    const response = await route.POST(request);
    const payload = await response.json();
    expect(response.status).toBe(400);
    expect(payload.errorCode).toBe('invalid_payload');
    expect(payload.error).toBe('Check your message and try again.');
  });
});
