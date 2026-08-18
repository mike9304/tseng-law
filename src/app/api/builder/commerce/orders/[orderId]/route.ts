import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceOrdersApiErrorPayload,
  type CommerceOrdersApiErrorCode,
} from '@/lib/builder/commerce/orders-api-copy';
import { loadOrder, softDeleteOrder, updateOrderState } from '@/lib/builder/commerce/orders-engine';
import { queueOrderUpdatedNotification } from '@/lib/builder/commerce/notifications-engine';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  status: z.enum(['created', 'confirmed', 'cancelled']).optional(),
  paymentStatus: z.enum(['requires_manual_payment', 'authorized_stub', 'paid', 'failed']).optional(),
  fulfillmentStatus: z.enum(['unfulfilled', 'processing', 'fulfilled', 'cancelled']).optional(),
  trackingNumber: z.string().trim().max(160).optional(),
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

export async function GET(request: NextRequest, props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const auth = await guardBuilderReadWithPermission(request, 'view-commerce');
  if (auth instanceof NextResponse) return auth;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const order = await loadOrder(params.orderId);
    if (!order) return errorResponse(errorLocale, 'order_not_found', 404);
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    console.error('[builder/commerce/orders/:id] GET failed:', error);
    return errorResponse(errorLocale, 'orders_failed', 500);
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = patchSchema.parse(await request.json());
    if (process.env.NODE_ENV === 'production' && input.paymentStatus === 'authorized_stub') {
      return errorResponse(errorLocale, 'order_update_failed', 422);
    }
    const previous = await loadOrder(params.orderId);
    if (!previous) return errorResponse(errorLocale, 'order_not_found', 404);
    if (process.env.NODE_ENV === 'production' && previous.payment.status === 'authorized_stub') {
      return errorResponse(errorLocale, 'order_update_failed', 422);
    }
    let order = await updateOrderState(params.orderId, { ...input, actor: 'admin' });
    if (!order) return errorResponse(errorLocale, 'order_not_found', 404);
    if (order.payment.status === 'paid' && previous?.payment.status !== 'paid') {
      try {
        const billingAutomation = await runOrderBillingAutomation(order.orderId, { trigger: 'paid' });
        if (billingAutomation?.owner) order = billingAutomation.owner;
      } catch (error) {
        console.error('[builder/commerce/orders/:id] billing automation failed:', error);
      }
    }
    await Promise.allSettled([queueOrderUpdatedNotification(order, input)]);
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/orders/:id] PATCH failed:', error);
    return errorResponse(errorLocale, 'order_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  const deleted = await softDeleteOrder(params.orderId);
  return NextResponse.json({ ok: true, deleted });
}
