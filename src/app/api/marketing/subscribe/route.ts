import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getSubscriberByEmail,
  makeSubscriberId,
  makeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import { subscribeRequestSchema } from '@/lib/builder/marketing/subscriber-types';
import { sendTestEmail } from '@/lib/builder/marketing/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const publicPayloadSchema = subscribeRequestSchema.extend({
  company: z.string().max(120).optional(), // honeypot
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rate = await checkRateLimit(`marketing-subscribe:${ip}`, 6, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const raw = await request.json().catch(() => null);
  const parsed = publicPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid subscribe payload' }, { status: 400 });
  }
  if (parsed.data.company) {
    return NextResponse.json({ ok: true }); // silent honeypot success
  }

  const existing = await getSubscriberByEmail(parsed.data.email);
  if (existing && existing.status === 'subscribed') {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  const now = new Date().toISOString();
  const doubleOptInToken = makeToken();
  const subscriber = {
    subscriberId: existing?.subscriberId ?? makeSubscriberId(),
    email: parsed.data.email,
    contactId: parsed.data.contactId ?? existing?.contactId,
    status: 'pending' as const,
    tags: Array.from(new Set([...(existing?.tags ?? []), ...parsed.data.tags])),
    preferredLocale: parsed.data.preferredLocale,
    doubleOptInToken,
    unsubscribeToken: existing?.unsubscribeToken ?? makeToken(),
    source: parsed.data.source,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await saveSubscriber(subscriber);

  // Best-effort double opt-in email — never block the response.
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  const verifyUrl = `${baseUrl}/api/marketing/verify?token=${encodeURIComponent(doubleOptInToken)}`;
  void sendTestEmail({
    campaign: {
      campaignId: 'system-opt-in',
      name: 'Double opt-in',
      subject: { ko: '구독 확인 메일', 'zh-hant': '訂閱確認', en: 'Please confirm your subscription' },
      bodyHtml: {
        ko: `<p>호정국제 뉴스레터 구독을 확인하시려면 아래 링크를 클릭해주세요.</p><p><a href="${verifyUrl}">구독 확인하기</a></p>`,
        'zh-hant': `<p>請點擊以下連結確認訂閱：</p><p><a href="${verifyUrl}">確認訂閱</a></p>`,
        en: `<p>Please confirm your subscription by clicking the link below.</p><p><a href="${verifyUrl}">Confirm subscription</a></p>`,
      },
      bodyText: {
        ko: `구독 확인: ${verifyUrl}`,
        'zh-hant': `確認訂閱: ${verifyUrl}`,
        en: `Confirm subscription: ${verifyUrl}`,
      },
      segmentTags: [],
      fromName: '호정국제',
      fromAddress: 'bookings@hoveringlaw.com.tw',
      status: 'draft',
      stats: { recipients: 0, opens: 0, clicks: 0, unsubscribes: 0, bounces: 0 },
      createdAt: now,
      updatedAt: now,
    },
    testEmail: parsed.data.email,
    subscriber,
  });

  return NextResponse.json({ ok: true, requiresVerification: true });
}
