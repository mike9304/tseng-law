import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getAiIntakeVersion,
  normalizeAiIntakeSiteId,
} from '@/lib/builder/ai-generator/intake-versions-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const siteId = normalizeAiIntakeSiteId(request.nextUrl.searchParams.get('siteId') ?? undefined);
  const version = await getAiIntakeVersion(siteId, params.id);
  if (!version) {
    return NextResponse.json({ ok: false, error: 'version_not_found' }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    siteId,
    version,
    spec: version.spec,
    draft: version.draft,
  });
}
