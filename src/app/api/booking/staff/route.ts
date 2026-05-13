import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getService, listStaff } from '@/lib/builder/bookings/storage';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}

export async function GET(request: NextRequest) {
  // SECURITY: public endpoint — gate against enumeration / scraping / DoS.
  // 60/min is generous for legitimate booking widgets that fetch once per
  // page load.
  const rate = await checkRateLimit(`booking-staff:${clientIp(request)}`, 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  const serviceId = request.nextUrl.searchParams.get('serviceId');
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
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
}
