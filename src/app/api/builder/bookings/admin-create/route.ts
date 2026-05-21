import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { bookingCreateSchema, type Booking } from '@/lib/builder/bookings/types';
import { getService, getStaff, makeBookingId, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { runBookingBillingAutomation } from '@/lib/builder/billing-document-automation';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { redeemPackageCreditForBooking, restorePackageCreditForBooking } from '@/lib/builder/bookings/packages';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';

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
  const price = bookingServicePriceSnapshot(service);

  const resourceIds = service.requiredResourceIds ?? [];
  const endAt = addBookingDuration(parsed.data.startAt, service.durationMinutes);
  const slotKey = {
    serviceId: parsed.data.serviceId,
    staffId: parsed.data.staffId,
    startAt: parsed.data.startAt,
    resourceIds,
  };
  if (!acquireSlotLock(slotKey)) {
    return NextResponse.json({ error: 'Selected slot is being booked by another request.' }, { status: 409 });
  }

  let booking: Booking | null = null;
  try {
    const available = await isSlotAvailable(slotKey);
    if (!available) return NextResponse.json({ error: 'Selected slot is no longer available' }, { status: 409 });

    const bookingId = makeBookingId();
    const packageRedemption = service.paymentMode === 'paid' && !parsed.data.paymentIntentId && parsed.data.status !== 'cancelled'
      ? await redeemPackageCreditForBooking({
          bookingId,
          customerEmail: parsed.data.customer.email,
          serviceId: service.serviceId,
        })
      : null;

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
    return NextResponse.json({ error: 'Booking could not be created.' }, { status: 500 });
  }
  try {
    const billingAutomation = await runBookingBillingAutomation(booking.bookingId, { trigger: 'created' });
    if (billingAutomation?.owner) booking = billingAutomation.owner;
  } catch (error) {
    console.error('[builder/bookings/admin-create] billing automation failed:', error);
  }
  await sendBookingConfirmation(booking, { service, staff });

  return NextResponse.json({ booking }, { status: 201 });
}
