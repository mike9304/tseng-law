import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  listSharedAssets,
  uploadSharedAsset,
} from '@/lib/builder/workspace/shared-assets';
import { recordAssetUpload } from '@/lib/builder/audit/record';
import {
  validateUploadFile,
  validateImageBytes,
} from '@/lib/builder/canvas/upload-validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function uploadStatus(code?: string): 400 | 413 | 415 {
  if (code === 'payload_too_large') return 413;
  if (code === 'unsupported_media') return 415;
  return 400;
}

export async function GET(request: NextRequest) {
  const blocked = guardBuilderRead(request);
  if (blocked instanceof NextResponse) return blocked;

  try {
    const limit = Number(request.nextUrl.searchParams.get('limit') ?? '24');
    const assets = await listSharedAssets(Number.isFinite(limit) ? limit : 24);
    return NextResponse.json({ ok: true, total: assets.length, assets });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'asset' });
  if (auth instanceof NextResponse) return auth;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid upload payload.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Image file is required.' }, { status: 400 });
  }

  const policyCheck = validateUploadFile(file);
  if (!policyCheck.valid) {
    return NextResponse.json(
      { ok: false, error: policyCheck.error, code: policyCheck.code },
      { status: uploadStatus(policyCheck.code) },
    );
  }

  const byteCheck = await validateImageBytes(file);
  if (!byteCheck.valid) {
    return NextResponse.json(
      { ok: false, error: byteCheck.error, code: byteCheck.code, sniffed: byteCheck.sniffed },
      { status: uploadStatus(byteCheck.code) },
    );
  }

  try {
    const asset = await uploadSharedAsset({ file });
    await recordAssetUpload({
      request,
      assetId: `workspace/${asset.filename}`,
      mime: asset.contentType,
      size: asset.size,
    });
    return NextResponse.json({ ok: true, asset }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 400 },
    );
  }
}