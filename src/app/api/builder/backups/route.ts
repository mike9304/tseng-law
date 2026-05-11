import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { createBackupSnapshot, listBackups } from '@/lib/builder/backups/backup-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const backups = await listBackups();
  return NextResponse.json({ ok: true, backups, total: backups.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const summary = await createBackupSnapshot({ triggeredBy: 'manual' });
  return NextResponse.json({ ok: true, summary }, { status: 201 });
}
