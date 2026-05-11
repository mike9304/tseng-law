import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getConversation } from '@/lib/builder/live-chat/storage';
import { buildChatStream } from '@/lib/builder/live-chat/sse';

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

  const stream = buildChatStream({
    conversationId: params.conversationId,
    observerRole: 'admin',
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
