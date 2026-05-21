import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  collectHealthSnapshot,
  readLatestHealthSnapshot,
} from '@/lib/builder/ops/health-collector';
import { OPS_HEALTH_SNAPSHOT_TTL_MS } from '@/lib/builder/ops/health-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;

  const cached = await readLatestHealthSnapshot();
  if (cached) {
    const ageMs = Date.now() - Date.parse(cached.gatheredAt);
    if (Number.isFinite(ageMs) && ageMs < OPS_HEALTH_SNAPSHOT_TTL_MS) {
      return NextResponse.json({ ok: true, snapshot: cached, cached: true });
    }
  }

  const snapshot = await collectHealthSnapshot();
  return NextResponse.json({ ok: true, snapshot, cached: false });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const snapshot = await collectHealthSnapshot();
  return NextResponse.json({ ok: true, snapshot }, { status: 201 });
}