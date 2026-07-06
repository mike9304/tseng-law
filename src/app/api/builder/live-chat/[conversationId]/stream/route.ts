import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getConversation } from '@/lib/builder/live-chat/storage';
import { buildChatStream } from '@/lib/builder/live-chat/sse';
import { getLiveChatAdminApiErrorPayload, type LiveChatAdminApiErrorCode } from '@/lib/builder/live-chat/admin-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: LiveChatAdminApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    getLiveChatAdminApiErrorPayload(locale, errorCode),
    { status },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
  const conversation = await getConversation(params.conversationId);
  if (!conversation) return errorResponse(locale, 'conversation_not_found', 404);

  const stream = buildChatStream({
    conversationId: params.conversationId,
    observerRole: 'admin',
    locale,
    pollMs: 1500,
    maxDurationMs: 120_000,
  });
  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
