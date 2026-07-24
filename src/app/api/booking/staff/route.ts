import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { mapPublicRateLimitDenial } from '@/lib/builder/security/public-rate-limit-response';
import { getService, listStaff } from '@/lib/builder/bookings/storage';
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
  // 60/min is generous for legitimate booking widgets that fetch once per
  // page load.
  const rate = await checkRateLimit(`booking-staff:${clientIp(request)}`, 60, 60_000);
  if (!rate.allowed) {
    const decision = mapPublicRateLimitDenial(rate);
    return errorResponse(locale, decision.errorCode, decision.status, {
      headers: decision.headers,
    });
  }

  const serviceId = request.nextUrl.searchParams.get('serviceId');
  try {
    const [service, staff] = await Promise.all([
      serviceId ? getService(serviceId) : Promise.resolve(null),
      listStaff(false),
    ]);
    const allowed = service?.staffIds?.length ? new Set(service.staffIds) : null;
    return NextResponse.json({
      staff: staff
        .filter((member) => !allowed || allowed.has(member.staffId))
        .map((member) => ({
          ...member,
          displayName: member.name[locale] || member.name.ko,
          displayTitle: member.title[locale] || member.title.ko,
          displayBio: member.bio?.[locale] || member.bio?.ko || '',
        })),
    });
  } catch (error) {
    console.error('[booking/staff] GET failed:', error);
    return errorResponse(locale, 'booking_staff_failed', 500);
  }
}
