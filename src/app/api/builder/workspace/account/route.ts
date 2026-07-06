import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import {
  ensureDefaultAccount,
  listMembers,
  listWorkspaceSites,
  updateAccountName,
} from '@/lib/builder/workspace/workspace-store';
import {
  type BuilderWorkspaceApiErrorCode,
  getBuilderWorkspaceApiErrorPayload,
} from '@/lib/builder/workspace/workspace-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120),
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
  const blocked = await guardBuilderReadWithPermission(request, 'settings');
  if (blocked instanceof NextResponse) return blocked;
  const locale = resolveRequestLocale(request);

  try {
    const account = await ensureDefaultAccount();
    const [sites, members] = await Promise.all([listWorkspaceSites(), listMembers()]);
    return NextResponse.json({
      ok: true,
      account,
      siteCount: sites.length,
      memberCount: members.length,
      sites,
    });
  } catch (error) {
    console.error('[builder/workspace/account] GET failed:', error);
    return errorResponse(locale, 'account_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  let errorLocale = resolveRequestLocale(request);

  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const patch = patchSchema.parse(body);
    const account = await updateAccountName(patch.name);
    return NextResponse.json({ ok: true, account });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/workspace/account] PATCH failed:', error);
    return errorResponse(errorLocale, 'account_update_failed', 500);
  }
}
