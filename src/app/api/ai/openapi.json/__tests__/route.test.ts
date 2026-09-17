import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AI_INTAKE_MCP_TOOL_NAMES } from '@/lib/ai-intake/mcp/constants';
import { AI_INTAKE_CATEGORIES, AI_INTAKE_SENSITIVE_KINDS } from '@/lib/ai-intake/schemas';
import { siteLocales } from '@/lib/locales';

const FORBIDDEN_INPUT_KEYS = [
  'recipient',
  'to',
  'from',
  'subject',
  'body',
  'transcript',
  'attachment',
  'fileUrl',
  'file_url',
  'booking',
  'calendar',
];

const PREVIEW_PROPERTIES = [
  'name',
  'email',
  'summary',
  'locale',
  'category',
  'phoneOrMessenger',
  'urgency',
  'preferredContact',
  'companyOrOrganization',
  'countryOrResidence',
  'preferredTime',
  'documentsAvailable',
  'idempotencyKey',
] as const;

const SUBMIT_PROPERTIES = [
  ...PREVIEW_PROPERTIES,
  'confirmationToken',
  'privacyConsent',
  'userApprovedExactPreview',
] as const;

const LOOKAROUND = /\(\?[=!<]/;

type OpenApiDoc = {
  openapi: string;
  info: { description: string };
  servers: Array<{ url: string }>;
  security: Array<Record<string, unknown>>;
  paths: Record<string, Record<string, Record<string, unknown>>>;
  components: {
    securitySchemes: Record<string, { type: string; scheme?: string }>;
    schemas: Record<string, {
      properties?: Record<string, Record<string, unknown>>;
      required?: string[];
      additionalProperties?: boolean;
    }>;
    responses: Record<string, { content?: { 'application/json'?: { schema?: { $ref?: string } } } }>;
  };
};

function collectPropertyKeys(node: unknown, keys: Set<string>): void {
  if (!node || typeof node !== 'object') return;
  const record = node as Record<string, unknown>;
  if (record.properties && typeof record.properties === 'object') {
    for (const key of Object.keys(record.properties as Record<string, unknown>)) {
      keys.add(key);
      collectPropertyKeys((record.properties as Record<string, unknown>)[key], keys);
    }
  }
  for (const value of Object.values(record)) {
    if (value && typeof value === 'object') collectPropertyKeys(value, keys);
  }
}

function collectPatterns(node: unknown, patterns: string[]): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) collectPatterns(item, patterns);
    return;
  }
  const record = node as Record<string, unknown>;
  if (typeof record.pattern === 'string') patterns.push(record.pattern);
  for (const value of Object.values(record)) collectPatterns(value, patterns);
}

function assertBoundedCopy(operation: Record<string, unknown>): void {
  expect(typeof operation.summary).toBe('string');
  expect(typeof operation.description).toBe('string');
  expect((operation.summary as string).length).toBeGreaterThan(0);
  expect((operation.summary as string).length).toBeLessThanOrEqual(300);
  expect((operation.description as string).length).toBeGreaterThan(0);
  expect((operation.description as string).length).toBeLessThanOrEqual(300);
}

