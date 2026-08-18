import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardMutation } from '@/lib/builder/security/guard';
import { updateBuilderAppSettings } from '@/lib/builder/apps/installed';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getBuilderAppsApiErrorPayload } from '@/lib/builder/apps/apps-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{
    appId: string;
  }>;
}

function errorResponse(locale: Locale, errorCode: Parameters<typeof getBuilderAppsApiErrorPayload>[1], status: number): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderAppsApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function PUT(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const payload = await request.json().catch(() => null) as { settings?: unknown } | null;
  if (!payload) {
    return errorResponse(locale, 'invalid_json', 400);
  }
  let result: Awaited<ReturnType<typeof updateBuilderAppSettings>>;
  try {
    result = await updateBuilderAppSettings(
      DEFAULT_BUILDER_SITE_ID,
      locale,
      params.appId,
      auth.username,
      payload.settings,
    );
  } catch (error) {
    console.error('[builder/apps/installations/:appId/settings] save failed:', error);
    return errorResponse(locale, 'app_settings_save_failed', 500);
  }

  if (!result) {
    return errorResponse(locale, 'app_not_installed', 404);
  }

  if (result.validationErrors?.length) {
    return NextResponse.json(
      {
        ok: false,
        ...getBuilderAppsApiErrorPayload(locale, 'invalid_app_settings'),
        validationErrors: result.validationErrors,
        entry: result.entry,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, ...result });
}
