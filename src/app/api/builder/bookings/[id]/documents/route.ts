import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  BookingBillingDocumentError,
  issueBookingBillingDocument,
  markBookingBillingDocumentEmailed,
} from '@/lib/builder/bookings/billing-documents';
import { sendBookingBillingDocument } from '@/lib/builder/bookings/notifications';
import { getStaff } from '@/lib/builder/bookings/storage';
import {
  getBookingDocumentApiErrorPayload,
  normalizeBookingDocumentApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const documentRequestSchema = z.object({
  type: z.enum(['invoice', 'receipt']),
  email: z.coerce.boolean().default(false),
  notes: z.string().trim().max(500).optional(),
});

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  const parsed = documentRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({
      ...getBookingDocumentApiErrorPayload(locale, 'invalid_document_payload'),
      details: parsed.error.issues.slice(0, 3),
    }, { status: 400 });
  }

  try {
    const issued = await issueBookingBillingDocument(params.id, {
      type: parsed.data.type,
      notes: parsed.data.notes,
    });
    let booking = issued.booking;
    let document = issued.document;
    if (parsed.data.email) {
      const staff = await getStaff(booking.staffId);
      const delivery = await sendBookingBillingDocument(booking, document, { service: issued.service, staff });
      if (!delivery.ok) {
        const error = delivery.reason === 'unconfigured' ? 'email_unconfigured' : 'email_provider_error';
        return NextResponse.json(
          { ok: false, error, booking, document, reused: issued.reused },
          { status: delivery.reason === 'unconfigured' ? 503 : 502 },
        );
      }
      let emailed;
      try {
        emailed = await markBookingBillingDocumentEmailed(booking.bookingId, document.documentId);
      } catch {
        return NextResponse.json(
          { ok: false, error: 'marker_persist_failed_after_delivery', booking, document },
          { status: 500 },
        );
      }
      booking = emailed.booking;
      document = emailed.document;
    }
    return NextResponse.json({ booking, document, reused: issued.reused });
  } catch (error) {
    if (error instanceof BookingBillingDocumentError) {
      return NextResponse.json(
        getBookingDocumentApiErrorPayload(locale, normalizeBookingDocumentApiErrorCode(error.code)),
        { status: error.status },
      );
    }
    throw error;
  }
}
