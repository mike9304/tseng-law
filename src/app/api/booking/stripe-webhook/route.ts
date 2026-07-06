import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getBooking, listBookings, saveBooking } from '@/lib/builder/bookings/storage';
import { runBookingBillingAutomation } from '@/lib/builder/billing-document-automation';
import { bookingPaymentAmountFor } from '@/lib/builder/bookings/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Phase 25 (W197~W201) — Stripe webhook receiver.
 *
 * Verifies the `stripe-signature` header against STRIPE_WEBHOOK_SECRET and
 * logs `payment_intent.succeeded` / `payment_intent.payment_failed` events.
 * The actual booking-row mutation is deferred to a follow-up; for now this
 * endpoint provides the signature verification surface so PCI/webhook
 * registration can be wired ahead of time.
 *
 * Why HMAC verification manually: avoids adding the `stripe` npm dependency
 * just for this. Stripe's v1 signature scheme is HMAC-SHA256 over
 * `${timestamp}.${rawBody}` with the webhook secret.
 */

function parseStripeSignatureHeader(header: string): { timestamp: number; signatures: string[] } | null {
  const parts = header.split(',');
  let timestamp = 0;
  const sigs: string[] = [];
  for (const part of parts) {
    const [key, value] = part.split('=');
    if (!key || !value) continue;
    if (key === 't') {
      const ts = Number(value);
      if (Number.isFinite(ts)) timestamp = ts;
    } else if (key === 'v1') {
      sigs.push(value);
    }
  }
  if (!timestamp || sigs.length === 0) return null;
  return { timestamp, signatures: sigs };
}

function verifySignature(rawBody: string, header: string, secret: string, toleranceSeconds = 120): boolean {
  const parsed = parseStripeSignatureHeader(header);
  if (!parsed) return false;
  const ageSec = Math.abs(Date.now() / 1000 - parsed.timestamp);
  if (ageSec > toleranceSeconds) return false;
  const signedPayload = `${parsed.timestamp}.${rawBody}`;
  const expected = createHmac('sha256', secret).update(signedPayload).digest('hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  for (const sig of parsed.signatures) {
    try {
      const sigBuf = Buffer.from(sig, 'hex');
      if (sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf)) {
        return true;
      }
    } catch {
      /* skip malformed sig */
    }
  }
  return false;
}

interface StripeEvent {
  id?: string;
  type?: string;
  data?: { object?: Record<string, unknown> };
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
  if (!secret) {
    // BOOKING_STRIPE_WEBHOOK_ALLOW_UNSIGNED=1 keeps the dev acceptance path
    // available when a production build runs in a local/QA harness.
    if (process.env.NODE_ENV === 'production' && process.env.BOOKING_STRIPE_WEBHOOK_ALLOW_UNSIGNED !== '1') {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }
    console.warn('[booking/stripe-webhook] STRIPE_WEBHOOK_SECRET unset — accepting unsigned events in dev only');
  }

  const sigHeader = request.headers.get('stripe-signature') ?? '';
  const rawBody = await request.text();

