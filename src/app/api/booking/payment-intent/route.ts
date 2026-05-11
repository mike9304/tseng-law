import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getService } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Phase 25 (W197~W201) — Stripe Payment Intent creation.
 *
 * Creates a PaymentIntent for paid booking services. The client receives the
 * client_secret and confirms the payment via Stripe Payment Element. The
 * actual booking row is created later by /api/booking/book once the payment
 * succeeds (or by a webhook in a future iteration).
 *
 * Env: STRIPE_SECRET_KEY. When absent in dev, returns a stub client_secret
 * so the UI flow can be wired without a real key — clearly marked with
 * `stub: true` so production won't accidentally accept it.
 */

const payloadSchema = z.object({
  serviceId: z.string().min(1).max(120),
  customer: z.object({
    email: z.string().email().max(200),
    name: z.string().min(1).max(120),
  }),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rate = await checkRateLimit(`booking-payment-intent:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many payment attempts' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  const raw = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payment payload' }, { status: 400 });
  }

  const service = await getService(parsed.data.serviceId);
  if (!service || !service.isActive) {
    return NextResponse.json({ error: 'Service not available' }, { status: 404 });
  }
  if (service.paymentMode !== 'paid') {
    return NextResponse.json({ error: 'Service is free; no payment required' }, { status: 400 });
  }
  if (!service.priceAmount || service.priceAmount <= 0 || !service.priceCurrency) {
    return NextResponse.json({ error: 'Service price is not configured' }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY ?? '';
  if (!stripeKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[booking/payment-intent] STRIPE_SECRET_KEY missing in production');
      return NextResponse.json({ error: 'Payment provider not configured' }, { status: 503 });
    }
    return NextResponse.json({
      ok: true,
      stub: true,
      clientSecret: 'pi_stub_dev_secret',
      amount: service.priceAmount,
      currency: service.priceCurrency.toLowerCase(),
      note: 'STRIPE_SECRET_KEY unset — returned stub client_secret for dev wiring only.',
    });
  }

  try {
    const formBody = new URLSearchParams();
    formBody.set('amount', String(service.priceAmount));
    formBody.set('currency', service.priceCurrency.toLowerCase());
    formBody.set('description', `Booking: ${service.slug}`);
    formBody.set('receipt_email', parsed.data.customer.email);
    formBody.set('automatic_payment_methods[enabled]', 'true');
    formBody.set('metadata[serviceId]', service.serviceId);
    formBody.set('metadata[customerName]', parsed.data.customer.name);

    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn('[booking/payment-intent] stripe error', { status: res.status, body: body.slice(0, 200) });
      return NextResponse.json({ error: 'Payment provider failed' }, { status: 502 });
    }

    const data = (await res.json()) as { id?: string; client_secret?: string };
    if (!data.client_secret) {
      return NextResponse.json({ error: 'Payment provider returned no secret' }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      stub: false,
      clientSecret: data.client_secret,
      paymentIntentId: data.id,
      amount: service.priceAmount,
      currency: service.priceCurrency.toLowerCase(),
    });
  } catch (err) {
    console.warn('[booking/payment-intent] fetch failed', {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: 'Payment provider unreachable' }, { status: 502 });
  }
}
