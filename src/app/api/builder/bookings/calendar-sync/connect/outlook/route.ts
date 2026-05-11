import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { buildOutlookAuthUrl } from '@/lib/builder/bookings/calendar-sync/outlook';
import { makeOauthState } from '@/lib/builder/bookings/calendar-sync/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const staffId = request.nextUrl.searchParams.get('staffId') ?? '';
  if (!staffId) return NextResponse.json({ error: 'staffId required' }, { status: 400 });

  const state = `outlook:${staffId}:${makeOauthState()}`;
  const result = buildOutlookAuthUrl(state);
  if (!result.ok || !result.url) {
    return NextResponse.json({ error: result.error ?? 'auth url failed' }, { status: 503 });
  }
  return NextResponse.json({ ok: true, url: result.url, state });
}
