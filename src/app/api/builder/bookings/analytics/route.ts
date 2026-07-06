import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { listBookings, listServices, listStaff } from '@/lib/builder/bookings/storage';
import { buildBookingAnalyticsBundle } from '@/lib/builder/bookings/analytics';
import { buildBookingPaymentAttribution } from '@/lib/builder/bookings/analytics-attribution';
import {
  getBookingAnalyticsApiErrorPayload,
  type BookingAnalyticsApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BookingAnalyticsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    getBookingAnalyticsApiErrorPayload(locale, errorCode),
    { status },
  );
}

/**
 * F84 — Booking analytics bundle. Returns funnel, per-service and
 * per-staff utilization, and a day-of-week × hour heatmap for the
 * supplied date window.
 *
 * Query params:
 *   - from?: ISO string (inclusive window start)
 *   - to?: ISO string   (exclusive window end)
 *   - serviceId?: filter to a single service
 *   - staffId?: filter to a single staff
 *   - locale?: 'ko' | 'zh-hant' | 'en' (label locale, defaults to 'ko')
 */
export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const params = request.nextUrl.searchParams;
  const from = params.get('from') ?? undefined;
  const to = params.get('to') ?? undefined;
  const serviceId = params.get('serviceId') ?? undefined;
  const staffId = params.get('staffId') ?? undefined;

  const localeRaw = params.get('locale');
  const locale = normalizeLocale(localeRaw || undefined);
  if (localeRaw && !isLocale(localeRaw)) {
    return errorResponse(locale, 'unknown_locale', 400);
  }

  if (from && Number.isNaN(Date.parse(from))) {
    return errorResponse(locale, 'invalid_from_timestamp', 400);
  }
  if (to && Number.isNaN(Date.parse(to))) {
    return errorResponse(locale, 'invalid_to_timestamp', 400);
  }

  const [bookings, services, staff] = await Promise.all([
    listBookings({ from, to, staffId, includeCancelled: true }),
    listServices(true),
    listStaff(true),
  ]);

  const scopedBookings = bookings.filter((booking) => {
    if (serviceId && booking.serviceId !== serviceId) return false;
    if (staffId && booking.staffId !== staffId) return false;
    return true;
  });
  const bundle = buildBookingAnalyticsBundle(scopedBookings, services, staff, locale, {
    from,
    to,
    serviceId,
    staffId,
  });
  const paymentAttribution = buildBookingPaymentAttribution(scopedBookings, services, locale);

  return NextResponse.json({
    range: { from: from ?? null, to: to ?? null },
    serviceId: serviceId ?? null,
    staffId: staffId ?? null,
    locale,
    paymentAttribution,
    ...bundle,
  });
}
