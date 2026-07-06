import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderSnapshotHistoryDetailResponse,
  buildBuilderSnapshotHistoryListResponse,
  isBuilderSnapshotKind,
  listBuilderPageSnapshotHistory,
  readBuilderPageSnapshotHistoryDetail,
} from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

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
  { params }: { params: { siteId: string; pageKey: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return errorResponse(locale, 'builder_site_not_found', 404);
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return errorResponse(locale, 'builder_page_not_found', 404);
  }

  const kindParam = request.nextUrl.searchParams.get('kind');
  const revisionId = request.nextUrl.searchParams.get('revisionId');
  const limitParam = request.nextUrl.searchParams.get('limit');
  const kind = kindParam ? (isBuilderSnapshotKind(kindParam) ? kindParam : null) : 'published';

  if (!kind) {
    return errorResponse(locale, 'revision_kind_invalid', 400);
  }

  try {
    if (revisionId) {
      const result = await readBuilderPageSnapshotHistoryDetail(params.pageKey, kind, locale, revisionId);
      if (!result.record || !result.snapshot) {
        return errorResponse(locale, 'revision_not_found', 404);
      }
      return NextResponse.json(buildBuilderSnapshotHistoryDetailResponse(result));
    }

    const parsedLimit =
      typeof limitParam === 'string' && limitParam.trim()
        ? Math.max(1, Math.min(20, Number.parseInt(limitParam, 10) || 8))
        : 8;
    const result = await listBuilderPageSnapshotHistory(params.pageKey, kind, locale, parsedLimit);
    return NextResponse.json(buildBuilderSnapshotHistoryListResponse(result));
  } catch {
    return errorResponse(locale, 'revision_load_failed', 500);
  }
}
