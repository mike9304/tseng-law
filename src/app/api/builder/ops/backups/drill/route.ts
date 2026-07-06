import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  readLatestOpsBackupRestoreDrill,
  runOpsBackupRestoreDrill,
} from '@/lib/builder/ops/backup-restore-drill';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const report = await readLatestOpsBackupRestoreDrill();
  return NextResponse.json({ ok: true, report });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const report = await runOpsBackupRestoreDrill();
  return NextResponse.json(
    { ok: report.status === 'ok', report },
    { status: report.status === 'ok' ? 200 : 500 },
  );
}
