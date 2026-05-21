import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { recordOrderManualPayment } from '@/lib/builder/commerce/orders-engine';
import { queueBillingPaymentReceivedNotification, queueOrderUpdatedNotification } from '@/lib/builder/commerce/notifications-engine';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import { getCurrentBillingInvoice } from '@/lib/builder/billing-documents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const manualPaymentSchema = z.object({
  amountCents: z.number().int().positive(),
  method: z.enum(['cash', 'bank_transfer', 'check', 'other']).default('other'),
  status: z.enum(['pending', 'succeeded', 'failed', 'canceled']).default('succeeded'),
  reference: z.string().trim().max(160).optional(),
  note: z.string().trim().max(500).optional(),
  idempotencyKey: z.string().trim().max(160).optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

function errorStatus(error?: string): number {
  switch (error) {
    case 'order_not_found':
      return 404;
    case 'manual_payment_amount_invalid':
    case 'manual_payment_exceeds_balance':
    case 'order_not_manual_invoice':
    case 'order_refund_locked':
    case 'order_already_paid':
      return 400;
    default:
      return 500;
  }
}

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = manualPaymentSchema.parse(await request.json());
    const result = await recordOrderManualPayment(params.orderId, {
      ...input,
      actor: 'admin',
    });
    if (!result.order || !result.manualPayment) {
      return NextResponse.json({ ok: false, error: result.error ?? 'manual_payment_failed' }, { status: errorStatus(result.error) });
    }

    let order = result.order;
    const succeeded = result.manualPayment.status === 'succeeded';
    let receiptEmailQueued = false;
    if (succeeded && order.payment.status === 'paid') {
      try {
        const billingAutomation = await runOrderBillingAutomation(order.orderId, { trigger: 'paid' });
        if (billingAutomation?.owner) order = billingAutomation.owner;
        receiptEmailQueued = Boolean(billingAutomation?.actions.some((action) => action.type === 'receipt' && action.emailed));
      } catch (error) {
        console.error('[builder/commerce/orders/:id/manual-payments] billing automation failed:', error);
      }
    }
    if (succeeded) {
      const invoice = await getCurrentBillingInvoice('order', order.orderId);
      await Promise.allSettled([
        queueOrderUpdatedNotification(order, {
          manualPaymentId: result.manualPayment.paymentId,
          amountCents: result.manualPayment.amountCents,
          paymentStatus: order.payment.status,
        }),
        invoice
          ? queueBillingPaymentReceivedNotification(invoice, {
            amount: result.manualPayment.amountCents,
            method: 'manual',
            paymentId: result.manualPayment.paymentId,
            provider: 'manual',
            reference: result.manualPayment.reference,
            receiptEmailQueued,
          })
          : Promise.resolve(null),
      ]);
    }
    return NextResponse.json({ ok: true, order, manualPayment: result.manualPayment });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    console.error('[builder/commerce/orders/:id/manual-payments] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'manual_payment_failed' }, { status: 500 });
  }
}
