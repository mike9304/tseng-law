import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';

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

function verifySignature(rawBody: string, header: string, secret: string, toleranceSeconds = 300): boolean {
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
    if (process.env.NODE_ENV === 'production') {
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

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const obj = event.data?.object ?? {};
      const metadata = (obj.metadata as Record<string, string> | undefined) ?? {};
      console.info('[booking/stripe-webhook] payment_intent.succeeded', {
        id: event.id,
        intentId: obj.id,
        serviceId: metadata.serviceId,
        amount: obj.amount,
        currency: obj.currency,
      });
      // Booking row creation is deferred to /api/booking/book (called by the
      // client after PaymentIntent succeeds) so that a single source of truth
      // governs availability checks. A future iteration may move that here.
      return NextResponse.json({ ok: true, handled: true });
    }
    case 'payment_intent.payment_failed': {
      const obj = event.data?.object ?? {};
      console.warn('[booking/stripe-webhook] payment_intent.payment_failed', {
        id: event.id,
        intentId: obj.id,
        lastError: (obj.last_payment_error as { message?: string } | undefined)?.message,
      });
      return NextResponse.json({ ok: true, handled: true });
    }
    default: {
      // Ack unhandled events so Stripe doesn't retry.
      return NextResponse.json({ ok: true, handled: false, type: event.type });
    }
  }
}
