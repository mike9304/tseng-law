import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { uploadBuilderImageAsset } from '@/lib/builder/assets';
import { recordAssetUpload } from '@/lib/builder/audit/record';
import {
  inspectImageBinary,
  type ImageBinaryValidationSuccess,
} from '@/lib/builder/ai-generator/image-binary-validation';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeBuilderHomeLocale } from '@/lib/builder/persistence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const imageGenerationSchema = z.object({
  locale: z.enum(['ko', 'en', 'zh-hant']).default('ko'),
  prompt: z.string().trim().min(20).max(1400),
  size: z.enum(['1024x1024', '1536x1024', '1024x1536', '2048x1152', 'auto']).default('1536x1024'),
  quality: z.enum(['low', 'medium', 'high', 'auto']).default('medium'),
  outputFormat: z.enum(['png', 'jpeg', 'webp']).default('webp'),
  outputCompression: z.number().int().min(0).max(100).default(82),
});

const OPENAI_IMAGE_GENERATION_TIMEOUT_MS = 20_000;
const MAX_GENERATED_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_GENERATED_IMAGE_PIXELS = 16_777_216;
const MAX_GENERATED_IMAGE_DECODED_BYTES = 64 * 1024 * 1024;
const MAX_GENERATED_IMAGE_BASE64_LENGTH = Math.ceil(MAX_GENERATED_IMAGE_BYTES / 3) * 4;
const STRICT_BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

const openAiGenerationResponseSchema = z.object({
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

function openAiApiKey(): string {
  return process.env.OPENAI_API_KEY?.trim() ?? '';
}

function filenameForGeneratedAsset(format: keyof typeof CONTENT_TYPE_BY_FORMAT): string {
  return `ai-image-2-hero-${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}.${format === 'jpeg' ? 'jpg' : format}`;
}

function normalizePrompt(prompt: string): string {
  return [
    prompt,
    'No readable text, no logo, no watermark, no UI screenshot.',
    'Use a polished editorial website hero composition that leaves safe copy space.',
  ].join(' ');
}

type DecodedProviderImage =
  | { ok: true; bytes: Buffer }
  | { ok: false; reason: 'invalid_base64' | 'too_large' };

function decodeProviderImageBase64(value: string): DecodedProviderImage {
  if (value.length > MAX_GENERATED_IMAGE_BASE64_LENGTH) {
    return { ok: false, reason: 'too_large' };
  }
  if (!STRICT_BASE64_PATTERN.test(value)) {
    return { ok: false, reason: 'invalid_base64' };
  }

  const bytes = Buffer.from(value, 'base64');
  if (bytes.toString('base64') !== value) {
    return { ok: false, reason: 'invalid_base64' };
  }
  if (bytes.byteLength > MAX_GENERATED_IMAGE_BYTES) {
    return { ok: false, reason: 'too_large' };
  }
  return { ok: true, bytes };
}

function invalidGeneratedImageResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: 'invalid_generated_image',
      message: 'Generated image bytes could not be validated.',
    },
    { status: 502 },
  );
}

function generatedImageUploadFailedResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: 'generated_image_asset_upload_failed',
      message: 'Generated image asset storage could not be confirmed.',
      uploadState: 'unknown',
    },
    { status: 502 },
  );
}

function requestedDimensions(size: z.infer<typeof imageGenerationSchema>['size']) {
  if (size === 'auto') return null;
  const [width, height] = size.split('x').map(Number);
  return { width, height };
}

