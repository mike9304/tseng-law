import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
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

type OpenAiChatPayload = {
  choices?: Array<{
    message?: {
      content?: string;
    };
    finish_reason?: string;
  }>;
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
};

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

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const apiKey = openAiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: 'missing_openai_api_key',
        message: 'OPENAI_API_KEY is not configured for the AI text assistant.',
      },
      { status: 503 },
    );
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

  let response: Response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
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
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'openai_text_request_failed',
        message: err instanceof Error ? err.message : 'OpenAI request failed.',
      },
      { status: 502 },
    );
  }

  const payload = (await response.json().catch(() => ({}))) as OpenAiChatPayload;
  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: payload.error?.code ?? payload.error?.type ?? 'openai_text_assistant_failed',
        message: payload.error?.message ?? 'AI text assistant failed.',
      },
      { status: response.status },
    );
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { ok: false, error: 'missing_text_payload', message: 'AI text assistant did not return any content.' },
      { status: 502 },
    );
  }

  const trimmed = trimAssistantContent(content);
  if (!trimmed) {
    return NextResponse.json(
      { ok: false, error: 'empty_text_payload', message: 'AI text assistant returned empty content.' },
      { status: 502 },
    );
  }

  const text = clampLengthForAction(trimmed, input.action, input.text.length);

  return NextResponse.json({
    ok: true,
    model,
    action: input.action,
    targetLocale: input.targetLocale ?? null,
    tone: input.tone ?? null,
    text,
    finishReason: payload.choices?.[0]?.finish_reason ?? null,
    supportedActions: TEXT_ASSISTANT_ACTIONS,
    supportedTones: TEXT_ASSISTANT_TONES,
    supportedTargetLocales: TEXT_ASSISTANT_TARGET_LOCALES,
  });
}
