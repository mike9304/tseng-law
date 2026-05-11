import { NextRequest, NextResponse } from 'next/server';
import { getConversation } from '@/lib/builder/live-chat/storage';
import { buildChatStream } from '@/lib/builder/live-chat/sse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const conversationId = request.nextUrl.searchParams.get('conversationId') ?? '';
  const visitorToken = request.nextUrl.searchParams.get('visitorToken') ?? '';
  if (!conversationId || !visitorToken) {
    return NextResponse.json({ error: 'conversationId + visitorToken required' }, { status: 400 });
  }
  const conversation = await getConversation(conversationId);
  if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  if (conversation.visitorToken !== visitorToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const stream = buildChatStream({
    conversationId,
    observerRole: 'visitor',
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
