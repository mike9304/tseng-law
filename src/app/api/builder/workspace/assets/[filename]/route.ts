import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import {
  deleteSharedAsset,
  readSharedAsset,
} from '@/lib/builder/workspace/shared-assets';
import { findSharedAssetUsage } from '@/lib/builder/workspace/shared-asset-usage';
import {
  type BuilderWorkspaceApiErrorCode,
  getBuilderWorkspaceApiErrorPayload,
} from '@/lib/builder/workspace/workspace-api-copy';
import { recordAssetDelete } from '@/lib/builder/audit/record';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FILENAME_RE = /^[A-Za-z0-9._-]{1,128}$/;

function safeFilename(raw: string): string | null {
  if (!raw) return null;
  if (raw.includes('..') || raw.includes('/') || raw.includes('\\')) return null;
  return FILENAME_RE.test(raw) ? raw : null;
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderWorkspaceApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderWorkspaceApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function resolveRequestLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  const blocked = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (blocked instanceof NextResponse) return blocked;
  const locale = resolveRequestLocale(request);
  const filename = safeFilename(params.filename);
  if (!filename) {
    return errorResponse(locale, 'asset_invalid_filename', 400);
  }
  try {
    const asset = await readSharedAsset(filename);
    if (!asset) return errorResponse(locale, 'asset_not_found', 404);
    return new NextResponse(new Uint8Array(asset.content), {
      status: 200,
      headers: {
        'Content-Type': asset.contentType,
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch (error) {
    console.error('[builder/workspace/assets/:filename] GET failed:', error);
    return errorResponse(locale, 'asset_load_failed', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  const auth = await guardMutation(request, { bucket: 'asset', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);
  const filename = safeFilename(params.filename);
  if (!filename) {
    return errorResponse(locale, 'asset_invalid_filename', 400);
  }
  try {
    const usage = await findSharedAssetUsage(filename);
    if (usage.total > 0) {
      return errorResponse(locale, 'asset_in_use', 409, { usage });
    }
    const removed = await deleteSharedAsset(filename);
    if (!removed) return errorResponse(locale, 'asset_not_found', 404);
    await recordAssetDelete({
      request,
      assetId: `workspace/${filename}`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/workspace/assets/:filename] DELETE failed:', error);
    return errorResponse(locale, 'asset_delete_failed', 500);
  }
}
