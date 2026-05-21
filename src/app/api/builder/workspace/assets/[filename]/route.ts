import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  deleteSharedAsset,
  readSharedAsset,
} from '@/lib/builder/workspace/shared-assets';
import { recordAssetDelete } from '@/lib/builder/audit/record';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FILENAME_RE = /^[A-Za-z0-9._-]{1,128}$/;

function safeFilename(raw: string): string | null {
  if (!raw) return null;
  if (raw.includes('..') || raw.includes('/') || raw.includes('\\')) return null;
  return FILENAME_RE.test(raw) ? raw : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  const blocked = guardBuilderRead(request);
  if (blocked instanceof NextResponse) return blocked;
  const filename = safeFilename(params.filename);
  if (!filename) {
    return NextResponse.json({ ok: false, error: 'Invalid asset filename.' }, { status: 400 });
  }
  const asset = await readSharedAsset(filename);
  if (!asset) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  return new NextResponse(new Uint8Array(asset.content), {
    status: 200,
    headers: {
      'Content-Type': asset.contentType,
      'Cache-Control': 'private, max-age=60',
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  const auth = await guardMutation(request, { bucket: 'asset' });
  if (auth instanceof NextResponse) return auth;
  const filename = safeFilename(params.filename);
  if (!filename) {
    return NextResponse.json({ ok: false, error: 'Invalid asset filename.' }, { status: 400 });
  }
  const removed = await deleteSharedAsset(filename);
  if (!removed) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  await recordAssetDelete({
    request,
    assetId: `workspace/${filename}`,
  });
  return NextResponse.json({ ok: true });
}