import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { getDelivery, getSubscription } from '@/lib/builder/webhooks/storage';
import { retryDelivery } from '@/lib/builder/webhooks/dispatcher';
import {
  getBuilderWebhooksApiErrorPayload,
  type BuilderWebhooksApiErrorCode,
} from '@/lib/builder/webhooks/webhooks-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({ deliveryId: z.string().trim().min(1).max(120) });

function requestLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderWebhooksApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderWebhooksApiErrorPayload(locale, errorCode),
      ...(extra ?? {}),
    },
    { status },
  );
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  const subscription = await getSubscription(params.id);
  if (!subscription) return errorResponse(locale, 'webhook_not_found', 404);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    console.error('[builder/webhooks/:id/retry] POST JSON parse failed:', error);
    return errorResponse(locale, 'invalid_json', 400);
  }

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'validation_error', 400, { details: parsed.error.issues.slice(0, 3) });
  }

  const prior = await getDelivery(parsed.data.deliveryId);
  if (!prior || prior.webhookId !== params.id) {
    return errorResponse(locale, 'delivery_not_found', 404);
  }

  try {
    const result = await retryDelivery(subscription, prior);
    return NextResponse.json({ ok: result.status === 'success', delivery: result });
  } catch (error) {
    console.error('[builder/webhooks/:id/retry] POST failed:', error);
    return errorResponse(locale, 'webhook_retry_failed', 500);
  }
}
