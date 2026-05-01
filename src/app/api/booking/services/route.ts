import { NextRequest, NextResponse } from 'next/server';
import { listServices } from '@/lib/builder/bookings/storage';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
  const services = await listServices(false);
  return NextResponse.json({
    services: services.map((service) => ({
      ...service,
      displayName: service.name[locale] || service.name.ko,
      displayDescription: service.description[locale] || service.description.ko,
    })),
  });
}
