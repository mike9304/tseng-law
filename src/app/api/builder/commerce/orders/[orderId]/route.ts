import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { loadOrder, softDeleteOrder, updateOrderState } from '@/lib/builder/commerce/orders-engine';
import { queueOrderUpdatedNotification } from '@/lib/builder/commerce/notifications-engine';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  status: z.enum(['created', 'confirmed', 'cancelled']).optional(),
  paymentStatus: z.enum(['requires_manual_payment', 'authorized_stub', 'paid', 'failed']).optional(),
  fulfillmentStatus: z.enum(['unfulfilled', 'processing', 'fulfilled', 'cancelled']).optional(),
  trackingNumber: z.string().trim().max(160).optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const order = await loadOrder(params.orderId);
  if (!order) return NextResponse.json({ ok: false, error: 'order_not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}

export async function PATCH(request: NextRequest, { params }: { params: { orderId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = patchSchema.parse(await request.json());
    const previous = await loadOrder(params.orderId);
    let order = await updateOrderState(params.orderId, { ...input, actor: 'admin' });
    if (!order) return NextResponse.json({ ok: false, error: 'order_not_found' }, { status: 404 });
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
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    console.error('[builder/commerce/orders/:id] PATCH failed:', error);
    return NextResponse.json({ ok: false, error: 'order_update_failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { orderId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const deleted = await softDeleteOrder(params.orderId);
  return NextResponse.json({ ok: true, deleted });
}
