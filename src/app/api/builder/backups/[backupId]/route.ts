import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { loadBackupManifest } from '@/lib/builder/backups/backup-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { backupId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const manifest = await loadBackupManifest(params.backupId);
  if (!manifest) return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
  // Don't return the raw entries (could be huge) — just metadata + count.
  return NextResponse.json({
    ok: true,
    backupId: manifest.backupId,
    createdAt: manifest.createdAt,
    triggeredBy: manifest.triggeredBy,
    prefixes: manifest.prefixes,
    entryCount: manifest.entries.length,
    sizeBytes: manifest.sizeBytes,
    backend: manifest.backend,
  });
}
