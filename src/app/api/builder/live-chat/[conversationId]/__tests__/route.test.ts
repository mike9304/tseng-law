import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getConversation,
  listMessagesForConversation,
  saveConversation,
} from '@/lib/builder/live-chat/storage';
import type { ChatConversation } from '@/lib/builder/live-chat/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/live-chat/storage', () => ({
  getConversation: vi.fn(),
  listMessagesForConversation: vi.fn(async () => []),
  saveConversation: vi.fn(async () => undefined),
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
    unreadByAdmin: 3,
    ...overrides,
  };
}

function patchRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/live-chat/cnv-1', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/live-chat/[conversationId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('returns messages and resets unread count on GET', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation({ unreadByAdmin: 3 }));
    vi.mocked(listMessagesForConversation).mockResolvedValue([
      { messageId: 'm1', conversationId: 'cnv-1', role: 'visitor', body: 'hi', at: '2026-05-13T00:01:00Z' },
    ]);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/live-chat/cnv-1'),
      { params: { conversationId: 'cnv-1' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.conversation.visitorToken).toBeUndefined();
    expect(payload.messages).toHaveLength(1);
    expect(saveConversation).toHaveBeenCalledWith(
      expect.objectContaining({ unreadByAdmin: 0 }),
    );
  });

  it('does not bump storage when there is nothing unread', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation({ unreadByAdmin: 0 }));
    const route = await import('../route');
    await route.GET(
      new NextRequest('https://law.example.test/api/builder/live-chat/cnv-1'),
      { params: { conversationId: 'cnv-1' } },
    );

    expect(saveConversation).not.toHaveBeenCalled();
  });

  it('returns 404 on GET when the conversation is missing', async () => {
    vi.mocked(getConversation).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/live-chat/cnv-missing?locale=zh-hant'),
      { params: { conversationId: 'cnv-missing' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.errorCode).toBe('conversation_not_found');
    expect(payload.error).toBe('找不到這段對話。');
    expect(payload.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('closes a conversation on PATCH status=closed', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation({ status: 'open' }));
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'closed' }), {
      params: { conversationId: 'cnv-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(saveConversation).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'closed' }),
    );
  });

  it('preserves existing status when PATCH body omits status', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation({ status: 'open' }));
    const route = await import('../route');
    await route.PATCH(patchRequest({}), { params: { conversationId: 'cnv-1' } });

    expect(saveConversation).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'open' }),
    );
  });

  it('returns localized 404 on PATCH when the conversation is missing', async () => {
    vi.mocked(getConversation).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ locale: 'en', status: 'closed' }), {
      params: { conversationId: 'cnv-missing' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Conversation not found.',
      errorCode: 'conversation_not_found',
    });
    expect(saveConversation).not.toHaveBeenCalled();
  });

  it('refuses anonymous callers on GET (guardMutation deny)', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/live-chat/cnv-1'),
      { params: { conversationId: 'cnv-1' } },
    );

    expect(response.status).toBe(401);
    expect(getConversation).not.toHaveBeenCalled();
  });
});
