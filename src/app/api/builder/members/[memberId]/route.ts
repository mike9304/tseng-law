import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  deleteMember,
  getMember,
  publicMember,
  updateMemberAdmin,
} from '@/lib/builder/members/members-engine';
import {
  getBuilderMembersApiErrorPayload,
  type BuilderMembersApiErrorCode,
} from '@/lib/builder/members/builder-members-api-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(80).optional(),
  role: z.enum(['free', 'premium', 'admin']).optional(),
  verified: z.boolean().optional(),
  blocked: z.boolean().optional(),
  locale: z.string().trim().max(20).optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: BuilderMembersApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderMembersApiErrorPayload(locale, errorCode), ...extras },
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

export async function GET(request: NextRequest, { params }: { params: { memberId: string } }) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);
  try {
    const member = await getMember(params.memberId);
    if (!member) return errorResponse(locale, 'member_not_found', 404);
    return NextResponse.json({ ok: true, member: publicMember(member) });
  } catch (error) {
    console.error('[builder/members/[memberId]] GET failed:', error);
    return errorResponse(locale, 'member_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { memberId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let errorLocale = resolveRequestLocale(request);
  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const patch = patchSchema.parse(body);
    const member = await updateMemberAdmin(params.memberId, {
      ...(patch.name != null ? { name: patch.name } : {}),
      ...(patch.phone != null ? { phone: patch.phone } : {}),
      ...(patch.role != null ? { role: patch.role } : {}),
      ...(patch.verified != null ? { verified: patch.verified } : {}),
      ...(patch.blocked != null ? { blocked: patch.blocked } : {}),
    });
    if (!member) return errorResponse(errorLocale, 'member_not_found', 404);
    return NextResponse.json({ ok: true, member: publicMember(member) });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/members/[memberId]] PATCH failed:', error);
    return errorResponse(errorLocale, 'member_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { memberId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);
  try {
    await deleteMember(params.memberId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/members/[memberId]] DELETE failed:', error);
    return errorResponse(locale, 'member_delete_failed', 500);
  }
}
