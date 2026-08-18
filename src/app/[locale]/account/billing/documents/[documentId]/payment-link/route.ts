import { NextRequest, NextResponse } from 'next/server';
import {
  createBillingDocumentPaymentLink,
  listBillingDocuments,
} from '@/lib/builder/billing-documents';
import { listCustomerBillingDocuments } from '@/lib/builder/billing-customer-portal';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ locale: string; documentId: string }> }
) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  const params = await props.params;
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

  const rate = await checkRateLimit(`member-payment-link:${member.memberId}`, 6, 60_000);
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

  const canonicalRow = (await listBillingDocuments({ locale })).find((item) => (
    item.source === row.source
    && item.documentId === row.documentId
    && memberEmails.includes(item.recipientEmail.trim().toLowerCase())
  ));
  if (!canonicalRow) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const renewed = await createBillingDocumentPaymentLink(
    canonicalRow.source,
    canonicalRow.ownerId,
    canonicalRow.documentId,
    { renew: true },
  );
  if (!renewed) {
    return NextResponse.json({ error: 'payment_link_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, document: renewed });
}
