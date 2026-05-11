import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { bookingCreateSchema } from '@/lib/builder/bookings/types';
import { getService, getStaff, makeBookingId, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const parsed = bookingCreateSchema.safeParse({ ...(await request.json().catch(() => null)), source: 'admin' });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const service = await getService(parsed.data.serviceId);
  const staff = await getStaff(parsed.data.staffId);
  if (!service || !staff) return NextResponse.json({ error: 'Service or staff not found' }, { status: 404 });

  const available = await isSlotAvailable({
    serviceId: parsed.data.serviceId,
    staffId: parsed.data.staffId,
    startAt: parsed.data.startAt,
  });
  if (!available) return NextResponse.json({ error: 'Selected slot is no longer available' }, { status: 409 });

  const booking = timestamped({
    bookingId: makeBookingId(),
    serviceId: parsed.data.serviceId,
    staffId: parsed.data.staffId,
    customer: parsed.data.customer,
    startAt: parsed.data.startAt,
    endAt: addBookingDuration(parsed.data.startAt, service.durationMinutes),
    status: parsed.data.status,
    source: 'admin' as const,
    reminders: [],
  });
  await saveBooking(booking);
  await sendBookingConfirmation(booking, { service, staff });

  return NextResponse.json({ booking }, { status: 201 });
}
