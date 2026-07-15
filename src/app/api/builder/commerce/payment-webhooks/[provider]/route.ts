import { NextRequest, NextResponse } from 'next/server';
import { isCommercePaymentProvider } from '@/lib/builder/commerce/payment-providers';
import { normalizeCommercePaymentWebhookPayload } from '@/lib/builder/commerce/payment-webhooks-shared';
import { receivePaymentWebhookEvent } from '@/lib/builder/commerce/payment-webhooks-engine';
import {
  getCommercePaymentWebhooksApiErrorPayload,
  type CommercePaymentWebhooksApiErrorCode,
} from '@/lib/builder/commerce/payment-webhooks-copy';
import { verifyWebhookSignature } from '@/lib/builder/webhooks/signature';
import { normalizeLocale, type Locale } from '@/lib/locales';

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

function errorResponse(
  locale: Locale,
  errorCode: CommercePaymentWebhooksApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommercePaymentWebhooksApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function POST(request: NextRequest, { params }: { params: { provider: string } }) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  // builder-route-guard: allow-public — intentional public visitor endpoint
  if (!isCommercePaymentProvider(params.provider)) {
    return errorResponse(errorLocale, 'payment_provider_not_found', 404);
  }
  if (process.env.NODE_ENV === 'production' && params.provider === 'sandbox-card') {
    return errorResponse(errorLocale, 'payment_webhook_not_configured', 503);
  }

  const secret = providerSecret(params.provider);
  if (!secret) {
    return errorResponse(errorLocale, 'payment_webhook_not_configured', 503);
  }

  const rawBody = await request.text();
  const signature = request.headers.get('commerce-signature') ?? request.headers.get('stripe-signature') ?? '';
  if (!verifyWebhookSignature(secret, rawBody, signature, 300)) {
    return errorResponse(errorLocale, 'invalid_signature', 400);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return errorResponse(errorLocale, 'invalid_json', 400);
  }

  const normalized = normalizeCommercePaymentWebhookPayload(params.provider, payload);
  if (!normalized) {
    return errorResponse(errorLocale, 'unsupported_payment_event', 400);
  }

  try {
    const result = await receivePaymentWebhookEvent({
      ...normalized,
      signatureVerified: true,
    });
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
    return errorResponse(errorLocale, 'payment_webhook_failed', 500);
  }
}
