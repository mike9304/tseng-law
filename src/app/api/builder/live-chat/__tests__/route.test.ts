import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { listConversations } from '@/lib/builder/live-chat/storage';
import type { ChatConversation } from '@/lib/builder/live-chat/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/live-chat/storage', () => ({
  listConversations: vi.fn(async () => []),
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
    unreadByAdmin: 1,
    ...overrides,
  };
}

describe('/api/builder/live-chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('returns conversations stripped of visitorToken on GET', async () => {
    vi.mocked(listConversations).mockResolvedValue([
      makeConversation({ conversationId: 'cnv-1' }),
      makeConversation({ conversationId: 'cnv-2', status: 'closed' }),
    ]);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/live-chat'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.total).toBe(2);
    expect(payload.conversations).toHaveLength(2);
    expect(payload.conversations[0].visitorToken).toBeUndefined();
    expect(payload.conversations[0].conversationId).toBe('cnv-1');
  });

  it('refuses anonymous callers (guardMutation deny)', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/live-chat'),
    );

    expect(response.status).toBe(401);
    expect(listConversations).not.toHaveBeenCalled();
  });
});
