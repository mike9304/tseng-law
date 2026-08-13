import { NextRequest, NextResponse } from 'next/server';
import { markBookingBillingDocumentEmailed } from '@/lib/builder/bookings/billing-documents';
import { sendBookingBillingDocument } from '@/lib/builder/bookings/notifications';
import { getService, getStaff, listBookings } from '@/lib/builder/bookings/storage';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ locale: string; bookingId: string; documentId: string }> }
) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  const params = await props.params;
  const member = await getCurrentSiteMember();
  if (!member) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const memberEmails = getMemberPortalEmails(member);
  const sourceBooking = (await listBookings({ includeCancelled: true }))
    .find((item) => item.bookingId === params.bookingId && memberEmails.includes(item.customer.email.trim().toLowerCase()));
  if (!sourceBooking) {
    return NextResponse.json({ error: 'booking_not_found' }, { status: 404 });
  }

  const document = (sourceBooking.billingDocuments ?? []).find((entry) => entry.documentId === params.documentId);
  if (!document) {
    return NextResponse.json({ error: 'document_not_found' }, { status: 404 });
  }
  if (document.status !== 'issued' && document.status !== 'emailed_stub') {
    return NextResponse.json({ error: 'document_not_current' }, { status: 409 });
  }

  const rate = await checkRateLimit(`member-booking-document-email:${member.memberId}`, 6, 60_000);
  if (!rate.allowed) {
    if (rate.reason === 'backend_unavailable') {
      return NextResponse.json({ error: 'rate_limit_unavailable' }, { status: 503 });
    }
    return NextResponse.json(
      { error: 'too_many_requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.max(1, Math.ceil(rate.retryAfterMs / 1000))) },
      },
    );
  }

  const service = await getService(sourceBooking.serviceId);
  const staff = await getStaff(sourceBooking.staffId);
  const delivery = await sendBookingBillingDocument(sourceBooking, document, { service, staff });
  if (!delivery.ok) {
    const error = delivery.reason === 'unconfigured' ? 'email_unconfigured' : 'email_provider_error';
    return NextResponse.json(
      { ok: false, error, booking: sourceBooking, document },
      { status: delivery.reason === 'unconfigured' ? 503 : 502 },
    );
  }
  let emailed;
  try {
    emailed = await markBookingBillingDocumentEmailed(sourceBooking.bookingId, document.documentId);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'marker_persist_failed_after_delivery', booking: sourceBooking, document },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, booking: emailed.booking, document: emailed.document });
}
