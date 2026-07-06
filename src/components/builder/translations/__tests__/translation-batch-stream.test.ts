import { describe, expect, it, vi } from 'vitest';
import { requestTranslationBatchStream } from '../translation-batch-stream';

describe('requestTranslationBatchStream', () => {
  it('returns final results after emitting live provider progress', async () => {
    let releaseFinal: () => void = () => undefined;
    const finalGate = new Promise<void>((resolve) => {
      releaseFinal = resolve;
    });
    const encoder = new TextEncoder();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(
            'event: progress\ndata: {"type":"progress","summary":{"provider":"mock","mode":"native-batch","requested":1,"succeeded":0,"failed":0,"step":{"name":"provider-request","provider":"mock","mode":"native-batch","requested":1,"cached":0,"sent":1,"succeeded":0,"failed":0,"durationMs":42}}}\n\n',
          ));
          finalGate.then(() => {
            controller.enqueue(encoder.encode(
              'event: result\ndata: {"type":"result","payload":{"ok":true,"results":[{"key":"page:home:title","ok":true,"text":"Hello"}],"summary":{"provider":"mock","mode":"native-batch","requested":1,"succeeded":1,"failed":0}}}\n\n',
            ));
            controller.close();
          });
        },
      }),
      { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
    )));
    const progressEvents: string[] = [];

    const payloadPromise = requestTranslationBatchStream({
      sourceLocale: 'ko',
      targetLocale: 'en',
      entries: [{ key: 'page:home:title', sourceText: '안녕하세요' }],
      provider: 'mock',
      locale: 'ko',
    }, (summary) => {
      progressEvents.push(`${summary.provider}:${summary.step?.name}:${summary.step?.durationMs}:${summary.succeeded}/${summary.requested}`);
    });

    await vi.waitFor(() => {
      expect(progressEvents).toEqual(['mock:provider-request:42:0/1']);
    });
    releaseFinal();

    await expect(payloadPromise).resolves.toEqual({
      ok: true,
      results: [{ key: 'page:home:title', ok: true, text: 'Hello' }],
      summary: {
        provider: 'mock',
        mode: 'native-batch',
        requested: 1,
        succeeded: 1,
        failed: 0,
      },
    });
  });

  it('ignores stale provider progress frames when stream sequence moves backward', async () => {
    const encoder = new TextEncoder();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(
            'event: progress\ndata: {"type":"progress","sequence":2,"summary":{"provider":"mock","mode":"native-batch","requested":1,"succeeded":1,"failed":0,"step":{"name":"provider-response","provider":"mock","mode":"native-batch","requested":1,"cached":0,"sent":1,"succeeded":1,"failed":0,"durationMs":84}}}\n\n',
          ));
          controller.enqueue(encoder.encode(
            'event: progress\ndata: {"type":"progress","sequence":1,"summary":{"provider":"mock","mode":"native-batch","requested":1,"succeeded":0,"failed":0,"step":{"name":"provider-request","provider":"mock","mode":"native-batch","requested":1,"cached":0,"sent":1,"succeeded":0,"failed":0,"durationMs":42}}}\n\n',
          ));
          controller.enqueue(encoder.encode(
            'event: result\ndata: {"type":"result","sequence":3,"payload":{"ok":true,"results":[{"key":"page:home:title","ok":true,"text":"Hello"}],"summary":{"provider":"mock","mode":"native-batch","requested":1,"succeeded":1,"failed":0}}}\n\n',
          ));
          controller.close();
        },
      }),
      { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
    )));
    const progressEvents: string[] = [];

    await requestTranslationBatchStream({
      sourceLocale: 'ko',
      targetLocale: 'en',
      entries: [{ key: 'page:home:title', sourceText: '안녕하세요' }],
      provider: 'mock',
      locale: 'ko',
    }, (summary) => {
      progressEvents.push(`${summary.step?.name}:${summary.succeeded}/${summary.requested}`);
    });

    expect(progressEvents).toEqual(['provider-response:1/1']);
  });
});
