import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getSendQueueStats } from '@/lib/builder/crm/campaign-queue';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, {
    allowReadOnly: true,
    permission: 'view-contacts',
  });
  if (auth instanceof NextResponse) return auth;

  const url = request.nextUrl;
  const recentLimitRaw = Number(url.searchParams.get('recent') ?? '20');
  const recentLimit = Number.isFinite(recentLimitRaw)
    ? Math.min(100, Math.max(0, Math.floor(recentLimitRaw)))
    : 20;

  const stats = await getSendQueueStats(recentLimit);
  return NextResponse.json({ ok: true, stats });
}