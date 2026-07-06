import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { restoreOpsBackupStub } from '@/lib/builder/ops/backups-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const result = await restoreOpsBackupStub(id);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 422 });
  }
  return NextResponse.json({
    ok: true,
    restoredPath: result.restoredPath,
    verified: result.verified,
    checksumSha256: result.checksumSha256,
    sizeBytes: result.sizeBytes,
  });
}
