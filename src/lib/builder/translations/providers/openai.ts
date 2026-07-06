import type {
  TranslationProvider,
  TranslationProviderArgs,
  TranslationProviderBatchEntryResult,
  TranslationProviderBatchItem,
  TranslationProviderBatchPartial,
  TranslationProviderBatchResult,
  TranslationProviderResult,
} from './types';
import { buildBatchPrompt, buildPrompt } from './openai-prompts';
import {
  openAiUsageFromPayload,
  openAiSingleResponseSchema,
  parseOpenAiBatchContent,
  parseOpenAiContent,
  readJson,
  summarizeOpenAiBatch,
} from './openai-response';
import { readOpenAiBatchStream } from './openai-stream';
import { openAiTranslationCostRatesFromEnv, type TokenCostRates } from './token-usage';

const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_OPENAI_TRANSLATION_MODEL = 'gpt-4o-mini';
const SYSTEM_PROMPT = 'You are a professional legal translator. Return compact JSON only.';

type ChatCompletionMessage = {
  readonly role: 'system' | 'user';
  readonly content: string;
};

type ChatCompletionRequest = {
  readonly model: string;
  readonly temperature: number;
  readonly response_format: { readonly type: 'json_object' };
  readonly messages: readonly ChatCompletionMessage[];
  readonly stream?: true;
  readonly stream_options?: { readonly include_usage: true };
};

function openAiHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

function openAiRequest(userPrompt: string, stream: boolean): ChatCompletionRequest {
  const request = {
    model: process.env.OPENAI_TRANSLATION_MODEL || DEFAULT_OPENAI_TRANSLATION_MODEL,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  } satisfies ChatCompletionRequest;
  if (!stream) return request;
  return { ...request, stream: true, stream_options: { include_usage: true } };
}

function openAiBatchErrorResult(
  item: TranslationProviderBatchItem,
  reason: 'unconfigured' | 'send' | 'parse' | 'network',
  error?: string,
): TranslationProviderBatchEntryResult {
  return {
    key: item.key,
    ok: false,
    reason,
    provider: 'openai',
    ...(error === undefined ? {} : { error }),
  };
}

function openAiBatchErrorResults(
  items: readonly TranslationProviderBatchItem[],
  reason: 'unconfigured' | 'send' | 'parse' | 'network',
  error?: string,
): TranslationProviderBatchResult {
  return summarizeOpenAiBatch(items.map((item) => openAiBatchErrorResult(item, reason, error)));
}

async function sendOpenAiRequest(apiKey: string, body: ChatCompletionRequest): Promise<Response> {
  return fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: openAiHeaders(apiKey),
    body: JSON.stringify(body),
  });
}

async function parseSendError(response: Response): Promise<string> {
  const jsonPayload = await readJson(response);
  const payload = openAiSingleResponseSchema.safeParse(jsonPayload);
  return payload.success ? payload.data.error?.message ?? `${response.status}` : `${response.status}`;
}

async function parseSingleResponse(response: Response): Promise<TranslationProviderResult> {
  const jsonPayload = await readJson(response);
  const payload = openAiSingleResponseSchema.safeParse(jsonPayload);
  if (!response.ok) {
    return {
      ok: false,
      reason: 'send',
      provider: 'openai',
      error: payload.success ? payload.data.error?.message ?? `${response.status}` : `${response.status}`,
    };
  }
  const content = payload.success ? payload.data.choices?.[0]?.message?.content : undefined;
  if (!content) return { ok: false, reason: 'parse', provider: 'openai', error: 'empty response' };
  try {
    return parseOpenAiContent(content);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return { ok: false, reason: 'parse', provider: 'openai', error: 'invalid JSON' };
  }
}

async function parseBatchResponse(
  response: Response,
  items: readonly TranslationProviderBatchItem[],
  rates: TokenCostRates | undefined,
): Promise<TranslationProviderBatchResult> {
  const jsonPayload = await readJson(response);
  const payload = openAiSingleResponseSchema.safeParse(jsonPayload);
  if (!response.ok) {
    const error = payload.success ? payload.data.error?.message ?? `${response.status}` : `${response.status}`;
    return openAiBatchErrorResults(items, 'send', error);
  }
  const content = payload.success ? payload.data.choices?.[0]?.message?.content : undefined;
  if (!content) return openAiBatchErrorResults(items, 'parse', 'empty response');
  try {
    return summarizeOpenAiBatch(
      parseOpenAiBatchContent(content, items),
      payload.success ? openAiUsageFromPayload(payload.data.usage, rates) : undefined,
    );
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return openAiBatchErrorResults(items, 'parse', 'invalid JSON');
  }
}

async function parseStreamingBatchResponse(
  response: Response,
  items: readonly TranslationProviderBatchItem[],
  onPartial: (partial: TranslationProviderBatchPartial) => void,
  requestStartedAt: number,
  rates: TokenCostRates | undefined,
): Promise<TranslationProviderBatchResult> {
  if (!response.ok) {
    return openAiBatchErrorResults(items, 'send', await parseSendError(response));
  }
  return readOpenAiBatchStream(response, items, onPartial, requestStartedAt, rates);
}

export const openaiProvider: TranslationProvider = {
  id: 'openai',
  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY);
  },
  async translate({ sourceLocale, targetLocale, sourceText }: TranslationProviderArgs): Promise<TranslationProviderResult> {
    const apiKey = process.env.OPENAI_API_KEY ?? '';
    if (!apiKey) return { ok: false, reason: 'unconfigured', provider: 'openai' };
    try {
      const response = await sendOpenAiRequest(apiKey, openAiRequest(
        buildPrompt(sourceLocale, targetLocale, sourceText),
        false,
      ));
      return parseSingleResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        return { ok: false, reason: 'network', provider: 'openai', error: error.message };
      }
      throw error;
    }
  },
  async translateBatch({ sourceLocale, targetLocale, items, onPartial }): Promise<TranslationProviderBatchResult> {
    const apiKey = process.env.OPENAI_API_KEY ?? '';
    if (!apiKey) return openAiBatchErrorResults(items, 'unconfigured');
    try {
      const requestStartedAt = Date.now();
      const rates = openAiTranslationCostRatesFromEnv();
      const response = await sendOpenAiRequest(apiKey, openAiRequest(
        buildBatchPrompt(sourceLocale, targetLocale, items),
        onPartial !== undefined,
      ));
      if (onPartial) {
        return parseStreamingBatchResponse(response, items, onPartial, requestStartedAt, rates);
      }
      return parseBatchResponse(response, items, rates);
    } catch (error) {
      if (error instanceof Error) {
        return openAiBatchErrorResults(items, 'network', error.message);
      }
      throw error;
    }
  },
};
