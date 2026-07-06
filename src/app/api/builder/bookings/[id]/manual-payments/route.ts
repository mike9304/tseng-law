import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { recordBookingManualPayment } from '@/lib/builder/bookings/payments';
import { runBookingBillingAutomation } from '@/lib/builder/billing-document-automation';
import { getCurrentBillingInvoice } from '@/lib/builder/billing-documents';
import { queueBillingPaymentReceivedNotification } from '@/lib/builder/commerce/notifications-engine';
import {
  getBookingManualPaymentApiErrorPayload,
  normalizeBookingManualPaymentApiErrorCode,
  type BookingManualPaymentApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
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

function validationError(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBookingManualPaymentApiErrorPayload(locale, 'validation_error'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

function errorStatus(errorCode: BookingManualPaymentApiErrorCode): number {
  switch (errorCode) {
    case 'booking_not_found':
      return 404;
    case 'manual_payment_amount_invalid':
    case 'manual_payment_exceeds_balance':
    case 'booking_cancelled':
    case 'booking_refund_locked':
    case 'booking_already_paid':
      return 400;
    default:
      return 500;
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const input = manualPaymentSchema.parse(await request.json());
    const result = await recordBookingManualPayment(params.id, {
      ...input,
      actor: 'admin',
    });
    if (!result.booking || !result.manualPayment) {
      const errorCode = normalizeBookingManualPaymentApiErrorCode(result.error);
      return NextResponse.json(
        { ok: false, ...getBookingManualPaymentApiErrorPayload(locale, errorCode) },
        { status: errorStatus(errorCode) },
      );
    }

    let booking = result.booking;
    let receiptEmailQueued = false;
    if (result.manualPayment.status === 'succeeded' && booking.paymentStatus === 'paid') {
      try {
        const billingAutomation = await runBookingBillingAutomation(booking.bookingId, { trigger: 'paid' });
        if (billingAutomation?.owner) booking = billingAutomation.owner;
        receiptEmailQueued = Boolean(billingAutomation?.actions.some((action) => action.type === 'receipt' && action.emailed));
      } catch (error) {
        console.error('[builder/bookings/:id/manual-payments] billing automation failed:', error);
      }
    }
    if (result.manualPayment.status === 'succeeded') {
      const invoice = await getCurrentBillingInvoice('booking', booking.bookingId);
      if (invoice) {
        await queueBillingPaymentReceivedNotification(invoice, {
          amount: result.manualPayment.amountCents,
          method: 'manual',
          paymentId: result.manualPayment.paymentId,
          provider: 'manual',
          reference: result.manualPayment.reference,
          receiptEmailQueued,
        }).catch((error) => console.error('[builder/bookings/:id/manual-payments] payment notification failed:', error));
      }
    }

    return NextResponse.json({ ok: true, booking, manualPayment: result.manualPayment });
  } catch (error) {
    if (error instanceof ZodError) return validationError(locale, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        ok: false,
        ...getBookingManualPaymentApiErrorPayload(locale, 'invalid_json'),
      }, { status: 400 });
    }
    console.error('[builder/bookings/:id/manual-payments] POST failed:', error);
    return NextResponse.json({
      ok: false,
      ...getBookingManualPaymentApiErrorPayload(locale, 'manual_payment_failed'),
    }, { status: 500 });
  }
}
