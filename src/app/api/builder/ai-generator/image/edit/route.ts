import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  parseBuilderAssetRouteReference,
  parseBuilderAssetUrl,
  readBuilderImageAsset,
  uploadBuilderImageAsset,
} from '@/lib/builder/assets';
import { recordAssetUpload } from '@/lib/builder/audit/record';
import { validateImageBytes } from '@/lib/builder/canvas/upload-validation';
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
    dataUrl: z.string().trim().min(32).max(8_000_000),
    description: z.string().trim().max(180).optional(),
  }).optional(),
  size: z.enum(['1024x1024', '1536x1024', '1024x1536', 'auto']).default('1536x1024'),
  quality: z.enum(['low', 'medium', 'high', 'auto']).default('medium'),
  outputFormat: z.enum(['png', 'jpeg', 'webp']).default('webp'),
  outputCompression: z.number().int().min(0).max(100).default(82),
});

type OpenAiImageEditPayload = {
  data?: Array<{
    b64_json?: string;
    revised_prompt?: string;
  }>;
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
};

const CONTENT_TYPE_BY_FORMAT = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
} as const;

const SUPPORTED_SOURCE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

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

function decodePngDataUrl(dataUrl: string): Buffer | null {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) return null;
  try {
    return Buffer.from(match[1], 'base64');
  } catch {
    return null;
  }
}

function pngHasAlphaChannel(content: Buffer): boolean {
  if (content.byteLength < 26) return false;
  const signature = '89504e470d0a1a0a';
  if (content.subarray(0, 8).toString('hex') !== signature) return false;
  const ihdrType = content.subarray(12, 16).toString('ascii');
  if (ihdrType !== 'IHDR') return false;
  const colorType = content[25];
  return colorType === 4 || colorType === 6;
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
  if (!SUPPORTED_SOURCE_IMAGE_TYPES.has(source.contentType)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'unsupported_source_image_type',
        message: 'Image 2.0 editing currently supports PNG, JPEG, and WEBP builder assets.',
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
    if (!maskContent || !pngHasAlphaChannel(maskContent)) {
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

  const response = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  const payload = (await response.json().catch(() => ({}))) as OpenAiImageEditPayload;
  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: payload.error?.code ?? payload.error?.type ?? 'openai_image_edit_failed',
        message: payload.error?.message ?? 'Image 2.0 editing failed.',
      },
      { status: response.status },
    );
  }

  const imageBase64 = payload.data?.[0]?.b64_json;
  if (!imageBase64) {
    return NextResponse.json(
      { ok: false, error: 'missing_image_payload', message: 'Image 2.0 did not return edited image data.' },
      { status: 502 },
    );
  }

  const content = Buffer.from(imageBase64, 'base64');
  const contentType = CONTENT_TYPE_BY_FORMAT[input.outputFormat];
  const outputFile = new File([content], filenameForEditedAsset(input.outputFormat), { type: contentType });
  const byteCheck = await validateImageBytes(outputFile);
  if (!byteCheck.valid) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_edited_image',
        message: byteCheck.error ?? 'Edited image bytes could not be validated.',
        sniffed: byteCheck.sniffed,
      },
      { status: 502 },
    );
  }

  const asset = await uploadBuilderImageAsset({ locale: sourceReference.locale, file: outputFile });
  await recordAssetUpload({
    request,
    assetId: asset.filename,
    mime: asset.contentType,
    size: asset.size,
  });

  return NextResponse.json({
    ok: true,
    model: 'gpt-image-2',
    prompt,
    revisedPrompt: payload.data?.[0]?.revised_prompt,
    source: {
      locale: sourceReference.locale,
      filename: sourceReference.filename,
      url: sourceReference.url,
    },
    asset,
  });
}
