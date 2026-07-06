import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import {
  addSite,
  ensureDefaultAccount,
  listWorkspaceSites,
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
  siteId: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(120).optional(),
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
  const blocked = await guardBuilderReadWithPermission(request, 'settings');
  if (blocked instanceof NextResponse) return blocked;
  const locale = resolveRequestLocale(request);
  try {
    await ensureDefaultAccount();
    const sites = await listWorkspaceSites();
    return NextResponse.json({ ok: true, total: sites.length, sites });
  } catch (error) {
    console.error('[builder/workspace/sites] GET failed:', error);
    return errorResponse(locale, 'sites_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  let errorLocale = resolveRequestLocale(request);

  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = createSchema.parse(body);
    await ensureDefaultAccount();
    const site = await addSite({
      siteId: input.siteId,
      name: input.name,
      role: input.role,
    });
    return NextResponse.json({ ok: true, site }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/workspace/sites] POST failed:', error);
    return errorResponse(errorLocale, 'site_create_failed', 500);
  }
}
