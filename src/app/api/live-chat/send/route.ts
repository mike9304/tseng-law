import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';
import {
  appendMessage,
  getConversation,
  makeMessageId,
  saveConversation,
} from '@/lib/builder/live-chat/storage';
import { getLiveChatApiErrorPayload, type LiveChatApiErrorCode } from '@/lib/builder/live-chat/widget-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  locale: z.string().trim().optional(),
  conversationId: z.string().trim().min(1).max(120),
  visitorToken: z.string().trim().min(1).max(80),
  body: z.string().trim().min(1).max(2000),
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
    getLiveChatApiErrorPayload(localeFromRequest(request, rawBody), errorCode, 'send'),
    { status },
  );
}

export async function POST(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  const ip = clientIp(request);
  const rate = await checkRateLimit(`livechat-send:${ip}`, 60, 60_000);
  if (!rate.allowed) return errorResponse(request, 'too_many_requests', 429);

  const rawBody = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(rawBody);
  if (!parsed.success) return errorResponse(request, 'invalid_payload', 400, rawBody);

  const conversation = await getConversation(parsed.data.conversationId);
  if (!conversation) return errorResponse(request, 'conversation_not_found', 404, rawBody);
  if (!safeEqualStrings(conversation.visitorToken, parsed.data.visitorToken)) {
    return errorResponse(request, 'unauthorized', 401, rawBody);
  }
  if (conversation.status === 'closed') {
    return errorResponse(request, 'conversation_closed', 409, rawBody);
  }

  const now = new Date().toISOString();
  await appendMessage({
    messageId: makeMessageId(),
    conversationId: conversation.conversationId,
    role: 'visitor',
    body: parsed.data.body,
    at: now,
    authorLabel: conversation.visitorName,
  });
  await saveConversation({
    ...conversation,
    lastMessageAt: now,
    unreadByAdmin: conversation.unreadByAdmin + 1,
  });
  return NextResponse.json({ ok: true, at: now });
}
