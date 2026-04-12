import { NextResponse } from 'next/server';
import {
  decodeBuilderDynamicRouteParam,
  readBuilderDynamicRouteDetail,
} from '@/lib/builder/dynamic-routes';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { siteId: string; routeId: string } }
) {
  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  const routeId = decodeBuilderDynamicRouteParam(params.routeId);
  if (!routeId) {
    return NextResponse.json({ ok: false, error: 'Unknown builder dynamic route.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);
    const previewRecordId = url.searchParams.get('previewRecordId');
    const detail = readBuilderDynamicRouteDetail(routeId, locale, previewRecordId);
    return NextResponse.json({ ok: true, siteId: params.siteId, locale, detail });
  } catch (error) {
    console.error('[builder-dynamic-route-detail] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder dynamic route detail.' },
      { status: 500 }
    );
  }
}
