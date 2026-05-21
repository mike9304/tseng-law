import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { uploadBuilderImageAsset } from '@/lib/builder/assets';
import { validateImageBytes } from '@/lib/builder/canvas/upload-validation';
import { recordAssetUpload } from '@/lib/builder/audit/record';
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

type OpenAiImageGenerationPayload = {
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
  const response = await fetch('https://api.openai.com/v1/images/generations', {
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
  });

  const payload = (await response.json().catch(() => ({}))) as OpenAiImageGenerationPayload;
  if (!response.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: payload.error?.code ?? payload.error?.type ?? 'openai_image_generation_failed',
        message: payload.error?.message ?? 'Image 2.0 generation failed.',
      },
      { status: response.status },
    );
  }

  const imageBase64 = payload.data?.[0]?.b64_json;
  if (!imageBase64) {
    return NextResponse.json(
      { ok: false, error: 'missing_image_payload', message: 'Image 2.0 did not return image data.' },
      { status: 502 },
    );
  }

  const content = Buffer.from(imageBase64, 'base64');
  const contentType = CONTENT_TYPE_BY_FORMAT[input.outputFormat];
  const file = new File([content], filenameForGeneratedAsset(input.outputFormat), { type: contentType });
  const byteCheck = await validateImageBytes(file);
  if (!byteCheck.valid) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_generated_image',
        message: byteCheck.error ?? 'Generated image bytes could not be validated.',
        sniffed: byteCheck.sniffed,
      },
      { status: 502 },
    );
  }

  const locale = normalizeBuilderHomeLocale(input.locale);
  const asset = await uploadBuilderImageAsset({ locale, file });
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
    asset,
  });
}
