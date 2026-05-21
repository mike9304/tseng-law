import { NextRequest, NextResponse } from 'next/server';
import { normalizeBillingDocumentStripeWebhookPayload } from '@/lib/builder/billing-document-hosted-payments';
import { receiveBillingDocumentWebhookEvent } from '@/lib/builder/billing-document-webhooks';
import { verifyWebhookSignature } from '@/lib/builder/webhooks/signature';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function webhookSecret(): string {
  return (
    process.env.BILLING_DOCUMENT_STRIPE_WEBHOOK_SECRET?.trim()
    || process.env.STRIPE_WEBHOOK_SECRET?.trim()
    || ''
  );
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const secret = webhookSecret();
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ ok: false, error: 'stripe_webhook_not_configured' }, { status: 503 });
    }
    console.warn('[billing-documents/stripe-webhook] webhook secret unset; accepting unsigned dev events');
  }

  if (secret && !verifyWebhookSignature(secret, rawBody, request.headers.get('stripe-signature') ?? '', 300)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const normalized = normalizeBillingDocumentStripeWebhookPayload(payload);
  if (!normalized) {
    return NextResponse.json({ ok: true, handled: false, reason: 'unsupported_event' });
  }

  try {
    const result = await receiveBillingDocumentWebhookEvent(normalized, {
      signatureVerified: Boolean(secret),
    });
    if (result.event.status === 'failed') {
      return NextResponse.json({
        ok: false,
        handled: true,
        changed: false,
        error: result.event.error,
        duplicate: result.duplicate,
        event: result.event,
      }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      handled: true,
      changed: result.changed,
      duplicate: result.duplicate,
      reason: result.reason,
      event: result.event,
      document: result.document,
      order: result.order,
      booking: result.booking,
    });
  } catch (error) {
    console.error('[billing-documents/stripe-webhook] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'stripe_webhook_failed' }, { status: 500 });
  }
}
