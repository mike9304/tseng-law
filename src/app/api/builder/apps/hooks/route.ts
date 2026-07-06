/**
 * F109 — App extension hooks API (first slice).
 *
 * GET  → list every registered hook with handler liveness flag.
 * POST → persist a hook metadata record + best-effort store the code body
 *        via F112 secrets. Stored code is invoked by the lifecycle dispatcher
 *        and the guarded `/api/builder/apps/hooks/invoke` route when a secret
 *        record is available.
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
import {
  getBuilderAppsApiErrorPayload,
  type BuilderAppsApiErrorCode,
} from '@/lib/builder/apps/apps-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  appId: z.string().trim().min(2).max(80),
  kind: z.enum(APP_HOOK_KINDS),
  hookId: z.string().trim().min(2).max(80).optional(),
  priority: z.number().int().min(-1000).max(1000).optional(),
  code: z.string().max(8192).optional(),
}).strict();

function errorResponse(
  locale: Locale,
  errorCode: BuilderAppsApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderAppsApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderAppsApiErrorPayload(locale, 'invalid_request'), issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const hooks = await listRegisteredAppHooks();
    return NextResponse.json({ ok: true, hooks });
  } catch (error) {
    console.error('[builder/apps/hooks] list failed:', error);
    return errorResponse(locale, 'hooks_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  let payload: z.infer<typeof createSchema>;
  try {
    payload = createSchema.parse(await request.json());
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'invalid_request', 400);
  }

  if (!isValidAppId(payload.appId)) {
    return errorResponse(locale, 'invalid_app_id', 400);
  }
  if (payload.hookId && !isValidAppHookId(payload.hookId)) {
    return errorResponse(locale, 'invalid_hook_id', 400);
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
    } catch {
      // Best-effort: if the F112 store is unavailable (missing KEK, key clash,
      // etc.) fall back to recording a stub note so the operator still sees
      // that code WAS submitted but cannot run yet.
      codeStubNote = `code-body-stored-as-stub (secret-store-unavailable; bytes=${trimmedCode.length})`;
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
    console.error('[builder/apps/hooks] register failed:', error);
    return errorResponse(locale, 'hook_register_failed', 500);
  }
}
