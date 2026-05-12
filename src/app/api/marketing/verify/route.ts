import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getSubscriberByDoubleOptInToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function GET(request: NextRequest) {
  const rate = await checkRateLimit(`marketing-verify:${clientIp(request)}`, 20, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
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
