import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

const sensitivePrompt = 'Private merger prompt for Sensitive Client';
const sensitiveKey = 'sk-sensitive-section-key';

function request(body: unknown = {
  prompt: sensitivePrompt,
  sectionKind: 'hero',
  locale: 'en',
  siteName: 'Sensitive Client',
}): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/section', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function providerResponse(content: unknown, status = 200): Response {
  return new Response(JSON.stringify({
    choices: [{ message: { content: typeof content === 'string' ? content : JSON.stringify(content) } }],
    error: { message: 'raw-provider-secret' },
  }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function expectSanitized(payload: unknown) {
  const serialized = JSON.stringify(payload);
  expect(serialized).not.toContain('raw-provider-secret');
  expect(serialized).not.toContain(sensitivePrompt);
  expect(serialized).not.toContain(sensitiveKey);
  expect(serialized).not.toContain('Sensitive Client');
}

describe('/api/builder/ai-generator/section production truthfulness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('OPENAI_API_KEY', sensitiveKey);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('fails closed on a missing key even when fallback flags are enabled', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');
    vi.stubEnv('ALLOW_AI_GENERATOR_STUB', '1');
    vi.stubEnv('ALLOW_STUB_PROVIDERS', '1');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      ok: false,
      error: 'ai_content_provider_unconfigured',
      message: 'AI content provider is not configured.',
    });
    expect(payload.nodes).toBeUndefined();
    expect(payload.spec).toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
    expectSanitized(payload);
  });

  it('sanitizes provider non-2xx failures', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse('ignored', 429)));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'ai_content_provider_rejected',
      message: 'AI content provider rejected the request.',
    });
    expect(payload.nodes).toBeUndefined();
    expectSanitized(payload);
  });

  it('sanitizes network failures', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(
      new Error(`raw-provider-secret ${sensitivePrompt}`),
    )));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe('ai_content_provider_unavailable');
    expect(payload.ok).toBe(false);
    expect(payload.nodes).toBeUndefined();
    expectSanitized(payload);
  });

  it('aborts a hung provider request at the bounded timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => (
      new Promise<Response>((_resolve, reject) => {
        expect(init?.signal).toBeInstanceOf(AbortSignal);
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('raw-provider-secret timeout', 'AbortError'));
        }, { once: true });
      })
    )));

    const route = await import('../route');
    const pending = route.POST(request());
    await vi.advanceTimersByTimeAsync(20_000);
    const response = await pending;
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe('ai_content_provider_unavailable');
    expect(payload.ok).toBe(false);
    expect(payload.nodes).toBeUndefined();
    expectSanitized(payload);
  });

  it.each([
    ['invalid JSON', 'not-json'],
    ['invalid shape', { sectionKind: 'hero', headline: '' }],
  ])('fails closed on %s', async (_label, content) => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(content)));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe('ai_content_invalid_response');
    expect(payload.ok).toBe(false);
    expect(payload.nodes).toBeUndefined();
    expectSanitized(payload);
  });

  it.each([
    [
      'a requested-kind mismatch',
      { prompt: sensitivePrompt, sectionKind: 'features', locale: 'en' },
      { sectionKind: 'hero', headline: 'Hero', subhead: 'Body', ctaLabel: 'Go' },
    ],
    [
      'a list section without the promised items',
      { prompt: sensitivePrompt, sectionKind: 'features', locale: 'en' },
      { sectionKind: 'features', headline: 'Features' },
    ],
    [
      'a hero without actionable supporting content',
      { prompt: sensitivePrompt, sectionKind: 'hero', locale: 'en' },
      { sectionKind: 'hero', headline: 'Hero', subhead: 'Body' },
    ],
  ])('rejects semantic provider output with %s', async (_label, body, content) => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(content)));

    const route = await import('../route');
    const response = await route.POST(request(body));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'ai_content_invalid_response',
      message: 'AI content provider returned an invalid response.',
    });
    expect(payload.nodes).toBeUndefined();
    expect(payload.spec).toBeUndefined();
  });

  it('marks validated provider nodes as non-stub content', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse({
      sectionKind: 'hero',
      headline: 'Trusted legal guidance',
      subhead: 'A clear next step.',
      ctaLabel: 'Contact us',
    })));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      source: 'openai',
      stub: false,
      usedFallback: false,
      sectionKind: 'hero',
    });
    expect(payload.nodes.length).toBeGreaterThan(0);
    expect(guardMutation).toHaveBeenCalled();
  });
});

describe('/api/builder/ai-generator/section local demo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('OPENAI_API_KEY', '');
    vi.stubEnv('AI_BUILDER_ALLOW_LOCAL_DEMO', 'true');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('labels demo nodes and never reports them as provider success', async () => {
    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      ok: false,
      error: 'ai_section_local_demo_only',
      source: 'local-demo',
      stub: true,
      usedFallback: true,
    });
    expect(payload.nodes.length).toBeGreaterThan(0);
  });
});
