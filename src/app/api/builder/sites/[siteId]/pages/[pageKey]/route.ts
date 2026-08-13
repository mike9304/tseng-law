import { NextRequest, NextResponse } from 'next/server';
import {
  isBuilderPageKey,
  isDefaultBuilderSiteId,
  readBuilderPageSnapshotOverview,
} from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { normalizeLocale } from '@/lib/locales';

function errorResponse(
  locale: ReturnType<typeof normalizeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ siteId: string; pageKey: string }> }
) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const locale = normalizeLocale(url.searchParams.get('locale') ?? undefined);

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return errorResponse(locale, 'builder_site_not_found', 404);
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return errorResponse(locale, 'builder_page_not_found', 404);
  }

  try {
    const overview = await readBuilderPageSnapshotOverview(params.pageKey, locale);
    return NextResponse.json({ ok: true, overview });
  } catch (error) {
    console.error('[builder-page-overview] failed', error);
    return errorResponse(locale, 'draft_load_failed', 500);
  }
}
