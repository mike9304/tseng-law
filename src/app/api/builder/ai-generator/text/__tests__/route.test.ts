import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

const originalApiKey = process.env.OPENAI_API_KEY;
const originalModel = process.env.OPENAI_TEXT_ASSISTANT_MODEL;

const SECRET_API_KEY = 'sk-test-secret-key-DO-NOT-LEAK';
const SECRET_PROVIDER_TOKEN = 'provider-secret-token';
const SECRET_SOURCE_TEXT = '이 소스 텍스트는 절대 노출되면 안 됩니다';
const SECRET_BRAND_CONTEXT = 'BRAND_CONTEXT_SECRET';
const SECRET_PROVIDER_CODE = 'provider_error_code_secret';
const SECRET_PROVIDER_TYPE = 'provider_error_type_secret';
const SECRET_PROVIDER_MESSAGE = 'provider raw detailed message';
const STACK_MARKER = 'at async POST STACK_TRACE_MARKER';

const SENSITIVE_MARKERS = [
  SECRET_API_KEY,
  SECRET_PROVIDER_TOKEN,
  SECRET_SOURCE_TEXT,
  SECRET_BRAND_CONTEXT,
  SECRET_PROVIDER_CODE,
  SECRET_PROVIDER_TYPE,
  SECRET_PROVIDER_MESSAGE,
  'AbortError',
  STACK_MARKER,
];

function assertSanitized(payload: unknown): void {
  const serialized = JSON.stringify(payload);
  for (const marker of SENSITIVE_MARKERS) {
    expect(serialized, `expected failure payload to exclude "${marker}"`).not.toContain(marker);
  }
}

const FIXED_ERROR_MESSAGES = {
  missing_openai_api_key: 'The AI text assistant is not configured.',
  openai_text_timeout: 'The AI text assistant took too long to respond.',
  openai_text_provider_failed: 'The AI text assistant was unable to complete the request.',
  openai_text_network_failed: 'The AI text assistant could not be reached.',
  invalid_openai_text_response: 'The AI text assistant returned an unusable response.',
} as const;

function expectFailure(payload: unknown, code: string, fixedMessage: string): void {
  expect(payload).toEqual({ ok: false, error: code, message: fixedMessage });
  assertSanitized(payload);
}

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/text', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

type ProviderResponseLike = Pick<Response, 'ok' | 'status' | 'statusText' | 'json' | 'text'>;

