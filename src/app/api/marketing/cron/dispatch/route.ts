import { NextRequest, NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { dispatchPendingCampaigns } from '@/lib/builder/marketing/dispatcher';
import { getPublicMarketingApiErrorPayload } from '@/lib/builder/marketing/marketing-api-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(request: NextRequest): boolean {
  return isCronAuthorized(request);
}

async function run(request: NextRequest) {
  if (!authorized(request)) {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
    return NextResponse.json(
      { ok: false, ...getPublicMarketingApiErrorPayload(locale, 'unauthorized') },
      { status: 401 },
    );
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
