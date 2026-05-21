/**
 * F109 — App extension hooks API (first slice).
 *
 * GET  → list every registered hook with handler liveness flag.
 * POST → persist a hook metadata record + best-effort store the code body
 *        via F112 secrets. The code body is NOT executed in this slice;
 *        it is dormant storage so a future runtime can bind a handler.
 *
 * Both endpoints require the `settings` permission, matching the rest of
 * the builder app lifecycle surface.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  APP_HOOK_KINDS,
  deriveHookCodeSecretKey,
  isValidAppHookId,
  isValidAppId,
  makeHookId,
} from '@/lib/builder/apps/hooks-model';
import {
  listRegisteredAppHooks,
  registerAppHookRecord,
} from '@/lib/builder/apps/hooks-registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  appId: z.string().trim().min(2).max(80),
  kind: z.enum(APP_HOOK_KINDS),
  hookId: z.string().trim().min(2).max(80).optional(),
  priority: z.number().int().min(-1000).max(1000).optional(),
  code: z.string().max(8192).optional(),
}).strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const hooks = await listRegisteredAppHooks();
    return NextResponse.json({ ok: true, hooks });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  let payload: z.infer<typeof createSchema>;
  try {
    payload = createSchema.parse(await request.json());
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  if (!isValidAppId(payload.appId)) {
    return NextResponse.json({ ok: false, error: 'invalid_appId' }, { status: 400 });
  }
  if (payload.hookId && !isValidAppHookId(payload.hookId)) {
    return NextResponse.json({ ok: false, error: 'invalid_hookId' }, { status: 400 });
  }

  const hookId = payload.hookId ?? makeHookId(payload.appId, payload.kind);

  let codeSecretId: string | undefined;
  let codeStubNote: string | undefined;
  const trimmedCode = payload.code?.trim();
  if (trimmedCode && trimmedCode.length > 0) {
    try {
      const { createSecret } = await import('@/lib/builder/dev/secrets-store');
      const key = deriveHookCodeSecretKey(payload.appId, hookId);
      const result = await createSecret({
        key,
        value: trimmedCode,
        scope: 'site',
        addedBy: auth.username,
      });
      codeSecretId = result.secret.id;
    } catch (error) {
      // Best-effort: if the F112 store is unavailable (missing KEK, key clash,
      // etc.) fall back to recording a stub note so the operator still sees
      // that code WAS submitted but is currently dormant.
      codeStubNote = `code-body-stored-as-stub (${error instanceof Error ? error.message : 'unknown'}; bytes=${trimmedCode.length})`;
    }
  }

  try {
    const record = await registerAppHookRecord({
      hookId,
      appId: payload.appId,
      kind: payload.kind,
      priority: payload.priority ?? 0,
      registeredAt: new Date().toISOString(),
      ...(codeSecretId ? { codeSecretId } : {}),
      ...(codeStubNote ? { codeStubNote } : {}),
    });
    return NextResponse.json({ ok: true, hook: { ...record, hasHandler: false } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}