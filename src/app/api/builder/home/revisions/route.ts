import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderHomeSnapshotHistoryDetailResponse,
  buildBuilderHomeSnapshotHistoryListResponse,
  isBuilderSnapshotKind,
  listBuilderHomeSnapshotHistory,
  normalizeBuilderHomeLocale,
  readBuilderHomeSnapshotHistoryDetail,
} from '@/lib/builder/persistence';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';

function errorResponse(
  locale: ReturnType<typeof normalizeBuilderHomeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));
  const kindParam = request.nextUrl.searchParams.get('kind');
  const revisionId = request.nextUrl.searchParams.get('revisionId');
  const limitParam = request.nextUrl.searchParams.get('limit');
  const kind = kindParam ? (isBuilderSnapshotKind(kindParam) ? kindParam : null) : 'published';

  if (!kind) {
    return errorResponse(locale, 'home_snapshot_kind_invalid', 400);
  }

  try {
    if (revisionId) {
      const result = await readBuilderHomeSnapshotHistoryDetail(kind, locale, revisionId);
      if (!result.record || !result.snapshot) {
        return errorResponse(locale, 'home_revision_not_found', 404);
      }
      return NextResponse.json(buildBuilderHomeSnapshotHistoryDetailResponse(result));
    }

    const parsedLimit =
      typeof limitParam === 'string' && limitParam.trim()
        ? Math.max(1, Math.min(20, Number.parseInt(limitParam, 10) || 8))
        : 8;
    const result = await listBuilderHomeSnapshotHistory(kind, locale, parsedLimit);
    return NextResponse.json(buildBuilderHomeSnapshotHistoryListResponse(result));
  } catch {
    return errorResponse(locale, 'home_revisions_load_failed', 500);
  }
}
