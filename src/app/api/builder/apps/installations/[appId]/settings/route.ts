import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardMutation } from '@/lib/builder/security/guard';
import { updateBuilderAppSettings } from '@/lib/builder/apps/installed';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    appId: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const payload = await request.json().catch(() => ({})) as { settings?: unknown };
  const result = await updateBuilderAppSettings(
    DEFAULT_BUILDER_SITE_ID,
    locale,
    params.appId,
    auth.username,
    payload.settings,
  );

  if (!result) {
    return NextResponse.json({ ok: false, error: 'app_not_installed' }, { status: 404 });
  }

  if (result.validationErrors?.length) {
    return NextResponse.json(
      { ok: false, error: 'invalid_app_settings', validationErrors: result.validationErrors, entry: result.entry },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, ...result });
}
