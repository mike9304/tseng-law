import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { listBookings, listServices, listStaff } from '@/lib/builder/bookings/storage';
import { buildBookingAnalyticsBundle } from '@/lib/builder/bookings/analytics';
import { isLocale, defaultLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  let locale: Locale = defaultLocale;
  if (localeRaw) {
    if (!isLocale(localeRaw)) {
      return NextResponse.json({ error: 'Unknown locale' }, { status: 400 });
    }
    locale = localeRaw;
  }

  if (from && Number.isNaN(Date.parse(from))) {
    return NextResponse.json({ error: 'Invalid `from` timestamp' }, { status: 400 });
  }
  if (to && Number.isNaN(Date.parse(to))) {
    return NextResponse.json({ error: 'Invalid `to` timestamp' }, { status: 400 });
  }

  const [bookings, services, staff] = await Promise.all([
    listBookings({ from, to, staffId, includeCancelled: true }),
    listServices(true),
    listStaff(true),
  ]);

  const bundle = buildBookingAnalyticsBundle(bookings, services, staff, locale, {
    from,
    to,
    serviceId,
    staffId,
  });

  return NextResponse.json({
    range: { from: from ?? null, to: to ?? null },
    serviceId: serviceId ?? null,
    staffId: staffId ?? null,
    locale,
    ...bundle,
  });
}