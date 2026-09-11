import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { mapPublicRateLimitDenial } from '@/lib/builder/security/public-rate-limit-response';
import { getService, listStaff } from '@/lib/builder/bookings/storage';
import type { Staff } from '@/lib/builder/bookings/types';
import {
  getPublicBookingApiErrorPayload,
  type PublicBookingApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PUBLIC_HIDDEN_STAFF_IDS = new Set(['staff-lee', 'staff-park']);
const CANONICAL_STAFF_TSENG_NAME = {
  ko: '증준외',
  'zh-hant': '曾雋崴',
  en: 'Wei Tseng',
} as const;

function toPublicStaff(member: Staff, locale: Locale): Staff & {
  displayName: string;
  displayTitle: string;
  displayBio: string;
} {
  const name = member.staffId === 'staff-tseng'
    ? { ...member.name, ...CANONICAL_STAFF_TSENG_NAME }
    : member.name;
  return {
    ...member,
    name,
    displayName: name[locale] || name.ko,
    displayTitle: member.title[locale] || member.title.ko,
    displayBio: member.bio?.[locale] || member.bio?.ko || '',
  };
}

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
        .filter((member) => !PUBLIC_HIDDEN_STAFF_IDS.has(member.staffId))
        .filter((member) => !allowed || allowed.has(member.staffId))
        .map((member) => toPublicStaff(member, locale)),
    });
  } catch (error) {
    console.error('[booking/staff] GET failed:', error);
    return errorResponse(locale, 'booking_staff_failed', 500);
  }
}
