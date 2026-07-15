import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { recordAssetUpload } from '@/lib/builder/audit/record';
import { readBuilderImageAsset, uploadBuilderImageAsset } from '@/lib/builder/assets';
import * as imageBinaryValidation from '@/lib/builder/ai-generator/image-binary-validation';
import {
  createJpegFixture,
  createPngFixture,
  createWebpFixture,
  imageBytesToBase64,
} from '@/lib/builder/ai-generator/__tests__/image-fixtures';
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

vi.mock('@/lib/builder/audit/record', () => ({
  recordAssetUpload: vi.fn(async () => undefined),
}));

const SOURCE_WIDTH = 640;
const SOURCE_HEIGHT = 360;
const OUTPUT_WIDTH = 1536;
const OUTPUT_HEIGHT = 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_BASE64_LENGTH = Math.ceil(MAX_IMAGE_BYTES / 3) * 4;
const sourcePngBytes = createPngFixture({
  width: SOURCE_WIDTH,
  height: SOURCE_HEIGHT,
  colorType: 6,
});
const alphaMaskBytes = createPngFixture({
  width: SOURCE_WIDTH,
  height: SOURCE_HEIGHT,
  colorType: 6,
  transparent: true,
});
const providerWebpBytes = createWebpFixture({
  width: OUTPUT_WIDTH,
  height: OUTPUT_HEIGHT,
  format: 'vp8x',
});
const providerWebpBase64 = imageBytesToBase64(providerWebpBytes);
const alphaMaskBase64 = imageBytesToBase64(alphaMaskBytes);
const originalApiKey = process.env.OPENAI_API_KEY;
type UploadedAsset = Awaited<ReturnType<typeof uploadBuilderImageAsset>>;

const VALID_PROMPT = 'Make this law office hero image brighter, editorial, and suitable for a premium legal website.';

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/image/edit', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

function uploadedAsset(overrides: Partial<UploadedAsset> = {}): UploadedAsset {
  return {
    backend: 'file' as const,
    locale: 'ko',
    pathname: 'builder/assets/ko/ai-image-2-edit.webp',
    url: '/api/builder/assets/ko/ai-image-2-edit.webp',
    filename: 'ai-image-2-edit.webp',
    contentType: 'image/webp',
    size: providerWebpBytes.byteLength,
    uploadedAt: '2026-05-21T00:00:00.000Z',
    ...overrides,
  };
}

function expectNoUploadOrAudit() {
  expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
  expect(recordAssetUpload).not.toHaveBeenCalled();
}

