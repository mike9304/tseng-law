import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  billingDocumentPaymentTokenMatches,
  getBillingDocument,
  parseBillingDocumentSource,
  settleBillingDocumentPaymentLink,
  validateBillingDocumentPaymentToken,
  type BuilderBillingDocumentRow,
} from '@/lib/builder/billing-documents';
import {
  billingManualPaymentInstructionsForTarget,
  loadBillingDocumentAutomationSettings,
  runBookingBillingAutomation,
  runOrderBillingAutomation,
  type BillingManualPaymentInstructionEntry,
} from '@/lib/builder/billing-document-automation';
import {
  billingDocumentStripeCheckoutConfigured,
  createBillingDocumentStripeCheckoutSession,
} from '@/lib/builder/billing-document-hosted-payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function escapeHtml(value: string | number | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}

function htmlResponse(body: string, status = 200): NextResponse {
  return new NextResponse(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

function manualSettlementEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}

function escapeHtmlMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br />');
}

async function manualInstructionsForRow(row: BuilderBillingDocumentRow): Promise<BillingManualPaymentInstructionEntry[]> {
  const settings = await loadBillingDocumentAutomationSettings();
  return billingManualPaymentInstructionsForTarget(settings, row.source === 'order' ? 'orders' : 'bookings');
}

function paymentPage(
  row: BuilderBillingDocumentRow,
  options: { error?: string; notice?: string; paid?: boolean; manualInstructions?: BillingManualPaymentInstructionEntry[] } = {},
): string {
  const isPaid = options.paid
    || row.paymentStatus === 'paid'
    || row.paymentStatus === 'partially_refunded'
    || row.paymentStatus === 'partial-refund'
    || row.paymentStatus === 'refunded';
  const title = isPaid ? 'Invoice paid' : 'Pay invoice';
  const action = row.paymentLinkPath;
  const showHostedPayment = !options.error && !isPaid && billingDocumentStripeCheckoutConfigured();
  const canMarkPaid = manualSettlementEnabled();
  const showManualSettlement = !options.error && !isPaid && !showHostedPayment && canMarkPaid;
  const showSettlementNotice = !options.error && !isPaid && !showHostedPayment && !canMarkPaid;
  const manualInstructions = !options.error && !isPaid ? options.manualInstructions ?? [] : [];
  return `<!doctype html>
<html lang="${escapeHtml(row.locale)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} ${escapeHtml(row.number)}</title>
  <style>
    :root { color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f8fafc; }
    main { max-width: 680px; margin: 0 auto; padding: 34px 18px; }
    section { border: 1px solid #dbe4ee; border-radius: 12px; background: #fff; padding: 26px; box-shadow: 0 18px 48px rgba(15,23,42,.07); }
    h1 { margin: 0 0 8px; font-size: 28px; overflow-wrap: anywhere; }
    p { margin: 6px 0; color: #475569; line-height: 1.5; overflow-wrap: anywhere; }
    dl { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 8px 12px; margin: 20px 0; }
    dt { color: #64748b; font-weight: 800; }
    dd { margin: 0; overflow-wrap: anywhere; }
    button, a.button { display: inline-flex; align-items: center; justify-content: center; min-height: 42px; border: 0; border-radius: 8px; background: #1d4ed8; color: #fff; padding: 0 18px; cursor: pointer; font: inherit; font-weight: 900; text-decoration: none; }
    .paid { color: #047857; font-weight: 900; }
    .error { color: #b91c1c; font-weight: 800; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
    .notice { border: 1px solid #bfdbfe; border-radius: 10px; background: #eff6ff; padding: 12px 14px; color: #1e3a8a; }
    .manual { display: grid; gap: 10px; margin: 18px 0; border: 1px solid #dbeafe; border-radius: 12px; background: #f8fbff; padding: 14px; }
    .manual h2 { margin: 0; font-size: 16px; }
    .manual article { border-top: 1px solid #dbeafe; padding-top: 10px; }
    .manual article:first-of-type { border-top: 0; padding-top: 0; }
    .manual strong { display: block; margin-bottom: 4px; }
    .manual p { margin: 0; }
    @media (max-width: 520px) { main { padding: 18px 10px; } section { padding: 20px 14px; } dl { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <section data-public-billing-payment-summary>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(row.typeLabel)} ${escapeHtml(row.number)}</p>
      <dl>
        <dt>Customer</dt><dd>${escapeHtml(row.customerLabel)}</dd>
        <dt>Email</dt><dd>${escapeHtml(row.recipientEmail)}</dd>
        <dt>Total</dt><dd>${escapeHtml(row.totalLabel)}</dd>
        <dt>Balance due</dt><dd>${escapeHtml(row.balanceDueLabel)}</dd>
        <dt>Currency</dt><dd data-public-billing-document-currency>${escapeHtml(row.currency)}</dd>
        <dt>Status</dt><dd data-public-billing-payment-status>${escapeHtml(row.paymentStatusLabel)}</dd>
        <dt>Pay link</dt><dd data-public-billing-payment-link-status>${escapeHtml(row.paymentLinkStatusLabel)}</dd>
      </dl>
      <p class="notice" data-public-billing-currency-policy>No currency conversion is applied. This invoice is settled in ${escapeHtml(row.currency)}.</p>
      ${options.error ? `<p class="error">${escapeHtml(options.error)}</p>` : ''}
      ${options.notice ? `<p class="notice">${escapeHtml(options.notice)}</p>` : ''}
      ${manualInstructions.length > 0
        ? `<div class="manual" data-public-billing-manual-instructions><h2>Manual payment instructions</h2>${manualInstructions.map((entry) => `<article data-public-billing-manual-method="${escapeHtml(entry.method)}"><strong>${escapeHtml(entry.title)}</strong><p>${escapeHtmlMultiline(entry.instructions)}</p></article>`).join('')}</div>`
        : ''}
      ${isPaid
        ? '<p class="paid">Payment is recorded for this invoice.</p>'
        : showHostedPayment
          ? `<div class="actions"><form method="post" action="${escapeHtml(action)}"><button type="submit" data-public-billing-hosted-pay-button>Continue to secure payment</button></form><p>Card payment is processed by Stripe Checkout and supports SCA when required.</p></div>`
          : showManualSettlement
          ? `<form method="post" action="${escapeHtml(action)}"><button type="submit" data-public-billing-pay-button>Mark invoice paid</button></form>`
          : showSettlementNotice
            ? '<p class="notice">Online settlement is not enabled for this invoice link. Use the billing instructions from the invoice or contact the office to complete payment.</p>'
            : ''}
    </section>
  </main>
</body>
</html>`;
}

