import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
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
