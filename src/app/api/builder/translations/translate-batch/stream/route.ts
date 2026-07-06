import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderTranslationsApiErrorPayload,
  type BuilderTranslationsApiErrorCode,
} from '@/lib/builder/translations/translations-api-copy';
import { translateBatchViaRouter } from '@/lib/builder/translations/providers/router';
import type { TranslationProviderBatchProgress } from '@/lib/builder/translations/providers/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const translationBatchStreamRequestSchema = z.object({
  locale: z.string().optional(),
  sourceLocale: z.string().optional(),
  targetLocale: z.string().optional(),
  provider: z.enum(['openai', 'deepl', 'mock']).optional(),
  entries: z.array(z.object({
    key: z.string().min(1),
    sourceText: z.string().min(1),
  })).min(1),
});

const translationBatchStreamLocaleSchema = z.object({
  locale: z.string().optional(),
  sourceLocale: z.string().optional(),
}).passthrough();

function errorResponse(
  locale: Locale,
  errorCode: BuilderTranslationsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderTranslationsApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function resolveRequestLocale(body: unknown): Locale {
  const parsed = translationBatchStreamLocaleSchema.safeParse(body);
  if (!parsed.success) return 'ko';
  const requestedLocale = parsed.data.locale ?? parsed.data.sourceLocale;
  if (requestedLocale) return normalizeLocale(requestedLocale);
  return 'ko';
}

function sseEvent(name: 'progress' | 'result' | 'error', payload: object): string {
  return `event: ${name}\ndata: ${JSON.stringify(payload)}\n\n`;
}

function clientResults(batch: Awaited<ReturnType<typeof translateBatchViaRouter>>) {
  return batch.results.map((result) => {
    if (result.ok) return { key: result.key, ok: true, text: result.text };
    return { key: result.key, ok: false, error: result.error ?? result.reason };
  });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const rawBody: unknown = await request.json().catch(() => null);
  const errorLocale = resolveRequestLocale(rawBody);
  const parsed = translationBatchStreamRequestSchema.safeParse(rawBody);

  if (!parsed.success) {
    return errorResponse(errorLocale, 'invalid_request', 400);
  }

  const body = parsed.data;
  const sourceLocale = normalizeLocale(body.sourceLocale ?? 'ko');
  const targetLocale = normalizeLocale(body.targetLocale ?? 'en');
  const entries = body.entries.slice(0, 25);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sequence = 0;
      const send = (name: 'progress' | 'result' | 'error', payload: object): void => {
        sequence += 1;
        controller.enqueue(encoder.encode(sseEvent(name, { ...payload, sequence })));
      };
      try {
        const batch = await translateBatchViaRouter({
          sourceLocale,
          targetLocale,
          preferProvider: body.provider,
          items: entries,
          onProgress: (summary: TranslationProviderBatchProgress) => {
            send('progress', { type: 'progress', summary });
          },
        });
        send('result', {
          type: 'result',
          payload: {
            ok: true,
            results: clientResults(batch),
            summary: batch.summary,
          },
        });
      } catch (error) {
        const batchError = error instanceof Error ? error : new Error(String(error));
        console.error('[builder/translations/translate-batch/stream] batch failed:', batchError);
        send('error', {
          type: 'error',
          error: getBuilderTranslationsApiErrorPayload(errorLocale, 'translation_batch_failed').error,
        });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/event-stream',
    },
  });
}
