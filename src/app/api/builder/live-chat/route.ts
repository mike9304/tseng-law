import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { listConversations } from '@/lib/builder/live-chat/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-contacts' });
  if (auth instanceof NextResponse) return auth;
  const conversations = await listConversations();
  // Strip visitorToken from admin payload.
  return NextResponse.json({
    ok: true,
    conversations: conversations.map(({ visitorToken: _v, ...rest }) => rest),
    total: conversations.length,
  });
}
