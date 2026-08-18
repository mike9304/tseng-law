import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceOrdersApiErrorPayload,
  type CommerceOrdersApiErrorCode,
} from '@/lib/builder/commerce/orders-api-copy';
import { recordOrderManualPayment } from '@/lib/builder/commerce/orders-engine';
import { queueBillingPaymentReceivedNotification, queueOrderUpdatedNotification } from '@/lib/builder/commerce/notifications-engine';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import { getCurrentBillingInvoice } from '@/lib/builder/billing-documents';
import { normalizeLocale, type Locale } from '@/lib/locales';

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

const manualPaymentErrorCodes = new Set<CommerceOrdersApiErrorCode>([
  'order_not_found',
  'manual_payment_amount_invalid',
  'manual_payment_exceeds_balance',
  'order_not_manual_invoice',
  'order_refund_locked',
  'order_already_paid',
  'manual_payment_failed',
]);

function manualPaymentErrorCode(error?: string): CommerceOrdersApiErrorCode {
  return manualPaymentErrorCodes.has(error as CommerceOrdersApiErrorCode)
    ? error as CommerceOrdersApiErrorCode
    : 'manual_payment_failed';
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

function errorStatus(errorCode: CommerceOrdersApiErrorCode): number {
  switch (errorCode) {
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

export async function POST(request: NextRequest, props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = manualPaymentSchema.parse(await request.json());
    const result = await recordOrderManualPayment(params.orderId, {
      ...input,
      actor: 'admin',
    });
    if (!result.order || !result.manualPayment) {
      const errorCode = manualPaymentErrorCode(result.error);
      return errorResponse(errorLocale, errorCode, errorStatus(errorCode));
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
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/orders/:id/manual-payments] POST failed:', error);
    return errorResponse(errorLocale, 'manual_payment_failed', 500);
  }
}
