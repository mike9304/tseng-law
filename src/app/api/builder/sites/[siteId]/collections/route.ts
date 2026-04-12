import { NextResponse } from 'next/server';
import { readBuilderCollectionSummaries } from '@/lib/builder/cms';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';

export async function GET(
  request: Request,
  { params }: { params: { siteId: string } }
) {
  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const collections = readBuilderCollectionSummaries(locale);
    return NextResponse.json({ ok: true, collections });
  } catch (error) {
    console.error('[builder-collections] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder collections.' },
      { status: 500 }
    );
  }
}
