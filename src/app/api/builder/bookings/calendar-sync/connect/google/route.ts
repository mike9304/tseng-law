import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { buildGoogleAuthUrl } from '@/lib/builder/bookings/calendar-sync/google';
import { buildOauthState } from '@/lib/builder/bookings/calendar-sync/oauth-state';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const staffId = request.nextUrl.searchParams.get('staffId') ?? '';
  if (!staffId) return NextResponse.json({ error: 'staffId required' }, { status: 400 });

  // SECURITY: HMAC-signed state. Callback at /oauth-callback verifies the
  // signature so OAuth CSRF cannot attach a token to a forged staffId.
  let state: string;
  try {
    state = buildOauthState('google', staffId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'state build failed' },
      { status: 503 },
    );
  }
  const result = buildGoogleAuthUrl(state);
  if (!result.ok || !result.url) {
    return NextResponse.json({ error: result.error ?? 'auth url failed' }, { status: 503 });
  }
  return NextResponse.json({ ok: true, url: result.url, state });
}
