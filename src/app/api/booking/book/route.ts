import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { mapPublicRateLimitDenial } from '@/lib/builder/security/public-rate-limit-response';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { bookingCreateSchema, type Booking } from '@/lib/builder/bookings/types';
import {
  claimBookingPaymentIntent,
  getService,
  getStaff,
  hasDurableBookingStorage,
  makeBookingId,
  releaseBookingPaymentIntentClaim,
  saveBooking,
  timestamped,
} from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import {
  fetchPaymentIntentStatus,
  isPaymentIntentBookable,
  paymentIntentPriceMismatch,
} from '@/lib/builder/bookings/stripe-verify';
import { acquireSlotLock, releaseSlotLock, renewSlotLock } from '@/lib/builder/bookings/slot-lock';
import { runBookingBillingAutomation } from '@/lib/builder/billing-document-automation';
import {
  findApplicablePackageCredit,
  redeemPackageCreditForBooking,
  restorePackageCreditForBooking,
} from '@/lib/builder/bookings/packages';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';
import { maybeCreateBookingZoomLink } from '@/lib/builder/bookings/zoom-handoff';
import {
  getPublicBookingApiErrorPayload,
  type PublicBookingApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import {
  MEMBER_SESSION_COOKIE,
  validateSession,
} from '@/lib/builder/members/members-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type EmailRecipientDelivery =
  | { ok: true }
  | { ok: false; reason: 'unconfigured' | 'provider_error' };

type EmailDelivery =
  | {
    ok: boolean;
    customer: EmailRecipientDelivery;
    admin?: EmailRecipientDelivery;
  }
  | { ok: false; reason: 'internal_error' };

function sanitizeEmailRecipient(
  delivery: Awaited<ReturnType<typeof sendBookingConfirmation>>['customer'],
): EmailRecipientDelivery {
  return delivery.ok
    ? { ok: true }
    : { ok: false, reason: delivery.reason };
}

async function deliverBookingConfirmation(
  booking: Booking,
  context: Parameters<typeof sendBookingConfirmation>[1],
): Promise<EmailDelivery> {
  try {
    const delivery = await sendBookingConfirmation(booking, context);
    return {
      ok: delivery.ok,
      customer: sanitizeEmailRecipient(delivery.customer),
      ...(delivery.admin ? { admin: sanitizeEmailRecipient(delivery.admin) } : {}),
    };
  } catch {
    console.error('[booking/book] confirmation delivery failed');
    return { ok: false, reason: 'internal_error' };
  }
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function errorResponse(
  locale: Locale,
  errorCode: PublicBookingApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
  init?: ResponseInit,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getPublicBookingApiErrorPayload(locale, errorCode),
      ...extra,
    },
    { ...init, status },
  );
}

