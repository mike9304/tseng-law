import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  clearAllCacheKeys,
  clearCacheKey,
  listCacheKeys,
} from '@/lib/builder/ops/cache-introspection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const keys = await listCacheKeys();
  return NextResponse.json({ ok: true, keys, total: keys.length });
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
  return NextResponse.json({ ok: true, cleared: key });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const cleared = await clearAllCacheKeys();
  return NextResponse.json({ ok: true, cleared });
}