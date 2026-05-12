import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';
import {
  appendMessage,
  getConversation,
  makeMessageId,
  saveConversation,
} from '@/lib/builder/live-chat/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
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

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rate = await checkRateLimit(`livechat-send:${ip}`, 60, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const conversation = await getConversation(parsed.data.conversationId);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  if (!safeEqualStrings(conversation.visitorToken, parsed.data.visitorToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (conversation.status === 'closed') {
    return NextResponse.json({ error: 'Conversation closed' }, { status: 409 });
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
