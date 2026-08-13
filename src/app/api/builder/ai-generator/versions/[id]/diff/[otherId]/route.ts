import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import {
  diffAiIntakeVersions,
  getAiIntakeVersion,
  normalizeAiIntakeSiteId,
} from '@/lib/builder/ai-generator/intake-versions-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; otherId: string }> }
) {
  const params = await props.params;
  const auth = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (auth instanceof NextResponse) return auth;

  const siteId = normalizeAiIntakeSiteId(request.nextUrl.searchParams.get('siteId') ?? undefined);
  const left = await getAiIntakeVersion(siteId, params.id);
  const right = await getAiIntakeVersion(siteId, params.otherId);
  if (!left || !right) {
    return NextResponse.json({ ok: false, error: 'version_not_found' }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    siteId,
    leftId: left.id,
    rightId: right.id,
    diff: diffAiIntakeVersions(left, right),
  });
}
