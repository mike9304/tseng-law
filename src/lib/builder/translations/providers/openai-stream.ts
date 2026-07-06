import { z } from 'zod';
import {
  openAiUsageFromPayload,
  openAiUsagePayloadSchema,
  parseOpenAiBatchContent,
  summarizeOpenAiBatch,
} from './openai-response';
import type { TokenCostRates } from './token-usage';
import type {
  TranslationProviderBatchEntryResult,
  TranslationProviderBatchItem,
  TranslationProviderBatchPartial,
  TranslationProviderBatchResult,
  TranslationProviderUsage,
} from './types';

const openAiStreamChunkSchema = z.object({
  choices: z.array(z.object({
    delta: z.object({
      content: z.string().optional(),
    }).optional(),
  })).optional(),
  error: z.object({ message: z.string().optional() }).optional(),
  usage: openAiUsagePayloadSchema.nullish(),
});

type OpenAiStreamReadResult =
  | { readonly ok: true; readonly content: string; readonly usage?: TranslationProviderUsage }
  | {
      readonly ok: false;
      readonly reason: 'send' | 'parse' | 'network';
      readonly error: string;
    };

type OpenAiDeltaParseResult =
  | { readonly kind: 'done' }
  | { readonly kind: 'delta'; readonly delta: string }
  | { readonly kind: 'usage'; readonly usage: TranslationProviderUsage }
  | {
      readonly kind: 'error';
      readonly reason: 'send' | 'parse';
      readonly error: string;
    };

type OpenAiStreamAccumulator = {
  readonly content: string;
  readonly chunkCount: number;
  readonly usage?: TranslationProviderUsage;
};

function assertNever(value: never): never {
  throw new Error(`Unhandled OpenAI stream delta: ${JSON.stringify(value)}`);
}

function splitSseFrames(buffer: string): { readonly frames: readonly string[]; readonly remainder: string } {
  const parts = buffer.split('\n\n');
  return {
    frames: parts.slice(0, -1),
    remainder: parts.at(-1) ?? '',
  };
}

function frameData(frame: string): string {
  return frame
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice('data:'.length).trimStart())
    .join('\n');
}

function errorResults(
  items: readonly TranslationProviderBatchItem[],
  reason: 'send' | 'parse' | 'network',
  error: string,
): TranslationProviderBatchResult {
  const results = items.map((item) => ({
    key: item.key,
    ok: false,
    reason,
    provider: 'openai',
    error,
  }) satisfies TranslationProviderBatchEntryResult);
  return summarizeOpenAiBatch(results);
}

function parseDelta(data: string, rates: TokenCostRates | undefined): OpenAiDeltaParseResult {
  if (data === '[DONE]') return { kind: 'done' };
  let payload: unknown;
  try {
    payload = JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { kind: 'error', reason: 'parse', error: 'invalid stream JSON' };
    }
    throw error;
  }
  const parsed = openAiStreamChunkSchema.safeParse(payload);
  if (!parsed.success) return { kind: 'error', reason: 'parse', error: 'invalid stream chunk' };
  if (parsed.data.error?.message) {
    return { kind: 'error', reason: 'send', error: parsed.data.error.message };
  }
  const usage = openAiUsageFromPayload(parsed.data.usage ?? undefined, rates);
  if (usage) return { kind: 'usage', usage };
  const delta = parsed.data.choices?.map((choice) => choice.delta?.content ?? '').join('') ?? '';
  return { kind: 'delta', delta };
}

function appendDelta(
  accumulator: OpenAiStreamAccumulator,
  delta: string,
  onPartial: ((partial: TranslationProviderBatchPartial) => void) | undefined,
  startedAt: number,
): OpenAiStreamAccumulator {
  if (!delta) return accumulator;
  const next = {
    content: `${accumulator.content}${delta}`,
    chunkCount: accumulator.chunkCount + 1,
  };
  onPartial?.({
    chunkCount: next.chunkCount,
    partialCharacters: next.content.length,
    durationMs: Math.max(0, Date.now() - startedAt),
  });
  return next;
}

async function readOpenAiStreamContent(
  response: Response,
  onPartial: ((partial: TranslationProviderBatchPartial) => void) | undefined,
  startedAt: number,
  rates: TokenCostRates | undefined,
): Promise<OpenAiStreamReadResult> {
  if (!response.body) return { ok: false, reason: 'network', error: 'missing stream body' };
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let accumulator: OpenAiStreamAccumulator = { content: '', chunkCount: 0 };

  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    buffer += decoder.decode(chunk.value, { stream: true });
    const split = splitSseFrames(buffer);
    buffer = split.remainder;
    for (const frame of split.frames) {
      const data = frameData(frame);
      if (!data) continue;
      const delta = parseDelta(data, rates);
      switch (delta.kind) {
        case 'error':
          return { ok: false, reason: delta.reason, error: delta.error };
        case 'done':
          return { ok: true, content: accumulator.content, usage: accumulator.usage };
        case 'delta':
          accumulator = appendDelta(accumulator, delta.delta, onPartial, startedAt);
          break;
        case 'usage':
          accumulator = { ...accumulator, usage: delta.usage };
          break;
        default:
          return assertNever(delta);
      }
    }
  }

  const data = frameData(buffer);
  if (data && data !== '[DONE]') {
    const delta = parseDelta(data, rates);
    switch (delta.kind) {
      case 'error':
        return { ok: false, reason: delta.reason, error: delta.error };
      case 'done':
        return { ok: true, content: accumulator.content, usage: accumulator.usage };
      case 'delta':
        accumulator = appendDelta(accumulator, delta.delta, onPartial, startedAt);
        break;
      case 'usage':
        accumulator = { ...accumulator, usage: delta.usage };
        break;
      default:
        return assertNever(delta);
    }
  }
  return { ok: true, content: accumulator.content, usage: accumulator.usage };
}

export async function readOpenAiBatchStream(
  response: Response,
  items: readonly TranslationProviderBatchItem[],
  onPartial: ((partial: TranslationProviderBatchPartial) => void) | undefined,
  startedAt: number,
  rates?: TokenCostRates,
): Promise<TranslationProviderBatchResult> {
  const stream = await readOpenAiStreamContent(response, onPartial, startedAt, rates);
  if (!stream.ok) return errorResults(items, stream.reason, stream.error);
  try {
    return summarizeOpenAiBatch(parseOpenAiBatchContent(stream.content, items), stream.usage);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return errorResults(items, 'parse', 'invalid JSON');
  }
}
