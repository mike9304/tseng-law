import { NextRequest, NextResponse } from 'next/server';
import {
  parseBuilderAssetRouteReference,
  readBuilderImageAsset,
} from '@/lib/builder/assets';

export const runtime = 'nodejs';

const MISSING_ASSET_PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
);

function missingAssetImageResponse(): NextResponse {
  return new NextResponse(MISSING_ASSET_PLACEHOLDER_PNG, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'private, max-age=60',
      'X-Builder-Asset-Missing': '1',
    },
  });
}

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
    return missingAssetImageResponse();
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
