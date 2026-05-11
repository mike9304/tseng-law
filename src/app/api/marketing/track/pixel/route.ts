import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (token) {
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
