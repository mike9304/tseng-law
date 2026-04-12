import { NextResponse } from 'next/server';
import {
  isBuilderPageKey,
  isDefaultBuilderSiteId,
  readBuilderPageSnapshotOverview,
} from '@/lib/builder/site';

export async function GET(
  request: Request,
  { params }: { params: { siteId: string; pageKey: string } }
) {
  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder page.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const overview = await readBuilderPageSnapshotOverview(params.pageKey, locale);
    return NextResponse.json({ ok: true, overview });
  } catch (error) {
    console.error('[builder-page-overview] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder page overview.' },
      { status: 500 }
    );
  }
}
