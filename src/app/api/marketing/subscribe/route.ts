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
import {
  buildMarketingConsentRecord,
  createDoubleOptInWindow,
} from '@/lib/builder/marketing/subscriber-consent';
import { sendTestEmail } from '@/lib/builder/marketing/dispatcher';
import { linkSubscriberToCrmContact } from '@/lib/builder/marketing/subscriber-crm-link';
import {
  getPublicMarketingApiErrorPayload,
  type PublicMarketingApiErrorCode,
} from '@/lib/builder/marketing/marketing-api-copy';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const publicPayloadSchema = subscribeRequestSchema
  .pick({
    email: true,
    preferredLocale: true,
    marketingConsent: true,
  })
  .extend({
    company: z.string().max(120).optional(), // honeypot
  });

const PUBLIC_SUBSCRIBER_SOURCE = 'public-form';
const PUBLIC_SUBSCRIBER_TAGS = ['newsletter'] as const;

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function localeFromRequest(request: NextRequest, body?: unknown): Locale {
  if (body && typeof body === 'object' && 'preferredLocale' in body) {
    return normalizeLocale(String((body as { preferredLocale?: unknown }).preferredLocale));
  }
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: PublicMarketingApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getPublicMarketingApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

export async function POST(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  const ip = clientIp(request);
  const rate = await checkRateLimit(`marketing-subscribe:${ip}`, 6, 60_000);
  if (!rate.allowed) {
    return errorResponse(localeFromRequest(request), 'too_many_requests', 429);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(localeFromRequest(request), 'invalid_json', 400);
  }
  const locale = localeFromRequest(request, raw);
  const parsed = publicPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_subscribe_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }
  if (parsed.data.company) {
    return NextResponse.json({ ok: true }); // silent honeypot success
  }

  const nowDate = new Date();
  const now = nowDate.toISOString();
  const userAgent = request.headers.get('user-agent') ?? undefined;
  const marketingConsent = buildMarketingConsentRecord({
    acceptedAt: now,
    source: PUBLIC_SUBSCRIBER_SOURCE,
    preferredLocale: parsed.data.preferredLocale,
    ipAddress: ip,
    ...(userAgent ? { userAgent } : {}),
  });
  const existing = await getSubscriberByEmail(parsed.data.email);
  if (existing && existing.status === 'subscribed') {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  const doubleOptInToken = makeToken();
  const doubleOptInWindow = createDoubleOptInWindow(nowDate);
  const tags = existing?.tags ?? [...PUBLIC_SUBSCRIBER_TAGS];
  const source = existing?.source ?? PUBLIC_SUBSCRIBER_SOURCE;
  const preferredLocale = existing?.preferredLocale ?? parsed.data.preferredLocale;
  const contactId = existing?.contactId ?? (
    await linkSubscriberToCrmContact({
      email: parsed.data.email,
      preferredLocale,
      source,
      tags,
    })
  ).contactId;
  const subscriber = {
    subscriberId: existing?.subscriberId ?? makeSubscriberId(),
    email: parsed.data.email,
    contactId,
    status: 'pending' as const,
    tags,
    preferredLocale,
    marketingConsent: existing?.marketingConsent ?? marketingConsent,
    doubleOptInToken,
    doubleOptInTokenCreatedAt: doubleOptInWindow.createdAt,
    doubleOptInTokenExpiresAt: doubleOptInWindow.expiresAt,
    unsubscribeToken: existing?.unsubscribeToken ?? makeToken(),
    source,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await saveSubscriber(subscriber);

  // Best-effort double opt-in email — never block the response.
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  const verifyParams = new URLSearchParams({
    token: doubleOptInToken,
    locale: preferredLocale,
  });
  const verifyUrl = `${baseUrl}/api/marketing/verify?${verifyParams.toString()}`;
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
