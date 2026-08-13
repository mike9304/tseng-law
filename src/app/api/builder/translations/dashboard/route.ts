import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { buildTranslationDashboard } from '@/lib/builder/translations/dashboard-model';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';
import { getBuilderTranslationsApiErrorPayload } from '@/lib/builder/translations/translations-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveRequestLocale(request: NextRequest): Locale {
  return normalizeLocale(
    request.nextUrl.searchParams.get('locale') ||
      request.nextUrl.searchParams.get('sourceLocale') ||
      DEFAULT_TRANSLATION_SOURCE_LOCALE,
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'manage-translations');
  if (auth instanceof NextResponse) return auth;

  try {
    const sourceLocale = normalizeLocale(
      request.nextUrl.searchParams.get('sourceLocale') ||
        DEFAULT_TRANSLATION_SOURCE_LOCALE,
    );
    const siteId = request.nextUrl.searchParams.get('siteId') || 'default';
    const payload = await buildTranslationDashboard(siteId, sourceLocale);
    return NextResponse.json(payload);
  } catch (error) {
    console.error('[builder/translations/dashboard] load failed:', error);
    return NextResponse.json(
      {
        ok: false,
        ...getBuilderTranslationsApiErrorPayload(resolveRequestLocale(request), 'translation_dashboard_failed'),
      },
      { status: 500 },
    );
  }
}
