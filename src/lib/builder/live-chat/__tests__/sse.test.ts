import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { listMessagesForConversation } from '@/lib/builder/live-chat/storage';
import { buildChatStream } from '@/lib/builder/live-chat/sse';

vi.mock('@/lib/builder/live-chat/storage', () => ({
  listMessagesForConversation: vi.fn(),
}));

const decoder = new TextDecoder();

function decode(value: Uint8Array | undefined): string {
  return decoder.decode(value);
}

describe('buildChatStream', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('emits a localized initial-load SSE error without leaking exception text', async () => {
    vi.useFakeTimers();
    vi.mocked(listMessagesForConversation).mockRejectedValueOnce(
      new Error('raw database exploded'),
    );

    const stream = buildChatStream({
      conversationId: 'cnv-1',
      observerRole: 'visitor',
      locale: 'zh-hant',
      pollMs: 500,
      maxDurationMs: 10_000,
    });
    const reader = stream.getReader();
    const { value } = await reader.read();

    await reader.cancel();
    await vi.runOnlyPendingTimersAsync();

    const event = decode(value);
    expect(event).toContain('event: error');
    expect(event).toContain('"error":"無法載入對話紀錄。"');
    expect(event).toContain('"errorCode":"stream_initial_failed"');
    expect(event).not.toContain('raw database exploded');
    expect(event).not.toContain('unknown');
  });

  it('emits a localized polling SSE error without leaking exception text', async () => {
    vi.useFakeTimers();
    vi.mocked(listMessagesForConversation)
      .mockResolvedValueOnce([])
      .mockRejectedValueOnce(new Error('raw poll exploded'));

    const stream = buildChatStream({
      conversationId: 'cnv-1',
      observerRole: 'admin',
      locale: 'en',
      pollMs: 500,
      maxDurationMs: 10_000,
    });
    const reader = stream.getReader();
    const ready = decode((await reader.read()).value);

    const pending = reader.read();
    await vi.advanceTimersByTimeAsync(500);
    const { value } = await pending;
    await reader.cancel();
    await vi.runOnlyPendingTimersAsync();

    const event = decode(value);
    expect(ready).toContain('event: ready');
    expect(event).toContain('event: error');
    expect(event).toContain('"error":"Could not check for new messages."');
    expect(event).toContain('"errorCode":"stream_poll_failed"');
    expect(event).not.toContain('raw poll exploded');
    expect(event).not.toContain('"poll"');
  });
});
