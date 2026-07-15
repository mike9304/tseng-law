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
 *
 * Fail-closed contract:
 * - explain must never yield an applicable fixedCode/diff; a provider-supplied
 *   fixedCode for explain is rejected.
 * - fix/optimize/comment require a nonempty fixedCode after trimming, otherwise
 *   the route returns a sanitized non-2xx instead of a false success.
 * - All provider/network/shape failures return a stable sanitized payload that
 *   never echoes provider status, error fields, response body, model details,
 *   API key, prompt/code/context, or Zod issue details.
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

const PROVIDER_TIMEOUT_MS = 20_000;

type OpenAiChatPayload = {
  choices?: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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

/**
 * Stable, sanitized failure payload for any provider/network/contract problem.
 * The error code and message are fixed internal strings only; this must never
 * echo provider status, error code/type/message, response body, model details,
 * API key, prompt/code/context, or Zod issue details. Provider statuses are
 * normalized to 502.
 */
function sanitizedProviderFailure(
  error: string,
  message: string,
  status = 502,
): NextResponse {
  return NextResponse.json({ ok: false, error, message }, { status });
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  let payload: OpenAiChatPayload;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
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

    if (!response.ok) {
      // Provider non-2xx: normalize to a stable sanitized 502 without reading
      // or echoing the provider status, error code/type/message, or body.
      return sanitizedProviderFailure(
        'openai_code_assistant_failed',
        'AI code assistant failed.',
      );
    }

    // Keep the same bounded timeout alive while consuming the response body.
    // Fetch can resolve after headers while json() remains stalled indefinitely.
    const rawPayload: unknown = await response.json();
    if (!isRecord(rawPayload)) {
      return sanitizedProviderFailure(
        'invalid_code_response_shape',
        'AI code assistant returned an unexpected JSON shape.',
      );
    }
    payload = rawPayload as OpenAiChatPayload;
  } catch {
    // Network/body rejection or bounded-timeout abort. Fixed internal message
    // only; never surface AbortError/network text, provider data, or secrets.
    return sanitizedProviderFailure(
      'openai_code_request_failed',
      'The AI code assistant request failed.',
    );
  } finally {
    clearTimeout(timeout);
  }
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return sanitizedProviderFailure(
      'missing_code_payload',
      'AI code assistant did not return any content.',
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    return sanitizedProviderFailure(
      'invalid_code_payload',
      'AI code assistant returned non-JSON content.',
    );
  }

  const parsedResult = codeAssistantResponseSchema.safeParse(json);
  if (!parsedResult.success) {
    // Malformed response shape: sanitized 502 with no Zod issue details, since
    // those could echo provider-produced field values.
    return sanitizedProviderFailure(
      'invalid_code_response_shape',
      'AI code assistant returned an unexpected JSON shape.',
    );
  }

  const { explanation, fixedCode } = parsedResult.data;
  const trimmedFixed = fixedCode && fixedCode.trim() ? fixedCode : null;

  // Action-specific contract enforcement (without touching the shared schema).
  if (input.action === 'explain') {
    // explain must never carry an applicable fixedCode/diff. If the provider
    // returned nonblank fixedCode anyway, fail closed rather than risk a
    // downstream apply via CodeAssistantPanel/CanvasNode/FunctionCodeEditor.
    if (trimmedFixed) {
      return sanitizedProviderFailure(
        'invalid_code_response_shape',
        'AI code assistant returned an unexpected JSON shape.',
      );
    }
    return NextResponse.json({
      ok: true,
      model,
      action: input.action,
      language: input.language,
      result: explanation,
      supportedActions: CODE_ASSISTANT_ACTIONS,
      finishReason: payload.choices?.[0]?.finish_reason ?? null,
    });
  }

  // fix / optimize / comment require a nonempty drop-in replacement for ok:true.
  if (!trimmedFixed) {
    return sanitizedProviderFailure(
      'invalid_code_response_shape',
      'AI code assistant returned an unexpected JSON shape.',
    );
  }

  const diffResult = trimmedFixed !== input.code
    ? buildUnifiedDiffResult(input.code, trimmedFixed, diffFilename(input.language))
    : undefined;

  return NextResponse.json({
    ok: true,
    model,
    action: input.action,
    language: input.language,
    result: explanation,
    fixedCode: trimmedFixed,
    diff: diffResult?.text,
    diffHunks: diffResult?.hunks,
    supportedActions: CODE_ASSISTANT_ACTIONS,
    finishReason: payload.choices?.[0]?.finish_reason ?? null,
  });
}
