import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { buildTranslationDashboard } from '@/lib/builder/translations/dashboard-model';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
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
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}