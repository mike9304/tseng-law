import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildChatStream } from '@/lib/builder/live-chat/sse';
import { getConversation } from '@/lib/builder/live-chat/storage';
import type { ChatConversation } from '@/lib/builder/live-chat/types';

vi.mock('@/lib/builder/live-chat/storage', () => ({
  getConversation: vi.fn(),
}));

vi.mock('@/lib/builder/live-chat/sse', () => ({
  buildChatStream: vi.fn(() => new ReadableStream()),
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

describe('/api/live-chat/stream', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns zh-hant invalid-payload errors when required query params are missing', async () => {
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/live-chat/stream?locale=zh-hant'),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.errorCode).toBe('invalid_payload');
    expect(payload.error).toBe('請確認訊息內容後再送出。');
    expect(payload.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en not-found errors when the conversation is missing', async () => {
    vi.mocked(getConversation).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/live-chat/stream?conversationId=cnv-missing&visitorToken=tok-correct&locale=en'),
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.errorCode).toBe('conversation_not_found');
    expect(payload.error).toBe('This conversation could not be found. Please start again.');
    expect(payload.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns ko unauthorized errors when the token does not match', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation());
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/live-chat/stream?conversationId=cnv-1&visitorToken=wrong&locale=ko'),
    );
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.errorCode).toBe('unauthorized');
    expect(payload.error).toBe('대화를 확인할 수 없습니다. 다시 시작해 주세요.');
  });

  it('passes the request locale into the visitor SSE stream', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation());
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/live-chat/stream?conversationId=cnv-1&visitorToken=tok-correct&locale=zh-hant'),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    expect(response.headers.get('cache-control')).toBe('private, no-store, no-transform');
    expect(response.headers.get('connection')).toBe('keep-alive');
    expect(buildChatStream).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationId: 'cnv-1',
        observerRole: 'visitor',
        locale: 'zh-hant',
      }),
    );
  });
});
