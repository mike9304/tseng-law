import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getRecipientByToken,
  saveRecipient,
} from '@/lib/builder/marketing/campaign-storage';
import { dispatchMarketingAnalyticsEvent } from '@/lib/builder/marketing/analytics-integrations';
import {
  getPublicMarketingApiErrorPayload,
  type PublicMarketingApiErrorCode,
} from '@/lib/builder/marketing/marketing-api-copy';
import {
  resolveMarketingTrackingSecret,
  verifyMarketingClickSignature,
} from '@/lib/builder/marketing/marketing-click-signature';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isSafeRedirect(target: string): boolean {
  try {
    const url = new URL(target);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function errorResponse(
  locale: Locale,
  errorCode: PublicMarketingApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getPublicMarketingApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const rate = await checkRateLimit(`marketing-track:${clientIp(request)}`, 60, 60_000);
  if (!rate.allowed) {
    return errorResponse(locale, 'too_many_requests', 429);
  }
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const target = request.nextUrl.searchParams.get('u') ?? '';
  const signature = request.nextUrl.searchParams.get('sig') ?? '';
  const secret = resolveMarketingTrackingSecret();
  if (
    !token
    || !target
    || !signature
    || !isSafeRedirect(target)
    || !secret
    || !verifyMarketingClickSignature(token, target, signature, secret)
  ) {
    return errorResponse(locale, 'invalid_redirect', 400);
  }
  const recipient = await getRecipientByToken(token);
  if (recipient && !recipient.clickedAt) {
    const clickedAt = new Date().toISOString();
    const nextRecipient = {
      ...recipient,
      clickedAt,
      status: 'clicked' as const,
    };
    await saveRecipient(nextRecipient);
    await dispatchMarketingAnalyticsEvent({
      kind: 'campaign-clicked',
      occurredAt: clickedAt,
      recipient: nextRecipient,
      payload: { targetUrl: target },
    });
  }
  return NextResponse.redirect(target, { status: 302 });
}
