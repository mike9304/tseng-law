import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { buildSecuritySummary } from '@/lib/builder/ops/security-summary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const raw = request.nextUrl.searchParams.get('windowHours');
  const windowHours = raw ? Number.parseInt(raw, 10) : undefined;
  const summary = await buildSecuritySummary({
    windowHours: Number.isFinite(windowHours) ? windowHours : undefined,
  });
  return NextResponse.json({ ok: true, summary });
}