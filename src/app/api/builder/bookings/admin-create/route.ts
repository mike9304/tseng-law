import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { getBookingMutationApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { bookingCreateSchema, type Booking } from '@/lib/builder/bookings/types';
import { getService, getStaff, makeBookingId, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { runBookingBillingAutomation } from '@/lib/builder/billing-document-automation';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { redeemPackageCreditForBooking, restorePackageCreditForBooking } from '@/lib/builder/bookings/packages';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';
import { maybeCreateBookingZoomLink } from '@/lib/builder/bookings/zoom-handoff';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const parsed = bookingCreateSchema.safeParse({ ...(await request.json().catch(() => null)), source: 'admin' });
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingMutationApiErrorPayload(locale, 'invalid_booking_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const service = await getService(parsed.data.serviceId);
  const staff = await getStaff(parsed.data.staffId);
  if (!service || !staff) {
    return NextResponse.json(getBookingMutationApiErrorPayload(locale, 'service_or_staff_not_found'), { status: 404 });
  }
  const price = bookingServicePriceSnapshot(service, (() => {
    const opts: Parameters<typeof bookingServicePriceSnapshot>[1] = {
      staffId: parsed.data.staffId,
      resourceIds: service.requiredResourceIds,
    };
    if (parsed.data.discountCode) {
      opts.discountCode = parsed.data.discountCode;
      opts.locale = parsed.data.customer.locale;
    }
    return opts;
  })());

  const resourceIds = service.requiredResourceIds ?? [];
  const endAt = addBookingDuration(parsed.data.startAt, service.durationMinutes);
  const slotKey = {
    serviceId: parsed.data.serviceId,
    staffId: parsed.data.staffId,
    startAt: parsed.data.startAt,
    resourceIds,
  };
  if (!acquireSlotLock(slotKey)) {
    return NextResponse.json(getBookingMutationApiErrorPayload(locale, 'slot_lock_conflict'), { status: 409 });
  }

  let booking: Booking | null = null;
  try {
    const available = await isSlotAvailable(slotKey);
    if (!available) {
      return NextResponse.json(getBookingMutationApiErrorPayload(locale, 'slot_unavailable'), { status: 409 });
    }

    const bookingId = makeBookingId();
    const packageRedemption = service.paymentMode === 'paid' && !parsed.data.paymentIntentId && parsed.data.status !== 'cancelled'
      ? await redeemPackageCreditForBooking({
          bookingId,
          customerEmail: parsed.data.customer.email,
          serviceId: service.serviceId,
        })
      : null;

    const zoom = await maybeCreateBookingZoomLink({
      service,
      staffId: staff.staffId,
      startTimeISO: parsed.data.startAt,
      customerName: parsed.data.customer.name,
      customerEmail: parsed.data.customer.email,
    });

    booking = timestamped({
      bookingId,
      serviceId: parsed.data.serviceId,
      staffId: parsed.data.staffId,
      customer: parsed.data.customer,
      startAt: parsed.data.startAt,
      endAt,
      status: parsed.data.status,
      source: 'admin' as const,
      reminders: [],
      paymentAmount: price.totalAmount,
      paymentCurrency: price.currency,
      paymentDueNow: price.amountDueNow,
      ...(price.depositAmount ? { depositAmount: price.depositAmount } : {}),
      ...(price.discountCode && price.discountAmount ? { discountCode: price.discountCode, discountAmount: price.discountAmount } : {}),
      billingDocuments: [],
      resourceIds,
      ...(packageRedemption
        ? {
            packageId: packageRedemption.package.packageId,
            packageCreditId: packageRedemption.credit.creditId,
            packageCreditsUsed: 1,
          }
        : {}),
      ...(service.paymentMode === 'paid'
        ? {
            paymentStatus: packageRedemption ? 'paid' as const : 'unpaid' as const,
            ...(parsed.data.paymentIntentId ? { paymentIntentId: parsed.data.paymentIntentId } : {}),
          }
        : {}),
      ...(parsed.data.customerTimezone ? { customerTimezone: parsed.data.customerTimezone } : {}),
      ...(zoom?.meetingLink ? { meetingLink: zoom.meetingLink } : {}),
    });
    try {
      await saveBooking(booking);
    } catch (error) {
      if (packageRedemption) {
        await restorePackageCreditForBooking(booking).catch((restoreError) => {
          console.error('[builder/bookings/admin-create] package credit restore after save failure failed:', restoreError);
        });
      }
      throw error;
    }
  } finally {
    releaseSlotLock(slotKey);
  }
  if (!booking) {
    return NextResponse.json(getBookingMutationApiErrorPayload(locale, 'booking_create_failed'), { status: 500 });
  }
  try {
    const billingAutomation = await runBookingBillingAutomation(booking.bookingId, { trigger: 'created' });
    if (billingAutomation?.owner) booking = billingAutomation.owner;
  } catch (error) {
    console.error('[builder/bookings/admin-create] billing automation failed:', error instanceof Error ? error.message : String(error));
  }
  await sendBookingConfirmation(booking, { service, staff });

  return NextResponse.json({ booking }, { status: 201 });
}
