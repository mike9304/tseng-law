import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

const sensitivePurpose = 'Private acquisition landing page for Sensitive Client';
const sensitiveKey = 'sk-sensitive-page-spec-key';

function request(body: unknown = {
  purpose: sensitivePurpose,
  audience: 'Confidential board members',
  targetAction: 'Request a private consultation',
  locale: 'en',
  intent: 'conversion',
  siteName: 'Sensitive Client',
}): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/page-spec', {
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

function validProviderPageSpec() {
  const items = (label: string) => [1, 2, 3].map((index) => ({
    title: `${label} ${index}`,
    body: `${label} body ${index}`,
  }));
  return {
    pageTitle: 'Cross-border counsel',
    pageDescription: 'A focused legal landing page.',
    reasoning: 'Lead with clarity and end with consultation.',
    sections: [
      {
        sectionKind: 'hero',
        headline: 'Clear cross-border guidance',
        subhead: 'Plan the next step.',
        ctaLabel: 'Request consultation',
      },
      {
        sectionKind: 'features',
        headline: 'How we help',
        items: items('Feature'),
      },
      {
        sectionKind: 'testimonials',
        headline: 'Client experience',
        items: items('Client'),
      },
      {
        sectionKind: 'cta',
        headline: 'Discuss your matter',
        subhead: 'Start with a confidential conversation.',
        ctaLabel: 'Request consultation',
      },
    ],
  };
}

function expectSanitized(payload: unknown) {
  const serialized = JSON.stringify(payload);
  expect(serialized).not.toContain('raw-provider-secret');
  expect(serialized).not.toContain(sensitivePurpose);
  expect(serialized).not.toContain(sensitiveKey);
  expect(serialized).not.toContain('Sensitive Client');
}

describe('/api/builder/ai-generator/page-spec production truthfulness', () => {
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
    expect(payload.spec).toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
    expectSanitized(payload);
  });

  it('sanitizes provider non-2xx failures instead of returning deterministic success', async () => {
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
    expect(payload.spec).toBeUndefined();
    expectSanitized(payload);
  });

  it('sanitizes network failures without returning a fallback spec', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(
      new Error(`raw-provider-secret ${sensitivePurpose}`),
    )));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe('ai_content_provider_unavailable');
    expect(payload.ok).toBe(false);
    expect(payload.spec).toBeUndefined();
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
    expect(payload.spec).toBeUndefined();
    expectSanitized(payload);
  });

  it.each([
    ['invalid JSON', 'not-json'],
    ['invalid shape', { sections: [] }],
  ])('fails closed on %s', async (_label, content) => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(content)));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe('ai_content_invalid_response');
    expect(payload.ok).toBe(false);
    expect(payload.spec).toBeUndefined();
    expectSanitized(payload);
  });

  it('rejects a provider page with a missing required section', async () => {
    const content = validProviderPageSpec();
    content.sections = content.sections.slice(0, 3);
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(content)));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe('ai_content_invalid_response');
    expect(payload.ok).toBe(false);
    expect(payload.spec).toBeUndefined();
  });

  it('rejects a provider page whose list section has no promised items', async () => {
    const content = validProviderPageSpec();
    content.sections[1] = { sectionKind: 'features', headline: 'How we help', items: [] };
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(content)));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe('ai_content_invalid_response');
    expect(payload.ok).toBe(false);
    expect(payload.spec).toBeUndefined();
  });

  it('rejects a provider page whose section order differs from the deterministic plan', async () => {
    const content = validProviderPageSpec();
    [content.sections[1], content.sections[2]] = [content.sections[2], content.sections[1]];
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(content)));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe('ai_content_invalid_response');
    expect(payload.ok).toBe(false);
    expect(payload.spec).toBeUndefined();
  });

  it('marks validated provider page specifications as non-stub content', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(validProviderPageSpec())));

    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      source: 'openai',
      stub: false,
      usedFallback: false,
    });
    expect(payload.spec.sections).toHaveLength(4);
    expect(guardMutation).toHaveBeenCalled();
  });
});

describe('/api/builder/ai-generator/page-spec local demo', () => {
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

  it('labels deterministic output and never reports it as provider success', async () => {
    const route = await import('../route');
    const response = await route.POST(request());
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      ok: false,
      error: 'ai_page_spec_local_demo_only',
      source: 'local-demo',
      stub: true,
      usedFallback: true,
    });
    expect(payload.spec.sections.length).toBeGreaterThan(0);
  });
});
