import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBillingDocument,
  parseBillingDocumentSource,
} from '@/lib/builder/billing-documents';
import { runBookingBillingAutomation, runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import { recordBookingManualPayment } from '@/lib/builder/bookings/payments';
import { queueBillingPaymentReceivedNotification } from '@/lib/builder/commerce/notifications-engine';
import { recordOrderManualPayment } from '@/lib/builder/commerce/orders-engine';

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
    case 'document_not_found':
    case 'order_not_found':
    case 'booking_not_found':
      return 404;
    case 'manual_payment_unavailable':
    case 'manual_payment_amount_invalid':
    case 'manual_payment_exceeds_balance':
    case 'order_not_manual_invoice':
    case 'order_refund_locked':
    case 'order_already_paid':
    case 'booking_cancelled':
    case 'booking_refund_locked':
    case 'booking_already_paid':
      return 400;
    default:
      return 500;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { source: string; ownerId: string; documentId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const source = parseBillingDocumentSource(params.source);
  if (!source) return NextResponse.json({ ok: false, error: 'invalid_document_source' }, { status: 400 });

  try {
    const input = manualPaymentSchema.parse(await request.json());
    const currentDocument = await getBillingDocument(source, params.ownerId, params.documentId);
    if (!currentDocument) {
      return NextResponse.json({ ok: false, error: 'document_not_found' }, { status: 404 });
    }
    const isCurrent = currentDocument.status === 'issued' || currentDocument.status === 'emailed_stub';
    if (currentDocument.type !== 'invoice' || !isCurrent || currentDocument.balanceDue <= 0) {
      return NextResponse.json({ ok: false, error: 'manual_payment_unavailable' }, { status: 400 });
    }
    if (input.amountCents > currentDocument.balanceDue) {
      return NextResponse.json({ ok: false, error: 'manual_payment_exceeds_balance' }, { status: 400 });
    }

    let manualPayment: unknown = null;
    let receiptEmailQueued = false;
    if (source === 'order') {
      const result = await recordOrderManualPayment(params.ownerId, {
        ...input,
        actor: 'admin',
      });
      if (!result.order || !result.manualPayment) {
        return NextResponse.json(
          { ok: false, error: result.error ?? 'manual_payment_failed' },
          { status: errorStatus(result.error) },
        );
      }
      manualPayment = result.manualPayment;
      if (result.manualPayment.status === 'succeeded' && result.order.payment.status === 'paid') {
        try {
          const billingAutomation = await runOrderBillingAutomation(result.order.orderId, { trigger: 'paid' });
          receiptEmailQueued = Boolean(billingAutomation?.actions.some((action) => action.type === 'receipt' && action.emailed));
        } catch (error) {
          console.error('[builder/billing-documents/manual-payments] order automation failed:', error);
        }
      }
    } else {
      const result = await recordBookingManualPayment(params.ownerId, {
        ...input,
        actor: 'admin',
      });
      if (!result.booking || !result.manualPayment) {
        return NextResponse.json(
          { ok: false, error: result.error ?? 'manual_payment_failed' },
          { status: errorStatus(result.error) },
        );
      }
      manualPayment = result.manualPayment;
      if (result.manualPayment.status === 'succeeded' && result.booking.paymentStatus === 'paid') {
        try {
          const billingAutomation = await runBookingBillingAutomation(result.booking.bookingId, { trigger: 'paid' });
          receiptEmailQueued = Boolean(billingAutomation?.actions.some((action) => action.type === 'receipt' && action.emailed));
        } catch (error) {
          console.error('[builder/billing-documents/manual-payments] booking automation failed:', error);
        }
      }
    }

    const document = await getBillingDocument(source, params.ownerId, params.documentId);
    if (!document) return NextResponse.json({ ok: false, error: 'document_not_found' }, { status: 404 });
    if (
      typeof manualPayment === 'object'
      && manualPayment
      && 'status' in manualPayment
      && manualPayment.status === 'succeeded'
      && 'paymentId' in manualPayment
      && typeof manualPayment.paymentId === 'string'
      && 'amountCents' in manualPayment
      && typeof manualPayment.amountCents === 'number'
    ) {
      await queueBillingPaymentReceivedNotification(document, {
        amount: manualPayment.amountCents,
        method: 'manual',
        paymentId: manualPayment.paymentId,
        provider: 'manual',
        reference: 'reference' in manualPayment && typeof manualPayment.reference === 'string' ? manualPayment.reference : undefined,
        receiptEmailQueued,
      }).catch((error) => console.error('[builder/billing-documents/manual-payments] payment notification failed:', error));
    }
    return NextResponse.json({ ok: true, document, manualPayment });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    console.error('[builder/billing-documents/manual-payments] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'manual_payment_failed' }, { status: 500 });
  }
}