function uploadedAssetIsSelfConsistent(
  asset: Awaited<ReturnType<typeof uploadBuilderImageAsset>>,
  locale: string,
  inspection: ImageBinaryValidationSuccess,
  byteLength: number,
): boolean {
  try {
    const extension = FILE_EXTENSION_BY_FORMAT[inspection.format];
    const filename = asset.filename;
    const uploadedAt = asset.uploadedAt;
    const parsedUploadedAt = Date.parse(uploadedAt);
    const canonicalFilename = (
      filename.length <= 96
      && /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:jpg|png|webp)$/.test(filename)
      && filename.endsWith(`.${extension}`)
    );
    const canonicalUploadedAt = (
      uploadedAt.length > 0
      && Number.isFinite(parsedUploadedAt)
      && new Date(parsedUploadedAt).toISOString() === uploadedAt
    );

    return (
      (asset.backend === 'file' || asset.backend === 'blob')
      && asset.locale === locale
      && canonicalFilename
      && asset.pathname === `builder/assets/${locale}/${filename}`
      && asset.url === `/api/builder/assets/${locale}/${filename}`
      && asset.contentType === inspection.mime
      && asset.size === byteLength
      && canonicalUploadedAt
    );
  } catch {
    return false;
  }
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
        message: 'OPENAI_API_KEY is not configured for Image 2.0 generation.',
      },
      { status: 503 },
    );
  }

  const raw = await request.json().catch(() => null);
  const parsed = imageGenerationSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_image_generation_request', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const prompt = normalizePrompt(input.prompt);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_IMAGE_GENERATION_TIMEOUT_MS);

  let validatedItem: { imageBase64: string; revisedPrompt: string | undefined } | null = null;
  try {
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-2',
          prompt,
          size: input.size,
          quality: input.quality,
          output_format: input.outputFormat,
          output_compression: input.outputFormat === 'png' ? undefined : input.outputCompression,
        }),
        signal: controller.signal,
      });
    } catch {
      if (controller.signal.aborted) {
        return NextResponse.json(
          {
            ok: false,
            error: 'openai_image_generation_timeout',
            message: 'Image generation timed out.',
          },
          { status: 504 },
        );
      }
      return NextResponse.json(
        {
          ok: false,
          error: 'openai_image_generation_network_error',
          message: 'Image generation request failed.',
        },
        { status: 502 },
      );
    }

    if (controller.signal.aborted) {
      return NextResponse.json(
        {
          ok: false,
          error: 'openai_image_generation_timeout',
          message: 'Image generation timed out.',
        },
        { status: 504 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: 'openai_image_generation_provider_error',
          message: 'Image generation provider returned an error.',
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
            error: 'openai_image_generation_timeout',
            message: 'Image generation timed out.',
          },
          { status: 504 },
        );
      }
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_openai_image_generation_response',
          message: 'Image generation returned a malformed response.',
        },
        { status: 502 },
      );
    }

    if (controller.signal.aborted) {
      return NextResponse.json(
        {
          ok: false,
          error: 'openai_image_generation_timeout',
          message: 'Image generation timed out.',
        },
        { status: 504 },
      );
    }

    const providerParsed = openAiGenerationResponseSchema.safeParse(providerJson);
    if (!providerParsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_openai_image_generation_response',
          message: 'Image generation returned a malformed response.',
        },
        { status: 502 },
      );
    }

    validatedItem = {
      imageBase64: providerParsed.data.data[0].b64_json,
      revisedPrompt: providerParsed.data.data[0].revised_prompt,
    };
  } finally {
    clearTimeout(timeoutId);
  }

  if (!validatedItem) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_openai_image_generation_response',
        message: 'Image generation returned a malformed response.',
      },
      { status: 502 },
    );
  }

  const { imageBase64, revisedPrompt } = validatedItem;

  const decoded = decodeProviderImageBase64(imageBase64);
  if (!decoded.ok) {
    if (decoded.reason === 'too_large') return invalidGeneratedImageResponse();
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_openai_image_generation_response',
        message: 'Image generation returned a malformed response.',
      },
      { status: 502 },
    );
  }

  let inspection: ReturnType<typeof inspectImageBinary>;
  try {
    inspection = inspectImageBinary(decoded.bytes, {
      declaredMime: CONTENT_TYPE_BY_FORMAT[input.outputFormat],
      maxBytes: MAX_GENERATED_IMAGE_BYTES,
      maxPixels: MAX_GENERATED_IMAGE_PIXELS,
      maxDecodedBytes: MAX_GENERATED_IMAGE_DECODED_BYTES,
    });
  } catch {
    return invalidGeneratedImageResponse();
  }
  if (!inspection.valid) {
    return invalidGeneratedImageResponse();
  }

  const expectedDimensions = requestedDimensions(input.size);
  if (
    expectedDimensions
    && (inspection.width !== expectedDimensions.width || inspection.height !== expectedDimensions.height)
  ) {
    return invalidGeneratedImageResponse();
  }

  const file = new File(
    [new Uint8Array(decoded.bytes)],
    filenameForGeneratedAsset(inspection.format),
    { type: inspection.mime },
  );

  const locale = normalizeBuilderHomeLocale(input.locale);

  let asset: Awaited<ReturnType<typeof uploadBuilderImageAsset>>;
  try {
    asset = await uploadBuilderImageAsset({ locale, file });
  } catch {
    return generatedImageUploadFailedResponse();
  }
  if (!uploadedAssetIsSelfConsistent(asset, locale, inspection, decoded.bytes.byteLength)) {
    return generatedImageUploadFailedResponse();
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
    operation: 'generate',
    prompt,
    revisedPrompt,
    dimensions: {
      width: inspection.width,
      height: inspection.height,
    },
    format: inspection.format,
    mime: inspection.mime,
    asset,
    auditState: 'attempted',
  });
}
