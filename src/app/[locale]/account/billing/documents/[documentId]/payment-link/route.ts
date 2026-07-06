import { NextRequest, NextResponse } from 'next/server';
import { createBillingDocumentPaymentLink } from '@/lib/builder/billing-documents';
import { listCustomerBillingDocuments } from '@/lib/builder/billing-customer-portal';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, { params }: { params: { locale: string; documentId: string } }) {
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const memberEmails = getMemberPortalEmails(member);
  const row = (await listCustomerBillingDocuments(member.email, { locale }, memberEmails))
    .find((item) => item.documentId === params.documentId);
  if (!row) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }
  if (row.type !== 'invoice' || row.balanceDue <= 0) {
    return NextResponse.json({ error: 'renewal_not_applicable' }, { status: 409 });
  }
  if (!row.paymentLinkRenewalNeeded && row.paymentLinkPath) {
    return NextResponse.json({ error: 'payment_link_already_active' }, { status: 409 });
  }

  const renewed = await createBillingDocumentPaymentLink(row.source, row.ownerLabel, row.documentId, { renew: true });
  if (!renewed) {
    return NextResponse.json({ error: 'payment_link_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, document: renewed });
}
