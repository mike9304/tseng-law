import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderHomeSnapshotHistoryDetailResponse,
  buildBuilderHomeSnapshotHistoryListResponse,
  isBuilderSnapshotKind,
  listBuilderHomeSnapshotHistory,
  normalizeBuilderHomeLocale,
  readBuilderHomeSnapshotHistoryDetail,
} from '@/lib/builder/persistence';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));
  const kindParam = request.nextUrl.searchParams.get('kind');
  const revisionId = request.nextUrl.searchParams.get('revisionId');
  const limitParam = request.nextUrl.searchParams.get('limit');
  const kind = kindParam ? (isBuilderSnapshotKind(kindParam) ? kindParam : null) : 'published';

  if (!kind) {
    return badRequest('Invalid snapshot kind.');
  }

  if (revisionId) {
    const result = await readBuilderHomeSnapshotHistoryDetail(kind, locale, revisionId);
    if (!result.record || !result.snapshot) {
      return NextResponse.json({ ok: false, error: 'Revision record not found.' }, { status: 404 });
    }
    return NextResponse.json(buildBuilderHomeSnapshotHistoryDetailResponse(result));
  }

  const parsedLimit =
    typeof limitParam === 'string' && limitParam.trim()
      ? Math.max(1, Math.min(20, Number.parseInt(limitParam, 10) || 8))
      : 8;
  const result = await listBuilderHomeSnapshotHistory(kind, locale, parsedLimit);
  return NextResponse.json(buildBuilderHomeSnapshotHistoryListResponse(result));
}
