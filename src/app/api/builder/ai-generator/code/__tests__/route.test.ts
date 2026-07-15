import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

const sensitiveKey = 'sk-sensitive-code-key';
const sensitiveCode = 'function handler(ctx) { ctx.log(SECRET_TOKEN); }';
const sensitiveContext = 'Inline context for Sensitive Client';
const providerSecret = 'raw-provider-secret';

function request(body: unknown = {
  code: sensitiveCode,
  action: 'explain',
  language: 'ts',
  context: sensitiveContext,
}): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function providerResponse(content: unknown, status = 200): Response {
  return new Response(JSON.stringify({
    choices: [{ message: { content: typeof content === 'string' ? content : JSON.stringify(content) } }],
    // Provider echoes secrets/error fields that must never reach the client.
    error: { message: providerSecret, code: 'sensitive_provider_code', type: 'sensitive_provider_type' },
    model: `${providerSecret}-gpt`,
  }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function expectSanitized(payload: unknown) {
  const serialized = JSON.stringify(payload);
  expect(serialized).not.toContain(providerSecret);
  expect(serialized).not.toContain(sensitiveKey);
  expect(serialized).not.toContain(sensitiveCode);
  expect(serialized).not.toContain('SECRET_TOKEN');
  expect(serialized).not.toContain(sensitiveContext);
  expect(serialized).not.toContain('Sensitive Client');
  expect(serialized).not.toContain('sensitive_provider_code');
  expect(serialized).not.toContain('sensitive_provider_type');
}

describe('/api/builder/ai-generator/code fail-closed contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('OPENAI_API_KEY', sensitiveKey);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('fails closed on a missing key without calling the provider', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      ok: false,
      error: 'missing_openai_api_key',
      message: 'OPENAI_API_KEY is not configured for the AI code assistant.',
    });
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
    expectSanitized(payload);
  });

  it('sanitizes provider non-2xx failures (no echo of status/error/body/secrets)', async () => {
    const jsonSpy = vi.fn(async () => {
      throw new Error(`${providerSecret} ${sensitiveCode} ${sensitiveContext}`);
    });
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      status: 429,
      json: jsonSpy,
    } as unknown as Response)));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'openai_code_assistant_failed',
      message: 'AI code assistant failed.',
    });
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expect(jsonSpy).not.toHaveBeenCalled();
    expectSanitized(payload);
  });

  it('sanitizes network rejections that carry raw secrets/code/context', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(
      new Error(`${providerSecret} ${sensitiveCode} ${sensitiveContext}`),
    )));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'openai_code_request_failed',
      message: 'The AI code assistant request failed.',
    });
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expectSanitized(payload);
  });

  it('aborts a hung provider request at the bounded timeout and returns sanitized 502', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => (
      new Promise<Response>((_resolve, reject) => {
        expect(init?.signal).toBeInstanceOf(AbortSignal);
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException(`${providerSecret} ${sensitiveCode}`, 'AbortError'));
        }, { once: true });
      })
    )));

    const route = await import('../route');
    const pending = route.POST(request());
    await vi.advanceTimersByTimeAsync(20_000);
    const response = await pending;
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'openai_code_request_failed',
      message: 'The AI code assistant request failed.',
    });
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expectSanitized(payload);
  });

  it('keeps the bounded timeout active while consuming a stalled response body', async () => {
    vi.useFakeTimers();
    const jsonSpy = vi.fn();
    vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      jsonSpy.mockImplementation(() => new Promise((_resolve, reject) => {
        expect(init?.signal).toBeInstanceOf(AbortSignal);
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException(`${providerSecret} ${sensitiveCode}`, 'AbortError'));
        }, { once: true });
      }));

      return {
        ok: true,
        json: jsonSpy,
      } as unknown as Response;
    }));

    const route = await import('../route');
    const pending = route.POST(request());
    await vi.advanceTimersByTimeAsync(0);

    expect(jsonSpy).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(1);

    await vi.advanceTimersByTimeAsync(20_000);
    const response = await pending;
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'openai_code_request_failed',
      message: 'The AI code assistant request failed.',
    });
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
    expectSanitized(payload);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['array', [providerSecret]],
    ['primitive', providerSecret],
  ])('rejects a top-level %s provider payload before dereferencing it', async (_label, body) => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: vi.fn(async () => body),
    } as unknown as Response)));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'invalid_code_response_shape',
      message: 'AI code assistant returned an unexpected JSON shape.',
    });
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
    expectSanitized(payload);
  });

  it('fails closed on invalid JSON content without echoing provider data', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(`${providerSecret} not-json`)));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'invalid_code_payload',
      message: 'AI code assistant returned non-JSON content.',
    });
    expect(payload.details).toBeUndefined();
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expectSanitized(payload);
  });

  it('fails closed on an invalid response shape without Zod details', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse({
      unknown: providerSecret,
      code: sensitiveCode,
    })));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'invalid_code_response_shape',
      message: 'AI code assistant returned an unexpected JSON shape.',
    });
    expect(payload.details).toBeUndefined();
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expectSanitized(payload);
  });

  it.each([
    ['fix', 'fix', null],
    ['fix omitted', 'fix', undefined],
    ['fix blank', 'fix', '   '],
    ['optimize', 'optimize', null],
    ['optimize omitted', 'optimize', undefined],
    ['optimize blank', 'optimize', '\n\t '],
    ['comment', 'comment', null],
    ['comment omitted', 'comment', undefined],
    ['comment blank', 'comment', '  '],
  ])('rejects %s with fixedCode %s (no false success, no applicable output)', async (_label, action, fixedCode) => {
    const content = { explanation: 'Looks fine.', ...(fixedCode === undefined ? {} : { fixedCode }) };
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(content)));

    const route = await import('../route');
    const response = await route.POST(request({ code: sensitiveCode, action, language: 'ts' }));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('invalid_code_response_shape');
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expectSanitized(payload);
  });

  it('rejects explain that returns a nonblank fixedCode (no applicable output)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse({
      explanation: 'This does a thing.',
      fixedCode: `function handler(ctx) { ctx.log(${providerSecret}); }`,
    })));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('invalid_code_response_shape');
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expectSanitized(payload);
  });

  it('returns ok:true for valid explain with fixedCode null and no applicable output', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse({
      explanation: 'This code logs a secret token via the ctx logger.',
      fixedCode: null,
    })));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      action: 'explain',
      language: 'ts',
      result: 'This code logs a secret token via the ctx logger.',
    });
    expect(payload.fixedCode).toBeUndefined();
    expect(payload.diff).toBeUndefined();
    expect(payload.diffHunks).toBeUndefined();
    expect(guardMutation).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('returns ok:true for a valid transform with fixedCode plus diff/diffHunks', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse({
      explanation: 'Removed the secret log call.',
      fixedCode: 'function handler(ctx) { ctx.log("safe"); }',
    })));

    const route = await import('../route');
    const response = await route.POST(request({
      code: 'function handler(ctx) { ctx.log(SECRET_TOKEN); }',
      action: 'fix',
      language: 'ts',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.action).toBe('fix');
    expect(payload.language).toBe('ts');
    expect(payload.fixedCode).toBe('function handler(ctx) { ctx.log("safe"); }');
    expect(typeof payload.diff).toBe('string');
    expect(payload.diff.length).toBeGreaterThan(0);
    expect(Array.isArray(payload.diffHunks)).toBe(true);
    expect(payload.diffHunks.length).toBeGreaterThan(0);
    expect(guardMutation).toHaveBeenCalled();
  });
});
