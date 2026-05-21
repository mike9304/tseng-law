import { NextRequest, NextResponse } from 'next/server';
import { isCommercePaymentProvider } from '@/lib/builder/commerce/payment-providers';
import { normalizeCommercePaymentWebhookPayload } from '@/lib/builder/commerce/payment-webhooks-shared';
import { receivePaymentWebhookEvent } from '@/lib/builder/commerce/payment-webhooks-engine';
import { verifyWebhookSignature } from '@/lib/builder/webhooks/signature';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEV_COMMERCE_WEBHOOK_SECRET = 'local-commerce-webhook-secret';

function providerSecret(provider: string): string | null {
  const providerKey = provider.replace(/[^a-z0-9]/gi, '_').toUpperCase();
  const configured = process.env[`COMMERCE_${providerKey}_WEBHOOK_SECRET`]
    ?? process.env.COMMERCE_PAYMENT_WEBHOOK_SECRET
    ?? '';
  if (configured.trim()) return configured.trim();
  return process.env.NODE_ENV === 'production' ? null : DEV_COMMERCE_WEBHOOK_SECRET;
}

export async function POST(request: NextRequest, { params }: { params: { provider: string } }) {
  if (!isCommercePaymentProvider(params.provider)) {
    return NextResponse.json({ ok: false, error: 'payment_provider_not_found' }, { status: 404 });
  }

  const secret = providerSecret(params.provider);
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'payment_webhook_not_configured' }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('commerce-signature') ?? request.headers.get('stripe-signature') ?? '';
  if (!verifyWebhookSignature(secret, rawBody, signature, 300)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const normalized = normalizeCommercePaymentWebhookPayload(params.provider, payload);
  if (!normalized) {
    return NextResponse.json({ ok: false, error: 'unsupported_payment_event' }, { status: 400 });
  }

  try {
    const result = await receivePaymentWebhookEvent(normalized);
    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      changed: result.changed,
      reason: result.reason,
      event: result.event,
      order: result.order,
    });
  } catch (error) {
    console.error('[builder/commerce/payment-webhooks/:provider] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'payment_webhook_failed' }, { status: 500 });
  }
}
