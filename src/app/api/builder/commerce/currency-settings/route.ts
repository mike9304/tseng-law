import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { loadCurrencySettings, saveCurrencySettings } from '@/lib/builder/commerce/currency-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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
    return NextResponse.json({ ok: false, error: 'currency_settings_failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => null) as { settings?: unknown } | null;
    const settings = await saveCurrencySettings(body?.settings ?? body);
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error('[builder/commerce/currency-settings] PATCH failed:', error);
    return NextResponse.json({ ok: false, error: 'currency_settings_save_failed' }, { status: 500 });
  }
}
