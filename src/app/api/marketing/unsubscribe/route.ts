import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getSubscriberByUnsubscribeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import { dispatchMarketingAnalyticsEvent } from '@/lib/builder/marketing/analytics-integrations';
import {
  getPublicMarketingApiErrorPayload,
  getPublicMarketingUnsubscribePageCopy,
  type PublicMarketingApiErrorCode,
} from '@/lib/builder/marketing/marketing-api-copy';
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatEmailCopy(template: string, email: string): string {
  return template.replace('{email}', email);
}

function textErrorResponse(
  locale: Locale,
  errorCode: PublicMarketingApiErrorCode,
  status: number,
): NextResponse {
  const payload = getPublicMarketingApiErrorPayload(locale, errorCode);
  return new NextResponse(payload.error, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Error-Code': payload.errorCode,
    },
  });
}

function jsonErrorResponse(
  locale: Locale,
  errorCode: PublicMarketingApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getPublicMarketingApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function confirmationPage(email: string, token: string, locale: Locale, alreadyDone: boolean): string {
  const copy = getPublicMarketingUnsubscribePageCopy(locale);
  const safeEmail = escapeHtml(email);
  const actionParams = new URLSearchParams({ token, locale });
  const safeAction = escapeHtml(`/api/marketing/unsubscribe?${actionParams.toString()}`);
  if (alreadyDone) {
    return `<!doctype html><meta charset="utf-8"><title>${escapeHtml(copy.alreadyDonePageTitle)}</title>
<body style="font-family:system-ui;max-width:480px;margin:80px auto;padding:24px;color:#0f172a">
<h1 style="font-size:20px">${escapeHtml(copy.alreadyDoneTitle)}</h1>
<p>${formatEmailCopy(copy.alreadyDoneBody, safeEmail)}</p>
</body>`;
  }
  return `<!doctype html><meta charset="utf-8"><title>${escapeHtml(copy.confirmationPageTitle)}</title>
<body style="font-family:system-ui;max-width:480px;margin:80px auto;padding:24px;color:#0f172a">
<h1 style="font-size:20px">${escapeHtml(copy.confirmationTitle)}</h1>
<p>${formatEmailCopy(copy.confirmationBody, safeEmail)}</p>
<form method="post" action="${safeAction}">
  <button type="submit" style="padding:10px 18px;background:#0f172a;color:#fff;border:0;border-radius:6px;font-weight:700;cursor:pointer">${escapeHtml(copy.confirmButton)}</button>
</form>
<p style="margin-top:32px;font-size:12px;color:#64748b">${escapeHtml(copy.accidentalHint)}</p>
</body>`;
}

/**
 * GET only renders an HTML confirmation page. This protects against email-
 * client link prefetching (Outlook Safe Links, Gmail image proxy) silently
 * unsubscribing legitimate recipients. POST is what actually mutates state.
 */
export async function GET(request: NextRequest) {
  const fallbackLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const rate = await checkRateLimit(`marketing-unsub-get:${clientIp(request)}`, 60, 60_000);
  if (!rate.allowed) {
    return textErrorResponse(fallbackLocale, 'too_many_requests', 429);
  }
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (!token) {
    return textErrorResponse(fallbackLocale, 'missing_token', 400);
  }
  const subscriber = await getSubscriberByUnsubscribeToken(token);
  if (!subscriber) {
    return textErrorResponse(fallbackLocale, 'invalid_token', 404);
  }
  return new NextResponse(
    confirmationPage(
      subscriber.email,
      token,
      subscriber.preferredLocale,
      subscriber.status === 'unsubscribed',
    ),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

export async function POST(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const rate = await checkRateLimit(`marketing-unsub:${clientIp(request)}`, 30, 60_000);
  if (!rate.allowed) {
    return jsonErrorResponse(locale, 'too_many_requests', 429);
  }
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (!token) {
    return jsonErrorResponse(locale, 'missing_token', 400);
  }
  const subscriber = await getSubscriberByUnsubscribeToken(token);
  if (!subscriber) {
    return jsonErrorResponse(locale, 'invalid_token', 404);
  }
  if (subscriber.status !== 'unsubscribed') {
    const unsubscribedAt = new Date().toISOString();
    const nextSubscriber = {
      ...subscriber,
      status: 'unsubscribed',
      unsubscribedAt,
    } as const;
    await saveSubscriber(nextSubscriber);
    await dispatchMarketingAnalyticsEvent({
      kind: 'subscriber-unsubscribed',
      occurredAt: unsubscribedAt,
      subscriber: nextSubscriber,
      payload: { source: 'unsubscribe-route' },
    });
  }
  return NextResponse.json({ ok: true, unsubscribed: true });
}
