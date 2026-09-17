import { buildCustomRoute } from 'next/dist/server/lib/router-utils/filesystem';
import { NextRequest } from 'next/server';
import { beforeAll, describe, expect, it } from 'vitest';
import { GET as getOpenApi } from '@/app/api/ai/openapi.json/route';
import { withAiIntakeMcpSecurityHeaders } from '@/lib/ai-intake/mcp/http';

type HeaderRule = {
  source: string;
  headers: Array<{ key: string; value: string }>;
};

let rules: HeaderRule[];

beforeAll(async () => {
  const configUrl = new URL('../../../next.config.mjs', import.meta.url).href;
  const { default: config } = await import(configUrl) as {
    default: { headers(): Promise<HeaderRule[]> };
  };
  rules = await config.headers();
});

function effectiveConfigHeaders(pathname: string): Headers {
  const headers = new Headers();
  // Next compiles each custom route and applies matching headers in order;
  // later rules replace earlier values before the route Response is sent.
  for (const rule of rules) {
    if (!buildCustomRoute('header', rule).match(pathname)) continue;
    for (const { key, value } of rule.headers) headers.set(key, value);
  }
  return headers;
}

describe('AI route header precedence', () => {
  it.each(['/api/ai/mcp', '/api/ai/openapi.json'])(
    'applies no-referrer after the global rule for %s',
    (pathname) => {
      const headers = effectiveConfigHeaders(pathname);
      expect(headers.get('referrer-policy')).toBe('no-referrer');
      expect(headers.get('x-content-type-options')).toBe('nosniff');
      expect(headers.get('x-frame-options')).toBe('SAMEORIGIN');
      expect(headers.get('content-security-policy')).toContain("default-src 'self'");
    },
  );

  it.each([
    '/ko', '/en', '/ja', '/zh-hant',
    '/en/login', '/api/ai/intake/requirements',
    '/api/ai/intake/preview', '/api/ai/intake/submit',
    '/api/ai/mcp/tools', '/api/ai/mcp-other',
    '/api/ai/openapi.json/schema', '/api/ai/openapi.json-extra',
  ])('retains the global policy outside the two exact routes: %s', (pathname) => {
    expect(effectiveConfigHeaders(pathname).get('referrer-policy'))
      .toBe('strict-origin-when-cross-origin');
  });

  it('leaves OpenAPI public caching and MCP no-store to their route responses', () => {
    const openApi = getOpenApi(new NextRequest('https://example.test/api/ai/openapi.json'));
    const mcp = withAiIntakeMcpSecurityHeaders(Response.json({ error: 'unavailable' }, { status: 503 }));

    expect(openApi.headers.get('cache-control')).toBe('public, max-age=300, must-revalidate');
    expect(mcp.headers.get('cache-control')).toBe('no-store');
    for (const [pathname, response] of [
      ['/api/ai/openapi.json', openApi],
      ['/api/ai/mcp', mcp],
    ] as const) {
      expect(response.headers.get('referrer-policy')).toBe('no-referrer');
      expect(effectiveConfigHeaders(pathname).has('cache-control')).toBe(false);
      expect(effectiveConfigHeaders(pathname).has('x-robots-tag')).toBe(false);
    }
    expect(effectiveConfigHeaders('/en/login').get('cache-control'))
      .toBe('private, no-store, max-age=0');
  });
});
