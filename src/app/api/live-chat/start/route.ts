import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  appendMessage,
  makeConversationId,
  makeMessageId,
  makeVisitorToken,
  saveConversation,
} from '@/lib/builder/live-chat/storage';
import { getLiveChatApiErrorPayload, type LiveChatApiErrorCode } from '@/lib/builder/live-chat/widget-copy';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  locale: z.string().trim().optional(),
  visitorName: z.string().trim().max(120).optional(),
  visitorEmail: z.string().trim().email().max(200).optional(),
  pagePath: z.string().trim().max(500).optional(),
  message: z.string().trim().min(1).max(2000),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function localeFromRequest(request: NextRequest, rawBody?: unknown): ReturnType<typeof normalizeLocale> {
  if (typeof rawBody === 'object' && rawBody !== null) {
    const locale = (rawBody as { locale?: unknown }).locale;
    if (typeof locale === 'string') return normalizeLocale(locale);
  }

  return normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
}

function errorResponse(
  request: NextRequest,
  errorCode: LiveChatApiErrorCode,
  status: number,
  rawBody?: unknown,
): NextResponse {
  return NextResponse.json(
    getLiveChatApiErrorPayload(localeFromRequest(request, rawBody), errorCode, 'start'),
    { status },
  );
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rate = await checkRateLimit(`livechat-start:${ip}`, 6, 60_000);
  if (!rate.allowed) return errorResponse(request, 'too_many_requests', 429);

  const rawBody = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(rawBody);
  if (!parsed.success) return errorResponse(request, 'invalid_payload', 400, rawBody);

  const now = new Date().toISOString();
  const conversationId = makeConversationId();
  const visitorToken = makeVisitorToken();
  await saveConversation({
    conversationId,
    visitorToken,
    visitorName: parsed.data.visitorName,
    visitorEmail: parsed.data.visitorEmail,
    pagePath: parsed.data.pagePath,
    status: 'open',
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now,
    unreadByAdmin: 1,
  });
  await appendMessage({
    messageId: makeMessageId(),
    conversationId,
    role: 'visitor',
    body: parsed.data.message.slice(0, 2000),
    at: now,
    authorLabel: parsed.data.visitorName,
  });
  void emitEvent('contact.created', { source: 'live-chat', conversationId, visitorEmail: parsed.data.visitorEmail });

  return NextResponse.json({ ok: true, conversationId, visitorToken });
}
