import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { uploadBuilderImageAsset } from '@/lib/builder/assets';
import { validateImageBytes } from '@/lib/builder/canvas/upload-validation';
import { recordAssetUpload } from '@/lib/builder/audit/record';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

vi.mock('@/lib/builder/assets', () => ({
  uploadBuilderImageAsset: vi.fn(),
}));

vi.mock('@/lib/builder/canvas/upload-validation', () => ({
  validateImageBytes: vi.fn(async () => ({ valid: true, sniffed: 'png' })),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordAssetUpload: vi.fn(async () => undefined),
}));

const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';
const originalApiKey = process.env.OPENAI_API_KEY;

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/image', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('/api/builder/ai-generator/image', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-openai-key';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      data: [{ b64_json: pngBase64, revised_prompt: 'revised prompt' }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })));
    vi.mocked(uploadBuilderImageAsset).mockResolvedValue({
      backend: 'file',
      locale: 'ko',
      pathname: 'builder/assets/ko/ai-image-2-hero.png',
      url: '/api/builder/assets/ko/ai-image-2-hero.png',
      filename: 'ai-image-2-hero.png',
      contentType: 'image/png',
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

  it('generates an Image 2.0 hero image and stores it as a builder asset', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      prompt: 'Create a polished law firm hero image for a Taiwan legal advisory website.',
      size: '1536x1024',
      quality: 'medium',
      outputFormat: 'png',
    }));
    const payload = await response.json();
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(String(fetchCall?.[1]?.body ?? '{}')) as Record<string, unknown>;
    const uploadedFile = vi.mocked(uploadBuilderImageAsset).mock.calls[0]?.[0]?.file;

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.model).toBe('gpt-image-2');
    expect(payload.asset.filename).toBe('ai-image-2-hero.png');
    expect(guardMutation).toHaveBeenCalledWith(expect.any(NextRequest), { bucket: 'asset', permission: 'edit-pages' });
    expect(fetchCall?.[0]).toBe('https://api.openai.com/v1/images/generations');
    expect(body).toMatchObject({
      model: 'gpt-image-2',
      size: '1536x1024',
      quality: 'medium',
      output_format: 'png',
    });
    expect(String(body.prompt)).toContain('No readable text');
    expect(uploadedFile).toBeInstanceOf(File);
    expect(uploadedFile?.type).toBe('image/png');
    expect(validateImageBytes).toHaveBeenCalledWith(uploadedFile);
    expect(recordAssetUpload).toHaveBeenCalledWith(expect.objectContaining({
      assetId: 'ai-image-2-hero.png',
      mime: 'image/png',
      size: 92,
    }));
  });

  it('returns a setup error when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      prompt: 'Create a polished law firm hero image for a Taiwan legal advisory website.',
    }));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error).toBe('missing_openai_api_key');
    expect(fetch).not.toHaveBeenCalled();
    expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
  });

  it('rejects short image prompts before calling OpenAI', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      prompt: 'short',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('invalid_image_generation_request');
    expect(fetch).not.toHaveBeenCalled();
  });
});
