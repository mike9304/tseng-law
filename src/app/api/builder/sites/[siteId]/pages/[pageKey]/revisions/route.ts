import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderSnapshotHistoryDetailResponse,
  buildBuilderSnapshotHistoryListResponse,
  isBuilderSnapshotKind,
  listBuilderPageSnapshotHistory,
  readBuilderPageSnapshotHistoryDetail,
} from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string; pageKey: string } }
) {
  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder page.' }, { status: 404 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const kindParam = request.nextUrl.searchParams.get('kind');
  const revisionId = request.nextUrl.searchParams.get('revisionId');
  const limitParam = request.nextUrl.searchParams.get('limit');
  const kind = kindParam ? (isBuilderSnapshotKind(kindParam) ? kindParam : null) : 'published';

  if (!kind) {
    return badRequest('Invalid snapshot kind.');
  }

  if (revisionId) {
    const result = await readBuilderPageSnapshotHistoryDetail(params.pageKey, kind, locale, revisionId);
    if (!result.record || !result.snapshot) {
      return NextResponse.json({ ok: false, error: 'Revision record not found.' }, { status: 404 });
    }
    return NextResponse.json(buildBuilderSnapshotHistoryDetailResponse(result));
  }

  const parsedLimit =
    typeof limitParam === 'string' && limitParam.trim()
      ? Math.max(1, Math.min(20, Number.parseInt(limitParam, 10) || 8))
      : 8;
  const result = await listBuilderPageSnapshotHistory(params.pageKey, kind, locale, parsedLimit);
  return NextResponse.json(buildBuilderSnapshotHistoryListResponse(result));
}
