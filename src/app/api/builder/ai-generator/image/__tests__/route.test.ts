import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createJpegFixture,
  createPngFixture,
  createWebpFixture,
  imageBytesToBase64,
} from '@/lib/builder/ai-generator/__tests__/image-fixtures';
import * as imageBinaryValidation from '@/lib/builder/ai-generator/image-binary-validation';
import { guardMutation } from '@/lib/builder/security/guard';
import { uploadBuilderImageAsset } from '@/lib/builder/assets';
import { recordAssetUpload } from '@/lib/builder/audit/record';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

vi.mock('@/lib/builder/assets', () => ({
  uploadBuilderImageAsset: vi.fn(),
}));

vi.mock('@/lib/builder/audit/record', () => ({
  recordAssetUpload: vi.fn(async () => undefined),
}));

const defaultWebpBytes = createWebpFixture({ width: 1536, height: 1024 });
const defaultWebpBase64 = imageBytesToBase64(defaultWebpBytes);
const originalApiKey = process.env.OPENAI_API_KEY;

const VALID_PROMPT = 'Create a polished law firm hero image for a Taiwan legal advisory website.';

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/image', {
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

function providerImageResponse(bytes: Uint8Array, revisedPrompt = 'revised prompt'): Response {
  return jsonResponse({
    data: [{ b64_json: imageBytesToBase64(bytes), revised_prompt: revisedPrompt }],
  });
}

type OutputFormat = 'png' | 'jpeg' | 'webp';

const MIME_BY_FORMAT: Record<OutputFormat, 'image/png' | 'image/jpeg' | 'image/webp'> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

function uploadedAssetFor(
  format: OutputFormat,
  bytes: Uint8Array,
  backend: 'file' | 'blob' = 'file',
) {
  const extension = format === 'jpeg' ? 'jpg' : format;
  return {
    backend,
    locale: 'ko' as const,
    pathname: `builder/assets/ko/ai-image-2-hero.${extension}`,
    url: `/api/builder/assets/ko/ai-image-2-hero.${extension}`,
    filename: `ai-image-2-hero.${extension}`,
    contentType: MIME_BY_FORMAT[format],
    size: bytes.byteLength,
    uploadedAt: '2026-05-21T00:00:00.000Z',
  };
}

function expectNoStoredSideEffects(): void {
  expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
  expect(recordAssetUpload).not.toHaveBeenCalled();
}

