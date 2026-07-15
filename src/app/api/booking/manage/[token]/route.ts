import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import {
  getBookingManageApiErrorPayload,
  type BookingManageApiErrorCode,
} from '@/lib/builder/bookings/booking-manage-copy';
import { verifyBookingManageToken } from '@/lib/builder/bookings/manage-token';
import { getBooking, getService, getStaff, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import {
  applyRefundOutcome,
  computeRefundForCancel,
  evaluateBookingSelfServicePolicy,
  type BookingSelfServicePolicy,
} from '@/lib/builder/bookings/refund';
import { sendBookingCancellation } from '@/lib/builder/bookings/notifications';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { restorePackageCreditForBooking } from '@/lib/builder/bookings/packages';
import { maybeCreateBookingZoomLink } from '@/lib/builder/bookings/zoom-handoff';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const updateSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('cancel'),
    reason: z.string().trim().max(300).optional(),
  }),
  z.object({
    action: z.literal('reschedule'),
    startAt: z.string().datetime({ offset: true }),
    staffId: z.string().trim().min(1).optional(),
  }),
]);

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}

function localeFromRequest(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
}

function manageErrorResponse(
  locale: Locale,
  errorCode: BookingManageApiErrorCode,
  status: number,
  headers?: HeadersInit,
): NextResponse {
  return NextResponse.json(getBookingManageApiErrorPayload(locale, errorCode), { status, headers });
}

function localizePolicyReasons(
  policy: BookingSelfServicePolicy,
  locale: Locale,
): BookingSelfServicePolicy {
  return {
    ...policy,
    ...(policy.cancelBlockedReason
      ? { cancelBlockedReason: getBookingManageApiErrorPayload(locale, 'cancel_unavailable').error }
      : {}),
    ...(policy.rescheduleBlockedReason
      ? { rescheduleBlockedReason: getBookingManageApiErrorPayload(locale, 'reschedule_unavailable').error }
      : {}),
  };
}

async function resolveBooking(token: string, fallbackLocale: Locale) {
  const verified = verifyBookingManageToken(token);
  if (!verified) return { error: manageErrorResponse(fallbackLocale, 'invalid_or_expired_link', 401) };

  const booking = await getBooking(verified.bookingId);
  if (!booking || booking.customer.email.toLowerCase() !== verified.email) {
    return { error: manageErrorResponse(fallbackLocale, 'booking_not_found', 404) };
  }

  const [service, staff] = await Promise.all([
    getService(booking.serviceId),
    getStaff(booking.staffId),
  ]);
  return { booking, service, staff };
}

async function bookingPayload(result: Awaited<ReturnType<typeof resolveBooking>>) {
  if (!('booking' in result) || !result.booking) return null;
  const locale = result.booking.customer.locale;
  const policy = await evaluateBookingSelfServicePolicy(result.booking, result.service);
  return {
    booking: result.booking,
    service: result.service ? {
      serviceId: result.service.serviceId,
      name: textForLocale(result.service.name, locale),
      durationMinutes: result.service.durationMinutes,
      meetingMode: result.service.meetingMode ?? 'in-person',
      cancellationPolicyId: result.service.cancellationPolicyId,
    } : null,
    staff: result.staff ? {
      staffId: result.staff.staffId,
      name: textForLocale(result.staff.name, locale),
    } : null,
    policy: localizePolicyReasons(policy, locale),
  };
}

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  const fallbackLocale = localeFromRequest(request);
  const rate = await checkRateLimit(`booking-manage-get:${clientIp(request)}`, 30, 60_000);
  if (!rate.allowed) return manageErrorResponse(fallbackLocale, 'too_many_requests', 429);

  const result = await resolveBooking(params.token, fallbackLocale);
  if ('error' in result && result.error) return result.error;
  return NextResponse.json(await bookingPayload(result));
}

