import { NextRequest, NextResponse } from 'next/server';
import { createBackupSnapshot } from '@/lib/builder/backups/backup-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET ?? '';
  if (!secret) return process.env.NODE_ENV !== 'production';
  const headerSecret =
    request.headers.get('x-cron-secret') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';
  return headerSecret === secret;
}

async function run(request: NextRequest): Promise<NextResponse> {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const summary = await createBackupSnapshot({ triggeredBy: 'cron' });
  return NextResponse.json({ ok: true, summary });
}

export async function POST(request: NextRequest) {
  return run(request);
}
export async function GET(request: NextRequest) {
  return run(request);
}
