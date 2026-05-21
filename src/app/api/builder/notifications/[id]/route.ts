import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteNotification,
  markRead,
} from '@/lib/builder/notifications/notification-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const updated = await markRead(params.id);
  if (!updated) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true, notification: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const ok = await deleteNotification(params.id);
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}