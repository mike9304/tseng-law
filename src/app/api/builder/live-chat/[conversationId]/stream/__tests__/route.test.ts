import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getConversation } from '@/lib/builder/live-chat/storage';
import { buildChatStream } from '@/lib/builder/live-chat/sse';
import type { ChatConversation } from '@/lib/builder/live-chat/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/live-chat/storage', () => ({
  getConversation: vi.fn(),
}));

vi.mock('@/lib/builder/live-chat/sse', () => ({
  buildChatStream: vi.fn(() => new ReadableStream()),
}));

function makeConversation(overrides: Partial<ChatConversation> = {}): ChatConversation {
  return {
    conversationId: 'cnv-1',
    visitorToken: 'tok-private',
    visitorName: '김민수',
    status: 'open',
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T00:00:00Z',
    lastMessageAt: '2026-05-13T00:00:00Z',
    unreadByAdmin: 0,
    ...overrides,
  };
}

describe('/api/builder/live-chat/[conversationId]/stream', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('passes the request locale into the admin SSE stream', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation());
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/live-chat/cnv-1/stream?locale=en'),
      { params: { conversationId: 'cnv-1' } },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    expect(buildChatStream).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationId: 'cnv-1',
        observerRole: 'admin',
        locale: 'en',
      }),
    );
  });

  it('returns localized not-found errors before opening the stream', async () => {
    vi.mocked(getConversation).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/live-chat/cnv-missing/stream?locale=zh-hant'),
      { params: { conversationId: 'cnv-missing' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.errorCode).toBe('conversation_not_found');
    expect(payload.error).toBe('找不到這段對話。');
    expect(buildChatStream).not.toHaveBeenCalled();
  });

  it('refuses anonymous admin stream callers before loading the conversation', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/live-chat/cnv-1/stream?locale=zh-hant'),
      { params: { conversationId: 'cnv-1' } },
    );

    expect(response.status).toBe(401);
    expect(getConversation).not.toHaveBeenCalled();
    expect(buildChatStream).not.toHaveBeenCalled();
  });
});
