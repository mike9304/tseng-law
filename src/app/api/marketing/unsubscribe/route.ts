import { NextRequest, NextResponse } from 'next/server';
import {
  getSubscriberByUnsubscribeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handle(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }
  const subscriber = await getSubscriberByUnsubscribeToken(token);
  if (!subscriber) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  }
  if (subscriber.status !== 'unsubscribed') {
    await saveSubscriber({
      ...subscriber,
      status: 'unsubscribed',
      unsubscribedAt: new Date().toISOString(),
    });
  }
  return NextResponse.json({ ok: true, unsubscribed: true });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
