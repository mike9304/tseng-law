import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getConversation,
  listMessagesForConversation,
  saveConversation,
} from '@/lib/builder/live-chat/storage';
import { toSafeChatConversation } from '@/lib/builder/live-chat/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;

  const conversation = await getConversation(params.conversationId);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
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

  const conversation = await getConversation(params.conversationId);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });

  const raw = await request.json().catch(() => ({})) as { status?: 'open' | 'closed' };
  const nextStatus = raw.status === 'open' || raw.status === 'closed' ? raw.status : conversation.status;
  await saveConversation({ ...conversation, status: nextStatus });
  return NextResponse.json({ ok: true });
}
