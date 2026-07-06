import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  appendMessage,
  getConversation,
  saveConversation,
} from '@/lib/builder/live-chat/storage';
import type { ChatConversation } from '@/lib/builder/live-chat/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/live-chat/storage', () => ({
  getConversation: vi.fn(),
  appendMessage: vi.fn(async () => undefined),
  saveConversation: vi.fn(async () => undefined),
  makeMessageId: vi.fn(() => 'msg-admin-send'),
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

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/live-chat/cnv-1/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/live-chat/[conversationId]/send', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('appends an admin message with the default ko author label on happy path', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation());
    const route = await import('../route');
    const response = await route.POST(postRequest({ body: '안녕하세요, 박변호사입니다.' }), {
      params: { conversationId: 'cnv-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(appendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'admin', body: '안녕하세요, 박변호사입니다.', authorLabel: '관리자' }),
    );
    expect(saveConversation).toHaveBeenCalledTimes(1);
  });

  it('uses locale-specific default author labels when authorLabel is omitted', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation());
    const route = await import('../route');
    await route.POST(postRequest({ body: '您好', locale: 'zh-hant' }), {
      params: { conversationId: 'cnv-1' },
    });

    expect(appendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ authorLabel: '管理員' }),
    );
  });

  it('uses authorLabel from payload when provided', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation());
    const route = await import('../route');
    await route.POST(postRequest({ body: 'hi', authorLabel: '박변호사' }), {
      params: { conversationId: 'cnv-1' },
    });

    expect(appendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ authorLabel: '박변호사' }),
    );
  });

  it('rejects empty body with 400', async () => {
    vi.mocked(getConversation).mockResolvedValue(makeConversation());
    const route = await import('../route');
    const response = await route.POST(postRequest({ body: '   ', locale: 'zh-hant' }), {
      params: { conversationId: 'cnv-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.errorCode).toBe('invalid_payload');
    expect(payload.error).toBe('請確認訊息內容。');
    expect(payload.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
    expect(appendMessage).not.toHaveBeenCalled();
  });

  it('returns 404 when conversation is missing', async () => {
    vi.mocked(getConversation).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.POST(postRequest({ body: 'hi', locale: 'en' }), {
      params: { conversationId: 'cnv-missing' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Conversation not found.',
      errorCode: 'conversation_not_found',
    });
    expect(appendMessage).not.toHaveBeenCalled();
  });

  it('refuses anonymous admin callers (guardMutation deny)', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.POST(postRequest({ body: 'hi' }), {
      params: { conversationId: 'cnv-1' },
    });

    expect(response.status).toBe(401);
    expect(appendMessage).not.toHaveBeenCalled();
  });
});
