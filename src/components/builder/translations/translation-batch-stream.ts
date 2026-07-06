import { z } from 'zod';
import type { Locale } from '@/lib/locales';
import type { TranslationProviderBatchProgress } from '@/lib/builder/translations/providers/types';
import type { BatchApiPayload } from './TranslationManagerView.types';

const batchResultSchema = z.object({
  key: z.string(),
  ok: z.boolean(),
  text: z.string().optional(),
  error: z.string().optional(),
});

const batchSummarySchema = z.object({
  provider: z.enum(['openai', 'deepl', 'mock']),
  mode: z.enum(['native-batch', 'single-fallback']),
  requested: z.number().int().nonnegative(),
  succeeded: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  step: z.object({
    name: z.enum([
      'provider-selected',
      'cache-checked',
      'provider-request',
      'provider-partial',
      'provider-result',
      'provider-response',
      'single-fallback',
      'mock-complete',
    ]),
    provider: z.enum(['openai', 'deepl', 'mock']),
    mode: z.enum(['native-batch', 'single-fallback']),
    requested: z.number().int().nonnegative(),
    cached: z.number().int().nonnegative(),
    sent: z.number().int().nonnegative(),
    succeeded: z.number().int().nonnegative(),
    failed: z.number().int().nonnegative(),
    durationMs: z.number().int().nonnegative().optional(),
    chunkCount: z.number().int().nonnegative().optional(),
    partialCharacters: z.number().int().nonnegative().optional(),
    promptTokens: z.number().int().nonnegative().optional(),
    completionTokens: z.number().int().nonnegative().optional(),
    totalTokens: z.number().int().nonnegative().optional(),
    estimatedCostUsd: z.number().nonnegative().optional(),
  }).optional(),
});

const batchApiPayloadSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
  results: z.array(batchResultSchema).optional(),
  summary: batchSummarySchema.optional(),
});

const batchStreamEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('progress'),
    sequence: z.number().int().positive().optional(),
    summary: batchSummarySchema,
  }),
  z.object({
    type: z.literal('result'),
    sequence: z.number().int().positive().optional(),
    payload: batchApiPayloadSchema,
  }),
  z.object({
    type: z.literal('error'),
    sequence: z.number().int().positive().optional(),
    error: z.string(),
  }),
]);

type BatchStreamEvent = z.infer<typeof batchStreamEventSchema>;

export interface BatchStreamRequest {
  readonly sourceLocale: Locale;
  readonly targetLocale: Locale;
  readonly entries: readonly { readonly key: string; readonly sourceText: string }[];
  readonly provider: 'openai' | 'deepl' | 'mock';
  readonly locale: Locale;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled translation batch stream event: ${JSON.stringify(value)}`);
}

function splitSseFrames(buffer: string): { readonly frames: readonly string[]; readonly remainder: string } {
  const parts = buffer.split('\n\n');
  return {
    frames: parts.slice(0, -1),
    remainder: parts.at(-1) ?? '',
  };
}

function parseSseFrame(frame: string): BatchStreamEvent | null {
  const data = frame
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice('data:'.length).trimStart())
    .join('\n');
  if (!data) return null;

  const parsed: unknown = JSON.parse(data);
  const event = batchStreamEventSchema.safeParse(parsed);
  return event.success ? event.data : null;
}

function applyStreamEvent(
  event: BatchStreamEvent,
  onProgress: (summary: TranslationProviderBatchProgress) => void,
): BatchApiPayload | null {
  switch (event.type) {
    case 'progress':
      onProgress(event.summary);
      return null;
    case 'result':
      return event.payload;
    case 'error':
      return { ok: false, error: event.error };
    default:
      return assertNever(event);
  }
}

async function errorPayload(response: Response): Promise<BatchApiPayload> {
  const parsed: unknown = await response.json().catch(() => null);
  const payload = batchApiPayloadSchema.safeParse(parsed);
  if (payload.success) return payload.data;
  return { ok: false, error: `Batch translation stream unavailable (${response.status})` };
}

export async function requestTranslationBatchStream(
  request: BatchStreamRequest,
  onProgress: (summary: TranslationProviderBatchProgress) => void,
): Promise<BatchApiPayload> {
  const response = await fetch('/api/builder/translations/translate-batch/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok || !response.body) return errorPayload(response);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalPayload: BatchApiPayload | null = null;
  let latestSequence = 0;

  const applyOrderedEvent = (event: BatchStreamEvent): BatchApiPayload | null => {
    if (event.sequence !== undefined) {
      if (event.sequence <= latestSequence) return null;
      latestSequence = event.sequence;
    }
    return applyStreamEvent(event, onProgress);
  };

  while (finalPayload === null) {
    const chunk = await reader.read();
    if (chunk.done) break;
    buffer += decoder.decode(chunk.value, { stream: true });
    const split = splitSseFrames(buffer);
    buffer = split.remainder;
    for (const frame of split.frames) {
      const event = parseSseFrame(frame);
      if (!event) continue;
      finalPayload = applyOrderedEvent(event);
      if (finalPayload !== null) break;
    }
  }

  if (finalPayload !== null) return finalPayload;
  const event = parseSseFrame(buffer);
  if (event) {
    const payload = applyOrderedEvent(event);
    if (payload !== null) return payload;
  }
  return { ok: false, error: 'Batch translation stream ended before returning results.' };
}
