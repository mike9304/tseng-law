import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AiContentGenerationError,
  generateSiteContent,
} from '@/lib/builder/ai-generator/content-generator';
import type { SiteSpec } from '@/lib/builder/ai-generator/site-spec';
import type { SiteBlueprint } from '@/lib/builder/ai-generator/template-selector';

const spec: SiteSpec = {
  industry: 'law',
  companyName: 'Sensitive Client Name',
  slogan: 'Sensitive customer prompt text',
  tone: 'professional',
  colorPreference: 'cool',
  locale: 'en',
};

const palette = {
  primary: '#0f172a',
  secondary: '#1e3a8a',
  accent: '#2563eb',
  background: '#f8fafc',
};

const blueprint: SiteBlueprint = {
  industry: 'law',
  sections: ['hero', 'services'],
  heroHeadlineHint: 'Trusted counsel',
  palettes: {
    cool: palette,
    warm: palette,
    neutral: palette,
    'high-contrast': palette,
    pastel: palette,
  },
};

function providerResponse(content: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify({
    choices: [{ message: { content: typeof content === 'string' ? content : JSON.stringify(content) } }],
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

function expectSanitizedFailure(error: unknown, code: AiContentGenerationError['code']) {
  expect(error).toBeInstanceOf(AiContentGenerationError);
  const typed = error as AiContentGenerationError;
  expect(typed.code).toBe(code);
  expect(typed.message).not.toContain(spec.companyName);
  expect(typed.message).not.toContain(spec.slogan ?? '');
  if (process.env.OPENAI_API_KEY) {
    expect(typed.message).not.toContain(process.env.OPENAI_API_KEY);
  }
  expect(JSON.stringify({ name: typed.name, code: typed.code, message: typed.message }))
    .not.toContain('raw-provider-secret');
}

describe('generateSiteContent production truthfulness', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('OPENAI_API_KEY', '');
    vi.stubEnv('ALLOW_AI_GENERATOR_STUB', '1');
    vi.stubEnv('ALLOW_STUB_PROVIDERS', '1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('rejects a missing key even when stub flags are enabled', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const error = await generateSiteContent(spec, blueprint).catch((caught) => caught);

    expectSanitizedFailure(error, 'ai_content_provider_unconfigured');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects provider non-2xx without exposing the provider body', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-sensitive-key');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      error: { message: 'raw-provider-secret and customer text' },
    }), { status: 429, headers: { 'Content-Type': 'application/json' } })));

    const error = await generateSiteContent(spec, blueprint).catch((caught) => caught);

    expectSanitizedFailure(error, 'ai_content_provider_rejected');
  });

  it.each([
    ['invalid JSON', 'not-json'],
    ['malformed shape', { hero: null, sections: [], metaDescription: 'x' }],
  ])('rejects %s as an invalid provider response', async (_label, content) => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-sensitive-key');
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(content)));

    const error = await generateSiteContent(spec, blueprint).catch((caught) => caught);

    expectSanitizedFailure(error, 'ai_content_invalid_response');
  });

  it.each([
    [
      'empty required strings',
      blueprint,
      {
        hero: { sectionId: 'hero', headline: '', body: '' },
        sections: [{ sectionId: 'services', headline: 'Services', body: 'Body' }],
        metaDescription: '',
      },
    ],
    [
      'missing expected section',
      blueprint,
      {
        hero: { sectionId: 'hero', headline: 'Hero', body: 'Body' },
        sections: [],
        metaDescription: 'Meta',
      },
    ],
    [
      'mismatched section',
      blueprint,
      {
        hero: { sectionId: 'hero', headline: 'Hero', body: 'Body' },
        sections: [{ sectionId: 'about', headline: 'About', body: 'Body' }],
        metaDescription: 'Meta',
      },
    ],
    [
      'duplicate section',
      { ...blueprint, sections: ['hero', 'services', 'about'] } as SiteBlueprint,
      {
        hero: { sectionId: 'hero', headline: 'Hero', body: 'Body' },
        sections: [
          { sectionId: 'services', headline: 'Services', body: 'Body' },
          { sectionId: 'services', headline: 'Services again', body: 'Body' },
        ],
        metaDescription: 'Meta',
      },
    ],
    [
      'out-of-order section',
      { ...blueprint, sections: ['hero', 'services', 'about'] } as SiteBlueprint,
      {
        hero: { sectionId: 'hero', headline: 'Hero', body: 'Body' },
        sections: [
          { sectionId: 'about', headline: 'About', body: 'Body' },
          { sectionId: 'services', headline: 'Services', body: 'Body' },
        ],
        metaDescription: 'Meta',
      },
    ],
    [
      'overlong meta description',
      blueprint,
      {
        hero: { sectionId: 'hero', headline: 'Hero', body: 'Body' },
        sections: [{ sectionId: 'services', headline: 'Services', body: 'Body' }],
        metaDescription: 'm'.repeat(161),
      },
    ],
  ])('rejects semantic provider output with %s', async (_label, contentBlueprint, content) => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-sensitive-key');
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse(content)));

    const error = await generateSiteContent(spec, contentBlueprint).catch((caught) => caught);

    expectSanitizedFailure(error, 'ai_content_invalid_response');
  });

  it('rejects a network failure without leaking its message', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-sensitive-key');
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(
      new Error('raw-provider-secret network failure'),
    )));

    const error = await generateSiteContent(spec, blueprint).catch((caught) => caught);

    expectSanitizedFailure(error, 'ai_content_provider_unavailable');
  });

  it('aborts a hung provider request at the bounded timeout', async () => {
    vi.useFakeTimers();
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-sensitive-key');
    vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => (
      new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        expect(signal).toBeInstanceOf(AbortSignal);
        signal?.addEventListener('abort', () => {
          reject(new DOMException('raw-provider-secret timeout', 'AbortError'));
        }, { once: true });
      })
    )));

    try {
      const pending = generateSiteContent(spec, blueprint).catch((caught) => caught);
      await vi.advanceTimersByTimeAsync(20_000);
      const error = await pending;

      expectSanitizedFailure(error, 'ai_content_provider_unavailable');
    } finally {
      vi.useRealTimers();
    }
  });

  it('marks a validated provider response as real provider content', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'sk-test-sensitive-key');
    vi.stubGlobal('fetch', vi.fn(async () => providerResponse({
      hero: { sectionId: 'hero', headline: 'Trusted counsel', body: 'Provider body.' },
      sections: [{ sectionId: 'services', headline: 'Services', body: 'Provider services.' }],
      metaDescription: 'Provider meta.',
    })));

    const content = await generateSiteContent(spec, blueprint);

    expect(content).toMatchObject({ source: 'openai', stub: false });
  });
});

describe('generateSiteContent nonproduction demo fallback', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('AI_BUILDER_ALLOW_LOCAL_DEMO', 'true');
  });
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('OPENAI_API_KEY', '');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('labels deterministic preview copy as a local demo stub', async () => {
    const content = await generateSiteContent(spec, blueprint);

    expect(content.source).toBe('local-demo');
    expect(content.stub).toBe(true);
    expect(content.hero.headline).toBe(spec.slogan);
  });
});
