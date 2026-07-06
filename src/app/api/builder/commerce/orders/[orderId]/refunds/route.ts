import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceOrdersApiErrorPayload,
  type CommerceOrdersApiErrorCode,
} from '@/lib/builder/commerce/orders-api-copy';
import { refundOrderPayment } from '@/lib/builder/commerce/orders-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const refundSchema = z.object({
  amountCents: z.number().int().positive().max(100_000_000),
  reason: z.string().trim().max(500).optional(),
});

const refundErrorCodes = new Set<CommerceOrdersApiErrorCode>([
  'order_not_found',
  'refund_amount_invalid',
  'order_not_refundable',
  'refund_amount_exceeds_remaining',
  'payment_reference_missing',
  'refund_provider_failed',
  'refund_failed',
]);

function refundErrorCode(error?: string): CommerceOrdersApiErrorCode {
  if (error?.startsWith('refund_provider')) return 'refund_provider_failed';
  return refundErrorCodes.has(error as CommerceOrdersApiErrorCode)
    ? error as CommerceOrdersApiErrorCode
    : 'refund_failed';
}

function errorResponse(
  locale: Locale,
  errorCode: CommerceOrdersApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceOrdersApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function refundErrorStatus(errorCode: CommerceOrdersApiErrorCode): number {
  if (errorCode === 'order_not_found') return 404;
  if (errorCode === 'payment_reference_missing' || errorCode === 'refund_provider_failed') return 502;
  return errorCode === 'refund_failed' ? 500 : 400;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } },
) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = refundSchema.parse(await request.json());
    const result = await refundOrderPayment(params.orderId, {
      amountCents: input.amountCents,
      reason: input.reason,
      actor: 'admin',
    });
    if (!result.order) return errorResponse(errorLocale, 'order_not_found', 404);
    if (!result.refund) {
      const errorCode = refundErrorCode(result.error);
      return errorResponse(errorLocale, errorCode, refundErrorStatus(errorCode), { order: result.order });
    }
    return NextResponse.json({ ok: true, order: result.order, refund: result.refund });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/orders/:id/refunds] POST failed:', error);
    return errorResponse(errorLocale, 'refund_failed', 500);
  }
}