describe('GET /api/ai/openapi.json', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
    vi.stubEnv('SITE_URL', 'https://example.test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns a deterministic OpenAPI 3.1 contract for the three Phase 1 operations', async () => {
    const { GET } = await import('../route');
    const first = await GET(new NextRequest('http://example.test/api/ai/openapi.json'));
    const second = await GET(new NextRequest('http://example.test/api/ai/openapi.json'));
    expect(first.status).toBe(200);
    expect(first.headers.get('content-type')).toContain('application/json');
    expect(first.headers.get('x-content-type-options')).toBe('nosniff');
    expect(first.headers.get('cache-control')).toMatch(/max-age=300/);
    const text = await first.text();
    expect(await second.text()).toBe(text);

    const document = JSON.parse(text) as OpenApiDoc;

    expect(document.openapi).toBe('3.1.0');
    expect(document.servers).toEqual([{ url: 'https://example.test' }]);
    expect(document.security[0]).toHaveProperty('bearerAuth');
    expect(document.components.securitySchemes.bearerAuth).toMatchObject({
      type: 'http',
      scheme: 'bearer',
    });
    expect(JSON.stringify(document)).not.toMatch(/sk-[A-Za-z0-9]{10,}/);
    expect(JSON.stringify(document)).not.toContain('test-ai-intake-client-key');
    expect(JSON.stringify(document)).not.toContain('AI_INTAKE_HMAC_SECRET');
    expect(JSON.stringify(document)).not.toMatch(/"example"\s*:\s*"[A-Za-z0-9._-]{16,}"/);
    expect(JSON.stringify(document)).toContain('userApprovedExactPreview');

    expect(Object.keys(document.paths)).toEqual([
      '/api/ai/intake/requirements',
      '/api/ai/intake/preview',
      '/api/ai/intake/submit',
    ]);
    const requirements = document.paths['/api/ai/intake/requirements']?.get;
    const preview = document.paths['/api/ai/intake/preview']?.post;
    const submit = document.paths['/api/ai/intake/submit']?.post;
    expect(requirements?.operationId).toBe(AI_INTAKE_MCP_TOOL_NAMES[0]);
    expect(preview?.operationId).toBe(AI_INTAKE_MCP_TOOL_NAMES[1]);
    expect(submit?.operationId).toBe(AI_INTAKE_MCP_TOOL_NAMES[2]);
    expect(requirements?.['x-openai-isConsequential']).toBe(false);
    expect(preview?.['x-openai-isConsequential']).toBe(false);
    expect(submit?.['x-openai-isConsequential']).toBe(true);
    expect(requirements?.security).toEqual([{ bearerAuth: [] }]);
    expect(preview?.security).toEqual([{ bearerAuth: [] }]);
    expect(submit?.security).toEqual([{ bearerAuth: [] }]);
    assertBoundedCopy(requirements ?? {});
    assertBoundedCopy(preview ?? {});
    assertBoundedCopy(submit ?? {});

    expect(document.info.description).toMatch(/GET requirements/i);
    expect(document.info.description).toMatch(/POST preview/i);
    expect(document.info.description).toMatch(/POST submit/i);
    expect(document.info.description).toMatch(/not connected yet/i);

    const joined = JSON.stringify(document.paths);
    expect(joined).toMatch(/display the exact returned subject and body/i);
    expect(joined).toMatch(/privacyConsent/i);
    expect(joined).toContain('userApprovedExactPreview');
    expect(joined).toMatch(/APPROVAL_REQUIRED/);
    expect(joined).toMatch(/attestation/i);
    expect(joined).toMatch(/not cryptographic proof/i);
    expect(joined).not.toMatch(/already connected/i);

    expect(Object.keys(requirements?.responses ?? {}).sort()).toEqual(['200', '400', '401', '429', '503']);
    expect(Object.keys(preview?.responses ?? {}).sort()).toEqual(['200', '400', '401', '422', '429', '503']);
    expect(Object.keys(submit?.responses ?? {}).sort()).toEqual(
      ['200', '201', '202', '400', '401', '409', '422', '429', '502', '503'],
    );
    expect(
      (submit?.responses as Record<string, { $ref?: string }>)['502']?.$ref,
    ).toBe('#/components/responses/DeliveryUnknown');
    expect(
      document.components.responses.DeliveryUnknown?.content?.['application/json']?.schema?.$ref,
    ).toBe('#/components/schemas/DeliveryUnknownResponse');
    expect(
      document.components.responses.Error?.content?.['application/json']?.schema?.$ref,
    ).toBe('#/components/schemas/ErrorEnvelope');

    const previewRequest = document.components.schemas.PreviewRequest;
    const submitRequest = document.components.schemas.SubmitRequest;
    expect(Object.keys(previewRequest.properties ?? {}).sort()).toEqual([...PREVIEW_PROPERTIES].sort());
    expect(Object.keys(submitRequest.properties ?? {}).sort()).toEqual([...SUBMIT_PROPERTIES].sort());
    expect(previewRequest.required?.sort()).toEqual(['email', 'idempotencyKey', 'locale', 'name', 'summary']);
    expect(submitRequest.required?.sort()).toEqual([
      'confirmationToken',
      'email',
      'idempotencyKey',
      'locale',
      'name',
      'privacyConsent',
      'summary',
      'userApprovedExactPreview',
    ]);
    expect(previewRequest.additionalProperties).toBe(false);
    expect(submitRequest.additionalProperties).toBe(false);

    const privacy = submitRequest.properties?.privacyConsent;
    expect(privacy).toMatchObject({ const: true, type: 'boolean' });
    expect(privacy).not.toHaveProperty('default');
    expect(privacy).not.toHaveProperty('nullable');
    expect(JSON.stringify(privacy)).not.toContain('null');
    expect(String(privacy?.description ?? '')).toMatch(/privacy/i);
    expect(String(privacy?.description ?? '')).toMatch(/userApprovedExactPreview/);
    expect(String(privacy?.description ?? '')).toMatch(/CONSENT_REQUIRED/);

    const approval = submitRequest.properties?.userApprovedExactPreview;
    expect(approval).toMatchObject({ const: true, type: 'boolean' });
    expect(approval).not.toHaveProperty('default');
    expect(approval).not.toHaveProperty('nullable');
    expect(JSON.stringify(approval)).not.toContain('null');
    expect(String(approval?.description ?? '')).toMatch(/exact/i);
    expect(String(approval?.description ?? '')).toMatch(/privacyConsent/);
    expect(String(approval?.description ?? '')).toMatch(/attestation/i);
    expect(String(approval?.description ?? '')).toMatch(/not cryptographic proof/i);
    expect(String(approval?.description ?? '')).toMatch(/APPROVAL_REQUIRED/);

    const errorCodeEnum = (
      document.components.schemas.ErrorEnvelope.properties?.error as {
        properties?: { code?: { enum?: string[] } };
      }
    ).properties?.code?.enum;
    expect(errorCodeEnum).toEqual(expect.arrayContaining(['CONSENT_REQUIRED', 'APPROVAL_REQUIRED']));

    const email = previewRequest.properties?.email;
    expect(email).toMatchObject({ type: 'string', format: 'email', minLength: 3, maxLength: 254 });
    expect(email).not.toHaveProperty('pattern');

    const findingsKind = (
      document.components.schemas.ErrorEnvelope.properties?.error as {
        properties?: { findings?: { items?: { properties?: { kind?: { enum?: string[] } } } } };
      }
    ).properties?.findings?.items?.properties?.kind?.enum;
    expect(findingsKind).toEqual([...AI_INTAKE_SENSITIVE_KINDS]);

    const delivery = document.components.schemas.DeliveryUnknownResponse;
    expect(delivery.additionalProperties).toBe(false);
    expect(delivery.properties?.intakeId).toMatchObject({
      type: 'string',
      pattern: '^HC-[A-F0-9]{8}$',
      minLength: 11,
      maxLength: 11,
    });
    expect(document.components.schemas.ErrorEnvelope.properties).not.toHaveProperty('intakeId');
    expect(document.components.schemas.ErrorEnvelope.properties).not.toHaveProperty('duplicate');

    const inputKeys = new Set<string>();
    collectPropertyKeys(document.paths['/api/ai/intake/preview']?.post?.requestBody, inputKeys);
    collectPropertyKeys(document.paths['/api/ai/intake/submit']?.post?.requestBody, inputKeys);
    collectPropertyKeys(document.components.schemas.PreviewRequest, inputKeys);
    collectPropertyKeys(document.components.schemas.SubmitRequest, inputKeys);
    for (const forbidden of FORBIDDEN_INPUT_KEYS) {
      expect(inputKeys.has(forbidden), forbidden).toBe(false);
    }

    const patterns: string[] = [];
    collectPatterns(document.components.schemas.PreviewRequest, patterns);
    collectPatterns(document.components.schemas.SubmitRequest, patterns);
    collectPatterns(document.paths['/api/ai/intake/preview']?.post?.requestBody, patterns);
    collectPatterns(document.paths['/api/ai/intake/submit']?.post?.requestBody, patterns);
    for (const pattern of patterns) {
      expect(pattern).not.toMatch(LOOKAROUND);
    }

    const localeEnum = (document.components.schemas.PreviewRequest.properties as {
      locale: { enum: string[] };
    }).locale.enum;
    expect(localeEnum).toEqual([...siteLocales]);
    const categoryEnum = (document.components.schemas.PreviewRequest.properties as {
      category: { enum: string[] };
    }).category.enum;
    expect(categoryEnum).toEqual([...AI_INTAKE_CATEGORIES]);
  });

  it('ignores a hostile incoming Host header when choosing the public server URL', async () => {
    const { GET } = await import('../route');
    const response = await GET(new NextRequest('http://evil.example/api/ai/openapi.json', {
      method: 'GET',
      headers: { host: 'evil.example' },
    }));
    const document = JSON.parse(await response.text()) as OpenApiDoc;
    expect(document.servers).toEqual([{ url: 'https://example.test' }]);
    expect(JSON.stringify(document)).not.toContain('evil.example');
  });
});
