import { NextRequest, NextResponse } from 'next/server';
import {
  isDefaultBuilderSiteId,
  readBuilderSiteOverview,
} from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const overview = await readBuilderSiteOverview(locale);
    return NextResponse.json({ ok: true, overview });
  } catch (error) {
    console.error('[builder-site-overview] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder site overview.' },
      { status: 500 }
    );
  }
}
