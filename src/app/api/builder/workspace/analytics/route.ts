import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { normalizeLocale } from '@/lib/locales';
import { ensureDefaultAccount } from '@/lib/builder/workspace/workspace-store';
import { buildWorkspaceAnalyticsRollup } from '@/lib/builder/workspace/analytics-aggregate';
import { getBuilderWorkspaceApiErrorPayload } from '@/lib/builder/workspace/workspace-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const blocked = await guardBuilderReadWithPermission(request, 'settings');
  if (blocked instanceof NextResponse) return blocked;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  try {
    await ensureDefaultAccount();
    const rollup = await buildWorkspaceAnalyticsRollup();
    return NextResponse.json({ ok: true, rollup });
  } catch (error) {
    console.error('[builder/workspace/analytics] GET failed:', error);
    return NextResponse.json(
      { ok: false, ...getBuilderWorkspaceApiErrorPayload(locale, 'analytics_load_failed') },
      { status: 500 },
    );
  }
}
