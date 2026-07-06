import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearTranslationCache } from '@/lib/builder/translations/providers/router';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

function request(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/translations/translate-batch/stream', {
    method: 'POST',
    headers: {
      cookie: 'session=abc',
      authorization: 'Bearer token',
    },
    body: JSON.stringify(body),
  });
}

function openAiStreamFrame(content: string): string {
  return `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;
}

describe('builder translations translate-batch stream OpenAI upstream telemetry', () => {
  beforeEach(() => {
    clearTranslationCache();
    process.env.OPENAI_API_KEY = 'sk-test';
    process.env.OPENAI_TRANSLATION_INPUT_USD_PER_1M_TOKENS = '0.15';
    process.env.OPENAI_TRANSLATION_OUTPUT_USD_PER_1M_TOKENS = '0.60';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearTranslationCache();
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_TRANSLATION_INPUT_USD_PER_1M_TOKENS;
    delete process.env.OPENAI_TRANSLATION_OUTPUT_USD_PER_1M_TOKENS;
  });

  it('streams provider partial chunks before final batch results', async () => {
    let requestBody = '';
    vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      requestBody = typeof init?.body === 'string' ? init.body : '';
      const encoder = new TextEncoder();
      return new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(encoder.encode(openAiStreamFrame('{"items":[{"key":"title","text":"Ti')));
            controller.enqueue(encoder.encode(openAiStreamFrame('tle"}]}')));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              choices: [],
              usage: { prompt_tokens: 12, completion_tokens: 18, total_tokens: 30 },
            })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          },
        }),
        { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
      );
    }));

    const response = await POST(request({
      sourceLocale: 'ko',
      targetLocale: 'en',
      locale: 'ko',
      provider: 'openai',
      entries: [{ key: 'title', sourceText: '제목' }],
    }));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    expect(requestBody).toContain('"stream":true');
    expect(requestBody).toContain('"stream_options":{"include_usage":true}');
    expect(body.indexOf('"name":"provider-partial"')).toBeGreaterThanOrEqual(0);
    expect(body.indexOf('"name":"provider-result"')).toBeGreaterThan(body.indexOf('"name":"provider-partial"'));
    expect(body.indexOf('event: result')).toBeGreaterThan(body.indexOf('"name":"provider-result"'));
    expect(body).toContain('"chunkCount":1');
    expect(body).toContain('"partialCharacters":35');
    expect(body).toContain('"chunkCount":2');
    expect(body).toContain('"partialCharacters":42');
    const providerResponseIndex = body.indexOf('"name":"provider-response"');
    expect(body.indexOf('"chunkCount":2', providerResponseIndex)).toBeGreaterThan(providerResponseIndex);
    expect(body.indexOf('"partialCharacters":42', providerResponseIndex)).toBeGreaterThan(providerResponseIndex);
    expect(body.indexOf('"promptTokens":12', providerResponseIndex)).toBeGreaterThan(providerResponseIndex);
    expect(body.indexOf('"completionTokens":18', providerResponseIndex)).toBeGreaterThan(providerResponseIndex);
    expect(body.indexOf('"totalTokens":30', providerResponseIndex)).toBeGreaterThan(providerResponseIndex);
    expect(body.indexOf('"estimatedCostUsd":0.0000126', providerResponseIndex)).toBeGreaterThan(providerResponseIndex);
    expect(body).toContain('"text":"Title"');
  });
});
