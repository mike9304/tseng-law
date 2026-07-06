import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import {
  addMember,
  ensureDefaultAccount,
  listMembers,
} from '@/lib/builder/workspace/workspace-store';
import {
  isBuilderWorkspaceRole,
  type BuilderWorkspaceRole,
} from '@/lib/builder/workspace/account-model';
import {
  type BuilderWorkspaceApiErrorCode,
  getBuilderWorkspaceApiErrorPayload,
} from '@/lib/builder/workspace/workspace-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  email: z.string().trim().email().max(180),
  role: z.custom<BuilderWorkspaceRole>(isBuilderWorkspaceRole).optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: BuilderWorkspaceApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderWorkspaceApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  const bodyLocale = payload && typeof payload === 'object'
    ? (payload as { locale?: unknown }).locale
    : undefined;
  return normalizeLocale(
    typeof bodyLocale === 'string' ? bodyLocale : request.nextUrl.searchParams.get('locale') ?? undefined,
  );
}

export async function GET(request: NextRequest) {
  const blocked = await guardBuilderReadWithPermission(request, 'manage-users');
  if (blocked instanceof NextResponse) return blocked;
  const locale = resolveRequestLocale(request);
  try {
    await ensureDefaultAccount();
    const members = await listMembers();
    return NextResponse.json({ ok: true, total: members.length, members });
  } catch (error) {
    console.error('[builder/workspace/members] GET failed:', error);
    return errorResponse(locale, 'members_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-users' });
  if (auth instanceof NextResponse) return auth;
  let errorLocale = resolveRequestLocale(request);

  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = createSchema.parse(body);
    await ensureDefaultAccount();
    const member = await addMember({
      email: input.email,
      role: input.role,
    });
    return NextResponse.json({ ok: true, member }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/workspace/members] POST failed:', error);
    return errorResponse(errorLocale, 'member_create_failed', 500);
  }
}
