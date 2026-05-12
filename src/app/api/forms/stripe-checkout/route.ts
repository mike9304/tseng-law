import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

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

/**
 * Same-origin redirect guard so a caller can't trick visitors into
 * paying us and landing on an attacker-controlled site. Allows
 * Stripe-hosted success/cancel pages too.
 */
function isAllowedRedirect(url: string, origin: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.origin === origin) return true;
    return parsed.hostname.endsWith('stripe.com');
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const rate = await checkRateLimit(`forms-stripe-checkout:${clientIp(request)}`, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
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

  const origin = request.nextUrl.origin;
  const successUrl = parsed.data.successUrl || `${origin}/ko?payment=success`;
  const cancelUrl = parsed.data.cancelUrl || `${origin}/ko?payment=cancel`;
  if (!isAllowedRedirect(successUrl, origin) || !isAllowedRedirect(cancelUrl, origin)) {
    return NextResponse.json({ error: 'success/cancel URL must be same-origin.' }, { status: 400 });
  }

  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('success_url', successUrl);
  body.set('cancel_url', cancelUrl);
  body.set('line_items[0][quantity]', '1');
  body.set('line_items[0][price_data][currency]', parsed.data.currency.toLowerCase());
  body.set('line_items[0][price_data][unit_amount]', String(parsed.data.amountCents));
  body.set('line_items[0][price_data][product_data][name]', parsed.data.description);

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    const payload = (await response.json().catch(() => ({}))) as { url?: string; error?: { message?: string } };
    if (!response.ok || !payload.url) {
      return NextResponse.json(
        { error: payload.error?.message || 'Stripe Checkout session failed.' },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, url: payload.url });
  } catch {
    return NextResponse.json({ error: 'Stripe request failed.' }, { status: 502 });
  }
}
