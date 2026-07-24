import { NextRequest, NextResponse } from 'next/server';
import { computeAvailableSlots } from '@/lib/builder/bookings/availability';
import {
  getPublicBookingApiErrorPayload,
  type PublicBookingApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { mapPublicRateLimitDenial } from '@/lib/builder/security/public-rate-limit-response';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: PublicBookingApiErrorCode,
  status: number,
  init?: ResponseInit,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getPublicBookingApiErrorPayload(locale, errorCode),
    },
    { ...init, status },
  );
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function GET(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
  const rate = await checkRateLimit(`booking-availability:${clientIp(request)}`, 30, 60_000);
  if (!rate.allowed) {
    const decision = mapPublicRateLimitDenial(rate);
    return errorResponse(locale, decision.errorCode, decision.status, {
      headers: decision.headers,
    });
  }

  const { searchParams } = request.nextUrl;
  const serviceId = searchParams.get('serviceId') || '';
  const staffId = searchParams.get('staffId') || 'any';
  const date = searchParams.get('date') || '';

  if (!serviceId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return errorResponse(locale, 'booking_availability_invalid', 400);
  }

  try {
    const slots = await computeAvailableSlots({ serviceId, staffId, date });
    return NextResponse.json({ slots });
  } catch (error) {
    console.error('[booking/availability] GET failed:', error);
    return errorResponse(locale, 'booking_availability_failed', 500);
  }
}
