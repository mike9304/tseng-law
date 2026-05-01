import { NextRequest, NextResponse } from 'next/server';
import { readRecentAuditEvents } from '@/lib/builder/audit/store';
import { guardBuilderRead } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;

  const limitParam = Number(request.nextUrl.searchParams.get('limit') ?? 200);
  const events = await readRecentAuditEvents(Number.isFinite(limitParam) ? limitParam : 200);

  return NextResponse.json({
    ok: true,
    events,
  });
}
