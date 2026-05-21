/**
 * F110 — Dev logs read endpoint.
 *
 * Auth-required (read-only); UI panels poll this every few seconds.
 */

import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import {
  listLogs,
  type DevLogSource,
} from '@/lib/builder/dev/logs-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_SOURCES: ReadonlySet<DevLogSource> = new Set(['function', 'webhook', 'app']);

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const sourceParam = request.nextUrl.searchParams.get('source') ?? 'function';
  if (!ALLOWED_SOURCES.has(sourceParam as DevLogSource)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_source', allowed: Array.from(ALLOWED_SOURCES) },
      { status: 400 },
    );
  }
  const sinceTs = request.nextUrl.searchParams.get('since') ?? undefined;
  const limitParam = request.nextUrl.searchParams.get('limit');
  const limit = limitParam ? Math.max(1, Math.min(200, Number.parseInt(limitParam, 10) || 0)) : undefined;
  const entries = listLogs(sourceParam as DevLogSource, { sinceTs, limit });
  return NextResponse.json({ ok: true, source: sourceParam, entries });
}