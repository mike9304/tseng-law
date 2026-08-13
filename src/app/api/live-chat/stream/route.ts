import { NextRequest, NextResponse } from 'next/server';
import { getConversation } from '@/lib/builder/live-chat/storage';
import { buildChatStream } from '@/lib/builder/live-chat/sse';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';
import { getLiveChatApiErrorPayload, type LiveChatApiErrorCode } from '@/lib/builder/live-chat/widget-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: LiveChatApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    getLiveChatApiErrorPayload(locale, errorCode, 'send'),
    { status },
  );
}

export async function GET(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
  const conversationId = request.nextUrl.searchParams.get('conversationId') ?? '';
  const visitorToken = request.nextUrl.searchParams.get('visitorToken') ?? '';
  if (!conversationId || !visitorToken) {
    return errorResponse(locale, 'invalid_payload', 400);
  }
  const conversation = await getConversation(conversationId);
  if (!conversation) return errorResponse(locale, 'conversation_not_found', 404);
  if (!safeEqualStrings(conversation.visitorToken, visitorToken)) {
    return errorResponse(locale, 'unauthorized', 401);
  }
  const stream = buildChatStream({
    conversationId,
    observerRole: 'visitor',
    locale,
    pollMs: 1500,
    maxDurationMs: 120_000,
  });
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'private, no-store, no-transform',
      Connection: 'keep-alive',
    },
  });
}
