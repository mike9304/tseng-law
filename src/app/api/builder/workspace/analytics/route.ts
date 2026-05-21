import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { ensureDefaultAccount } from '@/lib/builder/workspace/workspace-store';
import { buildWorkspaceAnalyticsRollup } from '@/lib/builder/workspace/analytics-aggregate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const blocked = guardBuilderRead(request);
  if (blocked instanceof NextResponse) return blocked;
  try {
    await ensureDefaultAccount();
    const rollup = await buildWorkspaceAnalyticsRollup();
    return NextResponse.json({ ok: true, rollup });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}