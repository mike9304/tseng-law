import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { captureAbandonedCart } from '@/lib/builder/commerce/notifications-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const recoverySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).default('ko'),
  email: z.string().trim().email().max(200),
  currency: z.enum(['TWD', 'KRW', 'USD']).default('TWD'),
  cart: z.unknown(),
  recoveryUrl: z.string().trim().max(400).optional(),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  
  // builder-route-guard: allow-public — intentional public visitor endpoint
const rate = await checkRateLimit(`commerce-cart-recovery:${clientIp(request)}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: 'too_many_requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  try {
    const input = recoverySchema.parse(await request.json());
    const result = await captureAbandonedCart(input);
    return NextResponse.json({ ok: true, recovery: result.recovery, event: result.event });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    if (error instanceof Error && error.message === 'commerce_recovery_cart_empty') {
      return NextResponse.json({ ok: false, error: 'cart_empty' }, { status: 400 });
    }
    console.error('[builder/commerce/cart-recovery] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'cart_recovery_failed' }, { status: 500 });
  }
}
