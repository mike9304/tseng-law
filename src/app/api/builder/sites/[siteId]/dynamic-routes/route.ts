import { NextRequest, NextResponse } from 'next/server';
import { readBuilderDynamicRouteSummaries } from '@/lib/builder/dynamic-routes';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  try {
    const locale = normalizeLocale(new URL(request.url).searchParams.get('locale') ?? undefined);
    const routes = readBuilderDynamicRouteSummaries(locale);
    return NextResponse.json({ ok: true, siteId: params.siteId, locale, routes });
  } catch (error) {
    console.error('[builder-dynamic-routes] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder dynamic routes.' },
      { status: 500 }
    );
  }
}
