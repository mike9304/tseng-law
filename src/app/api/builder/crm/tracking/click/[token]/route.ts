/**
 * Tracking click endpoint. PUBLIC — the HMAC token is the only auth and
 * the redirect URL is part of the signed payload (no open-redirect oracle).
 *
 * On invalid token: 404. On valid token but unsafe URL: 400.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  isSafeRedirectUrl,
  logClickEvent,
  resolveTrackingSecret,
  verifyTrackingToken,
} from '@/lib/builder/crm/tracking-model';
import {
  getBuilderCrmApiErrorPayload,
  type BuilderCrmApiErrorCode,
} from '@/lib/builder/crm/crm-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderCrmApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderCrmApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const secret = resolveTrackingSecret();
  if (!secret) {
    return errorResponse(locale, 'tracking_not_configured', 503);
  }
  const payload = verifyTrackingToken(params.token, secret, {
    expectedKind: 'click',
  });
  if (!payload || !isSafeRedirectUrl(payload.url)) {
    return errorResponse(locale, 'tracking_invalid_token', 404);
  }

  try {
    await logClickEvent({
      contactId: payload.contactId,
      campaignId: payload.campaignId,
      url: payload.url,
      userAgent: request.headers.get('user-agent') ?? undefined,
      ip:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        undefined,
    });
  } catch (err) {
    console.error('[crm/tracking/click] failed to log:', err);
  }

  return NextResponse.redirect(payload.url, { status: 302 });
}
