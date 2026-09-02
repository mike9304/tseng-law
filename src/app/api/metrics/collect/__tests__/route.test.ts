import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { enrichEvents } from '@/lib/metrics/enrich-events';
import { saveVisitEventBatch } from '@/lib/metrics/visit-store';

vi.mock('@/lib/builder/security/rate-limit', () => ({ checkRateLimit: vi.fn() }));
vi.mock('@/lib/metrics/enrich-events', () => ({ enrichEvents: vi.fn((events) => events) }));
vi.mock('@/lib/metrics/visit-store', () => ({ saveVisitEventBatch: vi.fn() }));

const event = { v: 1, sid: 'visitor_123', ts: '2026-09-01T01:00:00.000Z', type: 'pageview', path: '/ko', locale: 'ko', firstLoad: true };
function request(body: string, headers: Record<string, string> = {}) {
  return new NextRequest('https://tseng-law.com/api/metrics/collect', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.1, 10.0.0.1', ...headers }, body });
}

describe('/api/metrics/collect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 119, retryAfterMs: 0 });
    vi.mocked(saveVisitEventBatch).mockResolvedValue(undefined);
  });

  it('drops bot requests before rate limiting', async () => {
    const { POST } = await import('../route');
    const response = await POST(request(JSON.stringify({ events: [event] }), { 'user-agent': 'curl/8.0' }));
    expect(response.status).toBe(204);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('enriches and saves a normal batch', async () => {
    const { POST } = await import('../route');
    const response = await POST(request(JSON.stringify({ events: [event] }), { 'x-vercel-ip-country': 'KR' }));
    expect(response.status).toBe(204);
    expect(checkRateLimit).toHaveBeenCalledWith('visit-collect:203.0.113.1', 120, 60_000);
    expect(enrichEvents).toHaveBeenCalledWith([event], expect.objectContaining({ country: 'KR', now: expect.any(Date) }));
    expect(saveVisitEventBatch).toHaveBeenCalledWith([event]);
  });

  it('rejects more than 25 events', async () => {
    const { POST } = await import('../route');
    const response = await POST(request(JSON.stringify({ events: Array.from({ length: 26 }, () => event) })));
    expect(response.status).toBe(400);
    expect(saveVisitEventBatch).not.toHaveBeenCalled();
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('rejects malformed JSON', async () => {
    const { POST } = await import('../route');
    const response = await POST(request('{'));
    expect(response.status).toBe(400);
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('rejects declared and actual oversized bodies before rate limiting', async () => {
    const { POST } = await import('../route');
    const declared = await POST(request(JSON.stringify({ events: [event] }), { 'content-length': '32769' }));
    expect(declared.status).toBe(413);
    expect(declared.headers.get('cache-control')).toContain('no-store');
    expect(checkRateLimit).not.toHaveBeenCalled();
    const actual = await POST(request('x'.repeat(32769)));
    expect(actual.status).toBe(413);
    expect(actual.headers.get('cache-control')).toContain('no-store');
    expect(checkRateLimit).not.toHaveBeenCalled();
  });

  it('returns an explicit no-store 405 for GET', async () => {
    const { GET, PUT } = await import('../route');
    const response = GET();
    expect(response.status).toBe(405);
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(response.headers.get('allow')).toBe('POST');
    expect(PUT().status).toBe(405);
  });

  it('returns 429 when rate limited', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, retryAfterMs: 10 });
    const { POST } = await import('../route');
    const response = await POST(request(JSON.stringify({ events: [event] })));
    expect(response.status).toBe(429);
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('logs a storage failure but still returns 204', async () => {
    vi.mocked(saveVisitEventBatch).mockRejectedValueOnce(new Error('storage unavailable'));
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { POST } = await import('../route');
    const response = await POST(request(JSON.stringify({ events: [event] })));
    expect(response.status).toBe(204);
    expect(error).toHaveBeenCalled();
    expect(response.headers.get('cache-control')).toContain('no-store');
    error.mockRestore();
  });
});
