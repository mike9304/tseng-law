import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { listServices } from '@/lib/builder/bookings/storage';
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
  const rate = await checkRateLimit(`booking-services:${clientIp(request)}`, 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

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