describe('/api/builder/ai-generator/image', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    process.env.OPENAI_API_KEY = 'test-openai-key';
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      data: [{ b64_json: defaultWebpBase64, revised_prompt: 'revised prompt' }],
    })));
    vi.mocked(uploadBuilderImageAsset).mockResolvedValue(uploadedAssetFor('webp', defaultWebpBytes));
    vi.mocked(recordAssetUpload).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalApiKey;
    }
    vi.unstubAllGlobals();
  });

  it.each([
    {
      outputFormat: 'png' as const,
      size: '1536x1024' as const,
      width: 1536,
      height: 1024,
      bytes: createPngFixture({ width: 1536, height: 1024 }),
    },
    {
      outputFormat: 'jpeg' as const,
      size: '1024x1536' as const,
      width: 1024,
      height: 1536,
      bytes: createJpegFixture({ width: 1024, height: 1536 }),
    },
    {
      outputFormat: 'webp' as const,
      size: '1024x1024' as const,
      width: 1024,
      height: 1024,
      bytes: createWebpFixture({ width: 1024, height: 1024 }),
    },
  ])('validates and stores a truthful $outputFormat Image 2.0 result', async ({
    outputFormat,
    size,
    width,
    height,
    bytes,
  }) => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async () => providerImageResponse(bytes)));
    const expectedAsset = uploadedAssetFor(outputFormat, bytes);
    vi.mocked(uploadBuilderImageAsset).mockImplementation(async ({ file }) => {
      expect(vi.getTimerCount()).toBe(0);
      expect(new Uint8Array(await file.arrayBuffer())).toEqual(bytes);
      return expectedAsset;
    });
    vi.mocked(recordAssetUpload).mockImplementation(async () => {
      expect(vi.getTimerCount()).toBe(0);
    });

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      prompt: VALID_PROMPT,
      size,
      quality: 'medium',
      outputFormat,
    }));
    const payload = await response.json();
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(String(fetchCall?.[1]?.body ?? '{}')) as Record<string, unknown>;
    const uploadedFile = vi.mocked(uploadBuilderImageAsset).mock.calls[0]?.[0]?.file;

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      provider: 'openai',
      model: 'gpt-image-2',
      stub: false,
      operation: 'generate',
      prompt: expect.stringContaining(VALID_PROMPT),
      revisedPrompt: 'revised prompt',
      dimensions: { width, height },
      format: outputFormat,
      mime: MIME_BY_FORMAT[outputFormat],
      asset: expectedAsset,
      auditState: 'attempted',
    });
    expect(guardMutation).toHaveBeenCalledWith(expect.any(NextRequest), { bucket: 'asset', permission: 'edit-pages' });
    expect(fetchCall?.[0]).toBe('https://api.openai.com/v1/images/generations');
    expect(fetchCall?.[1]?.signal).toBeInstanceOf(AbortSignal);
    expect(body).toMatchObject({
      model: 'gpt-image-2',
      size,
      quality: 'medium',
      output_format: outputFormat,
    });
    expect(String(body.prompt)).toContain('No readable text');
    expect(uploadedFile).toBeInstanceOf(File);
    expect(uploadedFile?.type).toBe(MIME_BY_FORMAT[outputFormat]);
    expect(recordAssetUpload).toHaveBeenCalledWith(expect.objectContaining({
      assetId: expectedAsset.filename,
      mime: MIME_BY_FORMAT[outputFormat],
      size: bytes.byteLength,
    }));
    expect(vi.getTimerCount()).toBe(0);
    expect(payload.auditState).toBe('attempted');
    expect(payload).not.toHaveProperty('auditRecorded');
    expect(payload).not.toHaveProperty('auditConfirmed');
    expect(payload).not.toHaveProperty('auditCompleted');
  });

  it('accepts auto size and reports the inspected dimensions instead of a requested placeholder', async () => {
    const bytes = createWebpFixture({ width: 640, height: 480, format: 'vp8x', alpha: true });
    const expectedAsset = uploadedAssetFor('webp', bytes, 'blob');
    vi.stubGlobal('fetch', vi.fn(async () => providerImageResponse(bytes)));
    vi.mocked(uploadBuilderImageAsset).mockResolvedValue(expectedAsset);

    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      prompt: VALID_PROMPT,
      size: 'auto',
      outputFormat: 'webp',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      dimensions: { width: 640, height: 480 },
      format: 'webp',
      mime: 'image/webp',
      asset: expectedAsset,
    });
    expect(recordAssetUpload).toHaveBeenCalledTimes(1);
  });

  it('clears the provider deadline before inspection, upload, and audit side effects', async () => {
    vi.useFakeTimers();
    const actualInspectImageBinary = imageBinaryValidation.inspectImageBinary;
    const inspectionSpy = vi
      .spyOn(imageBinaryValidation, 'inspectImageBinary')
      .mockImplementation((...args) => {
        expect(vi.getTimerCount()).toBe(0);
        return actualInspectImageBinary(...args);
      });
    vi.mocked(uploadBuilderImageAsset).mockImplementation(async () => {
      expect(vi.getTimerCount()).toBe(0);
      return uploadedAssetFor('webp', defaultWebpBytes);
    });
    vi.mocked(recordAssetUpload).mockImplementation(async () => {
      expect(vi.getTimerCount()).toBe(0);
    });

    try {
      const { POST } = await import('../route');
      const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));

      expect(response.status).toBe(200);
      expect(inspectionSpy).toHaveBeenCalledTimes(1);
      expect(uploadBuilderImageAsset).toHaveBeenCalledTimes(1);
      expect(recordAssetUpload).toHaveBeenCalledTimes(1);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      inspectionSpy.mockRestore();
    }
  });

  it('returns a setup error when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const { POST } = await import('../route');
    const response = await POST(postRequest({
      locale: 'ko',
      prompt: VALID_PROMPT,
    }));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error).toBe('missing_openai_api_key');
    expect(fetch).not.toHaveBeenCalled();
    expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
    expect(recordAssetUpload).not.toHaveBeenCalled();
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

  it('normalizes a non-2xx provider response to a stable 502 and never relays provider details', async () => {
    const secretMarker = 'sk-provider-leaked-secret-9f3a';
    const promptMarker = 'SUBMITTED-PROMPT-MARKER-7c1';
    const providerCode = 'provider_internal_code_2b';
    const providerType = 'provider_internal_type_8d';
    const providerMessage = 'provider internal message ee';
    const statusTextMarker = 'InternalErrorStackTraceMarker';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      error: {
        message: `${providerMessage} ${secretMarker} ${promptMarker}`,
        type: providerType,
        code: providerCode,
      },
    }), { status: 500, statusText: statusTextMarker, headers: { 'Content-Type': 'application/json' } })));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: `${promptMarker} padded to exceed the twenty character minimum length requirement` }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'openai_image_generation_provider_error', message: 'Image generation provider returned an error.' });
    expect(payload).not.toHaveProperty('asset');
    expect(payload).not.toHaveProperty('model');
    expect(payload).not.toHaveProperty('prompt');
    expect(payload).not.toHaveProperty('revisedPrompt');
    expect(text).not.toContain(secretMarker);
    expect(text).not.toContain(promptMarker);
    expect(text).not.toContain(providerCode);
    expect(text).not.toContain(providerType);
    expect(text).not.toContain(providerMessage);
    expect(text).not.toContain(statusTextMarker);
    expect(text).not.toContain('sk-provider-leaked');
    expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
    expect(recordAssetUpload).not.toHaveBeenCalled();
  });

  it('returns a sanitized 502 when the provider fetch rejects with a network error containing markers', async () => {
    const secretMarker = 'sk-network-leaked-key-aa11';
    const promptMarker = 'NETWORK-PROMPT-MARKER-bb22';
    const stackMarker = 'stackTraceSecretCC33';
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError(`fetch failed to reach host using ${secretMarker} while sending ${promptMarker}; cause=${stackMarker}`);
    }));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: `${promptMarker} padded to exceed the twenty character minimum length requirement` }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'openai_image_generation_network_error', message: 'Image generation request failed.' });
    expect(payload).not.toHaveProperty('asset');
    expect(payload).not.toHaveProperty('model');
    expect(payload).not.toHaveProperty('prompt');
    expect(payload).not.toHaveProperty('revisedPrompt');
    expect(text).not.toContain(secretMarker);
    expect(text).not.toContain(promptMarker);
    expect(text).not.toContain(stackMarker);
    expect(text).not.toContain('sk-network-leaked');
    expect(text).not.toContain('TypeError');
    expect(uploadBuilderImageAsset).not.toHaveBeenCalled();
    expect(recordAssetUpload).not.toHaveBeenCalled();
  });

  it('returns a stable 504 when the OpenAI generation fetch aborts after the timeout', async () => {
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
    const responsePromise = POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    await vi.advanceTimersByTimeAsync(20_000);
    const response = await responsePromise;
    const text = await response.text();
    const payload = JSON.parse(text);
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const signal = (fetchCall?.[1] as RequestInit | undefined)?.signal;

    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal?.aborted).toBe(true);
    expect(response.status).toBe(504);
    expect(payload).toEqual({ ok: false, error: 'openai_image_generation_timeout', message: 'Image generation timed out.' });
    expect(payload).not.toHaveProperty('asset');
    expect(payload).not.toHaveProperty('prompt');
    expectNoStoredSideEffects();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('returns a stable 504 when fetch itself resolves a valid response from its abort listener', async () => {
    vi.useFakeTimers();
    const inspectionSpy = vi.spyOn(imageBinaryValidation, 'inspectImageBinary');
    vi.stubGlobal('fetch', vi.fn(async (_url, init) => {
      const signal = (init as RequestInit | undefined)?.signal;
      if (!signal) {
        throw new Error('missing signal');
      }
      return new Promise<Response>((resolve) => {
        signal.addEventListener('abort', () => {
          resolve(providerImageResponse(defaultWebpBytes));
        });
      });
    }));

    try {
      const { POST } = await import('../route');
      const responsePromise = POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
      await vi.advanceTimersByTimeAsync(20_000);
      const response = await responsePromise;
      const text = await response.text();
      const payload = JSON.parse(text);
      const fetchCall = vi.mocked(fetch).mock.calls[0];
      const signal = (fetchCall?.[1] as RequestInit | undefined)?.signal;

      expect(signal).toBeInstanceOf(AbortSignal);
      expect(signal?.aborted).toBe(true);
      expect(response.status).toBe(504);
      expect(payload).toEqual({ ok: false, error: 'openai_image_generation_timeout', message: 'Image generation timed out.' });
      expect(text).not.toContain(defaultWebpBase64);
      expect(inspectionSpy).not.toHaveBeenCalled();
      expectNoStoredSideEffects();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      inspectionSpy.mockRestore();
    }
  });

  it('returns a stable 502 when the provider returns a non-JSON success body', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>not json</html>', { status: 200, headers: { 'Content-Type': 'text/html' } })));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_openai_image_generation_response', message: 'Image generation returned a malformed response.' });
    expect(text).not.toContain('<html>');
    expectNoStoredSideEffects();
  });

  it.each([
    ['an empty data array', { data: [] }],
    ['a missing b64_json field', { data: [{ revised_prompt: 'x' }] }],
    ['a blank b64_json field', { data: [{ b64_json: '', revised_prompt: 'x' }] }],
    ['a non-string b64_json field', { data: [{ b64_json: 123 }] }],
    ['a missing data field', { other: true }],
  ])('returns a stable 502 when the provider success body has %s', async (_label, body) => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(body)));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_openai_image_generation_response', message: 'Image generation returned a malformed response.' });
    expect(payload).not.toHaveProperty('asset');
    expectNoStoredSideEffects();
  });

  it('rejects a canonical base64 body above the raw-image cap before binary inspection', async () => {
    const rawByteCap = 10 * 1024 * 1024;
    const encodedLengthCap = Math.ceil(rawByteCap / 3) * 4;
    const oversizedCanonicalBase64 = 'A'.repeat(encodedLengthCap + 4);
    const inspectionSpy = vi.spyOn(imageBinaryValidation, 'inspectImageBinary');
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        data: [{ b64_json: oversizedCanonicalBase64, revised_prompt: 'oversized' }],
      }),
    } as Response)));

    try {
      const { POST } = await import('../route');
      const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
      const payload = await response.json();

      expect(response.status).toBe(502);
      expect(payload).toEqual({ ok: false, error: 'invalid_generated_image', message: 'Generated image bytes could not be validated.' });
      expect(inspectionSpy).not.toHaveBeenCalled();
      expectNoStoredSideEffects();
    } finally {
      inspectionSpy.mockRestore();
    }
  });

  it.each([
    {
      label: 'a truncated PNG',
      bytes: createPngFixture({ width: 1536, height: 1024 }).slice(0, -1),
      request: { size: '1536x1024', outputFormat: 'png' },
    },
    {
      label: 'a PNG polyglot with trailing script bytes',
      bytes: new Uint8Array([
        ...createPngFixture({ width: 1536, height: 1024 }),
        ...Buffer.from('<script>not-an-image-tail</script>'),
      ]),
      request: { size: '1536x1024', outputFormat: 'png' },
    },
    {
      label: 'PNG bytes declared as JPEG',
      bytes: createPngFixture({ width: 1536, height: 1024 }),
      request: { size: '1536x1024', outputFormat: 'jpeg' },
    },
    {
      label: 'dimensions different from the explicit requested size',
      bytes: createPngFixture({ width: 1024, height: 1536 }),
      request: { size: '1536x1024', outputFormat: 'png' },
    },
    {
      label: 'pixel count above the route cap',
      bytes: createPngFixture({ width: 4097, height: 4096, colorType: 0, bitDepth: 8 }),
      request: { size: 'auto', outputFormat: 'png' },
    },
  ])('rejects $label with a sanitized invalid-image 502', async ({ bytes, request }) => {
    vi.stubGlobal('fetch', vi.fn(async () => providerImageResponse(bytes)));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT, ...request }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_generated_image', message: 'Generated image bytes could not be validated.' });
    expect(text).not.toContain(imageBytesToBase64(bytes));
    expectNoStoredSideEffects();
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
    const responsePromise = POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    await vi.advanceTimersByTimeAsync(20_000);
    const response = await responsePromise;
    const text = await response.text();
    const payload = JSON.parse(text);
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const signal = (fetchCall?.[1] as RequestInit | undefined)?.signal;

    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal?.aborted).toBe(true);
    expect(response.status).toBe(504);
    expect(payload).toEqual({ ok: false, error: 'openai_image_generation_timeout', message: 'Image generation timed out.' });
    expect(text).not.toContain('AbortError');
    expect(text).not.toContain('sk-');
    expectNoStoredSideEffects();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([
    ['a whitespace-only b64_json field', { data: [{ b64_json: '   ', revised_prompt: 'x' }] }],
    ['a stray-character b64_json field', { data: [{ b64_json: '%%%', revised_prompt: 'x' }] }],
    ['a valid base64 with trailing stray characters', { data: [{ b64_json: `${defaultWebpBase64}%%%`, revised_prompt: 'x' }] }],
    ['a base64 field with genuinely interior padding', { data: [{ b64_json: `${defaultWebpBase64.slice(0, 8)}=${defaultWebpBase64.slice(8)}`, revised_prompt: 'x' }] }],
    ['a noncanonical-pad base64 field (AB==)', { data: [{ b64_json: 'AB==', revised_prompt: 'x' }] }],
  ])('returns a stable 502 when the provider success body has %s and skips upload/audit', async (_label, body) => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(body)));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_openai_image_generation_response', message: 'Image generation returned a malformed response.' });
    expect(payload).not.toHaveProperty('asset');
    expectNoStoredSideEffects();
  });

  it('returns a stable 400 for malformed request JSON and never relays parser details', async () => {
    const parserMarker = 'JSON-PARSER-SENTINEL-aa91';
    const request = new NextRequest('https://law.example.test/api/builder/ai-generator/image', {
      method: 'POST',
      body: `{ "prompt": "${parserMarker}",, invalid json }`,
      headers: { 'Content-Type': 'application/json' },
    });

    const { POST } = await import('../route');
    const response = await POST(request);
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(400);
    expect(payload.error).toBe('invalid_image_generation_request');
    expect(text).not.toContain(parserMarker);
    expect(fetch).not.toHaveBeenCalled();
    expectNoStoredSideEffects();
  });

  it('sanitizes the invalid-image 502 when provider bytes are not an image', async () => {
    const notImageBase64 = Buffer.from('definitely-not-an-image').toString('base64');
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      data: [{ b64_json: notImageBase64, revised_prompt: 'revised prompt' }],
    })));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_generated_image', message: 'Generated image bytes could not be validated.' });
    expect(text).not.toContain('definitely-not-an-image');
    expectNoStoredSideEffects();
  });

  it('sanitizes upload rejection into a stable 502 with uploadState unknown and no leaked details', async () => {
    const secretMarker = 'sk-upload-leaked-key-ee11';
    const promptMarker = 'UPLOAD-PROMPT-MARKER-ff22';
    const pathMarker = '/secret/upload/path/stack-marker-33dd';
    const stackMarker = 'uploadStackTraceSecret44ee';
    vi.mocked(uploadBuilderImageAsset).mockRejectedValueOnce(new Error(`${secretMarker} ${promptMarker} ${pathMarker} ${stackMarker}`));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'generated_image_asset_upload_failed',
      message: 'Generated image asset storage could not be confirmed.',
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

  it.each([
    ['content type', { contentType: 'image/png' as const }],
    ['byte size', { size: defaultWebpBytes.byteLength + 1 }],
    ['locale', { locale: 'en' as const }],
    ['backend', { backend: 'memory' as const }],
    ['unsafe filename', {
      filename: '../ai-image-2-hero.webp',
      pathname: 'builder/assets/ko/../ai-image-2-hero.webp',
      url: '/api/builder/assets/ko/../ai-image-2-hero.webp',
    }],
    ['filename extension', {
      filename: 'ai-image-2-hero.png',
      pathname: 'builder/assets/ko/ai-image-2-hero.png',
      url: '/api/builder/assets/ko/ai-image-2-hero.png',
    }],
    ['pathname', { pathname: 'builder/assets/ko/other.webp' }],
    ['URL', { url: '/api/builder/assets/ko/other.webp' }],
    ['blank upload timestamp', { uploadedAt: '' }],
    ['invalid upload timestamp', { uploadedAt: 'not-an-iso-timestamp' }],
  ])('fails closed when uploaded asset metadata contradicts self-consistency: %s', async (_label, override) => {
    const invalidAsset = {
      ...uploadedAssetFor('webp', defaultWebpBytes),
      ...override,
    } as Awaited<ReturnType<typeof uploadBuilderImageAsset>>;
    vi.mocked(uploadBuilderImageAsset).mockResolvedValue(invalidAsset);

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'generated_image_asset_upload_failed',
      message: 'Generated image asset storage could not be confirmed.',
      uploadState: 'unknown',
    });
    expect(payload).not.toHaveProperty('asset');
    expect(uploadBuilderImageAsset).toHaveBeenCalledTimes(1);
    expect(recordAssetUpload).not.toHaveBeenCalled();
  });

  it('treats audit recording as best-effort: audit rejection still returns a normal 200 attempted response', async () => {
    const secretMarker = 'sk-audit-leaked-key-55gg';
    const promptMarker = 'AUDIT-PROMPT-MARKER-66hh';
    const pathMarker = '/secret/audit/path/stack-marker-77ii';
    const stackMarker = 'auditStackTraceSecret88jj';
    vi.mocked(recordAssetUpload).mockRejectedValueOnce(new Error(`${secretMarker} ${promptMarker} ${pathMarker} ${stackMarker}`));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    const text = await response.text();
    const payload = JSON.parse(text);

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.asset).toEqual(uploadedAssetFor('webp', defaultWebpBytes));
    expect(payload).toMatchObject({
      provider: 'openai',
      model: 'gpt-image-2',
      stub: false,
      operation: 'generate',
      dimensions: { width: 1536, height: 1024 },
      format: 'webp',
      mime: 'image/webp',
    });
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

  it('sanitizes an unexpected binary-inspector rejection into the fixed 502 without leaking details', async () => {
    const secretMarker = 'sk-validate-throw-key-12ab';
    const pathMarker = '/secret/validate/path/stack-marker-34cd';
    const stackMarker = 'validateThrowStackTrace56ef';
    const inspectionSpy = vi
      .spyOn(imageBinaryValidation, 'inspectImageBinary')
      .mockImplementationOnce(() => {
        throw new Error(`boom ${secretMarker} ${pathMarker} ${stackMarker}`);
      });

    try {
      const { POST } = await import('../route');
      const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
      const text = await response.text();
      const payload = JSON.parse(text);

      expect(response.status).toBe(502);
      expect(payload).toEqual({ ok: false, error: 'invalid_generated_image', message: 'Generated image bytes could not be validated.' });
      expect(text).not.toContain(secretMarker);
      expect(text).not.toContain(pathMarker);
      expect(text).not.toContain(stackMarker);
      expect(text).not.toContain('boom');
      expect(inspectionSpy).toHaveBeenCalledTimes(1);
      expectNoStoredSideEffects();
    } finally {
      inspectionSpy.mockRestore();
    }
  });

  it('lets canonical minimal base64 (AA==) proceed to binary inspection where it fails as a non-image', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      data: [{ b64_json: 'AA==', revised_prompt: 'revised prompt' }],
    })));

    const { POST } = await import('../route');
    const response = await POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({ ok: false, error: 'invalid_generated_image', message: 'Generated image bytes could not be validated.' });
    expectNoStoredSideEffects();
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
            resolve({ data: [{ b64_json: defaultWebpBase64, revised_prompt: 'revised prompt' }] });
          });
        }),
      } as Response;
    }));

    const { POST } = await import('../route');
    const responsePromise = POST(postRequest({ locale: 'ko', prompt: VALID_PROMPT }));
    await vi.advanceTimersByTimeAsync(20_000);
    const response = await responsePromise;
    const text = await response.text();
    const payload = JSON.parse(text);
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const signal = (fetchCall?.[1] as RequestInit | undefined)?.signal;

    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal?.aborted).toBe(true);
    expect(response.status).toBe(504);
    expect(payload).toEqual({ ok: false, error: 'openai_image_generation_timeout', message: 'Image generation timed out.' });
    expect(text).not.toContain(defaultWebpBase64);
    expect(text).not.toContain('revised prompt');
    expectNoStoredSideEffects();
    expect(vi.getTimerCount()).toBe(0);
  });
});
