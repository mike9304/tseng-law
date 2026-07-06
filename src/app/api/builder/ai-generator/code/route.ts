/**
 * F94 — Code assistant route.
 *
 * POST /api/builder/ai-generator/code
 * Body: { code, action: 'explain'|'fix'|'optimize'|'comment', language, context? }
 * Returns: { ok, result: string, diff?: string, fixedCode?: string }
 *
 * Uses gpt-4o-mini with response_format=json_object. For fix/optimize/comment
 * we compute the unified diff server-side from the LLM's full `fixedCode`
 * rather than trust an LLM to emit valid diff headers.
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  buildCodeAssistantPrompt,
  buildUnifiedDiffResult,
  codeAssistantResponseSchema,
  codeAssistantSchema,
  CODE_ASSISTANT_ACTIONS,
  type CodeAssistantInput,
} from '@/lib/builder/ai-generator/code-assistant';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type OpenAiChatPayload = {
  choices?: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
  error?: { message?: string; type?: string; code?: string };
};

function openAiApiKey(): string {
  return process.env.OPENAI_API_KEY?.trim() ?? '';
}

function codeAssistantModel(): string {
  return (
    process.env.OPENAI_CODE_ASSISTANT_MODEL?.trim()
    || process.env.OPENAI_GENERATION_MODEL?.trim()
    || 'gpt-4o-mini'
  );
}

function temperatureFor(action: CodeAssistantInput['action']): number {
  if (action === 'explain') return 0.2;
  if (action === 'comment') return 0.3;
  return 0.4;
}

function maxTokensFor(action: CodeAssistantInput['action']): number {
  if (action === 'explain') return 700;
  return 1400;
}

function diffFilename(language: string): string {
  switch (language) {
    case 'js':
      return 'function.js';
    case 'jsx':
      return 'function.jsx';
    case 'tsx':
      return 'function.tsx';
    case 'json':
      return 'snippet.json';
    case 'html':
      return 'snippet.html';
    case 'css':
      return 'snippet.css';
    case 'bash':
      return 'snippet.sh';
    case 'text':
      return 'snippet.txt';
    default:
      return 'function.ts';
  }
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
        message: 'OPENAI_API_KEY is not configured for the AI code assistant.',
      },
      { status: 503 },
    );
  }

  const raw = await request.json().catch(() => null);
  const parsed = codeAssistantSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_code_assistant_request', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }
  const input = parsed.data;
  const { systemPrompt, userPrompt } = buildCodeAssistantPrompt(input);
  const model = codeAssistantModel();

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
        temperature: temperatureFor(input.action),
        max_tokens: maxTokensFor(input.action),
        response_format: { type: 'json_object' },
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
        error: 'openai_code_request_failed',
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
        error: payload.error?.code ?? payload.error?.type ?? 'openai_code_assistant_failed',
        message: payload.error?.message ?? 'AI code assistant failed.',
      },
      { status: response.status },
    );
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { ok: false, error: 'missing_code_payload', message: 'AI code assistant did not return any content.' },
      { status: 502 },
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_code_payload', message: 'AI code assistant returned non-JSON content.' },
      { status: 502 },
    );
  }
  const parsedResult = codeAssistantResponseSchema.safeParse(json);
  if (!parsedResult.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_code_response_shape',
        message: 'AI code assistant returned an unexpected JSON shape.',
        details: parsedResult.error.issues.slice(0, 3),
      },
      { status: 502 },
    );
  }

  const { explanation, fixedCode } = parsedResult.data;
  const trimmedFixed = fixedCode && fixedCode.trim() ? fixedCode : null;
  const diffResult = trimmedFixed && trimmedFixed !== input.code
    ? buildUnifiedDiffResult(input.code, trimmedFixed, diffFilename(input.language))
    : undefined;

  return NextResponse.json({
    ok: true,
    model,
    action: input.action,
    language: input.language,
    result: explanation,
    fixedCode: trimmedFixed ?? undefined,
    diff: diffResult?.text,
    diffHunks: diffResult?.hunks,
    supportedActions: CODE_ASSISTANT_ACTIONS,
    finishReason: payload.choices?.[0]?.finish_reason ?? null,
  });
}
