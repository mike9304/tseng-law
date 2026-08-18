import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getCommercePaymentIntentsApiErrorPayload,
  type CommercePaymentIntentsApiErrorCode,
} from '@/lib/builder/commerce/payment-intents-api-copy';
import {
  captureCommercePaymentIntent,
  createCommercePaymentIntent,
  paymentIntentToOrderStatus,
} from '@/lib/builder/commerce/payment-providers';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

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

function errorResponse(
  locale: Locale,
  errorCode: CommercePaymentIntentsApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommercePaymentIntentsApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  if (payload && typeof payload === 'object' && 'locale' in payload) {
    const locale = (payload as { locale?: unknown }).locale;
    if (typeof locale === 'string' && isLocale(locale)) return locale;
  }
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

export async function POST(request: NextRequest) {
  let errorLocale = resolveRequestLocale(request);
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = await request.json();
    errorLocale = resolveRequestLocale(request, payload);
    const input = intentSchema.parse(payload);
    const requestedProvider = input.action === 'capture'
      && input.paymentIntent
      && typeof input.paymentIntent === 'object'
      && 'provider' in input.paymentIntent
      ? (input.paymentIntent as { provider?: unknown }).provider
      : input.provider;
    if (process.env.NODE_ENV === 'production' && requestedProvider === 'sandbox-card') {
      return errorResponse(errorLocale, 'payment_provider_not_configured', 503);
    }
    const intent = input.action === 'capture'
      ? captureCommercePaymentIntent(input.paymentIntent, { simulateFailure: input.simulateFailure })
      : createCommercePaymentIntent({
          provider: input.provider,
          locale: input.locale,
          currency: input.currency,
          amountCents: input.amountCents,
          simulateFailure: input.simulateFailure,
        });

    if (!intent) return errorResponse(errorLocale, 'payment_intent_invalid', 400);
    return NextResponse.json({
      ok: true,
      intent,
      paymentStatus: paymentIntentToOrderStatus(intent),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/payment-intents] POST failed:', error);
    return errorResponse(errorLocale, 'payment_intent_failed', 500);
  }
}
