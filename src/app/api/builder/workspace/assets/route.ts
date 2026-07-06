import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import {
  listSharedAssets,
  uploadSharedAsset,
} from '@/lib/builder/workspace/shared-assets';
import {
  type BuilderWorkspaceApiErrorCode,
  getBuilderWorkspaceApiErrorPayload,
} from '@/lib/builder/workspace/workspace-api-copy';
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

function resolveRequestLocale(request: NextRequest, formData?: FormData): Locale {
  const formLocale = formData?.get('locale');
  return normalizeLocale(
    typeof formLocale === 'string' ? formLocale : request.nextUrl.searchParams.get('locale') ?? undefined,
  );
}

function uploadErrorCode(code?: string): BuilderWorkspaceApiErrorCode {
  if (code === 'payload_too_large') return 'asset_payload_too_large';
  if (code === 'unsupported_media') return 'asset_unsupported_media';
  return 'asset_invalid_upload';
}

export async function GET(request: NextRequest) {
  const blocked = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (blocked instanceof NextResponse) return blocked;
  const locale = resolveRequestLocale(request);

  try {
    const limit = Number(request.nextUrl.searchParams.get('limit') ?? '24');
    const assets = await listSharedAssets(Number.isFinite(limit) ? limit : 24);
    return NextResponse.json({ ok: true, total: assets.length, assets });
  } catch (error) {
    console.error('[builder/workspace/assets] GET failed:', error);
    return errorResponse(locale, 'assets_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'asset', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;
  let errorLocale = resolveRequestLocale(request);

  let formData: FormData;
  try {
    formData = await request.formData();
    errorLocale = resolveRequestLocale(request, formData);
  } catch {
    return errorResponse(errorLocale, 'asset_invalid_upload', 400);
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return errorResponse(errorLocale, 'asset_file_required', 400);
  }

  const policyCheck = validateUploadFile(file);
  if (!policyCheck.valid) {
    return errorResponse(errorLocale, uploadErrorCode(policyCheck.code), uploadStatus(policyCheck.code), {
      code: policyCheck.code,
    });
  }

  const byteCheck = await validateImageBytes(file);
  if (!byteCheck.valid) {
    return errorResponse(errorLocale, uploadErrorCode(byteCheck.code), uploadStatus(byteCheck.code), {
      code: byteCheck.code,
      sniffed: byteCheck.sniffed,
    });
  }

  try {
    const asset = await uploadSharedAsset({ file, locale: errorLocale });
    await recordAssetUpload({
      request,
      assetId: `workspace/${asset.filename}`,
      mime: asset.contentType,
      size: asset.size,
    });
    return NextResponse.json({ ok: true, asset }, { status: 201 });
  } catch (error) {
    console.error('[builder/workspace/assets] POST failed:', error);
    return errorResponse(errorLocale, 'asset_upload_failed', 500);
  }
}
