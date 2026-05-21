import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { bookingCreateSchema, type Booking } from '@/lib/builder/bookings/types';
import { getService, getStaff, makeBookingId, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { createZoomMeeting } from '@/lib/builder/bookings/zoom-client';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import {
  fetchPaymentIntentStatus,
  isPaymentIntentBookable,
  paymentIntentPriceMismatch,
} from '@/lib/builder/bookings/stripe-verify';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { runBookingBillingAutomation } from '@/lib/builder/billing-document-automation';
import {
  findApplicablePackageCredit,
  redeemPackageCreditForBooking,
  restorePackageCreditForBooking,
} from '@/lib/builder/bookings/packages';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = await checkRateLimit(`booking:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many booking attempts. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  const raw = await request.json().catch(() => null);
  if (raw?.company) {
    return NextResponse.json({ error: 'Unable to accept this booking.' }, { status: 400 });
  }

  const parsed = bookingCreateSchema.safeParse({ ...raw, source: 'web', status: 'confirmed' });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const service = await getService(parsed.data.serviceId);
  const staff = await getStaff(parsed.data.staffId);
  if (!service || !service.isActive || !staff || !staff.isActive) {
    return NextResponse.json({ error: 'Service or staff not available' }, { status: 404 });
  }
  const price = bookingServicePriceSnapshot(service);
  const packageCreditAvailable = service.paymentMode === 'paid' && !parsed.data.paymentIntentId
    ? await findApplicablePackageCredit({
        customerEmail: parsed.data.customer.email,
        serviceId: service.serviceId,
      })
    : null;
  if (service.paymentMode === 'paid' && !parsed.data.paymentIntentId && !packageCreditAvailable) {
    return NextResponse.json({ error: 'Payment is required before booking this service.' }, { status: 402 });
  }
  if (service.paymentMode !== 'paid' && parsed.data.paymentIntentId) {
    return NextResponse.json({ error: 'paymentIntentId not allowed for free services.' }, { status: 400 });
  }

  // Server-side verify the paymentIntent so a client can't fabricate
  // an id to hold a slot or bypass payment. When STRIPE_SECRET_KEY is
  // unset (dev) we fall through and trust the client until the webhook
  // arrives.
  let paymentSettled = false;
  if (service.paymentMode === 'paid' && parsed.data.paymentIntentId) {
    const intent = await fetchPaymentIntentStatus(parsed.data.paymentIntentId);
    if (intent !== null) {
      // serviceId metadata must match to prevent reusing an intent for a
      // different service.
      const intentServiceId = intent.metadata?.serviceId;
      if (intentServiceId && intentServiceId !== service.serviceId) {
        return NextResponse.json({ error: 'PaymentIntent does not match this service.' }, { status: 400 });
      }
      const priceMismatch = paymentIntentPriceMismatch(intent, {
        amount: price.amountDueNow,
        currency: price.currency,
      });
      if (priceMismatch) {
        return NextResponse.json({ error: priceMismatch }, { status: 400 });
      }
      if (!isPaymentIntentBookable(intent)) {
        return NextResponse.json({ error: `Payment not settled (status: ${intent.status})` }, { status: 402 });
      }
      paymentSettled = intent.status === 'succeeded';
    } else if (process.env.NODE_ENV === 'production' && process.env.STRIPE_SECRET_KEY) {
      // Key is set but verification failed → don't trust the intent.
      return NextResponse.json({ error: 'PaymentIntent could not be verified.' }, { status: 402 });
    }
  }

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
    if (!available) {
      return NextResponse.json({ error: 'Selected slot is no longer available' }, { status: 409 });
    }

    const bookingId = makeBookingId();
    const packageRedemption = packageCreditAvailable
      ? await redeemPackageCreditForBooking({
          bookingId,
          customerEmail: parsed.data.customer.email,
          serviceId: service.serviceId,
        })
      : null;
    if (packageCreditAvailable && !packageRedemption) {
      return NextResponse.json({ error: 'Package credit is no longer available.' }, { status: 409 });
    }

    let meetingLink: string | undefined;
    if (service.meetingMode === 'zoom') {
      const zoom = await createZoomMeeting({
        topic: `${service.name?.ko || service.name?.en || 'Booking'} · ${parsed.data.customer.name}`,
        startTimeISO: parsed.data.startAt,
        durationMinutes: service.durationMinutes,
        customerEmail: parsed.data.customer.email,
      });
      if (zoom.ok) {
        meetingLink = zoom.meetingLink;
      } else if (zoom.reason !== 'unconfigured') {
        console.warn('[booking] zoom meeting creation failed', zoom.reason, zoom.details);
      }
    }

    booking = timestamped({
      bookingId,
      serviceId: parsed.data.serviceId,
      staffId: parsed.data.staffId,
      customer: parsed.data.customer,
      startAt: parsed.data.startAt,
      endAt,
      status: 'confirmed' as const,
      source: 'web' as const,
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
            paymentStatus: 'paid' as const,
          }
        : {}),
      ...(parsed.data.customerTimezone ? { customerTimezone: parsed.data.customerTimezone } : {}),
      ...(meetingLink ? { meetingLink } : {}),
      ...(parsed.data.paymentIntentId
        ? {
            paymentIntentId: parsed.data.paymentIntentId,
            ...(paymentSettled ? { onlinePaidAmount: price.amountDueNow } : {}),
            paymentStatus: (paymentSettled
              ? (price.balanceDueAfterOnlinePayment > 0 ? 'partially_paid' : 'paid')
              : 'unpaid') as 'paid' | 'partially_paid' | 'unpaid',
          }
        : {}),
    });
    try {
      await saveBooking(booking);
    } catch (error) {
      if (packageRedemption) {
        await restorePackageCreditForBooking(booking).catch((restoreError) => {
          console.error('[booking/book] package credit restore after save failure failed:', restoreError);
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
    console.error('[booking/book] billing automation failed:', error);
  }
  await sendBookingConfirmation(booking, { service, staff });
  emitEvent('booking.created', {
    bookingId: booking.bookingId,
    serviceId: booking.serviceId,
    staffId: booking.staffId,
    startAt: booking.startAt,
    customer: { email: booking.customer.email, name: booking.customer.name, locale: booking.customer.locale },
    customerTimezone: booking.customerTimezone,
  });

  return NextResponse.json({ bookingId: booking.bookingId, booking }, { status: 201 });
}
