import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { translateBatchViaRouter } from '@/lib/builder/translations/providers/router';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/translations/providers/router', () => ({
  translateBatchViaRouter: vi.fn(),
}));

const translateBatchViaRouterMock = vi.mocked(translateBatchViaRouter);

function request(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/translations/translate-batch/stream', {
    method: 'POST',
    headers: {
      cookie: 'session=abc',
      authorization: 'Bearer token',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder translations translate-batch stream API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('streams provider progress before final batch results', async () => {
    translateBatchViaRouterMock.mockImplementationOnce(async (args) => {
      args.onProgress?.({
        provider: 'mock',
        mode: 'native-batch',
        requested: 1,
        succeeded: 0,
        failed: 0,
      });
      return {
        results: [{ key: 'page:home:title', ok: true, provider: 'mock', text: 'Hello' }],
        summary: {
          provider: 'mock',
          mode: 'native-batch',
          requested: 1,
          succeeded: 1,
          failed: 0,
        },
      };
    });

    const response = await POST(request({
      sourceLocale: 'ko',
      targetLocale: 'en',
      locale: 'ko',
      provider: 'mock',
      entries: [{ key: 'page:home:title', sourceText: '안녕하세요' }],
    }));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    expect(body.indexOf('event: progress')).toBeGreaterThanOrEqual(0);
    expect(body.indexOf('event: result')).toBeGreaterThan(body.indexOf('event: progress'));
    expect(body.indexOf('"sequence":1')).toBeGreaterThan(body.indexOf('event: progress'));
    expect(body.indexOf('"sequence":2')).toBeGreaterThan(body.indexOf('"sequence":1'));
    expect(body).toContain('"succeeded":0');
    expect(body).toContain('"succeeded":1');
  });
});
