import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import {
  aggregateLogs,
  type UnifiedLogType,
} from '@/lib/builder/ops/logs-aggregator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_TYPES: ReadonlySet<UnifiedLogType> = new Set(['audit', 'dev', 'security', 'error']);

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'settings');
  if (auth instanceof NextResponse) return auth;

  const since = request.nextUrl.searchParams.get('since') ?? undefined;
  const typeParam = request.nextUrl.searchParams.get('type') ?? undefined;
  const type = typeParam && VALID_TYPES.has(typeParam as UnifiedLogType)
    ? (typeParam as UnifiedLogType)
    : undefined;

  const result = await aggregateLogs({ since, type, limit: 50 });
  return NextResponse.json({ ok: true, ...result });
}
