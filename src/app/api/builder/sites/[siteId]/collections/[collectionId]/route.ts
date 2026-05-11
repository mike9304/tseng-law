import { NextRequest, NextResponse } from 'next/server';
import {
  isBuilderCollectionId,
  readBuilderCollectionDetail,
} from '@/lib/builder/cms';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string; collectionId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  if (!isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const detail = readBuilderCollectionDetail(params.collectionId, locale);
    return NextResponse.json({ ok: true, detail });
  } catch (error) {
    console.error('[builder-collection-detail] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder collection detail.' },
      { status: 500 }
    );
  }
}