describe('/api/builder/ai-generator/image/edit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    process.env.OPENAI_API_KEY = 'test-openai-key';
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      data: [{ b64_json: providerWebpBase64, revised_prompt: 'edited prompt' }],
    })));
    vi.mocked(readBuilderImageAsset).mockResolvedValue({
      backend: 'file',
      content: Buffer.from(sourcePngBytes),
      contentType: 'image/png',
    });
    vi.mocked(uploadBuilderImageAsset).mockResolvedValue(uploadedAsset());
    vi.mocked(recordAssetUpload).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
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
      prompt: VALID_PROMPT,
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
    expect(payload).toEqual({
      ok: true,
      provider: 'openai',
      model: 'gpt-image-2',
      stub: false,
      operation: 'edit',
      prompt: expect.stringContaining('No readable text'),
      revisedPrompt: 'edited prompt',
      source: {
        locale: 'ko',
        filename: 'source.png',
        url: '/api/builder/assets/ko/source.png',
        dimensions: { width: SOURCE_WIDTH, height: SOURCE_HEIGHT },
        format: 'png',
        mime: 'image/png',
      },
      dimensions: { width: OUTPUT_WIDTH, height: OUTPUT_HEIGHT },
      format: 'webp',
      mime: 'image/webp',
      asset: uploadedAsset(),
      auditState: 'attempted',
    });
    expect(guardMutation).toHaveBeenCalledWith(expect.any(NextRequest), { bucket: 'asset', permission: 'edit-pages' });
    expect(readBuilderImageAsset).toHaveBeenCalledWith({ locale: 'ko', assetPath: ['source.png'] });
    expect(fetchCall?.[0]).toBe('https://api.openai.com/v1/images/edits');
    expect(fetchCall?.[1]?.signal).toBeInstanceOf(AbortSignal);
    expect(body.get('model')).toBe('gpt-image-2');
    expect(body.get('size')).toBe('1536x1024');
    expect(body.get('quality')).toBe('medium');
    expect(body.get('output_format')).toBe('webp');
    expect(body.get('output_compression')).toBe('78');
    expect(String(body.get('prompt'))).toContain('No readable text');
    expect(sourceFile).toBeInstanceOf(File);
    expect((sourceFile as File).name).toBe('source.png');
    expect(Buffer.from(await (sourceFile as File).arrayBuffer())).toEqual(Buffer.from(sourcePngBytes));
    expect(uploadedFile).toBeInstanceOf(File);
    expect(uploadedFile?.type).toBe('image/webp');
    expect(Buffer.from(await uploadedFile!.arrayBuffer())).toEqual(Buffer.from(providerWebpBytes));
    expect(recordAssetUpload).toHaveBeenCalledWith(expect.objectContaining({
      assetId: 'ai-image-2-edit.webp',
      mime: 'image/webp',
      size: providerWebpBytes.byteLength,
    }));
    expect(payload.auditState).toBe('attempted');
    expect(payload).not.toHaveProperty('auditRecorded');
    expect(payload).not.toHaveProperty('auditConfirmed');
    expect(payload).not.toHaveProperty('auditCompleted');
  });

  it('passes a PNG alpha mask to the Image 2.0 edit request when provided', async () => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: 'Only update the highlighted area with a brighter polished office detail.',
      mask: {
        dataUrl: `data:image/png;base64,${alphaMaskBase64}`,
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
    expect(Buffer.from(await (maskFile as File).arrayBuffer())).toEqual(Buffer.from(alphaMaskBytes));
    expect(body.get('mask_description')).toBe('Center rectangle');
  });

  it('clears the provider deadline before output inspection, upload, and audit', async () => {
    vi.useFakeTimers();
    const inspectSpy = vi.spyOn(imageBinaryValidation, 'inspectImageBinary');
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    vi.mocked(uploadBuilderImageAsset).mockImplementation(async () => {
      expect(vi.getTimerCount()).toBe(0);
      return uploadedAsset();
    });
    vi.mocked(recordAssetUpload).mockImplementation(async () => {
      expect(vi.getTimerCount()).toBe(0);
    });

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
      size: '1536x1024',
      outputFormat: 'webp',
    }));

    expect(response.status).toBe(200);
    expect(inspectSpy).toHaveBeenCalledTimes(2);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(clearTimeoutSpy.mock.invocationCallOrder[0]).toBeLessThan(inspectSpy.mock.invocationCallOrder[1]);
    expect(uploadBuilderImageAsset).toHaveBeenCalledTimes(1);
    expect(recordAssetUpload).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('accepts actual provider dimensions within caps when the requested size is auto', async () => {
    const autoBytes = createWebpFixture({ width: 777, height: 333, format: 'vp8x', alpha: true });
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      data: [{ b64_json: imageBytesToBase64(autoBytes), revised_prompt: 'auto edit' }],
    })));
    vi.mocked(uploadBuilderImageAsset).mockResolvedValue(uploadedAsset({ size: autoBytes.byteLength }));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
      size: 'auto',
      outputFormat: 'webp',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.dimensions).toEqual({ width: 777, height: 333 });
    expect(payload.format).toBe('webp');
    expect(payload.mime).toBe('image/webp');
  });

  it.each([
    ['extra padding', `data:image/png;base64,${alphaMaskBase64}=`],
    ['duplicate extra padding', `data:image/png;base64,${alphaMaskBase64}==`],
    [
      'genuine interior padding followed by more base64 data',
      `data:image/png;base64,${alphaMaskBase64.slice(0, 16)}=${alphaMaskBase64.slice(16)}`,
    ],
    ['noncanonical pad bits', `data:image/png;base64,${alphaMaskBase64.slice(0, -4)}gh==`],
    ['invalid alphabet', `data:image/png;base64,${alphaMaskBase64}%`],
    ['wrong MIME prefix', `data:image/jpeg;base64,${alphaMaskBase64}`],
    ['leading whitespace', ` data:image/png;base64,${alphaMaskBase64}`],
    ['trailing whitespace', `data:image/png;base64,${alphaMaskBase64}\n`],
  ])('rejects a mask with %s as invalid_mask_image before any provider call', async (_label, dataUrl) => {
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: 'Only update the highlighted area with a brighter polished office detail.',
      mask: { dataUrl },
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'invalid_mask_image',
      message: 'Mask must be a PNG data URL with an alpha channel.',
    });
    expect(text).not.toContain('data:image');
    expect(readBuilderImageAsset).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    expectNoUploadOrAudit();
  });

  it.each([
    [
      'a complete PNG with no alpha channel',
      createPngFixture({ width: SOURCE_WIDTH, height: SOURCE_HEIGHT, colorType: 2 }),
    ],
    ['a truncated alpha PNG', alphaMaskBytes.slice(0, -12)],
    [
      'an alpha PNG with dimensions different from the source',
      createPngFixture({ width: SOURCE_WIDTH + 1, height: SOURCE_HEIGHT, colorType: 6, transparent: true }),
    ],
  ])('rejects %s as invalid_mask_image before any provider call', async (_label, maskBytes) => {
    const dataUrl = `data:image/png;base64,${imageBytesToBase64(maskBytes)}`;
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: 'Only update the highlighted area with a brighter polished office detail.',
      mask: { dataUrl },
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'invalid_mask_image',
      message: 'Mask must be a PNG data URL with an alpha channel.',
    });
    expect(text).not.toContain('data:image');
    expect(readBuilderImageAsset).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
    expectNoUploadOrAudit();
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
    expectNoUploadOrAudit();
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
    expectNoUploadOrAudit();
  });

  it.each([
    [
      'MIME-spoofed JPEG bytes declared as PNG',
      Buffer.from(createJpegFixture({ width: SOURCE_WIDTH, height: SOURCE_HEIGHT })),
    ],
    ['a truncated PNG', Buffer.from(sourcePngBytes.slice(0, -12))],
    [
      'a complete PNG with trailing polyglot bytes',
      Buffer.concat([Buffer.from(sourcePngBytes), Buffer.from('<script>polyglot</script>')]),
    ],
    ['a source over the raw byte cap', Buffer.alloc(MAX_IMAGE_BYTES + 1)],
    [
      'a source over the pixel cap',
      Buffer.from(createPngFixture({ width: 4097, height: 4097, colorType: 0, bitDepth: 8 })),
    ],
  ])('rejects %s before constructing provider FormData or causing side effects', async (_label, content) => {
    vi.mocked(readBuilderImageAsset).mockResolvedValue({
      backend: 'file',
      content,
      contentType: 'image/png',
    });

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetId: 'source.png',
      prompt: VALID_PROMPT,
    }));
    const payload = await response.json();

    expect(response.status).toBe(415);
    expect(payload).toEqual({
      ok: false,
      error: 'invalid_source_image',
      message: 'Source image bytes could not be validated.',
    });
    expect(fetch).not.toHaveBeenCalled();
    expectNoUploadOrAudit();
  });

  it('returns a setup error when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error).toBe('missing_openai_api_key');
    expect(readBuilderImageAsset).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expectNoUploadOrAudit();
  });

  it('normalizes a non-2xx provider response to a stable 502 and never relays provider details', async () => {
    const secretMarker = 'sk-edit-provider-leaked-1a2b';
    const promptMarker = 'EDIT-SUBMITTED-PROMPT-3c4d';
    const providerCode = 'edit_provider_code_5e6f';
    const providerType = 'edit_provider_type_7g8h';
    const providerMessage = 'edit provider internal message 9i0j';
    const statusTextMarker = 'EditInternalErrorStackTrace';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      error: {
        message: `${providerMessage} ${secretMarker} ${promptMarker}`,
        type: providerType,
        code: providerCode,
      },
    }), { status: 500, statusText: statusTextMarker, headers: { 'Content-Type': 'application/json' } })));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: `${promptMarker} padded to exceed the twenty character minimum length requirement`,
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'openai_image_edit_provider_error', message: 'Image edit provider returned an error.' });
    expect(payload).not.toHaveProperty('asset');
    expect(payload).not.toHaveProperty('model');
    expect(payload).not.toHaveProperty('prompt');
    expect(payload).not.toHaveProperty('revisedPrompt');
    expect(payload).not.toHaveProperty('source');
    expect(text).not.toContain(secretMarker);
    expect(text).not.toContain(promptMarker);
    expect(text).not.toContain(providerCode);
    expect(text).not.toContain(providerType);
    expect(text).not.toContain(providerMessage);
    expect(text).not.toContain(statusTextMarker);
    expect(text).not.toContain('sk-edit-provider-leaked');
    expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
    expect(recordAssetUpload).not.toHaveBeenCalled();
  });

  it('returns a sanitized 502 when the provider fetch rejects with a network error containing markers', async () => {
    const secretMarker = 'sk-edit-network-leaked-11aa';
    const promptMarker = 'EDIT-NETWORK-PROMPT-22bb';
    const stackMarker = 'editStackTraceSecret33cc';
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError(`edit fetch failed using ${secretMarker} while sending ${promptMarker}; cause=${stackMarker}`);
    }));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: `${promptMarker} padded to exceed the twenty character minimum length requirement`,
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'openai_image_edit_network_error', message: 'Image edit request failed.' });
    expect(payload).not.toHaveProperty('asset');
    expect(payload).not.toHaveProperty('source');
    expect(payload).not.toHaveProperty('prompt');
    expect(text).not.toContain(secretMarker);
    expect(text).not.toContain(promptMarker);
    expect(text).not.toContain(stackMarker);
    expect(text).not.toContain('sk-edit-network-leaked');
    expect(text).not.toContain('TypeError');
    expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
    expect(recordAssetUpload).not.toHaveBeenCalled();
  });

  it('returns a stable 504 when the OpenAI edit fetch aborts after the timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async (_url, init) => {
      const signal = (init as RequestInit | undefined)?.signal;
      if (!signal) {
        throw new Error('missing signal');
      }
      return new Promise<Response>((_resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(new DOMException('The user aborted a request.', 'AbortError'));
        });
      });
    }));

    const { POST } = await import('../route');
    const responsePromise = POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    await vi.advanceTimersByTimeAsync(20_000);
    const response = await responsePromise;
    const text = await response.text();
    const payload = JSON.parse(text);
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const signal = (fetchCall?.[1] as RequestInit | undefined)?.signal;

    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal?.aborted).toBe(true);
    expect(response.status).toBe(504);
    expect(payload).toEqual({ ok: false, error: 'openai_image_edit_timeout', message: 'Image edit timed out.' });
    expect(payload).not.toHaveProperty('asset');
    expect(payload).not.toHaveProperty('source');
    expectNoUploadOrAudit();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('returns a stable 504 when fetch itself resolves with a valid response on abort', async () => {
    vi.useFakeTimers();
    const inspectSpy = vi.spyOn(imageBinaryValidation, 'inspectImageBinary');
    vi.stubGlobal('fetch', vi.fn(async (_url, init) => {
      const signal = (init as RequestInit | undefined)?.signal;
      if (!signal) {
        throw new Error('missing signal');
      }
      return new Promise<Response>((resolve) => {
        signal.addEventListener('abort', () => {
          resolve(jsonResponse({
            data: [{ b64_json: providerWebpBase64, revised_prompt: 'must not escape timeout' }],
          }));
        });
      });
    }));

    const { POST } = await import('../route');
    const responsePromise = POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    await vi.advanceTimersByTimeAsync(20_000);
    const response = await responsePromise;
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(504);
    expect(payload).toEqual({ ok: false, error: 'openai_image_edit_timeout', message: 'Image edit timed out.' });
    expect(text).not.toContain(providerWebpBase64);
    expect(text).not.toContain('must not escape timeout');
    expect(inspectSpy).toHaveBeenCalledTimes(1);
    expectNoUploadOrAudit();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('returns a stable 502 when the provider returns a non-JSON success body', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>not json</html>', { status: 200, headers: { 'Content-Type': 'text/html' } })));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_openai_image_edit_response', message: 'Image edit returned a malformed response.' });
    expect(text).not.toContain('<html>');
    expectNoUploadOrAudit();
  });

  it.each([
    ['an empty data array', { data: [] }],
    ['a missing b64_json field', { data: [{ revised_prompt: 'x' }] }],
    ['a blank b64_json field', { data: [{ b64_json: '', revised_prompt: 'x' }] }],
    ['a non-string b64_json field', { data: [{ b64_json: 123 }] }],
    ['a missing data field', { other: true }],
  ])('returns a stable 502 when the provider edit success body has %s', async (_label, body) => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(body)));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_openai_image_edit_response', message: 'Image edit returned a malformed response.' });
    expect(payload).not.toHaveProperty('asset');
    expectNoUploadOrAudit();
  });

  it.each([
    [
      'whose complete format contradicts outputFormat',
      createPngFixture({ width: OUTPUT_WIDTH, height: OUTPUT_HEIGHT, colorType: 2 }),
    ],
    [
      'whose actual dimensions contradict the explicit requested size',
      createWebpFixture({ width: 1024, height: 1024, format: 'vp8x' }),
    ],
    ['that are truncated', providerWebpBytes.slice(0, -4)],
    [
      'that contain trailing polyglot data after a complete image',
      Buffer.concat([Buffer.from(providerWebpBytes), Buffer.from('<script>output-polyglot</script>')]),
    ],
  ])('rejects actual provider bytes %s', async (_label, providerBytes) => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      data: [{ b64_json: imageBytesToBase64(providerBytes), revised_prompt: 'edited prompt' }],
    })));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_edited_image', message: 'Edited image bytes could not be validated.' });
    expect(text).not.toContain(imageBytesToBase64(providerBytes));
    expectNoUploadOrAudit();
  });

  it('rejects an oversized canonical provider base64 field before decoding or output inspection', async () => {
    const oversizedBase64 = 'A'.repeat(MAX_IMAGE_BASE64_LENGTH + 4);
    const inspectSpy = vi.spyOn(imageBinaryValidation, 'inspectImageBinary');
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: [{ b64_json: oversizedBase64, revised_prompt: 'oversized' }] }),
    } as Response)));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_openai_image_edit_response', message: 'Image edit returned a malformed response.' });
    expect(inspectSpy).toHaveBeenCalledTimes(1);
    expectNoUploadOrAudit();
  });

  it('returns a stable 504 when the provider returns 200 headers but the response body hangs past the timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async (_url, init) => {
      const signal = (init as RequestInit | undefined)?.signal;
      if (!signal) {
        throw new Error('missing signal');
      }
      return {
        ok: true,
        status: 200,
        json: () => new Promise<unknown>((_resolve, reject) => {
          signal.addEventListener('abort', () => {
            reject(new DOMException('The user aborted a request.', 'AbortError'));
          });
        }),
      } as Response;
    }));

    const { POST } = await import('../route');
    const responsePromise = POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    await vi.advanceTimersByTimeAsync(20_000);
    const response = await responsePromise;
    const text = await response.text();
    const payload = JSON.parse(text);
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const signal = (fetchCall?.[1] as RequestInit | undefined)?.signal;

    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal?.aborted).toBe(true);
    expect(response.status).toBe(504);
    expect(payload).toEqual({ ok: false, error: 'openai_image_edit_timeout', message: 'Image edit timed out.' });
    expect(text).not.toContain('AbortError');
    expect(text).not.toContain('sk-');
    expectNoUploadOrAudit();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([
    ['a whitespace-only b64_json field', { data: [{ b64_json: '   ', revised_prompt: 'x' }] }],
    ['a stray-character b64_json field', { data: [{ b64_json: '%%%', revised_prompt: 'x' }] }],
    ['a valid base64 with trailing stray characters', { data: [{ b64_json: `${providerWebpBase64}%%%`, revised_prompt: 'x' }] }],
    ['a noncanonical-pad base64 field (AB==)', { data: [{ b64_json: 'AB==', revised_prompt: 'x' }] }],
  ])('returns a stable 502 when the provider edit success body has %s and skips upload/audit', async (_label, body) => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(body)));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_openai_image_edit_response', message: 'Image edit returned a malformed response.' });
    expect(payload).not.toHaveProperty('asset');
    expectNoUploadOrAudit();
  });

  it('returns a stable 400 for malformed request JSON and never relays parser details', async () => {
    const parserMarker = 'EDIT-JSON-PARSER-SENTINEL-aa91';
    const request = new NextRequest('https://law.example.test/api/builder/ai-generator/image/edit', {
      method: 'POST',
      body: `{ "prompt": "${parserMarker}",, invalid json }`,
      headers: { 'Content-Type': 'application/json' },
    });

    const { POST } = await import('../route');
    const response = await POST(request);
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(400);
    expect(payload.error).toBe('invalid_image_edit_request');
    expect(text).not.toContain(parserMarker);
    expect(readBuilderImageAsset).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expectNoUploadOrAudit();
  });

  it('sanitizes the invalid-image 502 when provider bytes are not an image', async () => {
    const notImageBase64 = Buffer.from('definitely-not-an-image').toString('base64');
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      data: [{ b64_json: notImageBase64, revised_prompt: 'edited prompt' }],
    })));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_edited_image', message: 'Edited image bytes could not be validated.' });
    expect(text).not.toContain('definitely-not-an-image');
    expectNoUploadOrAudit();
  });

  it('sanitizes upload rejection into a stable 502 with uploadState unknown and no leaked details', async () => {
    const secretMarker = 'sk-edit-upload-leaked-key-ee11';
    const promptMarker = 'EDIT-UPLOAD-PROMPT-MARKER-ff22';
    const pathMarker = '/secret/edit/upload/path/stack-marker-33dd';
    const stackMarker = 'editUploadStackTraceSecret44ee';
    vi.mocked(uploadBuilderImageAsset).mockRejectedValueOnce(new Error(`${secretMarker} ${promptMarker} ${pathMarker} ${stackMarker}`));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'edited_image_asset_upload_failed',
      message: 'Edited image asset storage could not be confirmed.',
      uploadState: 'unknown',
    });
    expect(text).not.toContain(secretMarker);
    expect(text).not.toContain(promptMarker);
    expect(text).not.toContain(pathMarker);
    expect(text).not.toContain(stackMarker);
    expect(payload).not.toHaveProperty('asset');
    expect(uploadBuilderImageAsset).toHaveBeenCalledTimes(1);
    expect(recordAssetUpload).not.toHaveBeenCalled();
  });

  const contradictoryAssetMetadataCases: Array<[string, Partial<UploadedAsset>]> = [
    ['content type', { contentType: 'image/png' }],
    ['byte size', { size: providerWebpBytes.byteLength + 1 }],
    ['locale', { locale: 'en' }],
    ['backend', { backend: 'disk' as UploadedAsset['backend'] }],
    ['unsafe filename', {
      filename: '../ai-image-2-edit.webp',
      pathname: 'builder/assets/ko/../ai-image-2-edit.webp',
      url: '/api/builder/assets/ko/../ai-image-2-edit.webp',
    }],
    ['filename extension', {
      filename: 'ai-image-2-edit.png',
      pathname: 'builder/assets/ko/ai-image-2-edit.png',
      url: '/api/builder/assets/ko/ai-image-2-edit.png',
    }],
    ['pathname', { pathname: 'builder/assets/en/ai-image-2-edit.webp' }],
    ['URL', { url: '/api/builder/assets/en/ai-image-2-edit.webp' }],
    ['upload timestamp', { uploadedAt: 'not-a-timestamp' }],
  ];

  it.each(contradictoryAssetMetadataCases)('fails closed when storage returns contradictory edited-image %s metadata', async (_label, overrides) => {
    vi.mocked(uploadBuilderImageAsset).mockResolvedValue(uploadedAsset(overrides));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'edited_image_asset_upload_failed',
      message: 'Edited image asset storage could not be confirmed.',
      uploadState: 'unknown',
    });
    expect(uploadBuilderImageAsset).toHaveBeenCalledTimes(1);
    expect(payload).not.toHaveProperty('asset');
    expect(recordAssetUpload).not.toHaveBeenCalled();
  });

  it('treats audit recording as best-effort: audit rejection still returns a normal 200 attempted response', async () => {
    const secretMarker = 'sk-edit-audit-leaked-key-55gg';
    const promptMarker = 'EDIT-AUDIT-PROMPT-MARKER-66hh';
    const pathMarker = '/secret/edit/audit/path/stack-marker-77ii';
    const stackMarker = 'editAuditStackTraceSecret88jj';
    vi.mocked(recordAssetUpload).mockRejectedValueOnce(new Error(`${secretMarker} ${promptMarker} ${pathMarker} ${stackMarker}`));

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.asset).toEqual(uploadedAsset());
    expect(payload.auditState).toBe('attempted');
    expect(payload).not.toHaveProperty('auditRecorded');
    expect(payload).not.toHaveProperty('auditConfirmed');
    expect(payload).not.toHaveProperty('auditCompleted');
    expect(text).not.toContain(secretMarker);
    expect(text).not.toContain(promptMarker);
    expect(text).not.toContain(pathMarker);
    expect(text).not.toContain(stackMarker);
    expect(uploadBuilderImageAsset).toHaveBeenCalledTimes(1);
    expect(recordAssetUpload).toHaveBeenCalledTimes(1);
  });

  it('sanitizes an image inspector exception into the fixed 502 without leaking thrown details', async () => {
    const secretMarker = 'sk-edit-validate-throw-key-12ab';
    const pathMarker = '/secret/edit/validate/path/stack-marker-34cd';
    const stackMarker = 'editValidateThrowStackTrace56ef';
    const realInspect = imageBinaryValidation.inspectImageBinary;
    vi.spyOn(imageBinaryValidation, 'inspectImageBinary').mockImplementation((bytes, options) => {
      if (options?.declaredMime === 'image/webp') {
        throw new Error(`boom ${secretMarker} ${pathMarker} ${stackMarker}`);
      }
      return realInspect(bytes, options);
    });

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_edited_image', message: 'Edited image bytes could not be validated.' });
    expect(text).not.toContain(secretMarker);
    expect(text).not.toContain(pathMarker);
    expect(text).not.toContain(stackMarker);
    expect(text).not.toContain('boom');
    expectNoUploadOrAudit();
  });

  it('lets a canonical minimal base64 (AA==) proceed to byte validation where it fails as a non-image', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      data: [{ b64_json: 'AA==', revised_prompt: 'edited prompt' }],
    })));
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_edited_image', message: 'Edited image bytes could not be validated.' });
    expectNoUploadOrAudit();
  });

  it('returns a stable 504 when the deadline wins even if response.json resolves valid data on abort', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async (_url, init) => {
      const signal = (init as RequestInit | undefined)?.signal;
      if (!signal) {
        throw new Error('missing signal');
      }
      return {
        ok: true,
        status: 200,
        json: () => new Promise<unknown>((resolve) => {
          signal.addEventListener('abort', () => {
            resolve({ data: [{ b64_json: providerWebpBase64, revised_prompt: 'edited prompt' }] });
          });
        }),
      } as Response;
    }));

    const { POST } = await import('../route');
    const responsePromise = POST(postRequest({
      locale: 'ko',
      assetUrl: '/api/builder/assets/ko/source.png',
      prompt: VALID_PROMPT,
    }));
    await vi.advanceTimersByTimeAsync(20_000);
    const response = await responsePromise;
    const text = await response.text();
    const payload = JSON.parse(text);
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const signal = (fetchCall?.[1] as RequestInit | undefined)?.signal;

    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal?.aborted).toBe(true);
    expect(response.status).toBe(504);
    expect(payload).toEqual({ ok: false, error: 'openai_image_edit_timeout', message: 'Image edit timed out.' });
    expect(text).not.toContain(providerWebpBase64);
    expect(text).not.toContain('edited prompt');
    expectNoUploadOrAudit();
    expect(vi.getTimerCount()).toBe(0);
  });
});
