import { NextRequest, NextResponse } from 'next/server';
import {
  parseBuilderAssetRouteReference,
  readBuilderImageAsset,
} from '@/lib/builder/assets';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  context: { params: { locale: string; assetPath: string[] } }
) {
  const reference = parseBuilderAssetRouteReference(context.params.locale, context.params.assetPath);
  if (!reference) {
    return NextResponse.json({ ok: false, error: 'Invalid builder asset URL.' }, { status: 400 });
  }

  const asset = await readBuilderImageAsset({
    locale: reference.locale,
    assetPath: [reference.filename],
  });

  if (!asset) {
    return NextResponse.json({ ok: false, error: 'Asset not found.' }, { status: 404 });
  }

  const body = new Uint8Array(asset.content);

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': asset.contentType,
      'Cache-Control': 'private, max-age=31536000, immutable',
    },
  });
}
