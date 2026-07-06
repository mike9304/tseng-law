import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  appendMessage,
  getConversation,
  makeMessageId,
  saveConversation,
} from '@/lib/builder/live-chat/storage';
import {
  getLiveChatAdminApiErrorPayload,
  getLiveChatAuthorCopy,
  type LiveChatAdminApiErrorCode,
} from '@/lib/builder/live-chat/admin-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  body: z.string().trim().min(1).max(2000),
  authorLabel: z.string().trim().max(120).optional(),
  locale: z.string().trim().optional(),
});

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

function localeFromPayload(payload: unknown): Locale {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const locale = (payload as { locale?: unknown }).locale;
    return normalizeLocale(typeof locale === 'string' ? locale : undefined);
  }
  return normalizeLocale();
}

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const locale = localeFromPayload(raw);
  const conversation = await getConversation(params.conversationId);
  if (!conversation) return errorResponse(locale, 'conversation_not_found', 404);

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) return errorResponse(locale, 'invalid_payload', 400);

  const now = new Date().toISOString();
  const authorCopy = getLiveChatAuthorCopy(locale);
  await appendMessage({
    messageId: makeMessageId(),
    conversationId: conversation.conversationId,
    role: 'admin',
    body: parsed.data.body,
    at: now,
    authorLabel: parsed.data.authorLabel ?? authorCopy.adminAuthorLabel,
  });
  await saveConversation({ ...conversation, lastMessageAt: now });
  return NextResponse.json({ ok: true, at: now });
}
