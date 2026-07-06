import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getConversation,
  listMessagesForConversation,
  saveConversation,
} from '@/lib/builder/live-chat/storage';
import { toSafeChatConversation } from '@/lib/builder/live-chat/types';
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
  const messages = await listMessagesForConversation(params.conversationId);

  if (conversation.unreadByAdmin > 0) {
    await saveConversation({ ...conversation, unreadByAdmin: 0 });
  }
  return NextResponse.json({ ok: true, conversation: toSafeChatConversation(conversation), messages });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;

  const rawPayload = await request.json().catch(() => ({}));
  const raw = rawPayload && typeof rawPayload === 'object' && !Array.isArray(rawPayload)
    ? rawPayload as { status?: 'open' | 'closed'; locale?: string }
    : {};
  const locale = normalizeLocale(raw.locale);
  const conversation = await getConversation(params.conversationId);
  if (!conversation) return errorResponse(locale, 'conversation_not_found', 404);

  const nextStatus = raw.status === 'open' || raw.status === 'closed' ? raw.status : conversation.status;
  await saveConversation({ ...conversation, status: nextStatus });
  return NextResponse.json({ ok: true });
}
