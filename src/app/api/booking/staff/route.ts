import { NextRequest, NextResponse } from 'next/server';
import { getService, listStaff } from '@/lib/builder/bookings/storage';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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
