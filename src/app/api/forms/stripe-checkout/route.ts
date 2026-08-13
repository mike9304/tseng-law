import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  isStripeCheckoutUrl,
  resolvePublishedStripeCheckoutOffer,
  stripeCheckoutIdempotencyKey,
} from '@/lib/builder/forms/stripe-checkout-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const checkoutSchema = z.object({
  amountCents: z.number().int().min(50).max(10_000_000),
  currency: z.enum(['KRW', 'USD', 'TWD', 'JPY', 'EUR']),
  description: z.string().trim().min(1).max(400),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

const CHECKOUT_VISITOR_COOKIE = 'tseng_form_checkout';
const CHECKOUT_VISITOR_TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  const rate = await checkRateLimit(`forms-stripe-checkout:${clientIp(request)}`, 10, 60_000);
  if (!rate.allowed) {
    const status = rate.reason === 'backend_unavailable' ? 503 : 429;
    return NextResponse.json(
      { error: status === 503 ? 'Checkout protection is unavailable.' : 'Too many requests' },
      {
        status,
        headers: status === 429
          ? { 'Retry-After': String(Math.max(1, Math.ceil(rate.retryAfterMs / 1000))) }
          : undefined,
      },
    );
  }

  const raw = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payment payload.' }, { status: 400 });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeSecret) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 501 });
  }

  let offer;
  try {
    offer = await resolvePublishedStripeCheckoutOffer(request, parsed.data);
  } catch {
    return NextResponse.json({ error: 'Published payment configuration is unavailable.' }, { status: 503 });
  }
  if (!offer) {
    return NextResponse.json({ error: 'Payment does not match a published offer.' }, { status: 400 });
  }

  const cookieToken = request.cookies.get(CHECKOUT_VISITOR_COOKIE)?.value;
  const visitorToken = cookieToken && CHECKOUT_VISITOR_TOKEN.test(cookieToken)
    ? cookieToken
    : randomUUID();

  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('success_url', offer.successUrl);
  body.set('cancel_url', offer.cancelUrl);
  body.set('line_items[0][quantity]', '1');
  body.set('line_items[0][price_data][currency]', offer.currency.toLowerCase());
  body.set('line_items[0][price_data][unit_amount]', String(offer.amountCents));
  body.set('line_items[0][price_data][product_data][name]', offer.description);

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': stripeCheckoutIdempotencyKey(offer, visitorToken),
      },
      body,
    });
    const payload = (await response.json().catch(() => ({}))) as { url?: string; error?: { message?: string } };
    if (!response.ok || !payload.url || !isStripeCheckoutUrl(payload.url)) {
      return NextResponse.json(
        { error: response.ok ? 'Stripe returned an invalid Checkout URL.' : 'Stripe Checkout session failed.' },
        { status: 502 },
      );
    }
    const checkoutResponse = NextResponse.json({ ok: true, url: payload.url });
    checkoutResponse.headers.set('Cache-Control', 'private, no-store, max-age=0');
    checkoutResponse.cookies.set(CHECKOUT_VISITOR_COOKIE, visitorToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/forms/stripe-checkout',
      maxAge: 30 * 60,
    });
    return checkoutResponse;
  } catch {
    return NextResponse.json({ error: 'Stripe request failed.' }, { status: 502 });
  }
}
