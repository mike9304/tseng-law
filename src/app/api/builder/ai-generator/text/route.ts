import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  buildTextAssistantPrompt,
  textAssistantSchema,
  TEXT_ASSISTANT_ACTIONS,
  TEXT_ASSISTANT_TONES,
  TEXT_ASSISTANT_TARGET_LOCALES,
  type TextAssistantAction,
  type TextAssistantInput,
} from '@/lib/builder/ai-generator/text-assistant';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OPENAI_TEXT_TIMEOUT_MS = 20_000;

type TextErrorCode =
  | 'missing_openai_api_key'
  | 'openai_text_timeout'
  | 'openai_text_provider_failed'
  | 'openai_text_network_failed'
  | 'invalid_openai_text_response';

const TEXT_ERROR_MESSAGE: Record<TextErrorCode, string> = {
  missing_openai_api_key: 'The AI text assistant is not configured.',
  openai_text_timeout: 'The AI text assistant took too long to respond.',
  openai_text_provider_failed: 'The AI text assistant was unable to complete the request.',
  openai_text_network_failed: 'The AI text assistant could not be reached.',
  invalid_openai_text_response: 'The AI text assistant returned an unusable response.',
};

function textErrorStatus(code: TextErrorCode): number {
  if (code === 'missing_openai_api_key') return 503;
  if (code === 'openai_text_timeout') return 504;
  return 502;
}

function textErrorResponse(code: TextErrorCode): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: code,
      message: TEXT_ERROR_MESSAGE[code],
    },
    { status: textErrorStatus(code) },
  );
}

function openAiApiKey(): string {
  return process.env.OPENAI_API_KEY?.trim() ?? '';
}

function textAssistantModel(): string {
  return process.env.OPENAI_TEXT_ASSISTANT_MODEL?.trim() || process.env.OPENAI_GENERATION_MODEL?.trim() || 'gpt-4o-mini';
}

function clampLengthForAction(text: string, action: TextAssistantAction, sourceLength: number): string {
  if (action === 'expand') {
    const cap = Math.min(Math.max(sourceLength * 3, 200), 1800);
    return text.length > cap ? `${text.slice(0, cap - 1).trimEnd()}…` : text;
  }
  if (action === 'shorten') {
    const cap = Math.max(40, Math.floor(sourceLength * 0.7));
    return text.length > cap ? `${text.slice(0, cap - 1).trimEnd()}…` : text;
  }
  if (text.length > 4000) {
    return `${text.slice(0, 3999).trimEnd()}…`;
  }
  return text;
}

function trimAssistantContent(content: string): string {
  return content
    .replace(/^[\s​]+|[\s​]+$/g, '')
    .replace(/^["“”]+|["“”]+$/g, '')
    .trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

type ExtractedOpenAiText = { content: string; finishReason: string | null };

function extractOpenAiText(payload: unknown): ExtractedOpenAiText | null {
  if (!isRecord(payload)) return null;
  const choices = payload.choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const firstChoice = choices[0];
  if (!isRecord(firstChoice)) return null;
  const message = firstChoice.message;
  if (!isRecord(message)) return null;
  const content = message.content;
  if (typeof content !== 'string' || content.length === 0) return null;
  const finishReasonValue = firstChoice.finish_reason;
  return {
    content,
    finishReason: typeof finishReasonValue === 'string' ? finishReasonValue : null,
  };
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const apiKey = openAiApiKey();
  if (!apiKey) {
    return textErrorResponse('missing_openai_api_key');
  }

  const raw = await request.json().catch(() => null);
  const parsed = textAssistantSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_text_assistant_request', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const input: TextAssistantInput = parsed.data;
  const { systemPrompt, userPrompt } = buildTextAssistantPrompt(input);
  const model = textAssistantModel();

  const controller = new AbortController();
  let timedOut = false;
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      timedOut = true;
      controller.abort();
      reject();
    }, OPENAI_TEXT_TIMEOUT_MS);
  });

  try {
    const fetchPromise = fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: input.action === 'translate' ? 0.2 : 0.5,
        max_tokens: input.action === 'expand' ? 900 : 400,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    let response: Response;
    try {
      response = await Promise.race([fetchPromise, deadline]);
    } catch {
      if (timedOut) return textErrorResponse('openai_text_timeout');
      return textErrorResponse('openai_text_network_failed');
    }

    if (!response.ok) {
      return textErrorResponse('openai_text_provider_failed');
    }

    const jsonPromise = Promise.resolve().then(() => response.json());

    let payload: unknown;
    try {
      payload = await Promise.race([jsonPromise, deadline]);
    } catch (error) {
      if (timedOut) return textErrorResponse('openai_text_timeout');
      if (error instanceof SyntaxError) {
        return textErrorResponse('invalid_openai_text_response');
      }
      return textErrorResponse('openai_text_network_failed');
    }

    const extracted = extractOpenAiText(payload);
    if (!extracted) {
      return textErrorResponse('invalid_openai_text_response');
    }

    const trimmed = trimAssistantContent(extracted.content);
    if (!trimmed) {
      return textErrorResponse('invalid_openai_text_response');
    }

    const text = clampLengthForAction(trimmed, input.action, input.text.length);

    return NextResponse.json({
      ok: true,
      model,
      action: input.action,
      targetLocale: input.targetLocale ?? null,
      tone: input.tone ?? null,
      text,
      finishReason: extracted.finishReason,
      supportedActions: TEXT_ASSISTANT_ACTIONS,
      supportedTones: TEXT_ASSISTANT_TONES,
      supportedTargetLocales: TEXT_ASSISTANT_TARGET_LOCALES,
    });
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}
