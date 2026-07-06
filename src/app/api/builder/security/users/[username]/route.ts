import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { recordSecurityUserEvent } from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  BUILDER_ROLE_NAMES,
  removeUserRole,
  upsertUserRole,
} from '@/lib/builder/security/user-role-store';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import {
  getBuilderUsersApiErrorPayload,
  type BuilderUsersApiErrorCode,
} from '@/lib/builder/security/users-api-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  role: z.enum(BUILDER_ROLE_NAMES as unknown as [string, ...string[]]),
  locale: z.string().trim().max(20).optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: BuilderUsersApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderUsersApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  const queryLocale = request.nextUrl.searchParams.get('locale') ?? undefined;
  if (isLocale(queryLocale)) return queryLocale;
  if (payload && typeof payload === 'object') {
    const locale = (payload as { locale?: unknown }).locale;
    if (typeof locale === 'string' && isLocale(locale)) return locale;
  }
  return normalizeLocale(queryLocale);
}

function decodeUsername(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'manage-roles',
  });
  if (auth instanceof NextResponse) return auth;

  let errorLocale = resolveRequestLocale(request);
  try {
    if (!(await userHasPermission(auth.username, 'manage-roles'))) {
      return errorResponse(errorLocale, 'missing_manage_roles_permission', 403);
    }
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const patch = patchSchema.parse(body);
    const username = decodeUsername(params.username);
    const user = await upsertUserRole({
      username,
      role: patch.role as never,
      addedBy: auth.username,
    });
    await recordSecurityUserEvent({
      request,
      type: 'updated',
      username,
      role: patch.role,
    });
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/security/users/[username]] PATCH failed:', error);
    return errorResponse(errorLocale, 'user_update_failed', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'manage-roles',
  });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);
  try {
    if (!(await userHasPermission(auth.username, 'manage-roles'))) {
      return errorResponse(locale, 'missing_manage_roles_permission', 403);
    }
    const username = decodeUsername(params.username);
    const removed = await removeUserRole(username);
    if (!removed) return errorResponse(locale, 'user_not_found', 404);
    await recordSecurityUserEvent({
      request,
      type: 'removed',
      username,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/security/users/[username]] DELETE failed:', error);
    return errorResponse(locale, 'user_delete_failed', 500);
  }
}
