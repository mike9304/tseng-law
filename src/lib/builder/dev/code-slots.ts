import { z } from 'zod';
import {
  BUILDER_FUNCTION_INVOCATION_RUNTIME,
  invokeBuilderFunctionCode,
  type BuilderFunctionInvocationResult,
} from '@/lib/builder/dev/function-invoker';
import { CANVAS_CODE_SLOT_EXECUTABLE_LANGUAGES } from '@/lib/builder/dev/code-slot-languages';
import { buildCanvasCodeSlotLogReference } from '@/lib/builder/dev/code-slot-reference';
import { readBuilderFunctions } from '@/lib/builder/dev/functions-model';
import { appendLog } from '@/lib/builder/dev/logs-store';

const titleSchema = z.string().trim().max(120).optional();

const inlineCodeSlotRunPayloadSchema = z.object({
  mode: z.literal('inline'),
  title: titleSchema,
  language: z.enum(CANVAS_CODE_SLOT_EXECUTABLE_LANGUAGES),
  code: z.string().trim().min(1).max(20000),
}).strict();

const functionCodeSlotRunPayloadSchema = z.object({
  mode: z.literal('function'),
  title: titleSchema,
  functionSlug: z.string().trim().min(1).max(80),
}).strict();

const canvasCodeSlotRunPayloadSchema = z.preprocess((input) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return input;
  const record = input as Record<string, unknown>;
  return 'mode' in record ? input : { ...record, mode: 'inline' };
}, z.discriminatedUnion('mode', [
  inlineCodeSlotRunPayloadSchema,
  functionCodeSlotRunPayloadSchema,
]));

type CanvasCodeSlotStatus = 200 | 404 | 408 | 409 | 500;

type CanvasCodeSlotRunErrorCode = 'function_not_found' | 'function_disabled';

type CanvasCodeSlotRunError = Extract<BuilderFunctionInvocationResult, { ok: false }> & {
  readonly status: Exclude<CanvasCodeSlotStatus, 200>;
  readonly errorCode: CanvasCodeSlotRunErrorCode;
};

export type CanvasCodeSlotRunResult = BuilderFunctionInvocationResult | CanvasCodeSlotRunError;

const canvasCodeSlotFunctionPayloadSchema = z.object({
  title: z.string().trim().max(120).optional(),
  functionSlug: z.string().trim().min(1).max(80),
});

export type { CanvasCodeSlotExecutableLanguage } from '@/lib/builder/dev/code-slot-languages';
export type CanvasCodeSlotRunPayload = z.infer<typeof canvasCodeSlotRunPayloadSchema>;

export type CanvasCodeSlotParseResult =
  | { readonly ok: true; readonly payload: CanvasCodeSlotRunPayload }
  | {
    readonly ok: false;
    readonly status: 400;
    readonly errorCode: 'invalid_payload' | 'unsupported_language' | 'empty_code' | 'function_not_selected';
    readonly error: string;
  };

export function parseCanvasCodeSlotRunPayload(input: unknown): CanvasCodeSlotParseResult {
  const parsed = canvasCodeSlotRunPayloadSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, payload: parsed.data };
  }

  const languageIssue = parsed.error.issues.find((issue) => issue.path.join('.') === 'language');
  if (languageIssue) {
    return {
      ok: false,
      status: 400,
      errorCode: 'unsupported_language',
      error: 'Canvas code slots can run JavaScript or TypeScript function-body snippets only.',
    };
  }

  const functionIssue = parsed.error.issues.find((issue) => issue.path.join('.') === 'functionSlug');
  if (functionIssue) {
    return {
      ok: false,
      status: 400,
      errorCode: 'function_not_selected',
      error: 'Select a stored builder function before running this canvas code slot.',
    };
  }

  const codeIssue = parsed.error.issues.find((issue) => issue.path.join('.') === 'code');
  if (codeIssue) {
    return {
      ok: false,
      status: 400,
      errorCode: 'empty_code',
      error: 'Canvas code slot code is required.',
    };
  }

  return {
    ok: false,
    status: 400,
    errorCode: 'invalid_payload',
    error: 'Invalid canvas code slot payload.',
  };
}

function appendCanvasCodeSlotError(
  error: string,
  reference: string,
  status: Exclude<CanvasCodeSlotStatus, 200>,
  errorCode: CanvasCodeSlotRunErrorCode,
): CanvasCodeSlotRunError {
  appendLog('function', { level: 'error', message: error, reference });
  return {
    ok: false,
    error,
    errorCode,
    status,
    logs: [],
    runtime: BUILDER_FUNCTION_INVOCATION_RUNTIME,
    durationMs: 0,
  };
}

async function runCodeSlotFunctionBody(
  code: string,
  reference: string,
): Promise<BuilderFunctionInvocationResult> {
  const invocation = await invokeBuilderFunctionCode(code, {
    onLog: (entry) => {
      appendLog('function', { ...entry, reference });
    },
  });

  if (!invocation.ok) {
    appendLog('function', {
      level: 'error',
      message: invocation.error,
      reference,
    });
  }

  return invocation;
}

export async function runCanvasCodeSlot(
  payload: CanvasCodeSlotRunPayload,
): Promise<CanvasCodeSlotRunResult> {
  if (payload.mode === 'inline') {
    return runCodeSlotFunctionBody(
      payload.code,
      buildCanvasCodeSlotLogReference(payload.title),
    );
  }

  const functionPayload = canvasCodeSlotFunctionPayloadSchema.parse(payload);
  const functions = await readBuilderFunctions();
  const fn = functions.find((entry) => (
    entry.slug === functionPayload.functionSlug || entry.id === functionPayload.functionSlug
  ));
  const reference = buildCanvasCodeSlotLogReference(
    functionPayload.title,
    fn?.slug ?? functionPayload.functionSlug,
  );

  if (!fn) {
    return appendCanvasCodeSlotError(
      'Function not found',
      reference,
      404,
      'function_not_found',
    );
  }

  if (!fn.enabled) {
    return appendCanvasCodeSlotError(
      'Function disabled',
      reference,
      409,
      'function_disabled',
    );
  }

  return runCodeSlotFunctionBody(fn.code, reference);
}
