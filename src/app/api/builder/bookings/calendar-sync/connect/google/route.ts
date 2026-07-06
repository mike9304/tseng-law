import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { buildGoogleAuthUrl } from '@/lib/builder/bookings/calendar-sync/google';
import { buildOauthState } from '@/lib/builder/bookings/calendar-sync/oauth-state';
import {
  getBookingCalendarSyncConnectApiErrorPayload,
  type BookingCalendarSyncConnectApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BookingCalendarSyncConnectApiErrorCode,
  status: number,
) {
  return NextResponse.json(
    getBookingCalendarSyncConnectApiErrorPayload(locale, errorCode),
    { status },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const staffId = request.nextUrl.searchParams.get('staffId') ?? '';
  if (!staffId) return errorResponse(locale, 'missing_staff_id', 400);

  // SECURITY: HMAC-signed state. Callback at /oauth-callback verifies the
  // signature so OAuth CSRF cannot attach a token to a forged staffId.
  let state: string;
  try {
    state = buildOauthState('google', staffId);
  } catch {
    return errorResponse(locale, 'oauth_state_failed', 503);
  }
  const result = buildGoogleAuthUrl(state);
  if (!result.ok || !result.url) {
    return errorResponse(locale, 'auth_url_failed', 503);
  }
  return NextResponse.json({ ok: true, url: result.url, state });
}
