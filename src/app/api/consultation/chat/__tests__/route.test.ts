import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  generateConsultationChatResponse,
  streamConsultationChatResponse,
} from '@/lib/consultation/engine';
import {
  logConsultationChatEvent,
  logConsultationFunnelEvent,
} from '@/lib/consultation/log-store';
import { checkChatRateLimit } from '@/lib/consultation/rate-limit';

vi.mock('@/lib/consultation/engine', () => ({
  generateConsultationChatResponse: vi.fn(async () => ({
    success: true,
    message: 'Response',
    classification: 'general',
    riskLevel: 'L1',
    shouldEscalate: false,
    referencedColumns: [],
    referencedKnowledgeIds: [],
  })),
  streamConsultationChatResponse: vi.fn(),
}));

vi.mock('@/lib/consultation/log-store', () => ({
  logConsultationChatEvent: vi.fn(async () => undefined),
  logConsultationFunnelEvent: vi.fn(async () => undefined),
}));

vi.mock('@/lib/consultation/rate-limit', () => ({
  checkChatRateLimit: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
}));

describe('/api/consultation/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkChatRateLimit).mockReturnValue({ allowed: true, retryAfterMs: 0 });
    vi.mocked(generateConsultationChatResponse).mockResolvedValue({
      success: true,
      message: 'Response',
      classification: 'general',
      riskLevel: 'L1',
      shouldEscalate: false,
      referencedColumns: [],
      referencedKnowledgeIds: [],
    } as never);
  });

  it.each([
    ['missing Origin and Referer', undefined],
    ['a cross-origin Origin', 'https://attacker.example'],
  ])('rejects %s before rate limiting, logging, or invoking the LLM engine', async (_label, origin) => {
    const route = await import('../route');
    const response = await route.POST(makeRequest(origin));

    expect(response.status).toBe(403);
    expect(checkChatRateLimit).not.toHaveBeenCalled();
    expect(logConsultationFunnelEvent).not.toHaveBeenCalled();
    expect(logConsultationChatEvent).not.toHaveBeenCalled();
    expect(generateConsultationChatResponse).not.toHaveBeenCalled();
    expect(streamConsultationChatResponse).not.toHaveBeenCalled();
  });

  it('allows a same-origin request through the existing rate and LLM flow', async () => {
    const route = await import('../route');
    const response = await route.POST(makeRequest('https://tseng-law.com'));

    expect(response.status).toBe(200);
    expect(checkChatRateLimit).toHaveBeenCalledOnce();
    expect(generateConsultationChatResponse).toHaveBeenCalledOnce();
    expect(logConsultationFunnelEvent).toHaveBeenCalled();
    expect(logConsultationChatEvent).toHaveBeenCalledOnce();
  });

  it('redacts stream exceptions and sends a private non-cacheable SSE response', async () => {
    const sensitiveMarker = 'SENSITIVE_STREAM_email=client@example.com';
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(streamConsultationChatResponse).mockImplementationOnce((async function* () {
      throw new Error(sensitiveMarker);
    }) as never);

    const route = await import('../route');
    const response = await route.POST(makeRequest('https://tseng-law.com', true));
    const eventData = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('private, no-store, no-transform');
    expect(eventData).toContain('"type":"error"');
    expect(eventData).toContain('Unable to continue this chat right now. Please try again or contact the firm directly.');
    expect(eventData).not.toContain(sensitiveMarker);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[consultation] operation failed',
      'chat_stream_failed',
      'Error',
    );
    expect(consoleSpy.mock.calls.flat().join(' ')).not.toContain(sensitiveMarker);
  });
});

function makeRequest(origin?: string, stream = false): NextRequest {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (origin) headers.set('origin', origin);
  return new NextRequest('https://tseng-law.com/api/consultation/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locale: 'ko',
      sessionId: 'session-123',
      message: 'Please help.',
      stream,
    }),
  });
}
