import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import {
  removeMember,
  updateMemberRole,
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

const patchSchema = z.object({
  role: z.custom<BuilderWorkspaceRole>(isBuilderWorkspaceRole),
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

function decodeEmail(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function isOwnerRoleRequiredError(error: unknown): boolean {
  const summary = String(error);
  return summary.includes('Cannot demote the only owner.')
    || summary.includes('Cannot remove the only owner.');
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ email: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-users' });
  if (auth instanceof NextResponse) return auth;
  let errorLocale = resolveRequestLocale(request);

  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const patch = patchSchema.parse(body);
    const email = decodeEmail(params.email);
    const member = await updateMemberRole(email, patch.role);
    if (!member) return errorResponse(errorLocale, 'member_not_found', 404);
    return NextResponse.json({ ok: true, member });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    if (isOwnerRoleRequiredError(error)) {
      return errorResponse(errorLocale, 'owner_role_required', 409);
    }
    console.error('[builder/workspace/members/:email] PATCH failed:', error);
    return errorResponse(errorLocale, 'member_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ email: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-users' });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);
  try {
    const email = decodeEmail(params.email);
    const removed = await removeMember(email);
    if (!removed) return errorResponse(locale, 'member_not_found', 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isOwnerRoleRequiredError(error)) {
      return errorResponse(locale, 'owner_role_required', 409);
    }
    console.error('[builder/workspace/members/:email] DELETE failed:', error);
    return errorResponse(locale, 'member_delete_failed', 500);
  }
}
