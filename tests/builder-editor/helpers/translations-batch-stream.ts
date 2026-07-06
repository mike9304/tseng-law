import type { Page } from '@playwright/test';
import { z } from 'zod';

const batchRequestSchema = z.object({
  entries: z.array(z.object({ key: z.string(), sourceText: z.string() })),
});

function progressFrame(succeeded: number): string {
  const step = {
    name: succeeded === 0 ? 'provider-request' : 'provider-response',
    provider: 'mock',
    mode: 'native-batch',
    requested: 1,
    cached: 0,
    sent: 1,
    succeeded,
    failed: 0,
    durationMs: succeeded === 0 ? 42 : 84,
  };
  return `event: progress\ndata: ${JSON.stringify({
    type: 'progress',
    summary: { provider: 'mock', mode: 'native-batch', requested: 1, succeeded, failed: 0, step },
  })}\n\n`;
}

function resultFrame(key: string, sourceText: string): string {
  return `event: result\ndata: ${JSON.stringify({
    type: 'result',
    payload: {
      ok: true,
      results: [{ key, ok: true, text: `Stream translated ${sourceText}` }],
      summary: { provider: 'mock', mode: 'native-batch', requested: 1, succeeded: 1, failed: 0 },
    },
  })}\n\n`;
}

export async function fulfillBatchStreamWithMockResult(page: Page): Promise<void> {
  await page.route('**/api/builder/translations/translate-batch/stream', async (route) => {
    const raw = route.request().postData() ?? '{}';
    const requestBody = batchRequestSchema.parse(JSON.parse(raw));
    const firstEntry = requestBody.entries[0];
    if (!firstEntry) {
      throw new Error('Expected one batch stream entry');
    }
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body: `${progressFrame(0)}${resultFrame(firstEntry.key, firstEntry.sourceText)}`,
    });
  });
}

export async function installControlledBatchStream(page: Page, emitInitialProgress: boolean): Promise<void> {
  await page.addInitScript((shouldEmitProgress) => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof Request
          ? input.url
          : input.toString();
      if (!url.includes('/api/builder/translations/translate-batch/stream')) {
        return originalFetch(input, init);
      }

      const bodyText = typeof init?.body === 'string' ? init.body : '{}';
      const parsed = JSON.parse(bodyText);
      const firstEntry = parsed.entries[0];
      const encoder = new TextEncoder();
      let streamController: ReadableStreamDefaultController<Uint8Array> | null = null;
      const progress = `event: progress\ndata: ${JSON.stringify({
        type: 'progress',
        summary: {
          provider: 'mock',
          mode: 'native-batch',
          requested: 1,
          succeeded: 0,
          failed: 0,
          step: {
            name: 'provider-request',
            provider: 'mock',
            mode: 'native-batch',
            requested: 1,
            cached: 0,
            sent: 1,
            succeeded: 0,
            failed: 0,
            durationMs: 42,
          },
        },
      })}\n\n`;

      Reflect.set(window, '__emitTranslationStreamProgress', () => {
        if (!streamController) throw new Error('Translation stream controller is not ready');
        streamController.enqueue(encoder.encode(progress));
      });
      Reflect.set(window, '__emitTranslationStreamResult', () => {
        if (!streamController) throw new Error('Translation stream controller is not ready');
        streamController.enqueue(encoder.encode(
          `event: result\ndata: ${JSON.stringify({
            type: 'result',
            payload: {
              ok: true,
              results: [{ key: firstEntry.key, ok: true, text: `Stream translated ${firstEntry.sourceText}` }],
              summary: { provider: 'mock', mode: 'native-batch', requested: 1, succeeded: 1, failed: 0 },
            },
          })}\n\n`,
        ));
        streamController.close();
      });

      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          streamController = controller;
          if (shouldEmitProgress) controller.enqueue(encoder.encode(progress));
        },
      });

      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      });
    };
  }, emitInitialProgress);
}

export async function installOutOfOrderBatchStream(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof Request
          ? input.url
          : input.toString();
      if (!url.includes('/api/builder/translations/translate-batch/stream')) {
        return originalFetch(input, init);
      }

      const bodyText = typeof init?.body === 'string' ? init.body : '{}';
      const parsed = JSON.parse(bodyText);
      const firstEntry = parsed.entries[0];
      const encoder = new TextEncoder();
      let streamController: ReadableStreamDefaultController<Uint8Array> | null = null;
      const progress = (sequence: number, succeeded: number): string => `event: progress\ndata: ${JSON.stringify({
        type: 'progress',
        sequence,
        summary: {
          provider: 'mock',
          mode: 'native-batch',
          requested: 1,
          succeeded,
          failed: 0,
          step: {
            name: succeeded === 1 ? 'provider-response' : 'provider-request',
            provider: 'mock',
            mode: 'native-batch',
            requested: 1,
            cached: 0,
            sent: 1,
            succeeded,
            failed: 0,
            durationMs: succeeded === 1 ? 84 : 42,
          },
        },
      })}\n\n`;

      Reflect.set(window, '__emitTranslationStreamResult', () => {
        if (!streamController) throw new Error('Translation stream controller is not ready');
        streamController.enqueue(encoder.encode(
          `event: result\ndata: ${JSON.stringify({
            type: 'result',
            sequence: 3,
            payload: {
              ok: true,
              results: [{ key: firstEntry.key, ok: true, text: `Stream translated ${firstEntry.sourceText}` }],
              summary: { provider: 'mock', mode: 'native-batch', requested: 1, succeeded: 1, failed: 0 },
            },
          })}\n\n`,
        ));
        streamController.close();
      });

      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          streamController = controller;
          controller.enqueue(encoder.encode(progress(2, 1)));
          controller.enqueue(encoder.encode(progress(1, 0)));
        },
      });

      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      });
    };
  });
}

async function invokeWindowHook(page: Page, name: string): Promise<void> {
  await page.evaluate((hookName) => {
    const hook = Reflect.get(window, hookName);
    if (typeof hook !== 'function') {
      throw new Error(`Missing translation stream hook: ${hookName}`);
    }
    hook();
  }, name);
}

export async function emitBatchStreamProgress(page: Page): Promise<void> {
  await invokeWindowHook(page, '__emitTranslationStreamProgress');
}

export async function emitBatchStreamResult(page: Page): Promise<void> {
  await invokeWindowHook(page, '__emitTranslationStreamResult');
}