function recordFromUnknown(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function localeFromRawPayload(raw: unknown, fallback: Locale): Locale {
  const record = recordFromUnknown(raw);
  const customer = recordFromUnknown(record?.customer);
  const customerLocale = typeof customer?.locale === 'string' ? customer.locale : '';
  return normalizeLocale(customerLocale || fallback);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  // A booking can persist customer data, reserve a slot, and redeem a member
  // package credit. Reject cross-site requests before any of those effects (or
  // even rate-limit storage) are touched.
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  let locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);

  try {
    const ip = getClientIp(request);
    const rate = await checkRateLimit(`booking:${ip}`, 8, 60_000);
    if (!rate.allowed) {
      const decision = mapPublicRateLimitDenial(rate);
      return errorResponse(locale, decision.errorCode, decision.status, {}, {
        headers: decision.headers,
      });
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return errorResponse(locale, 'invalid_json', 400);
    }

    locale = localeFromRawPayload(raw, locale);
    const rawRecord = recordFromUnknown(raw);
    if (rawRecord?.company) {
      return errorResponse(locale, 'booking_create_rejected', 400);
    }

    const parsed = bookingCreateSchema.safeParse({ ...rawRecord, source: 'web', status: 'confirmed' });
    if (!parsed.success) {
      return errorResponse(locale, 'booking_create_invalid', 400, {
        details: parsed.error.issues.slice(0, 3),
      });
    }
    if (!hasDurableBookingStorage()) {
      return errorResponse(locale, 'booking_storage_unavailable', 503);
    }

    const service = await getService(parsed.data.serviceId);
    const staff = await getStaff(parsed.data.staffId);
    if (!service || !service.isActive || !staff || !staff.isActive) {
      return errorResponse(locale, 'booking_create_service_or_staff_unavailable', 404);
    }
    if (service.staffIds.length > 0 && !service.staffIds.includes(staff.staffId)) {
      return errorResponse(locale, 'booking_create_service_or_staff_unavailable', 404);
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
    const mayApplyPackageCredit = service.paymentMode === 'paid' && !parsed.data.paymentIntentId;
    const memberSessionId = mayApplyPackageCredit
      ? request.cookies.get(MEMBER_SESSION_COOKIE)?.value
      : undefined;
    const member = memberSessionId ? await validateSession(memberSessionId) : null;
    const mayUsePackageCredit = Boolean(
      member
      && member.verified
      && !member.blocked
      && normalizeEmail(member.email) === normalizeEmail(parsed.data.customer.email),
    );
    const packageCreditAvailable = mayApplyPackageCredit && mayUsePackageCredit
      ? await findApplicablePackageCredit({
          customerEmail: parsed.data.customer.email,
          serviceId: service.serviceId,
        })
      : null;
    if (service.paymentMode === 'paid' && !price.payLater && !parsed.data.paymentIntentId && !packageCreditAvailable) {
      return errorResponse(locale, 'booking_create_payment_required', 402);
    }
    if ((service.paymentMode !== 'paid' || price.payLater) && parsed.data.paymentIntentId) {
      return errorResponse(locale, 'booking_create_payment_not_allowed', 400);
    }

    // Server-side verify the paymentIntent so a client can't fabricate an id
    // to hold a slot or bypass payment. Development may use the local stub,
    // but production must have Stripe configured and return a verified intent.
    let paymentSettled = false;
    if (service.paymentMode === 'paid' && parsed.data.paymentIntentId) {
      if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY) {
        return errorResponse(locale, 'booking_payment_provider_not_configured', 503);
      }
      const intent = await fetchPaymentIntentStatus(parsed.data.paymentIntentId);
      if (intent !== null) {
        // serviceId metadata must match to prevent reusing an intent for a
        // different service.
        const intentServiceId = intent.metadata?.serviceId;
        if (intentServiceId && intentServiceId !== service.serviceId) {
          return errorResponse(locale, 'booking_create_payment_mismatch', 400);
        }
        const intentStaffId = intent.metadata?.staffId;
        if (intentStaffId !== parsed.data.staffId) {
          return errorResponse(locale, 'booking_create_payment_mismatch', 400);
        }
        const priceMismatch = paymentIntentPriceMismatch(intent, {
          amount: price.amountDueNow,
          currency: price.currency,
        });
        if (priceMismatch) {
          return errorResponse(locale, 'booking_create_payment_mismatch', 400);
        }
        if (!isPaymentIntentBookable(intent)) {
          return errorResponse(locale, 'booking_create_payment_not_settled', 402, {
            paymentStatus: intent.status,
          });
        }
        paymentSettled = intent.status === 'succeeded';
      } else if (process.env.NODE_ENV === 'production') {
        return errorResponse(locale, 'booking_create_payment_unverified', 402);
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
    const slotLease = await acquireSlotLock(slotKey);
    if (!slotLease) {
      return errorResponse(locale, 'booking_create_slot_locked', 409);
    }

    let booking: Booking | null = null;
    let claimedPaymentIntent: { paymentIntentId: string; bookingId: string } | null = null;
    let bookingPersisted = false;
    try {
      const available = await isSlotAvailable(slotKey);
      if (!available) {
        return errorResponse(locale, 'booking_create_slot_unavailable', 409);
      }

      const bookingId = makeBookingId();
      if (parsed.data.paymentIntentId) {
        const claim = await claimBookingPaymentIntent(parsed.data.paymentIntentId, bookingId);
        if (!claim.claimed) {
          return errorResponse(locale, 'booking_create_payment_unverified', 409);
        }
        if (!claim.idempotent) {
          claimedPaymentIntent = {
            paymentIntentId: parsed.data.paymentIntentId,
            bookingId,
          };
        }
      }
      if (!await renewSlotLock(slotLease)) {
        return errorResponse(locale, 'booking_storage_unavailable', 503);
      }
      const zoom = await maybeCreateBookingZoomLink({
        service,
        staffId: staff.staffId,
        startTimeISO: parsed.data.startAt,
        customerName: parsed.data.customer.name,
        customerEmail: parsed.data.customer.email,
      });
      const packageRedemption = packageCreditAvailable
        ? await redeemPackageCreditForBooking({
            bookingId,
            customerEmail: parsed.data.customer.email,
            serviceId: service.serviceId,
          })
        : null;
      if (packageCreditAvailable && !packageRedemption) {
        return errorResponse(locale, 'booking_create_package_unavailable', 409);
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
        ...(price.discountCode && price.discountAmount ? { discountCode: price.discountCode, discountAmount: price.discountAmount } : {}),
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
        ...(zoom?.meetingLink ? { meetingLink: zoom.meetingLink } : {}),
        ...(parsed.data.paymentIntentId
          ? {
              paymentIntentId: parsed.data.paymentIntentId,
              ...(paymentSettled ? { onlinePaidAmount: price.amountDueNow } : {}),
              paymentStatus: (paymentSettled
                ? (price.balanceDueAfterOnlinePayment > 0 ? 'partially_paid' : 'paid')
                : 'unpaid') as 'paid' | 'partially_paid' | 'unpaid',
            }
          : {}),
        ...(price.payLater && !packageRedemption
          ? { paymentStatus: 'unpaid' as const }
        : {}),
      });
      if (!await renewSlotLock(slotLease)) {
        if (packageRedemption) {
          await restorePackageCreditForBooking(booking).catch(() => undefined);
        }
        return errorResponse(locale, 'booking_storage_unavailable', 503);
      }
      try {
        await saveBooking(booking);
        bookingPersisted = true;
      } catch (error) {
        if (packageRedemption) {
          await restorePackageCreditForBooking(booking).catch((restoreError) => {
            console.error('[booking/book] package credit restore after save failure failed:', restoreError);
          });
        }
        throw error;
      }
    } finally {
      if (claimedPaymentIntent && !bookingPersisted) {
        await releaseBookingPaymentIntentClaim(
          claimedPaymentIntent.paymentIntentId,
          claimedPaymentIntent.bookingId,
        ).catch(() => {
          console.error('[booking/book] payment intent claim release after save failure failed');
        });
      }
      await releaseSlotLock(slotLease).catch(() => {
        // A persisted booking remains successful even if a best-effort lease
        // cleanup cannot reach Blob; ownership-safe release cannot delete a
        // replacement lease and the TTL is the remaining recovery path.
        console.error('[booking/book] slot lease release failed');
      });
    }
    if (!booking) {
      return errorResponse(locale, 'booking_create_failed', 500);
    }
    try {
      const billingAutomation = await runBookingBillingAutomation(booking.bookingId, { trigger: 'created' });
      if (billingAutomation?.owner) booking = billingAutomation.owner;
    } catch (error) {
      console.error('[booking/book] billing automation failed:', error instanceof Error ? error.message : String(error));
    }
    const emailDelivery = await deliverBookingConfirmation(booking, { service, staff });
    try {
      emitEvent('booking.created', {
        bookingId: booking.bookingId,
        serviceId: booking.serviceId,
        staffId: booking.staffId,
        startAt: booking.startAt,
        customer: { email: booking.customer.email, name: booking.customer.name, locale: booking.customer.locale },
        customerTimezone: booking.customerTimezone,
      });
    } catch (error) {
      console.error('[booking/book] webhook dispatch failed:', error instanceof Error ? error.message : String(error));
    }

    return NextResponse.json({ bookingId: booking.bookingId, booking, emailDelivery }, { status: 201 });
  } catch (error) {
    console.error('[booking/book] POST failed:', error instanceof Error ? error.message : String(error));
    return errorResponse(locale, 'booking_create_failed', 500);
  }
}
