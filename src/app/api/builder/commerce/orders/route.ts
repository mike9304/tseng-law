import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  getCommerceOrdersApiErrorPayload,
  type CommerceOrdersApiErrorCode,
} from '@/lib/builder/commerce/orders-api-copy';
import { filterOrders } from '@/lib/builder/commerce/orders-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  q: z.string().trim().max(200).optional(),
  status: z.enum(['all', 'created', 'confirmed', 'cancelled']).default('all'),
  paymentStatus: z.enum(['all', 'requires_manual_payment', 'partially_paid', 'authorized_stub', 'paid', 'failed', 'partially_refunded', 'refunded']).default('all'),
  fulfillmentStatus: z.enum(['all', 'unfulfilled', 'processing', 'fulfilled', 'cancelled']).default('all'),
});

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

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? undefined,
      q: sp.get('q') ?? undefined,
      status: sp.get('status') ?? 'all',
      paymentStatus: sp.get('paymentStatus') ?? 'all',
      fulfillmentStatus: sp.get('fulfillmentStatus') ?? 'all',
    });
    const orders = await filterOrders(parsed);
    return NextResponse.json({ ok: true, orders, total: orders.length });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/commerce/orders] GET failed:', error);
    return errorResponse(errorLocale, 'orders_failed', 500);
  }
}
