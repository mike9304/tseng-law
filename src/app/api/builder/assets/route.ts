import { NextRequest, NextResponse } from 'next/server';
import {
  deleteBuilderImageAsset,
  listBuilderImageAssets,
  readBuilderAssetLibraryState,
  uploadBuilderImageAsset,
  writeBuilderAssetLibraryState,
} from '@/lib/builder/assets';
import { recordAssetDelete, recordAssetUpload } from '@/lib/builder/audit/record';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  validateUploadFile,
  validateImageBytes,
} from '@/lib/builder/canvas/upload-validation';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const blocked = guardBuilderRead(request);
  if (blocked instanceof NextResponse) return blocked;

  try {
    const locale = request.nextUrl.searchParams.get('locale');
    const [assets, library] = await Promise.all([
      listBuilderImageAssets({
        locale,
        limit: parseLimit(request.nextUrl.searchParams.get('limit')),
      }),
      readBuilderAssetLibraryState({ locale }),
    ]);

    return NextResponse.json({
      ok: true,
      library,
      assets: assets.map((asset) => ({
        backend: asset.backend,
        locale: asset.locale,
        pathname: asset.pathname,
        url: asset.url,
        filename: asset.filename,
        contentType: asset.contentType,
        size: asset.size,
        uploadedAt: asset.uploadedAt,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to load builder assets.',
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = await request.json();
    const library = await writeBuilderAssetLibraryState({
      locale: request.nextUrl.searchParams.get('locale') ?? payload?.locale,
      library: payload?.library,
    });

    return NextResponse.json({ ok: true, library });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to save asset library.',
      },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = guardMutation(request, { bucket: 'asset' });
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

  // Server-side validation: client validation은 위조 가능, 여기서 진짜 검증.
  const policyCheck = validateUploadFile(file);
  if (!policyCheck.valid) {
    return NextResponse.json({ ok: false, error: policyCheck.error }, { status: 400 });
  }

  // Magic-byte sniffing — claimed MIME과 실제 시그니처 일치 강제.
  const byteCheck = await validateImageBytes(file);
  if (!byteCheck.valid) {
    return NextResponse.json(
      { ok: false, error: byteCheck.error, sniffed: byteCheck.sniffed },
      { status: 400 },
    );
  }

  try {
    const asset = await uploadBuilderImageAsset({
      locale: request.nextUrl.searchParams.get('locale'),
      file,
    });
    await recordAssetUpload({
      request,
      assetId: asset.filename,
      mime: asset.contentType,
      size: asset.size,
    });

    return NextResponse.json({
      ok: true,
      asset,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to upload image asset.',
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = guardMutation(request, { bucket: 'asset' });
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = await request.json();
    const filename = typeof payload?.filename === 'string' ? payload.filename : null;
    await deleteBuilderImageAsset({
      locale: request.nextUrl.searchParams.get('locale') ?? payload?.locale,
      filename,
    });
    if (filename) {
      await recordAssetDelete({
        request,
        assetId: filename,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to delete image asset.',
      },
      { status: 400 }
    );
  }
}

function parseLimit(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
