import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  appendMessage,
  getConversation,
  makeMessageId,
  saveConversation,
} from '@/lib/builder/live-chat/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  body: z.string().trim().min(1).max(2000),
  authorLabel: z.string().trim().max(120).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  const auth = await guardMutation(request, { permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;

  const conversation = await getConversation(params.conversationId);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const now = new Date().toISOString();
  await appendMessage({
    messageId: makeMessageId(),
    conversationId: conversation.conversationId,
    role: 'admin',
    body: parsed.data.body,
    at: now,
    authorLabel: parsed.data.authorLabel ?? 'admin',
  });
  await saveConversation({ ...conversation, lastMessageAt: now });
  return NextResponse.json({ ok: true, at: now });
}
