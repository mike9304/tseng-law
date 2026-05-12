import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { bookingUpdateSchema } from '@/lib/builder/bookings/types';
import { getBooking, getService, getStaff, saveBooking, timestamped } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getBooking(params.id);
  if (!existing) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const parsed = bookingUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const nextStaffId = parsed.data.staffId || existing.staffId;
  const nextStartAt = parsed.data.startAt || existing.startAt;
  const service = await getService(existing.serviceId);
  const staff = await getStaff(nextStaffId);
  if (!service || !staff) return NextResponse.json({ error: 'Service or staff not found' }, { status: 404 });

  const timingChanged = nextStaffId !== existing.staffId || nextStartAt !== existing.startAt;
  if (timingChanged && parsed.data.status !== 'cancelled') {
    const available = await isSlotAvailable({
      serviceId: existing.serviceId,
      staffId: nextStaffId,
      startAt: nextStartAt,
    });
    if (!available) return NextResponse.json({ error: 'Selected slot is no longer available' }, { status: 409 });
  }

  const next = timestamped({
    ...existing,
    staffId: nextStaffId,
    startAt: nextStartAt,
    endAt: timingChanged ? addBookingDuration(nextStartAt, service.durationMinutes) : existing.endAt,
    status: parsed.data.status || existing.status,
    customer: { ...existing.customer, ...parsed.data.customer },
    customerTimezone: parsed.data.customerTimezone ?? existing.customerTimezone,
    cancellationReason: parsed.data.cancellationReason ?? existing.cancellationReason,
    cancelledAt: parsed.data.status === 'cancelled'
      ? existing.cancelledAt ?? new Date().toISOString()
      : existing.cancelledAt,
  }, existing.createdAt);
  await saveBooking(next);
  return NextResponse.json({ booking: next });
}
