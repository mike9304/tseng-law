import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { replayPaymentWebhookEvent } from '@/lib/builder/commerce/payment-webhooks-engine';
import {
  getCommercePaymentWebhooksApiErrorPayload,
  type CommercePaymentWebhooksApiErrorCode,
} from '@/lib/builder/commerce/payment-webhooks-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function POST(request: NextRequest, props: { params: Promise<{ eventId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const result = await replayPaymentWebhookEvent(params.eventId);
    if (!result.event) return errorResponse(errorLocale, 'payment_webhook_event_not_found', 404);
    return NextResponse.json({
      ok: true,
      event: result.event,
      order: result.order,
      changed: result.changed,
      reason: result.reason,
    });
  } catch (error) {
    console.error('[builder/commerce/payment-webhooks/replay] POST failed:', error);
    return errorResponse(errorLocale, 'payment_webhook_replay_failed', 500);
  }
}
