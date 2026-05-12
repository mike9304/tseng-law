import { NextRequest, NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { runDueScheduledPublishes } from '@/lib/builder/site/scheduled-publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function run(request: NextRequest): Promise<NextResponse> {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const limitParam = request.nextUrl.searchParams.get('limit');
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : Number.NaN;
  const result = await runDueScheduledPublishes({
    limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
  });
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: NextRequest) {
  return run(request);
}

export async function POST(request: NextRequest) {
  return run(request);
}
