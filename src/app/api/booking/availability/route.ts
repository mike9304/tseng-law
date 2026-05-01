import { NextRequest, NextResponse } from 'next/server';
import { computeAvailableSlots } from '@/lib/builder/bookings/availability';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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
