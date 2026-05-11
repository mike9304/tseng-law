import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getSubscriberByEmail,
  listSubscribers,
  makeSubscriberId,
  makeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import {
  adminSubscriberCreateSchema,
  type SubscriberStatus,
} from '@/lib/builder/marketing/subscriber-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const status = request.nextUrl.searchParams.get('status') as SubscriberStatus | null;
  const tag = request.nextUrl.searchParams.get('tag');
  const search = request.nextUrl.searchParams.get('q');
  const subscribers = await listSubscribers({
    status: status ?? undefined,
    tag: tag ?? undefined,
    search: search ?? undefined,
  });
  return NextResponse.json({ ok: true, subscribers, total: subscribers.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-subscribers' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = adminSubscriberCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid subscriber payload' }, { status: 400 });
  }

  const existing = await getSubscriberByEmail(parsed.data.email);
  const now = new Date().toISOString();
  const subscriber = {
    subscriberId: existing?.subscriberId ?? makeSubscriberId(),
    email: parsed.data.email,
    contactId: parsed.data.contactId ?? existing?.contactId,
    status: parsed.data.status,
    tags: Array.from(new Set([...(existing?.tags ?? []), ...parsed.data.tags])),
    preferredLocale: parsed.data.preferredLocale,
    unsubscribeToken: existing?.unsubscribeToken ?? makeToken(),
    source: parsed.data.source,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await saveSubscriber(subscriber);
  return NextResponse.json({ ok: true, subscriber }, { status: existing ? 200 : 201 });
}