  if (secret && !verifySignature(rawBody, sigHeader, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  async function updateBookingPaymentStatus(
    intentId: string,
    nextStatus: 'paid' | 'unpaid',
    paidAmount?: number,
  ): Promise<{ updated: boolean; bookingId?: string }> {
    if (!intentId) return { updated: false };
    const bookings = await listBookings({ includeCancelled: true });
    const match = bookings.find((b) => b.paymentIntentId === intentId);
    if (!match) return { updated: false };
    // Idempotency: if the booking is already in the requested state, no-op.
    // Stripe redelivers webhooks on retry — flipping back-and-forth would
    // confuse downstream analytics and could re-fire derived notifications.
    const totalAmount = bookingPaymentAmountFor(match);
    const onlinePaidAmount = nextStatus === 'paid' ? Math.max(0, Math.floor(Number(paidAmount ?? match.paymentDueNow ?? totalAmount))) : 0;
    const resolvedStatus = nextStatus === 'paid' && onlinePaidAmount > 0 && onlinePaidAmount < totalAmount
      ? 'partially_paid'
      : nextStatus;
    if (match.paymentStatus === resolvedStatus && (match.onlinePaidAmount ?? 0) === onlinePaidAmount) {
      return { updated: false, bookingId: match.bookingId };
    }
    // Don't resurrect cancelled bookings as 'paid' — they should stay in
    // their cancelled refund state (refunded / partial-refund).
    if (
      resolvedStatus === 'paid'
      && (match.status === 'cancelled' || match.paymentStatus === 'refunded' || match.paymentStatus === 'partial-refund')
    ) {
      return { updated: false, bookingId: match.bookingId };
    }
    await saveBooking({
      ...match,
      paymentStatus: resolvedStatus,
      onlinePaidAmount,
      updatedAt: new Date().toISOString(),
    });
    return { updated: true, bookingId: match.bookingId };
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const obj = event.data?.object ?? {};
      const intentId = String(obj.id ?? '');
      const amount = typeof obj.amount === 'number' ? obj.amount : undefined;
      const updated = await updateBookingPaymentStatus(intentId, 'paid', amount);
      if (updated.bookingId) {
        const latest = await getBooking(updated.bookingId);
        if (latest?.paymentStatus !== 'paid') {
          console.info('[booking/stripe-webhook] payment_intent.succeeded pending balance', {
            bookingId: updated.bookingId,
            paymentStatus: latest?.paymentStatus,
          });
          return NextResponse.json({ ok: true, handled: true, bookingUpdated: updated.updated });
        }
        try {
          await runBookingBillingAutomation(updated.bookingId, { trigger: 'paid' });
        } catch (error) {
          console.error('[booking/stripe-webhook] billing automation failed:', error);
        }
      }
      console.info('[booking/stripe-webhook] payment_intent.succeeded', {
        id: event.id,
        intentId,
        amount: obj.amount,
        currency: obj.currency,
        bookingUpdated: updated.updated,
      });
      return NextResponse.json({ ok: true, handled: true, bookingUpdated: updated.updated });
    }
    case 'payment_intent.payment_failed': {
      const obj = event.data?.object ?? {};
      const intentId = String(obj.id ?? '');
      const updated = await updateBookingPaymentStatus(intentId, 'unpaid');
      console.warn('[booking/stripe-webhook] payment_intent.payment_failed', {
        id: event.id,
        intentId,
        lastError: (obj.last_payment_error as { message?: string } | undefined)?.message,
        bookingUpdated: updated.updated,
      });
      return NextResponse.json({ ok: true, handled: true, bookingUpdated: updated.updated });
    }
    case 'charge.refunded': {
      const obj = event.data?.object ?? {};
      const intentId = String(obj.payment_intent ?? '');
      if (intentId) {
        const bookings = await listBookings({ includeCancelled: true });
        const match = bookings.find((b) => b.paymentIntentId === intentId);
        if (match) {
          const refunded = obj.amount_refunded as number | undefined;
          const total = obj.amount as number | undefined;
          const nextStatus: 'refunded' | 'partial-refund' =
            refunded && total && refunded >= total ? 'refunded' : 'partial-refund';
          // Narrow the concurrent-refund race: re-read just before write
          // so an in-flight cancel/refund that already set this status
          // wins and we don't clobber its updatedAt or downgrade
          // 'refunded' to 'partial-refund' due to webhook redelivery.
          const latest = await getBooking(match.bookingId);
          const target = latest ?? match;
          if (
            target.paymentStatus === 'refunded'
            || (target.paymentStatus === 'partial-refund' && nextStatus === 'partial-refund')
          ) {
            return NextResponse.json({ ok: true, handled: true, bookingUpdated: false });
          }
          await saveBooking({ ...target, paymentStatus: nextStatus, updatedAt: new Date().toISOString() });
          return NextResponse.json({ ok: true, handled: true, bookingUpdated: true });
        }
      }
      return NextResponse.json({ ok: true, handled: true, bookingUpdated: false });
    }
    default: {
      return NextResponse.json({ ok: true, handled: false, type: event.type });
    }
  }
}
