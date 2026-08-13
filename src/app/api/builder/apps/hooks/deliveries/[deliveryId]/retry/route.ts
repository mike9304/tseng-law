import { NextRequest, NextResponse } from 'next/server';
import { retryStoredAppHookDelivery } from '@/lib/builder/apps/hook-runtime';
import {
  getBuilderAppsApiErrorPayload,
  type BuilderAppsApiErrorCode,
} from '@/lib/builder/apps/apps-api-copy';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderAppsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderAppsApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function unreachableRetryResult(value: never): never {
  throw new Error(`Unsupported app hook retry result: ${String(value)}`);
}

export async function POST(request: NextRequest, props: { params: Promise<{ deliveryId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const deliveryId = params.deliveryId.trim();
  if (deliveryId.length === 0) return errorResponse(locale, 'invalid_request', 400);
  try {
    const result = await retryStoredAppHookDelivery(deliveryId);
    switch (result.status) {
      case 'not-found':
        return errorResponse(locale, 'hook_delivery_not_found', 404);
      case 'unavailable':
        return errorResponse(locale, 'hook_retry_unavailable', 409);
      case 'retried':
        return NextResponse.json({ ok: result.delivery.status === 'succeeded', delivery: result.delivery });
      default:
        return unreachableRetryResult(result);
    }
  } catch (error) {
    console.error('[builder/apps/hooks/deliveries/:deliveryId/retry] failed:', error);
    return errorResponse(locale, 'hook_retry_failed', 500);
  }
}
