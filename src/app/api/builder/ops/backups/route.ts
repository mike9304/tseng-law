import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  createOpsBackupStub,
  deleteOpsBackup,
  listOpsBackups,
} from '@/lib/builder/ops/backups-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const backups = await listOpsBackups();
  return NextResponse.json({ ok: true, backups, total: backups.length });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  let body: { sourcePath?: unknown; note?: unknown };
  try {
    body = (await request.json()) as { sourcePath?: unknown; note?: unknown };
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }
  const sourcePath = typeof body.sourcePath === 'string' ? body.sourcePath : '';
  const note = typeof body.note === 'string' ? body.note.slice(0, 240) : undefined;
  if (!sourcePath) {
    return NextResponse.json({ error: 'sourcePath required' }, { status: 400 });
  }
  const record = await createOpsBackupStub(sourcePath, note);
  return NextResponse.json(
    { ok: record.status === 'ok', record },
    { status: record.status === 'ok' ? 201 : 422 },
  );
}

export async function DELETE(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id query param required' }, { status: 400 });
  const removed = await deleteOpsBackup(id);
  if (!removed) return NextResponse.json({ error: 'unknown backup' }, { status: 404 });
  return NextResponse.json({ ok: true, removed: id });
}