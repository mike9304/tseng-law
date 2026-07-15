import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  parseBuilderAssetRouteReference,
  parseBuilderAssetUrl,
  readBuilderImageAsset,
  uploadBuilderImageAsset,
} from '@/lib/builder/assets';
import { recordAssetUpload } from '@/lib/builder/audit/record';
import {
  inspectImageBinary,
  validatePngAlphaMask,
} from '@/lib/builder/ai-generator/image-binary-validation';
import { normalizeBuilderHomeLocale } from '@/lib/builder/persistence';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const imageEditSchema = z.object({
  locale: z.enum(['ko', 'en', 'zh-hant']).default('ko'),
  assetId: z.string().trim().min(1).max(260).optional(),
  assetUrl: z.string().trim().min(1).max(420).optional(),
  prompt: z.string().trim().min(20).max(1400),
  mask: z.object({
    dataUrl: z.string().min(32).max(8_000_000),
    description: z.string().trim().max(180).optional(),
  }).optional(),
  size: z.enum(['1024x1024', '1536x1024', '1024x1536', 'auto']).default('1536x1024'),
  quality: z.enum(['low', 'medium', 'high', 'auto']).default('medium'),
  outputFormat: z.enum(['png', 'jpeg', 'webp']).default('webp'),
  outputCompression: z.number().int().min(0).max(100).default(82),
});

const OPENAI_IMAGE_EDIT_TIMEOUT_MS = 20_000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 16_777_216;
const MAX_IMAGE_DECODED_BYTES = 64 * 1024 * 1024;
const MAX_IMAGE_BASE64_LENGTH = Math.ceil(MAX_IMAGE_BYTES / 3) * 4;

const openAiEditResponseSchema = z.object({
  data: z
    .object({
      b64_json: z.string().min(1),
      revised_prompt: z.string().optional(),
    })
    .array()
    .min(1),
});

const CONTENT_TYPE_BY_FORMAT = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
} as const;

const FILE_EXTENSION_BY_FORMAT = {
  png: 'png',
  jpeg: 'jpg',
  webp: 'webp',
} as const;

const SOURCE_FORMAT_BY_MIME = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/webp': 'webp',
} as const;

function openAiApiKey(): string {
  return process.env.OPENAI_API_KEY?.trim() ?? '';
}

function filenameForEditedAsset(format: keyof typeof CONTENT_TYPE_BY_FORMAT): string {
  return `ai-image-2-edit-${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}.${format === 'jpeg' ? 'jpg' : format}`;
}

function normalizeEditPrompt(prompt: string): string {
  return [
    prompt,
    'Preserve useful composition and brand realism unless the prompt asks for a larger change.',
    'No readable text, no logo, no watermark, no UI screenshot.',
    'Return a polished website-ready image suitable for use in a Wix-style visual builder.',
  ].join(' ');
}

function decodeStrictBase64(encoded: string): Buffer | null {
  if (
    encoded.length === 0
    || encoded.length > MAX_IMAGE_BASE64_LENGTH
    || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(encoded)
  ) {
    return null;
  }
  try {
    const decoded = Buffer.from(encoded, 'base64');
    return decoded.toString('base64') === encoded ? decoded : null;
  } catch {
    return null;
  }
}

function decodePngDataUrl(dataUrl: string): Buffer | null {
  const prefix = 'data:image/png;base64,';
  if (!dataUrl.startsWith(prefix)) return null;
  const encoded = dataUrl.slice(prefix.length);
  return decodeStrictBase64(encoded);
}

function dimensionsForRequestedSize(size: z.infer<typeof imageEditSchema>['size']) {
  if (size === 'auto') return null;
  const [width, height] = size.split('x').map(Number);
  return { width, height };
}

function isCanonicalUploadTimestamp(value: string): boolean {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return false;
  return new Date(timestamp).toISOString() === value;
}

function isAttestedEditedAsset(
  asset: Awaited<ReturnType<typeof uploadBuilderImageAsset>>,
  input: {
    locale: string;
    format: keyof typeof FILE_EXTENSION_BY_FORMAT;
    mime: string;
    byteLength: number;
  },
): boolean {
  const extension = FILE_EXTENSION_BY_FORMAT[input.format];
  const safeFilename = (
    asset.filename.length <= 128
    && /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+$/.test(asset.filename)
    && asset.filename.endsWith(`.${extension}`)
  );
  if (!safeFilename) return false;

  const expectedPathname = `builder/assets/${input.locale}/${asset.filename}`;
  const expectedUrl = `/api/builder/assets/${input.locale}/${asset.filename}`;
  return (
    asset.locale === input.locale
    && (asset.backend === 'file' || asset.backend === 'blob')
    && asset.pathname === expectedPathname
    && asset.url === expectedUrl
    && asset.contentType === input.mime
    && asset.size === input.byteLength
    && isCanonicalUploadTimestamp(asset.uploadedAt)
  );
}

