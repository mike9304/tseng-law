import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getRecipientByToken,
  saveRecipient,
} from '@/lib/builder/marketing/campaign-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64',
);

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function GET(request: NextRequest) {
  // Always return the pixel — only rate-limit the write side so legitimate
  // email clients still receive the image.
  const rate = await checkRateLimit(`marketing-pixel:${clientIp(request)}`, 120, 60_000);
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (rate.allowed && token) {
    const recipient = await getRecipientByToken(token);
    if (recipient && !recipient.openedAt) {
      await saveRecipient({
        ...recipient,
        openedAt: new Date().toISOString(),
        status: recipient.status === 'sent' ? 'opened' : recipient.status,
      });
    }
  }
  return new NextResponse(new Uint8Array(PIXEL.buffer, PIXEL.byteOffset, PIXEL.byteLength), {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store',
    },
  });
}
