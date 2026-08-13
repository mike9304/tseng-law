import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { recordSecurityUserEvent } from '@/lib/builder/audit/record';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';
import {
  BUILDER_ROLE_NAMES,
  listUserRoles,
  upsertUserRole,
} from '@/lib/builder/security/user-role-store';
import { BUILDER_PERMISSIONS } from '@/lib/builder/security/permissions';
import { rolePermissionMatrix } from '@/lib/builder/security/role-permissions';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import {
  getBuilderUsersApiErrorPayload,
  type BuilderUsersApiErrorCode,
} from '@/lib/builder/security/users-api-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const upsertSchema = z.object({
  username: z.string().trim().min(1).max(180),
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

export async function GET(request: NextRequest) {
  const blocked = await guardBuilderReadWithPermission(request, 'manage-roles');
  if (blocked instanceof NextResponse) return blocked;
  const locale = resolveRequestLocale(request);
  try {
    const users = await listUserRoles();
    const matrix = rolePermissionMatrix(BUILDER_PERMISSIONS);
    return NextResponse.json({
      ok: true,
      total: users.length,
      users,
      roles: BUILDER_ROLE_NAMES,
      permissions: BUILDER_PERMISSIONS,
      matrix,
    });
  } catch (error) {
    console.error('[builder/security/users] GET failed:', error);
    return errorResponse(locale, 'users_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'manage-roles',
  });
  if (auth instanceof NextResponse) return auth;

  let errorLocale = resolveRequestLocale(request);
  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = upsertSchema.parse(body);
    if (!(await userHasPermission(auth.username, 'manage-roles'))) {
      return errorResponse(errorLocale, 'missing_manage_roles_permission', 403);
    }
    const user = await upsertUserRole({
      username: input.username,
      role: input.role as never,
      addedBy: auth.username,
    });
    await recordSecurityUserEvent({
      request,
      type: 'created',
      username: input.username,
      role: input.role,
    });
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/security/users] POST failed:', error);
    return errorResponse(errorLocale, 'user_create_failed', 500);
  }
}
