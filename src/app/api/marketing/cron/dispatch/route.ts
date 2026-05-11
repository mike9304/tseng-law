import { NextRequest, NextResponse } from 'next/server';
import { dispatchPendingCampaigns } from '@/lib/builder/marketing/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET ?? '';
  if (!secret) return process.env.NODE_ENV !== 'production';
  const headerSecret =
    request.headers.get('x-cron-secret') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';
  return headerSecret === secret;
}

async function run(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await dispatchPendingCampaigns(50);
  return NextResponse.json({ ok: true, ...result });
}

export async function POST(request: NextRequest) {
  return run(request);
}
export async function GET(request: NextRequest) {
  return run(request);
}
