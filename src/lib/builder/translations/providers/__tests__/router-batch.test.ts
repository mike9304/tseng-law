import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearTranslationCache,
  translateBatchViaRouter,
} from '@/lib/builder/translations/providers/router';
import { deeplProvider } from '@/lib/builder/translations/providers/deepl';
import type { TranslationProviderBatchProgress } from '@/lib/builder/translations/providers/types';

function openAiBatchStreamResponse(content: string): Response {
  const encoder = new TextEncoder();
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
}

describe('translation batch router', () => {
  beforeEach(() => {
    clearTranslationCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.OPENAI_API_KEY;
    delete process.env.DEEPL_API_KEY;
    delete process.env.TRANSLATION_PROVIDER;
  });

  it('uses provider-native batch translation for multiple uncached entries', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const fetchMock = vi.fn(async () => new Response(
      JSON.stringify({
        choices: [{
          message: {
            content: JSON.stringify({
              items: [
                { key: 'title', text: 'Title' },
                { key: 'body', text: 'Body' },
              ],
            }),
          },
        }],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ));
    vi.stubGlobal('fetch', fetchMock);

    const result = await translateBatchViaRouter({
      sourceLocale: 'ko',
      targetLocale: 'en',
      preferProvider: 'openai',
      items: [
        { key: 'title', sourceText: '제목' },
        { key: 'body', sourceText: '본문' },
      ],
    });

    expect(result).toEqual({
      results: [
        { key: 'title', ok: true, provider: 'openai', text: 'Title' },
        { key: 'body', ok: true, provider: 'openai', text: 'Body' },
      ],
      summary: {
        provider: 'openai',
        mode: 'native-batch',
        requested: 2,
        succeeded: 2,
        failed: 0,
      },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('emits provider progress before native batch translation resolves', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    let releaseFetch: () => void = () => undefined;
    const fetchGate = new Promise<void>((resolve) => {
      releaseFetch = resolve;
    });
    const fetchMock = vi.fn(async () => {
      await fetchGate;
      return openAiBatchStreamResponse(JSON.stringify({
        items: [{ key: 'title', text: 'Title' }],
      }));
    });
    vi.stubGlobal('fetch', fetchMock);
    const progress: TranslationProviderBatchProgress[] = [];

    const resultPromise = translateBatchViaRouter({
      sourceLocale: 'ko',
      targetLocale: 'en',
      preferProvider: 'openai',
      items: [{ key: 'title', sourceText: '제목' }],
      onProgress: (event) => {
        progress.push(event);
      },
    });

    expect(progress.map((event) => event.step?.name)).toEqual([
      'provider-selected',
      'cache-checked',
      'provider-request',
    ]);

    releaseFetch();
    await expect(resultPromise).resolves.toMatchObject({
      summary: {
        provider: 'openai',
        mode: 'native-batch',
        requested: 1,
        succeeded: 1,
        failed: 0,
      },
    });
  });

  it('emits provider step telemetry across cache check and native provider request', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    let currentTime = 10_000;
    vi.spyOn(Date, 'now').mockImplementation(() => currentTime);
    const fetchMock = vi.fn(async () => {
      currentTime = 10_147;
      return openAiBatchStreamResponse(JSON.stringify({
        items: [{ key: 'body', text: 'Body' }],
      }));
    });
    vi.stubGlobal('fetch', fetchMock);
    const progress: TranslationProviderBatchProgress[] = [];

    await translateBatchViaRouter({
      sourceLocale: 'ko',
      targetLocale: 'en',
      preferProvider: 'openai',
      items: [{ key: 'body', sourceText: '본문' }],
      onProgress: (event) => {
        progress.push(event);
      },
    });

    expect(progress
      .map((event) => event.step?.name)
      .filter((name) => name !== 'provider-result')).toEqual([
      'provider-selected',
      'cache-checked',
      'provider-request',
      'provider-partial',
      'provider-response',
    ]);
    expect(progress.find((event) => event.step?.name === 'provider-request')?.step).toMatchObject({
      provider: 'openai',
      mode: 'native-batch',
      requested: 1,
      cached: 0,
      sent: 1,
      succeeded: 0,
      failed: 0,
    });
    expect(progress.at(-1)?.step).toMatchObject({
      name: 'provider-response',
      succeeded: 1,
      failed: 0,
      durationMs: 147,
    });
    expect(progress.find((event) => event.step?.name === 'provider-partial')?.step).toMatchObject({
      name: 'provider-partial',
      partialCharacters: 40,
      chunkCount: 1,
      durationMs: 147,
    });
  });

  it('sends one DeepL request with multiple text fields for provider-native batches', async () => {
    process.env.DEEPL_API_KEY = 'deepl-test:fx';
    let requestBody = '';
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      requestBody = typeof init?.body === 'string' ? init.body : '';
      return new Response(
        JSON.stringify({ translations: [{ text: 'Title' }, { text: 'Body' }] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await deeplProvider.translateBatch?.({
      sourceLocale: 'ko',
      targetLocale: 'en',
      items: [
        { key: 'title', sourceText: '제목' },
        { key: 'body', sourceText: '본문' },
      ],
    });

    expect(result).toEqual({
      results: [
        { key: 'title', ok: true, provider: 'deepl', text: 'Title' },
        { key: 'body', ok: true, provider: 'deepl', text: 'Body' },
      ],
      summary: {
        provider: 'deepl',
        mode: 'native-batch',
        requested: 2,
        succeeded: 2,
        failed: 0,
      },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(requestBody).toContain('text=');
    expect(requestBody.match(/text=/g)?.length).toBe(2);
  });
});
