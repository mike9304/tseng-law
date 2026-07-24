import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { mapPublicRateLimitDenial } from '@/lib/builder/security/public-rate-limit-response';
import { listServices } from '@/lib/builder/bookings/storage';
import {
  getPublicBookingApiErrorPayload,
  type PublicBookingApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
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
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}

export async function GET(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
  // SECURITY: public endpoint — gate against enumeration / scraping / DoS.
  const rate = await checkRateLimit(`booking-services:${clientIp(request)}`, 60, 60_000);
  if (!rate.allowed) {
    const decision = mapPublicRateLimitDenial(rate);
    return errorResponse(locale, decision.errorCode, decision.status, {
      headers: decision.headers,
    });
  }

  try {
    const services = await listServices(false);
    return NextResponse.json({
      services: services.map((service) => ({
        ...service,
        displayName: service.name[locale] || service.name.ko,
        displayDescription: service.description[locale] || service.description.ko,
      })),
    });
  } catch (error) {
    console.error('[booking/services] GET failed:', error);
    return errorResponse(locale, 'booking_services_failed', 500);
  }
}
