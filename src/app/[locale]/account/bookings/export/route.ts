import { NextRequest, NextResponse } from 'next/server';
import { getCustomerBookingPortal } from '@/lib/builder/bookings/customer-portal';
import {
  buildMemberBookingsHistoryCsvFilename,
  filterMemberBookingsHistory,
  normalizeMemberBookingsHistorySearchParams,
  serializeMemberBookingsHistoryCsv,
  sortMemberBookingsHistory,
} from '@/lib/builder/bookings/member-portal-history';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const portal = await getCustomerBookingPortal(member.email, locale, undefined, getMemberPortalEmails(member));
  const url = new URL(request.url);
  const filters = normalizeMemberBookingsHistorySearchParams({
    q: url.searchParams.get('q') ?? undefined,
    status: url.searchParams.get('status') ?? undefined,
    service: url.searchParams.get('service') ?? undefined,
    staff: url.searchParams.get('staff') ?? undefined,
    timezone: url.searchParams.get('timezone') ?? undefined,
    dateFrom: url.searchParams.get('dateFrom') ?? undefined,
    dateTo: url.searchParams.get('dateTo') ?? undefined,
    payment: url.searchParams.get('payment') ?? undefined,
    sort: url.searchParams.get('sort') ?? undefined,
  });
  const nowIso = new Date().toISOString();
  const visibleBookings = sortMemberBookingsHistory(filterMemberBookingsHistory([...portal.upcoming, ...portal.past], filters, nowIso), filters.sort);
  const csv = serializeMemberBookingsHistoryCsv(visibleBookings, locale);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${buildMemberBookingsHistoryCsvFilename()}"`,
      'Cache-Control': 'no-store',
    },
  });
}
