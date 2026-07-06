import { z } from 'zod';
import type {
  TranslationProviderBatchEntryResult,
  TranslationProviderBatchResult,
  TranslationProviderUsage,
  TranslationProviderResult,
} from './types';
import { withEstimatedTokenCost, type TokenCostRates } from './token-usage';

export const openAiUsagePayloadSchema = z.object({
  prompt_tokens: z.number().int().nonnegative().optional(),
  completion_tokens: z.number().int().nonnegative().optional(),
  total_tokens: z.number().int().nonnegative().optional(),
});

export const openAiSingleResponseSchema = z.object({
  choices: z.array(z.object({
    message: z.object({
      content: z.string().optional(),
    }).optional(),
  })).optional(),
  error: z.object({ message: z.string().optional() }).optional(),
  usage: openAiUsagePayloadSchema.optional(),
});

const openAiTranslatedTextSchema = z.object({
  text: z.string(),
});

const openAiBatchContentSchema = z.object({
  items: z.array(z.object({
    key: z.string(),
    text: z.string(),
  })),
});

export async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    if (error instanceof Error) return null;
    return null;
  }
}

export function parseOpenAiContent(content: string): TranslationProviderResult {
  const parsedJson: unknown = JSON.parse(content);
  const parsed = openAiTranslatedTextSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return { ok: false, reason: 'parse', provider: 'openai', error: 'missing text field' };
  }
  return { ok: true, provider: 'openai', text: parsed.data.text.trim() };
}

export function parseOpenAiBatchContent(
  content: string,
  items: readonly { readonly key: string }[],
): readonly TranslationProviderBatchEntryResult[] {
  const parsedJson: unknown = JSON.parse(content);
  const parsed = openAiBatchContentSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return items.map((item) => ({
      key: item.key,
      ok: false,
      reason: 'parse',
      provider: 'openai',
      error: 'missing items field',
    }) satisfies TranslationProviderBatchEntryResult);
  }
  const translationsByKey = new Map(parsed.data.items.map((item) => [item.key, item.text.trim()]));
  return items.map((item) => {
    const text = translationsByKey.get(item.key);
    if (!text) {
      return {
        key: item.key,
        ok: false,
        reason: 'parse',
        provider: 'openai',
        error: 'missing text field',
      } satisfies TranslationProviderBatchEntryResult;
    }
    return { key: item.key, ok: true, provider: 'openai', text } satisfies TranslationProviderBatchEntryResult;
  });
}

export function openAiUsageFromPayload(
  payload: z.infer<typeof openAiUsagePayloadSchema> | undefined,
  rates: TokenCostRates | undefined,
): TranslationProviderUsage | undefined {
  if (payload === undefined) return undefined;
  const promptTokens = payload.prompt_tokens ?? 0;
  const completionTokens = payload.completion_tokens ?? 0;
  return withEstimatedTokenCost({
    promptTokens,
    completionTokens,
    totalTokens: payload.total_tokens ?? promptTokens + completionTokens,
  }, rates);
}

export function summarizeOpenAiBatch(
  results: readonly TranslationProviderBatchEntryResult[],
  usage?: TranslationProviderUsage,
): TranslationProviderBatchResult {
  const succeeded = results.filter((result) => result.ok).length;
  return {
    results,
    summary: {
      provider: 'openai',
      mode: 'native-batch',
      requested: results.length,
      succeeded,
      failed: results.length - succeeded,
    },
    ...(usage === undefined ? {} : { usage }),
  };
}
