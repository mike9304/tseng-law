import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearTranslationCache,
  translateBatchViaRouter,
} from '@/lib/builder/translations/providers/router';
import type { TranslationProviderBatchProgress } from '@/lib/builder/translations/providers/types';

describe('translation batch provider result progress', () => {
  beforeEach(() => {
    clearTranslationCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_TRANSLATION_INPUT_USD_PER_1M_TOKENS;
    delete process.env.OPENAI_TRANSLATION_OUTPUT_USD_PER_1M_TOKENS;
    delete process.env.TRANSLATION_PROVIDER;
  });

  it('emits item-level provider result progress before final native batch completion', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(10_000)
      .mockReturnValue(10_084);
    vi.stubGlobal('fetch', vi.fn(async () => {
      const encoder = new TextEncoder();
      const content = JSON.stringify({
        items: [
          { key: 'title', text: 'Title' },
          { key: 'body', text: 'Body' },
        ],
      });
      return new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          },
        }),
        { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
      );
    }));
    const progress: TranslationProviderBatchProgress[] = [];

    await translateBatchViaRouter({
      sourceLocale: 'ko',
      targetLocale: 'en',
      preferProvider: 'openai',
      items: [
        { key: 'title', sourceText: '제목' },
        { key: 'body', sourceText: '본문' },
      ],
      onProgress: (event) => {
        progress.push(event);
      },
    });

    const providerResults = progress.filter((event) => event.step?.name === 'provider-result');
    expect(providerResults.map((event) => event.step?.succeeded)).toEqual([1, 2]);
    expect(providerResults.map((event) => event.step?.failed)).toEqual([0, 0]);
    expect(providerResults.map((event) => event.step?.durationMs)).toEqual([84, 84]);
    expect(progress.map((event) => event.step?.name).at(-1)).toBe('provider-response');
  });

  it('emits provider partial progress while OpenAI streams batch content', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    process.env.OPENAI_TRANSLATION_INPUT_USD_PER_1M_TOKENS = '0.15';
    process.env.OPENAI_TRANSLATION_OUTPUT_USD_PER_1M_TOKENS = '0.60';
    let requestBody = '';
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(20_000)
      .mockReturnValue(20_042);
    vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      requestBody = typeof init?.body === 'string' ? init.body : '';
      const encoder = new TextEncoder();
      const frame = (content: string): string => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;
      return new Response(
        requestBody.includes('"stream":true')
          ? new ReadableStream<Uint8Array>({
              start(controller) {
                controller.enqueue(encoder.encode(frame('{"items":[{"key":"title","text":"Ti')));
                controller.enqueue(encoder.encode(frame('tle"}]}')));
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  choices: [],
                  usage: { prompt_tokens: 12, completion_tokens: 18, total_tokens: 30 },
                })}\n\n`));
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
              },
            })
          : JSON.stringify({
              choices: [{
                message: {
                  content: JSON.stringify({ items: [{ key: 'title', text: 'Title' }] }),
                },
              }],
            }),
        { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
      );
    }));
    const progress: TranslationProviderBatchProgress[] = [];

    const result = await translateBatchViaRouter({
      sourceLocale: 'ko',
      targetLocale: 'en',
      preferProvider: 'openai',
      items: [{ key: 'title', sourceText: '제목' }],
      onProgress: (event) => {
        progress.push(event);
      },
    });

    expect(requestBody).toContain('"stream":true');
    expect(requestBody).toContain('"stream_options":{"include_usage":true}');
    expect(result.results).toEqual([{ key: 'title', ok: true, provider: 'openai', text: 'Title' }]);
    const partials = progress.filter((event) => event.step?.name === 'provider-partial');
    expect(partials.map((event) => event.step?.partialCharacters)).toEqual([35, 42]);
    expect(partials.map((event) => event.step?.chunkCount)).toEqual([1, 2]);
    const finalStep = progress.at(-1)?.step as TranslationProviderBatchProgress['step'] & {
      readonly promptTokens?: number;
      readonly completionTokens?: number;
      readonly totalTokens?: number;
      readonly estimatedCostUsd?: number;
    };
    expect(finalStep).toMatchObject({
      name: 'provider-response',
      partialCharacters: 42,
      chunkCount: 2,
      promptTokens: 12,
      completionTokens: 18,
      totalTokens: 30,
    });
    expect(finalStep.estimatedCostUsd).toBeCloseTo(0.0000126);
    expect(progress.map((event) => event.step?.name)).toEqual([
      'provider-selected',
      'cache-checked',
      'provider-request',
      'provider-partial',
      'provider-partial',
      'provider-result',
      'provider-response',
    ]);
  });
});