describe('/api/builder/ai-generator/text', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.OPENAI_TEXT_ASSISTANT_MODEL = 'gpt-4o-mini';
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalApiKey;
    }
    if (originalModel === undefined) {
      delete process.env.OPENAI_TEXT_ASSISTANT_MODEL;
    } else {
      process.env.OPENAI_TEXT_ASSISTANT_MODEL = originalModel;
    }
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('returns the rewritten text from a rewrite action', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            choices: [{ message: { content: '간결하고 신뢰감 있는 새 카피' }, finish_reason: 'stop' }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: '이 텍스트는 길고 어색해서 더 자연스럽게 다듬어야 합니다.',
        action: 'rewrite',
        sourceLocale: 'ko',
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toMatchObject({
      ok: true,
      action: 'rewrite',
      text: '간결하고 신뢰감 있는 새 카피',
      model: 'gpt-4o-mini',
    });

    const fetchMock = vi.mocked(globalThis.fetch);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.openai.com/v1/chat/completions');
    expect(init?.method).toBe('POST');
    const requestBody = JSON.parse((init?.body as string) ?? '{}');
    expect(requestBody.model).toBe('gpt-4o-mini');
    expect(requestBody.messages?.[0]?.role).toBe('system');
    expect(requestBody.messages?.[1]?.role).toBe('user');
    expect(requestBody.messages?.[1]?.content).toContain('Rewrite the source text');
  });

  it('rejects translate action without a target locale', async () => {
    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: 'Source text for translation',
        action: 'translate',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('invalid_text_assistant_request');
  });

  it('rejects tone action without a tone selection', async () => {
    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: 'Source text for tone change',
        action: 'tone',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('invalid_text_assistant_request');
  });

  it('returns a sanitized 503 missing-key contract without calling the provider', async () => {
    delete process.env.OPENAI_API_KEY;
    const fetchMock = vi.fn(async () => {
      throw new Error(`provider must not be called ${SECRET_API_KEY}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: 'Source text',
        action: 'rewrite',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(503);
    const payload = await response.json();
    expectFailure(payload, 'missing_openai_api_key', FIXED_ERROR_MESSAGES.missing_openai_api_key);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns a sanitized 502 invalid-response contract when OpenAI returns empty content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ choices: [{ message: { content: '' } }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: 'Source text',
        action: 'rewrite',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(502);
    const payload = await response.json();
    expectFailure(
      payload,
      'invalid_openai_text_response',
      FIXED_ERROR_MESSAGES.invalid_openai_text_response,
    );
  });

  it('forwards translation target locale into the prompt', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({ choices: [{ message: { content: 'Translated copy.' } }] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: '이 텍스트는 번역되어야 합니다.',
        action: 'translate',
        sourceLocale: 'ko',
        targetLocale: 'en',
      }),
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.text).toBe('Translated copy.');
    expect(payload.targetLocale).toBe('en');
    const lastCall = fetchMock.mock.calls.at(0) as [string, RequestInit] | undefined;
    const requestBody = JSON.parse((lastCall?.[1]?.body as string | undefined) ?? '{}');
    expect(requestBody.messages?.[1]?.content).toContain('Translate the source text into English');
  });

  it('returns a sanitized 502 provider-failed contract when the provider responds non-2xx', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            access_token: SECRET_API_KEY,
            internal_token: SECRET_PROVIDER_TOKEN,
            error: {
              code: SECRET_PROVIDER_CODE,
              type: SECRET_PROVIDER_TYPE,
              message: `${SECRET_PROVIDER_MESSAGE} ${SECRET_API_KEY} ${SECRET_SOURCE_TEXT}`,
            },
            debug: { prompt: SECRET_SOURCE_TEXT, context: SECRET_BRAND_CONTEXT },
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: SECRET_SOURCE_TEXT,
        action: 'rewrite',
        sourceLocale: 'ko',
        brandTone: SECRET_BRAND_CONTEXT,
      }),
    );
    expect(response.status).toBe(502);
    const payload = await response.json();
    expectFailure(
      payload,
      'openai_text_provider_failed',
      FIXED_ERROR_MESSAGES.openai_text_provider_failed,
    );
  });

  it('returns a sanitized 502 network-failed contract when fetch rejects', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error(
          `fetch rejected ${SECRET_API_KEY} ${SECRET_SOURCE_TEXT} ${SECRET_BRAND_CONTEXT} ${STACK_MARKER}`,
        );
      }),
    );

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: SECRET_SOURCE_TEXT,
        action: 'rewrite',
        sourceLocale: 'ko',
        brandTone: SECRET_BRAND_CONTEXT,
      }),
    );
    expect(response.status).toBe(502);
    const payload = await response.json();
    expectFailure(
      payload,
      'openai_text_network_failed',
      FIXED_ERROR_MESSAGES.openai_text_network_failed,
    );
  });

  it('returns a sanitized 504 timeout contract when the provider hangs past the bound', async () => {
    vi.useFakeTimers();

    let suppliedSignal: AbortSignal | undefined;
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      suppliedSignal = init?.signal as AbortSignal | undefined;
      return new Promise<Response>((_resolve, reject) => {
        const onAbort = () => {
          const err = new Error(
            `AbortError: aborted ${SECRET_API_KEY} ${SECRET_SOURCE_TEXT} ${STACK_MARKER}`,
          );
          err.name = 'AbortError';
          reject(err);
        };
        const signal = init?.signal as AbortSignal | undefined;
        if (!signal) return;
        if (signal.aborted) onAbort();
        else signal.addEventListener('abort', onAbort, { once: true });
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../route');
    const responsePromise = POST(
      postRequest({
        text: SECRET_SOURCE_TEXT,
        action: 'rewrite',
        sourceLocale: 'ko',
        brandTone: SECRET_BRAND_CONTEXT,
      }),
    );

    await vi.advanceTimersByTimeAsync(20_000);

    const response = await responsePromise;
    expect(response.status).toBe(504);
    const payload = await response.json();
    expectFailure(payload, 'openai_text_timeout', FIXED_ERROR_MESSAGES.openai_text_timeout);
    expect(suppliedSignal).toBeInstanceOf(AbortSignal);
    expect(suppliedSignal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('returns a sanitized 502 invalid-response contract when the provider body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(`<<<not-json::${SECRET_API_KEY} ${SECRET_SOURCE_TEXT}`, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        }),
      ),
    );

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: SECRET_SOURCE_TEXT,
        action: 'rewrite',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(502);
    const payload = await response.json();
    expectFailure(
      payload,
      'invalid_openai_text_response',
      FIXED_ERROR_MESSAGES.invalid_openai_text_response,
    );
  });

  it.each([
    ['missing choices', {}],
    ['choices without a message', { choices: [{}] }],
    ['message without content', { choices: [{ message: {} }] }],
    ['non-string content', { choices: [{ message: { content: 42 } }] }],
    ['null content', { choices: [{ message: { content: null } }] }],
    ['whitespace-only content', { choices: [{ message: { content: '   \n\t ' } }] }],
    ['quote-only content', { choices: [{ message: { content: '""“”' } }] }],
    ['array payload', [{ choices: [{ message: { content: 'x' } }] }]],
    ['primitive payload', 42],
    ['top-level null', null],
  ])('returns a sanitized 502 invalid-response contract for %s', async (_label, body) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify(body), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: 'Source text',
        action: 'rewrite',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(502);
    const payload = await response.json();
    expectFailure(
      payload,
      'invalid_openai_text_response',
      FIXED_ERROR_MESSAGES.invalid_openai_text_response,
    );
  });

  it('returns a sanitized 502 provider-failed contract and never reads the body when the provider responds non-2xx (Response-like)', async () => {
    const textSpy = vi.fn(async () => new Promise<string>(() => undefined));
    const jsonSpy = vi.fn(async () => {
      throw new Error(`provider body must not be read ${SECRET_API_KEY} ${SECRET_SOURCE_TEXT}`);
    });
    const providerResponse: ProviderResponseLike = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: textSpy,
      json: jsonSpy,
    };

    vi.stubGlobal('fetch', vi.fn(async () => providerResponse));

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: SECRET_SOURCE_TEXT,
        action: 'rewrite',
        sourceLocale: 'ko',
        brandTone: SECRET_BRAND_CONTEXT,
      }),
    );
    expect(response.status).toBe(502);
    const payload = await response.json();
    expectFailure(
      payload,
      'openai_text_provider_failed',
      FIXED_ERROR_MESSAGES.openai_text_provider_failed,
    );
    expect(textSpy).not.toHaveBeenCalled();
    expect(jsonSpy).not.toHaveBeenCalled();
  });

  it('returns a sanitized 504 timeout contract when the provider json() never settles (Response-like)', async () => {
    vi.useFakeTimers();

    let suppliedSignal: AbortSignal | undefined;
    const jsonSpy = vi.fn(async () => new Promise<never>(() => undefined));
    const providerResponse: ProviderResponseLike = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jsonSpy,
      text: vi.fn(async () => new Promise<string>(() => undefined)),
    };

    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      suppliedSignal = init?.signal as AbortSignal | undefined;
      return providerResponse;
    });
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../route');
    const responsePromise = POST(
      postRequest({
        text: SECRET_SOURCE_TEXT,
        action: 'rewrite',
        sourceLocale: 'ko',
        brandTone: SECRET_BRAND_CONTEXT,
      }),
    );

    await vi.advanceTimersByTimeAsync(20_000);

    const response = await responsePromise;
    expect(response.status).toBe(504);
    const payload = await response.json();
    expectFailure(payload, 'openai_text_timeout', FIXED_ERROR_MESSAGES.openai_text_timeout);
    expect(jsonSpy).toHaveBeenCalledTimes(1);
    expect(suppliedSignal).toBeInstanceOf(AbortSignal);
    expect(suppliedSignal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('returns a sanitized 502 network-failed contract when json() rejects with a non-SyntaxError carrying secrets', async () => {
    const jsonSpy = vi.fn(async () => {
      throw new Error(
        `json read failed ${SECRET_API_KEY} ${SECRET_SOURCE_TEXT} ${SECRET_BRAND_CONTEXT} ${STACK_MARKER}`,
      );
    });
    const providerResponse: ProviderResponseLike = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jsonSpy,
      text: vi.fn(async () => 'never'),
    };

    vi.stubGlobal('fetch', vi.fn(async () => providerResponse));

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: SECRET_SOURCE_TEXT,
        action: 'rewrite',
        sourceLocale: 'ko',
        brandTone: SECRET_BRAND_CONTEXT,
      }),
    );
    expect(response.status).toBe(502);
    const payload = await response.json();
    expectFailure(
      payload,
      'openai_text_network_failed',
      FIXED_ERROR_MESSAGES.openai_text_network_failed,
    );
  });

  it('returns a sanitized 502 network-failed contract when a successful Response-like json() throws synchronously', async () => {
    const jsonSpy = vi.fn(() => {
      throw new TypeError(
        `sync json read failed ${SECRET_API_KEY} ${SECRET_PROVIDER_TOKEN} ${SECRET_SOURCE_TEXT} ${SECRET_BRAND_CONTEXT} ${STACK_MARKER}`,
      );
    });
    const providerResponse: ProviderResponseLike = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jsonSpy,
      text: vi.fn(async () => 'never'),
    };

    vi.stubGlobal('fetch', vi.fn(async () => providerResponse));

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: SECRET_SOURCE_TEXT,
        action: 'rewrite',
        sourceLocale: 'ko',
        brandTone: SECRET_BRAND_CONTEXT,
      }),
    );
    expect(response.status).toBe(502);
    const payload = await response.json();
    expectFailure(
      payload,
      'openai_text_network_failed',
      FIXED_ERROR_MESSAGES.openai_text_network_failed,
    );
    expect(jsonSpy).toHaveBeenCalledTimes(1);
  });

  it('returns the full valid 200 contract and invokes the auth guard for a tone action', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: { content: '신뢰감 있는 전문가 톤의 카피입니다.' },
              finish_reason: 'stop',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: '원본 카피입니다.',
        action: 'tone',
        sourceLocale: 'ko',
        tone: 'authoritative',
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toMatchObject({
      ok: true,
      action: 'tone',
      tone: 'authoritative',
      targetLocale: null,
      text: '신뢰감 있는 전문가 톤의 카피입니다.',
      model: 'gpt-4o-mini',
      finishReason: 'stop',
    });
    expect(Array.isArray(payload.supportedActions)).toBe(true);
    expect(payload.supportedActions).toContain('rewrite');
    expect(Array.isArray(payload.supportedTones)).toBe(true);
    expect(payload.supportedTones).toContain('authoritative');
    expect(Array.isArray(payload.supportedTargetLocales)).toBe(true);
    expect(payload.supportedTargetLocales).toContain('en');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const lastCall = fetchMock.mock.calls.at(0) as [string, RequestInit] | undefined;
    const requestBody = JSON.parse((lastCall?.[1]?.body as string | undefined) ?? '{}');
    expect(requestBody.temperature).toBe(0.5);
    expect(requestBody.messages?.[1]?.content).toContain('expert, and trustworthy');

    expect(guardMutation).toHaveBeenCalledTimes(1);
  });
});
