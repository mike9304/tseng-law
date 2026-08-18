import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  AI_INTAKE_RESTORE_BLOCKED_MESSAGE,
  AI_INTAKE_RESTORE_ERROR_CODE,
  getAiIntakeVersion,
  isIntakeVersionRestorable,
  normalizeAiIntakeSiteId,
} from '@/lib/builder/ai-generator/intake-versions-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const siteId = normalizeAiIntakeSiteId(request.nextUrl.searchParams.get('siteId') ?? undefined);
  const version = await getAiIntakeVersion(siteId, params.id);
  if (!version) {
    return NextResponse.json({ ok: false, error: 'version_not_found' }, { status: 404 });
  }
  if (!isIntakeVersionRestorable(version, siteId)) {
    return NextResponse.json(
      {
        ok: false,
        error: AI_INTAKE_RESTORE_ERROR_CODE,
        message: AI_INTAKE_RESTORE_BLOCKED_MESSAGE,
      },
      { status: 422 },
    );
  }
  return NextResponse.json({
    ok: true,
    siteId,
    version,
    spec: version.spec,
    draft: version.draft,
  });
}
