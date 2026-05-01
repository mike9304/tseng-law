import { NextRequest, NextResponse } from 'next/server';
import {
  deleteBuilderImageAsset,
  listBuilderImageAssets,
  uploadBuilderImageAsset,
} from '@/lib/builder/assets';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const blocked = guardBuilderRead(request);
  if (blocked instanceof NextResponse) return blocked;

  try {
    const assets = await listBuilderImageAssets({
      locale: request.nextUrl.searchParams.get('locale'),
      limit: parseLimit(request.nextUrl.searchParams.get('limit')),
    });

    return NextResponse.json({
      ok: true,
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

  try {
    const asset = await uploadBuilderImageAsset({
      locale: request.nextUrl.searchParams.get('locale'),
      file,
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
    await deleteBuilderImageAsset({
      locale: request.nextUrl.searchParams.get('locale') ?? payload?.locale,
      filename: typeof payload?.filename === 'string' ? payload.filename : null,
    });

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
