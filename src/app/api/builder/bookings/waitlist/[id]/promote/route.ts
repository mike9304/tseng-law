import { NextRequest, NextResponse } from 'next/server';
import { addBookingDuration, computeAvailableSlots, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { bookingWaitlistPromoteSchema, type Booking } from '@/lib/builder/bookings/types';
import {
  getService,
  getStaff,
  getWaitlistEntry,
  makeBookingId,
  saveBooking,
  saveWaitlistEntry,
  timestamped,
} from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import { guardMutation } from '@/lib/builder/security/guard';
import { runBookingBillingAutomation } from '@/lib/builder/billing-document-automation';
import { redeemPackageCreditForBooking, restorePackageCreditForBooking } from '@/lib/builder/bookings/packages';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';
import { maybeCreateBookingZoomLink } from '@/lib/builder/bookings/zoom-handoff';
import { getBookingWaitlistApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  const existing = await getWaitlistEntry(params.id);
  if (!existing) {
    return NextResponse.json(getBookingWaitlistApiErrorPayload(locale, 'waitlist_not_found'), { status: 404 });
  }
  if (existing.status === 'promoted' && existing.promotedBookingId) {
    return NextResponse.json({ waitlist: existing, promotedBookingId: existing.promotedBookingId }, { status: 200 });
  }
  if (existing.status === 'closed') {
    return NextResponse.json(getBookingWaitlistApiErrorPayload(locale, 'waitlist_closed'), { status: 409 });
  }

  const parsed = bookingWaitlistPromoteSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({
      ...getBookingWaitlistApiErrorPayload(locale, 'invalid_waitlist_promotion_payload'),
      details: parsed.error.issues.slice(0, 3),
    }, { status: 400 });
  }

  const staffId = parsed.data.staffId ?? existing.staffId;
  const date = parsed.data.date ?? existing.requestedDate;
  const [service, staff] = await Promise.all([
    getService(existing.serviceId),
    getStaff(staffId),
  ]);
  if (!service || !service.isActive || !staff || !staff.isActive) {
    return NextResponse.json(getBookingWaitlistApiErrorPayload(locale, 'service_or_staff_not_available'), { status: 404 });
  }
  if (service.staffIds.length > 0 && !service.staffIds.includes(staff.staffId)) {
    return NextResponse.json(getBookingWaitlistApiErrorPayload(locale, 'staff_not_assigned_to_service'), { status: 400 });
  }

  const slots = await computeAvailableSlots({ serviceId: service.serviceId, staffId, date });
  const slot = slots[0];
  if (!slot) {
    return NextResponse.json(getBookingWaitlistApiErrorPayload(locale, 'no_available_slot'), { status: 409 });
  }

  const resourceIds = service.requiredResourceIds ?? [];
  const endAt = addBookingDuration(slot.startAt, service.durationMinutes);
  const slotKey = { serviceId: service.serviceId, staffId, startAt: slot.startAt, resourceIds };
  if (!acquireSlotLock(slotKey)) {
    return NextResponse.json(getBookingWaitlistApiErrorPayload(locale, 'slot_lock_conflict'), { status: 409 });
  }

  try {
    const available = await isSlotAvailable(slotKey);
    if (!available) {
      return NextResponse.json(getBookingWaitlistApiErrorPayload(locale, 'slot_unavailable'), { status: 409 });
    }

    const bookingId = makeBookingId();
    const price = bookingServicePriceSnapshot(service, { staffId, resourceIds: service.requiredResourceIds });
    const packageRedemption = service.paymentMode === 'paid'
      ? await redeemPackageCreditForBooking({
          bookingId,
          customerEmail: existing.customer.email,
          serviceId: service.serviceId,
        })
      : null;

    const zoom = await maybeCreateBookingZoomLink({
      service,
      staffId,
      startTimeISO: slot.startAt,
      customerName: existing.customer.name,
      customerEmail: existing.customer.email,
    });

    let booking: Booking = timestamped({
      bookingId,
      serviceId: service.serviceId,
      staffId,
      customer: existing.customer,
      startAt: slot.startAt,
      endAt,
      status: 'confirmed' as const,
      source: 'admin' as const,
      reminders: [],
      paymentAmount: price.totalAmount,
      paymentCurrency: price.currency,
      paymentDueNow: price.amountDueNow,
      ...(price.depositAmount ? { depositAmount: price.depositAmount } : {}),
      billingDocuments: [],
      resourceIds,
      ...(packageRedemption
        ? {
            packageId: packageRedemption.package.packageId,
            packageCreditId: packageRedemption.credit.creditId,
            packageCreditsUsed: 1,
          }
        : {}),
      ...(existing.customerTimezone ? { customerTimezone: existing.customerTimezone } : {}),
      ...(service.paymentMode === 'paid' ? { paymentStatus: packageRedemption ? 'paid' as const : 'unpaid' as const } : {}),
      ...(zoom?.meetingLink ? { meetingLink: zoom.meetingLink } : {}),
    });
    try {
      await saveBooking(booking);
    } catch (error) {
      if (packageRedemption) {
        await restorePackageCreditForBooking(booking).catch((restoreError) => {
          console.error('[builder/bookings/waitlist/promote] package credit restore after save failure failed:', restoreError);
        });
      }
      throw error;
    }
    try {
      const billingAutomation = await runBookingBillingAutomation(booking.bookingId, { trigger: 'created' });
      if (billingAutomation?.owner) booking = billingAutomation.owner;
    } catch (error) {
      console.error('[builder/bookings/waitlist/promote] billing automation failed:', error);
    }

    const waitlist = timestamped({
      ...existing,
      status: 'promoted' as const,
      promotedBookingId: booking.bookingId,
    }, existing.createdAt);
    await saveWaitlistEntry(waitlist);
    await sendBookingConfirmation(booking, { service, staff });
    emitEvent('booking.created', {
      bookingId: booking.bookingId,
      serviceId: booking.serviceId,
      staffId: booking.staffId,
      startAt: booking.startAt,
      customer: { email: booking.customer.email, name: booking.customer.name, locale: booking.customer.locale },
      customerTimezone: booking.customerTimezone,
      source: 'waitlist-promotion',
      waitlistId: waitlist.waitlistId,
    });

    return NextResponse.json({ booking, waitlist }, { status: 201 });
  } finally {
    releaseSlotLock(slotKey);
  }
}
