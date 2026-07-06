import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  listPaymentWebhookEvents,
  summarizePaymentWebhookEvents,
} from '@/lib/builder/commerce/payment-webhooks-engine';
import {
  getCommercePaymentWebhooksApiErrorPayload,
  type CommercePaymentWebhooksApiErrorCode,
} from '@/lib/builder/commerce/payment-webhooks-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  q: z.string().trim().max(200).optional(),
  provider: z.enum(['all', 'manual-invoice', 'sandbox-card']).default('all'),
  status: z.enum(['all', 'processed', 'unmatched', 'failed', 'ignored']).default('all'),
});

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

function validationError(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getCommercePaymentWebhooksApiErrorPayload(locale, 'invalid_payment_webhook_filters'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const sp = request.nextUrl.searchParams;
    const input = querySchema.parse({
      q: sp.get('q') ?? undefined,
      provider: sp.get('provider') ?? 'all',
      status: sp.get('status') ?? 'all',
    });
    const events = await listPaymentWebhookEvents(input);
    return NextResponse.json({
      ok: true,
      events,
      kpis: summarizePaymentWebhookEvents(events),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/commerce/payment-webhooks] GET failed:', error);
    return errorResponse(errorLocale, 'payment_webhooks_failed', 500);
  }
}
