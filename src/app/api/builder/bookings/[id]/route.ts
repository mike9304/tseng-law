import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { getBookingMutationApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { bookingUpdateSchema } from '@/lib/builder/bookings/types';
import { getBooking, getService, getStaff, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import { sendBookingCancellation } from '@/lib/builder/bookings/notifications';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { restorePackageCreditForBooking } from '@/lib/builder/bookings/packages';
import { maybeCreateBookingZoomLink } from '@/lib/builder/bookings/zoom-handoff';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const existing = await getBooking(params.id);
  if (!existing) {
    return NextResponse.json(getBookingMutationApiErrorPayload(locale, 'booking_not_found'), { status: 404 });
  }

  const parsed = bookingUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingMutationApiErrorPayload(locale, 'invalid_booking_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const nextStaffId = parsed.data.staffId || existing.staffId;
  const nextStartAt = parsed.data.startAt || existing.startAt;
  const service = await getService(existing.serviceId);
  const staff = await getStaff(nextStaffId);
  if (!service || !staff) {
    return NextResponse.json(getBookingMutationApiErrorPayload(locale, 'service_or_staff_not_found'), { status: 404 });
  }

  const timingChanged = nextStaffId !== existing.staffId || nextStartAt !== existing.startAt;
  const resourceIds = service.requiredResourceIds ?? [];
  const nextEndAt = timingChanged ? addBookingDuration(nextStartAt, service.durationMinutes) : existing.endAt;
  let acquiredSlotKey: { serviceId: string; staffId: string; startAt: string; resourceIds: string[] } | null = null;
  if (timingChanged && parsed.data.status !== 'cancelled') {
    const slotKey = {
      serviceId: existing.serviceId,
      staffId: nextStaffId,
      startAt: nextStartAt,
      resourceIds,
    };
    if (!acquireSlotLock(slotKey)) {
      return NextResponse.json(getBookingMutationApiErrorPayload(locale, 'slot_lock_conflict'), { status: 409 });
    }
    acquiredSlotKey = slotKey;
    try {
      const available = await isSlotAvailable({
        ...slotKey,
        excludeBookingId: existing.bookingId,
      });
      if (!available) {
        releaseSlotLock(slotKey);
        acquiredSlotKey = null;
        return NextResponse.json(getBookingMutationApiErrorPayload(locale, 'slot_unavailable'), { status: 409 });
      }
    } catch (error) {
      releaseSlotLock(slotKey);
      acquiredSlotKey = null;
      throw error;
    }
  }

  const nextDraft = timestamped({
    ...existing,
    staffId: nextStaffId,
    startAt: nextStartAt,
    endAt: nextEndAt,
    resourceIds: timingChanged ? resourceIds : existing.resourceIds,
    status: parsed.data.status || existing.status,
    customer: { ...existing.customer, ...parsed.data.customer },
    customerTimezone: parsed.data.customerTimezone ?? existing.customerTimezone,
    cancellationReason: parsed.data.cancellationReason ?? existing.cancellationReason,
    cancelledAt: parsed.data.status === 'cancelled'
      ? existing.cancelledAt ?? new Date().toISOString()
      : existing.cancelledAt,
  }, existing.createdAt);
  const zoom = timingChanged && parsed.data.status !== 'cancelled'
    ? await maybeCreateBookingZoomLink({
      service,
      staffId: nextStaffId,
      startTimeISO: nextStartAt,
      customerName: nextDraft.customer.name,
      customerEmail: nextDraft.customer.email,
    })
    : null;
  const next = parsed.data.status === 'cancelled'
    ? await restorePackageCreditForBooking(nextDraft)
    : timestamped({
        ...nextDraft,
        ...(zoom?.meetingLink ? { meetingLink: zoom.meetingLink } : existing.meetingLink ? { meetingLink: existing.meetingLink } : {}),
      }, nextDraft.createdAt);
  try {
    await saveBooking(next);
  } finally {
    if (acquiredSlotKey) releaseSlotLock(acquiredSlotKey);
  }
  let emailDelivery;
  if (existing.status !== 'cancelled' && next.status === 'cancelled') {
    try {
      const delivery = await sendBookingCancellation(next, { service, staff });
      emailDelivery = delivery.ok
        ? { ok: true as const }
        : { ok: false as const, reason: delivery.reason };
    } catch {
      emailDelivery = { ok: false as const, reason: 'internal_error' as const };
    }
  }
  return NextResponse.json({
    booking: next,
    ...(emailDelivery ? { emailDelivery } : {}),
  });
}
