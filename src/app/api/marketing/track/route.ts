import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getRecipientByToken,
  saveRecipient,
} from '@/lib/builder/marketing/campaign-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isSafeRedirect(target: string): boolean {
  try {
    const url = new URL(target);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function GET(request: NextRequest) {
  const rate = await checkRateLimit(`marketing-track:${clientIp(request)}`, 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const target = request.nextUrl.searchParams.get('u') ?? '';
  if (!target || !isSafeRedirect(target)) {
    return NextResponse.json({ error: 'Invalid redirect' }, { status: 400 });
  }
  if (token) {
    const recipient = await getRecipientByToken(token);
    if (recipient) {
      await saveRecipient({
        ...recipient,
        clickedAt: recipient.clickedAt ?? new Date().toISOString(),
        status: recipient.clickedAt ? recipient.status : 'clicked',
      });
    }
  }
  return NextResponse.redirect(target, { status: 302 });
}