function unavailablePaymentPage(status: 'expired' | 'revoked' | 'invalid' | 'not_found' | 'rate_limited'): string {
  const copy = {
    expired: 'This payment link has expired. Ask the office for a new payment link.',
    revoked: 'This payment link was disabled by the office. Ask for a new link.',
    invalid: 'This payment link is no longer valid.',
    not_found: 'Invoice payment link not found.',
    rate_limited: 'Too many payment attempts. Try again shortly.',
  }[status];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Payment link unavailable</title>
  <style>
    :root { color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f8fafc; }
    main { max-width: 560px; margin: 0 auto; padding: 34px 18px; }
    section { border: 1px solid #dbe4ee; border-radius: 12px; background: #fff; padding: 26px; box-shadow: 0 18px 48px rgba(15,23,42,.07); }
    h1 { margin: 0 0 8px; font-size: 28px; overflow-wrap: anywhere; }
    p { margin: 6px 0; color: #475569; line-height: 1.5; overflow-wrap: anywhere; }
    .error { color: #b91c1c; font-weight: 800; }
  </style>
</head>
<body>
  <main>
    <section data-public-billing-payment-unavailable data-public-billing-payment-unavailable-status="${escapeHtml(status)}">
      <h1>Payment link unavailable</h1>
      <p class="error">${escapeHtml(copy)}</p>
    </section>
  </main>
</body>
</html>`;
}

async function loadValidRow(params: { source: string; ownerId: string; documentId: string }, token: string | null) {
  const source = parseBillingDocumentSource(params.source);
  if (!source) return { row: null, source: null, error: 'invalid_source' as const };
  const row = await getBillingDocument(source, params.ownerId, params.documentId);
  if (!row) return { row: null, source, error: 'document_not_found' as const };
  if (!billingDocumentPaymentTokenMatches(row, token)) {
    if (row.paymentLinkStatus === 'expired') return { row: null, source, error: 'payment_link_expired' as const };
    if (row.paymentLinkStatus === 'revoked') return { row: null, source, error: 'payment_link_revoked' as const };
    return { row: null, source, error: 'payment_link_invalid' as const };
  }
  if (row.paymentLinkStatus === 'expired') return { row: null, source, error: 'payment_link_expired' as const };
  if (row.paymentLinkStatus === 'revoked') return { row: null, source, error: 'payment_link_revoked' as const };
  if (row.paymentLinkStatus !== 'active') return { row: null, source, error: 'payment_link_invalid' as const };
  if (!validateBillingDocumentPaymentToken(row, token)) {
    return { row: null, source, error: 'payment_link_invalid' as const };
  }
  return { row, source, error: null };
}

function unavailableStatusForError(error: Awaited<ReturnType<typeof loadValidRow>>['error']): {
  page: 'expired' | 'revoked' | 'invalid' | 'not_found';
  status: number;
} {
  if (error === 'payment_link_expired') return { page: 'expired', status: 410 };
  if (error === 'payment_link_revoked') return { page: 'revoked', status: 410 };
  if (error === 'document_not_found' || error === 'invalid_source') return { page: 'not_found', status: 404 };
  return { page: 'invalid', status: 403 };
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ source: string; ownerId: string; documentId: string }> }
) {
  const params = await props.params;
  const token = request.nextUrl.searchParams.get('token');
  const paymentReturn = request.nextUrl.searchParams.get('payment');
  const loaded = await loadValidRow(params, token);
  if (!loaded.row || loaded.error) {
    const unavailable = unavailableStatusForError(loaded.error);
    return htmlResponse(unavailablePaymentPage(unavailable.page), unavailable.status);
  }
  const manualInstructions = await manualInstructionsForRow(loaded.row);
  const notice = paymentReturn === 'return'
    ? 'Payment is processing. This invoice will update after the provider confirms the transaction.'
    : paymentReturn === 'cancel'
      ? 'Payment was canceled. You can try again from this page.'
      : undefined;
  return htmlResponse(paymentPage(loaded.row, { notice, manualInstructions }));
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ source: string; ownerId: string; documentId: string }> }
) {
  const params = await props.params;
  const rate = await checkRateLimit(`billing-document-pay:${clientIp(request)}`, 12, 60_000);
  if (!rate.allowed) return htmlResponse(unavailablePaymentPage('rate_limited'), 429);

  const token = request.nextUrl.searchParams.get('token');
  const loaded = await loadValidRow(params, token);
  if (!loaded.row || loaded.error) {
    const unavailable = unavailableStatusForError(loaded.error);
    return htmlResponse(unavailablePaymentPage(unavailable.page), unavailable.status);
  }
  const manualInstructions = await manualInstructionsForRow(loaded.row);

  if (billingDocumentStripeCheckoutConfigured()) {
    const checkout = await createBillingDocumentStripeCheckoutSession(loaded.row, {
      origin: request.nextUrl.origin,
    });
    if (!checkout.ok) {
      return htmlResponse(paymentPage(loaded.row, { error: 'Secure payment could not be started. Contact the office or try again shortly.', manualInstructions }), checkout.status);
    }
    return NextResponse.redirect(checkout.url, 303);
  }

  if (!manualSettlementEnabled()) {
    return htmlResponse('<!doctype html><p>Online invoice settlement is not configured.</p>', 503);
  }

  const source = parseBillingDocumentSource(params.source);
  if (!source) return htmlResponse('<!doctype html><p>Invoice payment link not found.</p>', 404);
  const settled = await settleBillingDocumentPaymentLink(source, params.ownerId, params.documentId, token);
  if (!settled.row) return htmlResponse('<!doctype html><p>Invoice payment link not found.</p>', 404);
  if (settled.error) return htmlResponse(paymentPage(settled.row, { error: 'Payment could not be recorded.' }), 400);

  if (settled.order?.payment.status === 'paid') {
    try {
      await runOrderBillingAutomation(settled.order.orderId, { trigger: 'paid' });
    } catch (error) {
      console.error('[billing-documents/pay] receipt automation failed:', error);
    }
  }
  if (settled.booking?.paymentStatus === 'paid') {
    try {
      await runBookingBillingAutomation(settled.booking.bookingId, { trigger: 'paid' });
    } catch (error) {
      console.error('[billing-documents/pay] booking receipt automation failed:', error);
    }
  }
  const row = await getBillingDocument(source, params.ownerId, params.documentId);
  return htmlResponse(paymentPage(row ?? settled.row, { paid: true, manualInstructions }));
}
