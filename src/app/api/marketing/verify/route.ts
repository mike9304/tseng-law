import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getSubscriberByDoubleOptInToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import {
  getPublicMarketingApiErrorPayload,
  type PublicMarketingApiErrorCode,
} from '@/lib/builder/marketing/marketing-api-copy';
import { isDoubleOptInExpired } from '@/lib/builder/marketing/subscriber-consent';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  const rate = await checkRateLimit(`marketing-verify:${clientIp(request)}`, 20, 60_000);
  if (!rate.allowed) {
    return errorResponse(locale, 'too_many_requests', 429);
  }
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (!token) {
    return errorResponse(locale, 'missing_token', 400);
  }
  const subscriber = await getSubscriberByDoubleOptInToken(token);
  if (!subscriber) {
    return errorResponse(locale, 'invalid_token', 404);
  }
  if (subscriber.status === 'subscribed') {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }
  if (isDoubleOptInExpired(subscriber)) {
    return errorResponse(locale, 'expired_token', 410);
  }
  await saveSubscriber({
    ...subscriber,
    status: 'subscribed',
    doubleOptInVerifiedAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, verified: true });
}
