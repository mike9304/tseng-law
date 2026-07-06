import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getSubscriberByEmail,
  listSubscribers,
  makeSubscriberId,
  makeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import {
  adminSubscriberCreateSchema,
  type SubscriberStatus,
} from '@/lib/builder/marketing/subscriber-types';
import { buildMarketingConsentRecord } from '@/lib/builder/marketing/subscriber-consent';
import { linkSubscriberToCrmContact } from '@/lib/builder/marketing/subscriber-crm-link';
import {
  getBuilderMarketingApiErrorPayload,
  type BuilderMarketingApiErrorCode,
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

function errorResponse(
  locale: Locale,
  errorCode: BuilderMarketingApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderMarketingApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  const status = request.nextUrl.searchParams.get('status') as SubscriberStatus | null;
  const tag = request.nextUrl.searchParams.get('tag');
  const search = request.nextUrl.searchParams.get('q');
  try {
    const subscribers = await listSubscribers({
      status: status ?? undefined,
      tag: tag ?? undefined,
      search: search ?? undefined,
    });
    return NextResponse.json({ ok: true, subscribers, total: subscribers.length });
  } catch (error) {
    console.error('[builder/marketing/subscribers] list failed:', error);
    return errorResponse(locale, 'subscribers_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-subscribers' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = adminSubscriberCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_subscriber_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }

  try {
    const existing = await getSubscriberByEmail(parsed.data.email);
    const now = new Date().toISOString();
    const tags = Array.from(new Set([...(existing?.tags ?? []), ...parsed.data.tags]));
    const userAgent = request.headers.get('user-agent') ?? undefined;
    const marketingConsent = parsed.data.status === 'subscribed'
      ? buildMarketingConsentRecord({
        acceptedAt: now,
        source: parsed.data.source,
        preferredLocale: parsed.data.preferredLocale,
        ipAddress: clientIp(request),
        acceptedBy: auth.username,
        ...(userAgent ? { userAgent } : {}),
        ...(parsed.data.consentEvidence ? { text: parsed.data.consentEvidence } : {}),
      })
      : existing?.marketingConsent;
    const linked = await linkSubscriberToCrmContact({
      email: parsed.data.email,
      preferredLocale: parsed.data.preferredLocale,
      source: parsed.data.source,
      tags,
    });
    const subscriber = {
      subscriberId: existing?.subscriberId ?? makeSubscriberId(),
      email: parsed.data.email,
      contactId: parsed.data.contactId ?? linked.contactId,
      status: parsed.data.status,
      tags,
      preferredLocale: parsed.data.preferredLocale,
      unsubscribeToken: existing?.unsubscribeToken ?? makeToken(),
      source: parsed.data.source,
      ...(marketingConsent ? { marketingConsent } : {}),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await saveSubscriber(subscriber);
    return NextResponse.json({ ok: true, subscriber }, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error('[builder/marketing/subscribers] save failed:', error);
    return errorResponse(locale, 'subscriber_create_failed', 500);
  }
}
