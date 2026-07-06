import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  clearCacheKey,
  inspectCacheInventory,
  purgeCacheKeys,
  readLatestCachePurgeReport,
} from '@/lib/builder/ops/cache-introspection';
import type { CachePurgeMode } from '@/lib/builder/ops/cache-introspection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const [inventory, latestPurge] = await Promise.all([
    inspectCacheInventory(),
    readLatestCachePurgeReport(),
  ]);
  return NextResponse.json({
    ok: true,
    keys: inventory.keys,
    total: inventory.summary.totalKeys,
    summary: inventory.summary,
    latestPurge,
  });
}

export async function DELETE(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const key = request.nextUrl.searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'key query param required' }, { status: 400 });
  }
  const ok = await clearCacheKey(key);
  if (!ok) return NextResponse.json({ error: 'unknown or unsafe key' }, { status: 404 });
  const inventory = await inspectCacheInventory();
  return NextResponse.json({ ok: true, cleared: key, summary: inventory.summary });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const mode = parseCachePurgeMode(request.nextUrl.searchParams.get('mode'));
  if (!mode) {
    return NextResponse.json({ error: 'mode must be all or stale' }, { status: 400 });
  }
  const report = await purgeCacheKeys({ mode });
  return NextResponse.json({
    ok: true,
    cleared: report.clearedKeys.length,
    report,
    summary: report.after,
  });
}

function parseCachePurgeMode(value: string | null): CachePurgeMode | null {
  if (value === null || value === '' || value === 'all') return 'all';
  if (value === 'stale') return 'stale';
  return null;
}