export async function PATCH(request: NextRequest, { params }: { params: { token: string } }) {
  const fallbackLocale = localeFromRequest(request);
  const rate = await checkRateLimit(`booking-manage-patch:${clientIp(request)}`, 8, 60_000);
  if (!rate.allowed) return manageErrorResponse(fallbackLocale, 'too_many_requests', 429);

  const result = await resolveBooking(params.token, fallbackLocale);
  if ('error' in result && result.error) return result.error;
  const locale = result.booking.customer.locale;
  if (!result.booking || !result.service) {
    return manageErrorResponse(locale, 'booking_not_manageable', 404);
  }
  if (result.booking.status === 'cancelled') {
    return manageErrorResponse(locale, 'booking_already_cancelled', 409);
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    // Don't leak Zod error structure — the issues array reveals internal
    // schema shape (field names, constraints) which helps an attacker map
    // the API surface. A generic 400 is sufficient for a token-scoped
    // customer link: the form on the page knows what fields are valid.
    return manageErrorResponse(locale, 'invalid_update', 400);
  }

  if (parsed.data.action === 'cancel') {
    const policy = localizePolicyReasons(
      await evaluateBookingSelfServicePolicy(result.booking, result.service),
      locale,
    );
    if (!policy.canCancel) {
      return NextResponse.json({
        ...getBookingManageApiErrorPayload(locale, 'cancel_unavailable'),
        policy,
      }, { status: 409 });
    }
    // Apply the cancellation policy + Stripe refund so customer-link
    // cancellations don't bypass the refund math that /api/booking/cancel
    // enforces for admin/web flows.
    const outcome = await computeRefundForCancel(result.booking, result.service);
    const cancelled = await restorePackageCreditForBooking(applyRefundOutcome(result.booking, outcome, parsed.data.reason));
    const updated = timestamped(cancelled, result.booking.createdAt);
    await saveBooking(updated);
    let emailDelivery;
    try {
      const delivery = await sendBookingCancellation(updated, { service: result.service, staff: result.staff });
      emailDelivery = delivery.ok
        ? { ok: true as const }
        : { ok: false as const, reason: delivery.reason };
    } catch {
      emailDelivery = { ok: false as const, reason: 'internal_error' as const };
    }
    emitEvent('booking.cancelled', {
      bookingId: updated.bookingId,
      reason: parsed.data.reason,
      source: 'customer-link',
      refundDecision: outcome.decision,
      paymentStatus: updated.paymentStatus,
    });
    return NextResponse.json({
      ok: true,
      booking: updated,
      refundDecision: outcome.decision,
      refundResult: outcome.refundResult,
      refundAmountCents: outcome.refundAmountCents,
      hoursUntilStart: outcome.hoursUntilStart,
      emailDelivery,
    });
  }

  const nextStaffId = parsed.data.staffId || result.booking.staffId;
  const policy = localizePolicyReasons(
    await evaluateBookingSelfServicePolicy(result.booking, result.service),
    locale,
  );
  if (!policy.canReschedule) {
    return NextResponse.json({
      ...getBookingManageApiErrorPayload(locale, 'reschedule_unavailable'),
      policy,
    }, { status: 409 });
  }
  const resourceIds = result.service.requiredResourceIds ?? [];
  const endAt = addBookingDuration(parsed.data.startAt, result.service.durationMinutes);
  const slotKey = {
    serviceId: result.booking.serviceId,
    staffId: nextStaffId,
    startAt: parsed.data.startAt,
    resourceIds,
  };
  if (!acquireSlotLock(slotKey)) {
    return manageErrorResponse(locale, 'slot_lock_conflict', 409);
  }

  try {
    const available = await isSlotAvailable({
      ...slotKey,
      excludeBookingId: result.booking.bookingId,
    });
    if (!available) return manageErrorResponse(locale, 'slot_unavailable', 409);

    const nextStaff = await getStaff(nextStaffId);
    if (!nextStaff || !nextStaff.isActive) return manageErrorResponse(locale, 'staff_unavailable', 404);

    const zoom = await maybeCreateBookingZoomLink({
      service: result.service,
      staffId: nextStaff.staffId,
      startTimeISO: parsed.data.startAt,
      customerName: result.booking.customer.name,
      customerEmail: result.booking.customer.email,
    });

    const updated = timestamped({
      ...result.booking,
      staffId: nextStaffId,
      startAt: parsed.data.startAt,
      endAt,
      resourceIds,
      ...(zoom?.meetingLink ? { meetingLink: zoom.meetingLink } : result.booking.meetingLink ? { meetingLink: result.booking.meetingLink } : {}),
    }, result.booking.createdAt);
    await saveBooking(updated);
    emitEvent('booking.rescheduled', {
      bookingId: updated.bookingId,
      staffId: updated.staffId,
      startAt: updated.startAt,
      source: 'customer-link',
    });
    return NextResponse.json({ ok: true, booking: updated });
  } finally {
    releaseSlotLock(slotKey);
  }
}
