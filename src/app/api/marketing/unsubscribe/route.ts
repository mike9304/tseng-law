import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getSubscriberByUnsubscribeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';

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

function confirmationPage(email: string, token: string, alreadyDone: boolean): string {
  const safeEmail = escapeHtml(email);
  const safeToken = escapeHtml(token);
  if (alreadyDone) {
    return `<!doctype html><meta charset="utf-8"><title>구독 해지 완료</title>
<body style="font-family:system-ui;max-width:480px;margin:80px auto;padding:24px;color:#0f172a">
<h1 style="font-size:20px">이미 구독이 해지된 상태입니다</h1>
<p>${safeEmail} 주소는 더 이상 메일을 받지 않습니다.</p>
</body>`;
  }
  return `<!doctype html><meta charset="utf-8"><title>구독 해지 확인</title>
<body style="font-family:system-ui;max-width:480px;margin:80px auto;padding:24px;color:#0f172a">
<h1 style="font-size:20px">구독 해지를 확인해주세요</h1>
<p>${safeEmail} 주소로 발송되는 마케팅 메일 수신을 중단합니다.</p>
<form method="post" action="/api/marketing/unsubscribe?token=${encodeURIComponent(safeToken)}">
  <button type="submit" style="padding:10px 18px;background:#0f172a;color:#fff;border:0;border-radius:6px;font-weight:700;cursor:pointer">구독 해지 확정</button>
</form>
<p style="margin-top:32px;font-size:12px;color:#64748b">실수로 클릭하신 경우 그냥 이 페이지를 닫으세요.</p>
</body>`;
}

/**
 * GET only renders an HTML confirmation page. This protects against email-
 * client link prefetching (Outlook Safe Links, Gmail image proxy) silently
 * unsubscribing legitimate recipients. POST is what actually mutates state.
 */
export async function GET(request: NextRequest) {
  const rate = await checkRateLimit(`marketing-unsub-get:${clientIp(request)}`, 60, 60_000);
  if (!rate.allowed) {
    return new NextResponse('Too many requests', { status: 429 });
  }
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (!token) {
    return new NextResponse('Missing token', { status: 400 });
  }
  const subscriber = await getSubscriberByUnsubscribeToken(token);
  if (!subscriber) {
    return new NextResponse('Invalid token', { status: 404 });
  }
  return new NextResponse(
    confirmationPage(subscriber.email, token, subscriber.status === 'unsubscribed'),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

export async function POST(request: NextRequest) {
  const rate = await checkRateLimit(`marketing-unsub:${clientIp(request)}`, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }
  const subscriber = await getSubscriberByUnsubscribeToken(token);
  if (!subscriber) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  }
  if (subscriber.status !== 'unsubscribed') {
    await saveSubscriber({
      ...subscriber,
      status: 'unsubscribed',
      unsubscribedAt: new Date().toISOString(),
    });
  }
  return NextResponse.json({ ok: true, unsubscribed: true });
}
