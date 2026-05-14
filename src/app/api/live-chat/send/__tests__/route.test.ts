import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  appendMessage,
  getConversation,
  saveConversation,
} from '@/lib/builder/live-chat/storage';
import type { ChatConversation } from '@/lib/builder/live-chat/types';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 60, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/live-chat/storage', () => ({
  getConversation: vi.fn(),
  saveConversation: vi.fn(async () => undefined),
  appendMessage: vi.fn(async () => undefined),
  makeMessageId: vi.fn(() => 'msg-test-send'),
}));

function makeConversation(overrides: Partial<ChatConversation> = {}): ChatConversation {
  return {
    conversationId: 'cnv-1',
    visitorToken: 'tok-correct',
    visitorName: '김민수',
    status: 'open',
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T00:00:00Z',
    lastMessageAt: '2026-05-13T00:00:00Z',
    unreadByAdmin: 0,
    ...overrides,
  };
}

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/live-chat/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.8' },
    body: JSON.stringify(body),
  });
}

describe('/api/live-chat/send', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 60, retryAfterMs: 0 });
  });

  it('persists the visitor message and bumps unread count on happy path', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation({ unreadByAdmin: 2 }));
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ conversationId: 'cnv-1', visitorToken: 'tok-correct', body: '추가 질문 있어요' }),
    );

    expect(response.status).toBe(200);
    expect(appendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'visitor', body: '추가 질문 있어요' }),
    );
    expect(saveConversation).toHaveBeenCalledWith(
      expect.objectContaining({ unreadByAdmin: 3 }),
    );
  });

  it('returns 401 when the visitor token does not match', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation());
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ conversationId: 'cnv-1', visitorToken: 'tok-WRONG', body: 'hi' }),
    );

    expect(response.status).toBe(401);
    expect(appendMessage).not.toHaveBeenCalled();
  });

  it('returns 404 when the conversation does not exist', async () => {
    vi.mocked(getConversation).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ conversationId: 'cnv-missing', visitorToken: 'tok-correct', body: 'hi' }),
    );

    expect(response.status).toBe(404);
    expect(appendMessage).not.toHaveBeenCalled();
  });

  it('refuses to append to a closed conversation with 409', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation({ status: 'closed' }));
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ conversationId: 'cnv-1', visitorToken: 'tok-correct', body: 'hi' }),
    );

    expect(response.status).toBe(409);
    expect(appendMessage).not.toHaveBeenCalled();
  });

  it('returns 429 when the send rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 4000 });
    const route = await import('../route');
    const response = await route.POST(
      postRequest({ conversationId: 'cnv-1', visitorToken: 'tok-correct', body: 'hi' }),
    );

    expect(response.status).toBe(429);
  });
});
