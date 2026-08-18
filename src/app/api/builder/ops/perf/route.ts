import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { capturePerfSnapshot } from '@/lib/builder/ops/perf-snapshot';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'settings');
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ ok: true, perf: capturePerfSnapshot() });
}
