import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  captureCommercePaymentIntent,
  createCommercePaymentIntent,
  paymentIntentToOrderStatus,
} from '@/lib/builder/commerce/payment-providers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const intentSchema = z.object({
  action: z.enum(['create', 'capture']).default('create'),
  provider: z.enum(['manual-invoice', 'sandbox-card']).default('manual-invoice'),
  locale: z.enum(['ko', 'zh-hant', 'en']).default('ko'),
  currency: z.enum(['TWD', 'KRW', 'USD']).default('TWD'),
  amountCents: z.number().int().min(0).max(100_000_000).default(0),
  paymentIntent: z.unknown().optional(),
  simulateFailure: z.boolean().optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = intentSchema.parse(await request.json());
    const intent = input.action === 'capture'
      ? captureCommercePaymentIntent(input.paymentIntent, { simulateFailure: input.simulateFailure })
      : createCommercePaymentIntent({
          provider: input.provider,
          locale: input.locale,
          currency: input.currency,
          amountCents: input.amountCents,
          simulateFailure: input.simulateFailure,
        });

    if (!intent) return NextResponse.json({ ok: false, error: 'payment_intent_invalid' }, { status: 400 });
    return NextResponse.json({
      ok: true,
      intent,
      paymentStatus: paymentIntentToOrderStatus(intent),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    console.error('[builder/commerce/payment-intents] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'payment_intent_failed' }, { status: 500 });
  }
}
