import { NextRequest, NextResponse } from 'next/server';
import { computeAvailableSlots } from '@/lib/builder/bookings/availability';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function GET(request: NextRequest) {
  const rate = await checkRateLimit(`booking-availability:${clientIp(request)}`, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = request.nextUrl;
  const serviceId = searchParams.get('serviceId') || '';
  const staffId = searchParams.get('staffId') || 'any';
  const date = searchParams.get('date') || '';

  if (!serviceId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Missing serviceId or date' }, { status: 400 });
  }

  const slots = await computeAvailableSlots({ serviceId, staffId, date });
  return NextResponse.json({ slots });
}
