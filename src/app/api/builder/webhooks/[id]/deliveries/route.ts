import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { getSubscription, listDeliveriesForWebhook } from '@/lib/builder/webhooks/storage';
import {
  getBuilderWebhooksApiErrorPayload,
  type BuilderWebhooksApiErrorCode,
} from '@/lib/builder/webhooks/webhooks-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function requestLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderWebhooksApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderWebhooksApiErrorPayload(locale, errorCode),
    },
    { status },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  const subscription = await getSubscription(params.id);
  if (!subscription) return errorResponse(locale, 'webhook_not_found', 404);

  try {
    const deliveries = await listDeliveriesForWebhook(params.id);
    return NextResponse.json({ ok: true, deliveries: deliveries.slice(0, 200), total: deliveries.length });
  } catch (error) {
    console.error('[builder/webhooks/:id/deliveries] GET failed:', error);
    return errorResponse(locale, 'webhook_deliveries_failed', 500);
  }
}
