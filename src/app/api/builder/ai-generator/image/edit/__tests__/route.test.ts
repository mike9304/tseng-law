import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { recordAssetUpload } from '@/lib/builder/audit/record';
import { readBuilderImageAsset, uploadBuilderImageAsset } from '@/lib/builder/assets';
import { validateImageBytes } from '@/lib/builder/canvas/upload-validation';
import { guardMutation } from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

vi.mock('@/lib/builder/assets', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/assets')>('@/lib/builder/assets');
  return {
    ...actual,
    readBuilderImageAsset: vi.fn(),
    uploadBuilderImageAsset: vi.fn(),
  };
});

vi.mock('@/lib/builder/canvas/upload-validation', () => ({
  validateImageBytes: vi.fn(async () => ({ valid: true, sniffed: 'webp' })),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordAssetUpload: vi.fn(async () => undefined),
}));

const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';
const rgbaMaskBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lA0F4wAAAABJRU5ErkJggg==';
const originalApiKey = process.env.OPENAI_API_KEY;

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/image/edit', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('/api/builder/ai-generator/image/edit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-openai-key';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      data: [{ b64_json: pngBase64, revised_prompt: 'edited prompt' }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })));
    vi.mocked(readBuilderImageAsset).mockResolvedValue({
      backend: 'file',
      content: Buffer.from('source-image'),
      contentType: 'image/png',
    });
    vi.mocked(uploadBuilderImageAsset).mockResolvedValue({
      backend: 'file',
      locale: 'ko',
      pathname: 'builder/assets/ko/ai-image-2-edit.webp',
      url: '/api/builder/assets/ko/ai-image-2-edit.webp',
      filename: 'ai-image-2-edit.webp',
      contentType: 'image/webp',
      size: 92,
      uploadedAt: '2026-05-21T00:00:00.000Z',
    });
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalApiKey;
    }
    vi.unstubAllGlobals();
  });

  it('edits an existing builder image with Image 2.0 and stores the result as a new asset', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: 'Make this law office hero image brighter, editorial, and suitable for a premium legal website.',
      size: '1536x1024',
      quality: 'medium',
      outputFormat: 'webp',
      outputCompression: 78,
    }));
    const payload = await response.json();
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const body = fetchCall?.[1]?.body as FormData;
    const sourceFile = body.get('image');
    const uploadedFile = vi.mocked(uploadBuilderImageAsset).mock.calls[0]?.[0]?.file;

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.model).toBe('gpt-image-2');
    expect(payload.source.filename).toBe('source.png');
    expect(guardMutation).toHaveBeenCalledWith(expect.any(NextRequest), { bucket: 'asset', permission: 'edit-pages' });
    expect(readBuilderImageAsset).toHaveBeenCalledWith({ locale: 'ko', assetPath: ['source.png'] });
    expect(fetchCall?.[0]).toBe('https://api.openai.com/v1/images/edits');
    expect(body.get('model')).toBe('gpt-image-2');
    expect(body.get('size')).toBe('1536x1024');
    expect(body.get('quality')).toBe('medium');
    expect(body.get('output_format')).toBe('webp');
    expect(body.get('output_compression')).toBe('78');
    expect(String(body.get('prompt'))).toContain('No readable text');
    expect(sourceFile).toBeInstanceOf(File);
    expect((sourceFile as File).name).toBe('source.png');
    expect(uploadedFile).toBeInstanceOf(File);
    expect(uploadedFile?.type).toBe('image/webp');
    expect(validateImageBytes).toHaveBeenCalledWith(uploadedFile);
    expect(recordAssetUpload).toHaveBeenCalledWith(expect.objectContaining({
      assetId: 'ai-image-2-edit.webp',
      mime: 'image/webp',
      size: 92,
    }));
  });

  it('passes a PNG alpha mask to the Image 2.0 edit request when provided', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: 'Only update the highlighted area with a brighter polished office detail.',
      mask: {
        dataUrl: `data:image/png;base64,${rgbaMaskBase64}`,
        description: 'Center rectangle',
      },
      outputFormat: 'webp',
    }));
    const body = vi.mocked(fetch).mock.calls[0]?.[1]?.body as FormData;
    const maskFile = body.get('mask');

    expect(response.status).toBe(200);
    expect(maskFile).toBeInstanceOf(File);
    expect((maskFile as File).name).toBe('ai-image-2-mask.png');
    expect((maskFile as File).type).toBe('image/png');
    expect(body.get('mask_description')).toBe('Center rectangle');
  });

  it('returns not found when the source asset cannot be read', async () => {
    vi.mocked(readBuilderImageAsset).mockResolvedValue(null);
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetId: 'missing.png',
      prompt: 'Make this image suitable for a polished website hero section.',
    }));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toBe('source_asset_not_found');
    expect(fetch).not.toHaveBeenCalled();
    expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
  });

  it('rejects unsupported source image formats before calling OpenAI', async () => {
    vi.mocked(readBuilderImageAsset).mockResolvedValue({
      backend: 'file',
      content: Buffer.from('<svg />'),
      contentType: 'image/svg+xml',
    });
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetId: 'source.svg',
      prompt: 'Make this image suitable for a polished website hero section.',
    }));
    const payload = await response.json();

    expect(response.status).toBe(415);
    expect(payload.error).toBe('unsupported_source_image_type');
    expect(fetch).not.toHaveBeenCalled();
    expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
  });
});
