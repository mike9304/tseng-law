import { NextRequest, NextResponse } from 'next/server';
import { runDueStoredAppHookRetries } from '@/lib/builder/apps/hook-retry-drain';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseLimit(request: NextRequest): number | undefined {
  const value = request.nextUrl.searchParams.get('limit');
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function run(request: NextRequest): Promise<NextResponse> {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const result = await runDueStoredAppHookRetries({ limit: parseLimit(request) });
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: NextRequest) {
  return run(request);
}

export async function POST(request: NextRequest) {
  return run(request);
}
