import { NextRequest, NextResponse } from 'next/server';
import {
  getSubscriberByDoubleOptInToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }
  const subscriber = await getSubscriberByDoubleOptInToken(token);
  if (!subscriber) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  }
  if (subscriber.status === 'subscribed') {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }
  await saveSubscriber({
    ...subscriber,
    status: 'subscribed',
    doubleOptInVerifiedAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, verified: true });
}
