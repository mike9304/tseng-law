import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  createMember,
  listMembers,
  publicMember,
} from '@/lib/builder/members/members-engine';
import {
  getBuilderMembersApiErrorPayload,
  type BuilderMembersApiErrorCode,
} from '@/lib/builder/members/builder-members-api-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const memberCreateSchema = z.object({
  email: z.string().trim().email().max(180),
  name: z.string().trim().min(1).max(120),
  password: z.string().min(8).max(128),
  role: z.enum(['free', 'premium', 'admin']).default('free'),
  verified: z.boolean().default(true),
  locale: z.string().trim().max(20).optional(),
});

const duplicateEmailEngineMessages = new Set(['duplicate_email', '이미 가입된 이메일입니다.']);

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

function createErrorCode(error: unknown): BuilderMembersApiErrorCode {
  if (error instanceof Error) {
    const { message } = error;
    if (duplicateEmailEngineMessages.has(message)) return 'duplicate_email';
  }
  return 'member_create_failed';
}

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const locale = resolveRequestLocale(request);
  try {
    const role = request.nextUrl.searchParams.get('role') ?? 'all';
    const members = (await listMembers())
      .filter((member) => role === 'all' || member.role === role)
      .map(publicMember)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return NextResponse.json({ ok: true, total: members.length, members });
  } catch (error) {
    console.error('[builder/members] GET failed:', error);
    return errorResponse(locale, 'members_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let errorLocale = resolveRequestLocale(request);
  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = memberCreateSchema.parse(body);
    const member = await createMember({
      email: input.email,
      name: input.name,
      password: input.password,
      role: input.role,
      verified: input.verified,
    });
    return NextResponse.json({ ok: true, member: publicMember(member) }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    const errorCode = createErrorCode(error);
    if (errorCode !== 'duplicate_email') console.error('[builder/members] POST failed:', error);
    return errorResponse(errorLocale, errorCode, errorCode === 'duplicate_email' ? 409 : 500);
  }
}