function resolveSourceReference(input: z.infer<typeof imageEditSchema>) {
  const locale = normalizeBuilderHomeLocale(input.locale);
  if (input.assetUrl) {
    return parseBuilderAssetUrl(input.assetUrl);
  }

  const assetId = input.assetId?.trim();
  if (!assetId) return null;

  if (assetId.startsWith('/api/builder/assets/')) {
    return parseBuilderAssetUrl(assetId);
  }

  if (assetId.startsWith('builder/assets/')) {
    const segments = assetId.split('/').filter(Boolean);
    if (segments.length === 4) {
      return parseBuilderAssetRouteReference(segments[2], [segments[3]]);
    }
    return null;
  }

  return parseBuilderAssetRouteReference(locale, [assetId]);
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'asset', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const apiKey = openAiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: 'missing_openai_api_key',
        message: 'OPENAI_API_KEY is not configured for Image 2.0 editing.',
      },
      { status: 503 },
    );
  }

  const raw = await request.json().catch(() => null);
  const parsed = imageEditSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_image_edit_request', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const sourceReference = resolveSourceReference(input);
  if (!sourceReference) {
    return NextResponse.json(
      { ok: false, error: 'invalid_source_asset', message: 'A valid builder image asset is required.' },
      { status: 400 },
    );
  }

  const source = await readBuilderImageAsset({
    locale: sourceReference.locale,
    assetPath: [sourceReference.filename],
  });
  if (!source) {
    return NextResponse.json(
      { ok: false, error: 'source_asset_not_found', message: 'The source builder image asset could not be found.' },
      { status: 404 },
    );
  }
  const declaredSourceFormat = SOURCE_FORMAT_BY_MIME[source.contentType as keyof typeof SOURCE_FORMAT_BY_MIME];
  if (!declaredSourceFormat) {
    return NextResponse.json(
      {
        ok: false,
        error: 'unsupported_source_image_type',
        message: 'Image 2.0 editing currently supports PNG, JPEG, and WEBP builder assets.',
      },
      { status: 415 },
    );
  }

  let sourceInspection: ReturnType<typeof inspectImageBinary>;
  try {
    sourceInspection = inspectImageBinary(source.content, {
      declaredMime: source.contentType as keyof typeof SOURCE_FORMAT_BY_MIME,
      maxBytes: MAX_IMAGE_BYTES,
      maxPixels: MAX_IMAGE_PIXELS,
      maxDecodedBytes: MAX_IMAGE_DECODED_BYTES,
    });
  } catch {
    sourceInspection = { valid: false, reason: 'inspection_failed' };
  }
  if (
    !sourceInspection.valid
    || sourceInspection.format !== declaredSourceFormat
    || sourceInspection.mime !== source.contentType
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_source_image',
        message: 'Source image bytes could not be validated.',
      },
      { status: 415 },
    );
  }

  const prompt = normalizeEditPrompt(input.prompt);
  const sourceFile = new File([new Uint8Array(source.content)], sourceReference.filename, { type: source.contentType });
  const formData = new FormData();
  formData.set('model', 'gpt-image-2');
  formData.set('image', sourceFile);
  formData.set('prompt', prompt);
  if (input.mask) {
    const maskContent = decodePngDataUrl(input.mask.dataUrl);
    let maskInspection: ReturnType<typeof validatePngAlphaMask> | null = null;
    if (maskContent) {
      try {
        maskInspection = validatePngAlphaMask(maskContent, {
          width: sourceInspection.width,
          height: sourceInspection.height,
          maxBytes: MAX_IMAGE_BYTES,
          maxPixels: MAX_IMAGE_PIXELS,
          maxDecodedBytes: MAX_IMAGE_DECODED_BYTES,
        });
      } catch {
        maskInspection = null;
      }
    }
    if (
      !maskContent
      || !maskInspection?.valid
      || maskInspection.format !== 'png'
      || maskInspection.mime !== 'image/png'
      || !maskInspection.hasAlpha
      || maskInspection.width !== sourceInspection.width
      || maskInspection.height !== sourceInspection.height
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_mask_image',
          message: 'Mask must be a PNG data URL with an alpha channel.',
        },
        { status: 400 },
      );
    }
    formData.set('mask', new File([new Uint8Array(maskContent)], 'ai-image-2-mask.png', { type: 'image/png' }));
    if (input.mask.description) {
      formData.set('mask_description', input.mask.description);
    }
  }
  formData.set('size', input.size);
  formData.set('quality', input.quality);
  formData.set('output_format', input.outputFormat);
  if (input.outputFormat !== 'png') {
    formData.set('output_compression', String(input.outputCompression));
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_IMAGE_EDIT_TIMEOUT_MS);

  let validatedItem: { imageBytes: Buffer; revisedPrompt: string | undefined } | null = null;
  try {
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
        signal: controller.signal,
      });
    } catch {
      if (controller.signal.aborted) {
        return NextResponse.json(
          {
            ok: false,
            error: 'openai_image_edit_timeout',
            message: 'Image edit timed out.',
          },
          { status: 504 },
        );
      }
      return NextResponse.json(
        {
          ok: false,
          error: 'openai_image_edit_network_error',
          message: 'Image edit request failed.',
        },
        { status: 502 },
      );
    }

    if (controller.signal.aborted) {
      return NextResponse.json(
        {
          ok: false,
          error: 'openai_image_edit_timeout',
          message: 'Image edit timed out.',
        },
        { status: 504 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: 'openai_image_edit_provider_error',
          message: 'Image edit provider returned an error.',
        },
        { status: 502 },
      );
    }

    let providerJson: unknown;
    try {
      providerJson = await response.json();
    } catch {
      if (controller.signal.aborted) {
        return NextResponse.json(
          {
            ok: false,
            error: 'openai_image_edit_timeout',
            message: 'Image edit timed out.',
          },
          { status: 504 },
        );
      }
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_openai_image_edit_response',
          message: 'Image edit returned a malformed response.',
        },
        { status: 502 },
      );
    }

    if (controller.signal.aborted) {
      return NextResponse.json(
        {
          ok: false,
          error: 'openai_image_edit_timeout',
          message: 'Image edit timed out.',
        },
        { status: 504 },
      );
    }

    const providerParsed = openAiEditResponseSchema.safeParse(providerJson);
    if (!providerParsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_openai_image_edit_response',
          message: 'Image edit returned a malformed response.',
        },
        { status: 502 },
      );
    }

    const imageBytes = decodeStrictBase64(providerParsed.data.data[0].b64_json);
    if (!imageBytes) {
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_openai_image_edit_response',
          message: 'Image edit returned a malformed response.',
        },
        { status: 502 },
      );
    }

    validatedItem = {
      imageBytes,
      revisedPrompt: providerParsed.data.data[0].revised_prompt,
    };
  } finally {
    clearTimeout(timeoutId);
  }

  if (!validatedItem) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_openai_image_edit_response',
        message: 'Image edit returned a malformed response.',
      },
      { status: 502 },
    );
  }

  const { imageBytes: content, revisedPrompt } = validatedItem;
  const contentType = CONTENT_TYPE_BY_FORMAT[input.outputFormat];
  let outputInspection: ReturnType<typeof inspectImageBinary>;
  try {
    outputInspection = inspectImageBinary(content, {
      declaredMime: contentType,
      maxBytes: MAX_IMAGE_BYTES,
      maxPixels: MAX_IMAGE_PIXELS,
      maxDecodedBytes: MAX_IMAGE_DECODED_BYTES,
    });
  } catch {
    outputInspection = { valid: false, reason: 'inspection_failed' };
  }
  const requestedDimensions = dimensionsForRequestedSize(input.size);
  if (
    !outputInspection.valid
    || outputInspection.format !== input.outputFormat
    || outputInspection.mime !== contentType
    || (requestedDimensions !== null
      && (outputInspection.width !== requestedDimensions.width
        || outputInspection.height !== requestedDimensions.height))
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_edited_image',
        message: 'Edited image bytes could not be validated.',
      },
      { status: 502 },
    );
  }
  const outputFile = new File(
    [new Uint8Array(content)],
    filenameForEditedAsset(input.outputFormat),
    { type: contentType },
  );

  let asset: Awaited<ReturnType<typeof uploadBuilderImageAsset>>;
  try {
    asset = await uploadBuilderImageAsset({ locale: sourceReference.locale, file: outputFile });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'edited_image_asset_upload_failed',
        message: 'Edited image asset storage could not be confirmed.',
        uploadState: 'unknown',
      },
      { status: 502 },
    );
  }
  if (!isAttestedEditedAsset(asset, {
    locale: sourceReference.locale,
    format: outputInspection.format,
    mime: outputInspection.mime,
    byteLength: content.byteLength,
  })) {
    return NextResponse.json(
      {
        ok: false,
        error: 'edited_image_asset_upload_failed',
        message: 'Edited image asset storage could not be confirmed.',
        uploadState: 'unknown',
      },
      { status: 502 },
    );
  }

  await recordAssetUpload({
    request,
    assetId: asset.filename,
    mime: asset.contentType,
    size: asset.size,
  }).catch(() => undefined);

  return NextResponse.json({
    ok: true,
    provider: 'openai',
    model: 'gpt-image-2',
    stub: false,
    operation: 'edit',
    prompt,
    revisedPrompt,
    source: {
      locale: sourceReference.locale,
      filename: sourceReference.filename,
      url: sourceReference.url,
      dimensions: {
        width: sourceInspection.width,
        height: sourceInspection.height,
      },
      format: sourceInspection.format,
      mime: sourceInspection.mime,
    },
    dimensions: {
      width: outputInspection.width,
      height: outputInspection.height,
    },
    format: outputInspection.format,
    mime: outputInspection.mime,
    asset,
    auditState: 'attempted',
  });
}
