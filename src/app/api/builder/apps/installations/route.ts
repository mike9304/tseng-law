import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardMutation } from '@/lib/builder/security/guard';
import { installBuilderApp, listBuilderAppCatalogEntries } from '@/lib/builder/apps/installed';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getBuilderAppsApiErrorPayload,
  type BuilderAppsApiErrorCode,
} from '@/lib/builder/apps/apps-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const installPayloadSchema = z.object({
  appId: z.string().trim().min(2).max(80),
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

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const entries = await listBuilderAppCatalogEntries(DEFAULT_BUILDER_SITE_ID, locale, { status: 'installed' });
    return NextResponse.json({ ok: true, entries });
  } catch (error) {
    console.error('[builder/apps/installations] list failed:', error);
    return errorResponse(locale, 'apps_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  let payload: z.infer<typeof installPayloadSchema>;
  try {
    payload = installPayloadSchema.parse(await request.json());
  } catch (error) {
    return errorResponse(locale, error instanceof z.ZodError ? 'invalid_request' : 'invalid_json', 400);
  }
  try {
    const result = await installBuilderApp(DEFAULT_BUILDER_SITE_ID, locale, payload.appId, auth.username);
    if (!result) {
      return errorResponse(locale, 'app_not_found', 404);
    }
    if (result.migrationFailed) {
      return errorResponse(locale, 'app_migration_failed', 409, result as unknown as Record<string, unknown>);
    }
    return NextResponse.json({ ok: true, ...result }, { status: result.changed ? 201 : 200 });
  } catch (error) {
    console.error('[builder/apps/installations] install failed:', error);
    return errorResponse(locale, 'app_action_failed', 500);
  }
}
