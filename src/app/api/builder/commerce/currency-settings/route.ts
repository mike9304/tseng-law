import { NextRequest, NextResponse } from 'next/server';
import { recordCommerceSettingsUpdated } from '@/lib/builder/audit/record';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceCurrencySettingsApiErrorPayload,
  type CommerceCurrencySettingsApiErrorCode,
} from '@/lib/builder/commerce/currency-settings-copy';
import { loadCurrencySettings, saveCurrencySettings } from '@/lib/builder/commerce/currency-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(locale: Locale, errorCode: CommerceCurrencySettingsApiErrorCode, status: number): NextResponse {
  return NextResponse.json({
    ok: false,
    ...getCommerceCurrencySettingsApiErrorPayload(locale, errorCode),
  }, { status });
}

export async function GET(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const scope = request.nextUrl.searchParams.get('scope') === 'all' ? 'all' : 'public';
    if (scope === 'all') {
      const auth = requireBuilderAdminAuth(request);
      if (auth instanceof NextResponse) return auth;
    }
    const settings = await loadCurrencySettings();
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error('[builder/commerce/currency-settings] GET failed:', error);
    return errorResponse(errorLocale, 'currency_settings_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => null) as { settings?: unknown } | null;
    const settings = await saveCurrencySettings(body?.settings ?? body);
    await recordCommerceSettingsUpdated({ request, area: 'currency' });
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error('[builder/commerce/currency-settings] PATCH failed:', error);
    return errorResponse(errorLocale, 'currency_settings_save_failed', 500);
  }
}
