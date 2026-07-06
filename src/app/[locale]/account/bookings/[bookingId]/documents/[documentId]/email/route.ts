import { NextRequest, NextResponse } from 'next/server';
import { markBookingBillingDocumentEmailed } from '@/lib/builder/bookings/billing-documents';
import { sendBookingBillingDocument } from '@/lib/builder/bookings/notifications';
import { getService, getStaff, listBookings } from '@/lib/builder/bookings/storage';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, { params }: { params: { locale: string; bookingId: string; documentId: string } }) {
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

  const service = await getService(sourceBooking.serviceId);
  const staff = await getStaff(sourceBooking.staffId);
  await sendBookingBillingDocument(sourceBooking, document, { service, staff });
  const emailed = await markBookingBillingDocumentEmailed(sourceBooking.bookingId, document.documentId);

  return NextResponse.json({ ok: true, booking: emailed.booking, document: emailed.document });
}
