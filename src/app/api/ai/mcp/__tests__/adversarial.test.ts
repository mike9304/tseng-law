import { createHash } from 'node:crypto';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CLIENT_CAPABILITIES_META_KEY,
  CLIENT_INFO_META_KEY,
  PROTOCOL_VERSION_META_KEY,
} from '@modelcontextprotocol/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { appendConsultationLogLine } from '@/lib/consultation/log-storage';
import {
  authHeaders,
  stubAiIntakeTestEnv,
  TEST_AI_INTAKE_CLIENT_KEY,
  testClientKeySha256,
  validPreviewBody,
} from '@/lib/ai-intake/__tests__/helpers';
import { resetAiIntakeAuthCacheForTests } from '@/lib/ai-intake/auth';
import { AI_INTAKE_MAX_BODY_BYTES } from '@/lib/ai-intake/constants';
import {
  getLastAiIntakeMcpRequestEraForTests,
  resetLastAiIntakeMcpRequestEraForTests,
} from '@/lib/ai-intake/mcp/handler';
import { resetAiIntakeClaimStoreForTests } from '@/lib/ai-intake/store';
import { submitAiIntake } from '@/lib/ai-intake/submit';
import { resetAiIntakeSubmitRateLimiterForTests } from '@/lib/ai-intake/submit-rate-limit';

const sendMail = vi.fn(async () => ({ messageId: 'test-message-id' }));

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail })),
  },
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 10, retryAfterMs: 0 })),
}));

vi.mock('@/lib/consultation/log-storage', () => ({
  appendConsultationLogLine: vi.fn(async () => undefined),
}));

vi.mock('@/lib/ai-intake/submit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/ai-intake/submit')>();
  return {
    ...actual,
    submitAiIntake: vi.fn(actual.submitAiIntake),
  };
});

const MCP_URL = 'http://localhost/api/ai/mcp';
const ACCEPT = 'application/json, text/event-stream';
const MARKER = 'ATTACKER_PII_KEY_9001011234567';
const encoder = new TextEncoder();
const SECOND_KEY = 'second-ai-intake-client-key-do-not-use-live';

const modernMeta = {
  [PROTOCOL_VERSION_META_KEY]: '2026-07-28',
  [CLIENT_INFO_META_KEY]: { name: 'ai-intake-test', version: '1.0.0' },
  [CLIENT_CAPABILITIES_META_KEY]: {},
};

function stubMcpEnv(): void {
  stubAiIntakeTestEnv();
  vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', 'localhost,example.test');
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
  vi.stubEnv('SITE_URL', 'https://example.test');
}

function mcpAuthHeaders(extra?: Record<string, string>): Headers {
  return authHeaders({
    host: 'localhost',
    accept: ACCEPT,
    ...extra,
  });
}

function modernHeaders(method: string, extra?: Record<string, string>): Headers {
  return mcpAuthHeaders({
    'mcp-protocol-version': '2026-07-28',
    'mcp-method': method,
    ...extra,
  });
}

function jsonRpc(id: number, method: string, params: Record<string, unknown> = {}) {
  return { jsonrpc: '2.0', id, method, params };
}

async function parseMcpResponse(response: Response): Promise<{
  status: number;
  headers: Headers;
  payload: Record<string, unknown>;
  raw: string;
}> {
  const raw = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  let payload: Record<string, unknown>;
  if (contentType.includes('text/event-stream')) {
    const data = raw
      .split('\n')
      .filter((line) => line.startsWith('data: '))
      .map((line) => line.slice(6))
      .at(-1);
    payload = JSON.parse(data ?? '{}') as Record<string, unknown>;
  } else {
    payload = JSON.parse(raw) as Record<string, unknown>;
  }
  return { status: response.status, headers: response.headers, payload, raw };
}

async function postMcp(
  body: unknown,
  headers: Headers,
  init?: { duplexBody?: ReadableStream<Uint8Array>; raw?: string },
): Promise<Response> {
  const { POST } = await import('../route');
  if (init?.duplexBody) {
    return POST(new NextRequest(new Request(MCP_URL, {
      method: 'POST',
      headers,
      body: init.duplexBody,
      duplex: 'half',
    } as RequestInit)));
  }
  return POST(new NextRequest(MCP_URL, {
    method: 'POST',
    headers,
    body: init?.raw ?? JSON.stringify(body),
  }));
}

async function modernCall(
  name: string,
  args: Record<string, unknown>,
  extraHeaders?: Record<string, string>,
): Promise<ReturnType<typeof parseMcpResponse>> {
  const response = await postMcp(
    jsonRpc(2, 'tools/call', {
      name,
      arguments: args,
      _meta: modernMeta,
    }),
    modernHeaders('tools/call', { 'mcp-name': name, ...extraHeaders }),
  );
  return parseMcpResponse(response);
}

async function legacyCall(
  name: string,
  args: Record<string, unknown>,
): Promise<ReturnType<typeof parseMcpResponse>> {
  const response = await postMcp(
    jsonRpc(2, 'tools/call', { name, arguments: args }),
    mcpAuthHeaders(),
  );
  return parseMcpResponse(response);
}

function leakScan(raw: string): void {
  expect(raw).not.toContain(TEST_AI_INTAKE_CLIENT_KEY);
  expect(raw).not.toContain(MARKER);
  expect(raw).not.toMatch(/stack/i);
  expect(raw).not.toContain('smtp.example.test');
}

function logsClean(): void {
  const dumped = JSON.stringify([
    vi.mocked(appendConsultationLogLine).mock.calls,
    vi.mocked(checkRateLimit).mock.calls,
  ]);
  expect(dumped).not.toContain(MARKER);
  expect(dumped).not.toContain(TEST_AI_INTAKE_CLIENT_KEY);
}

async function postWithoutReadingOnReject(headers: Headers): Promise<Response> {
  const { POST } = await import('../route');
  const request = new NextRequest(MCP_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(jsonRpc(1, 'tools/list', { _meta: modernMeta, pad: MARKER })),
  });
  expect(request.bodyUsed).toBe(false);
  const response = await POST(request);
  expect(request.bodyUsed).toBe(false);
  return response;
}

function mcpBodyOfSize(bytes: number): string {
  const hangul = '한';
  const make = (pad: string) => JSON.stringify(jsonRpc(1, 'tools/list', {
    _meta: { ...modernMeta, pad },
  }));
  let pad = hangul;
  let raw = make(pad);
  while (encoder.encode(raw).byteLength + 3 <= bytes) {
    pad += hangul;
    raw = make(pad);
  }
  while (encoder.encode(raw).byteLength < bytes) {
    pad += 'x';
    raw = make(pad);
  }
  if (encoder.encode(raw).byteLength !== bytes) {
    throw new Error(`Unable to build MCP body of ${bytes} bytes`);
  }
  return raw;
}

describe('MCP /api/ai/mcp adversarial containment', () => {
  beforeEach(() => {
    stubMcpEnv();
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: 'test-message-id' });
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 10, retryAfterMs: 0 });
    vi.mocked(appendConsultationLogLine).mockClear();
    vi.mocked(submitAiIntake).mockClear();
    resetAiIntakeClaimStoreForTests();
    resetAiIntakeSubmitRateLimiterForTests();
    resetLastAiIntakeMcpRequestEraForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetAiIntakeAuthCacheForTests();
    resetAiIntakeClaimStoreForTests();
    resetAiIntakeSubmitRateLimiterForTests();
    resetLastAiIntakeMcpRequestEraForTests();
  });

  it('does not pull the body stream on auth, Host, or Origin rejection', async () => {
    const unauthResponse = await postWithoutReadingOnReject(new Headers({
      host: 'localhost',
      'content-type': 'application/json',
      accept: ACCEPT,
    }));
    expect(unauthResponse.status).toBe(401);
    leakScan(await unauthResponse.text());

    const hostResponse = await postWithoutReadingOnReject(modernHeaders('tools/list', { host: 'evil.example' }));
    expect(hostResponse.status).toBe(403);
    const hostBody = await hostResponse.text();
    expect(hostBody).not.toContain('evil.example');
    leakScan(hostBody);

    const originResponse = await postWithoutReadingOnReject(
      modernHeaders('tools/list', { origin: `https://${MARKER}.example` }),
    );
    expect(originResponse.status).toBe(403);
    leakScan(await originResponse.text());
    expect(sendMail).not.toHaveBeenCalled();
    expect(checkRateLimit).not.toHaveBeenCalled();
  });

  it.each([
    '@localhost',
    'user@localhost',
    'localhost/path',
    'localhost?x=1',
    'localhost#x',
    'localhost\\path',
    'evil@localhost:3000',
    'localhost:',
    'localhost:abc',
    'localhost:65536',
  ])('rejects parser-confusing Host %s before body, factory, rate, or mail', async (host) => {
    const { POST } = await import('../route');
    const request = new NextRequest(MCP_URL, {
      method: 'POST',
      headers: modernHeaders('tools/list', { host }),
      body: JSON.stringify(jsonRpc(1, 'tools/list', { _meta: modernMeta, pad: MARKER })),
    });
    expect(request.bodyUsed).toBe(false);
    const response = await POST(request);
    expect(response.status).toBe(403);
    expect(request.bodyUsed).toBe(false);
    const raw = await response.text();
    expect(raw).toContain('Host is not allowed.');
    expect(raw).not.toContain(host);
    expect(raw).not.toContain(MARKER);
    leakScan(raw);
    expect(getLastAiIntakeMcpRequestEraForTests()).toBeUndefined();
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it.each([
    'https://@localhost',
    'https://user@localhost',
    'https://localhost/path',
    'https://localhost?x=1',
    'https://localhost#x',
    'https://localhost\\path',
    'ftp://localhost',
    'https://localhost:',
    'https://localhost:abc',
    'https://localhost:65536',
  ])('rejects parser-confusing Origin %s before body, factory, rate, or mail', async (origin) => {
    const { POST } = await import('../route');
    const request = new NextRequest(MCP_URL, {
      method: 'POST',
      headers: modernHeaders('tools/list', { origin }),
      body: JSON.stringify(jsonRpc(1, 'tools/list', { _meta: modernMeta, pad: MARKER })),
    });
    expect(request.bodyUsed).toBe(false);
    const response = await POST(request);
    expect(response.status).toBe(403);
    expect(request.bodyUsed).toBe(false);
    const raw = await response.text();
    expect(raw).toContain('Origin is not allowed.');
    expect(raw).not.toContain(origin);
    expect(raw).not.toContain(MARKER);
    leakScan(raw);
    expect(getLastAiIntakeMcpRequestEraForTests()).toBeUndefined();
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it.each([
    ['http:80', 'http'],
    ['HTTP:80/path', 'http'],
    ['https:443', 'https'],
    ['HtTpS:443/path', 'https'],
    ['ftp:21', 'ftp'],
    ['file:80', 'file'],
    ['ws:80', 'ws'],
    ['wss:443', 'wss'],
    ['data:80', 'data'],
    ['javascript:80', 'javascript'],
    ['mailto:25', 'mailto'],
  ])('does not derive or authorize Host %s from malformed configured origin', async (configured, host) => {
    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', 'localhost');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', configured);
    vi.stubEnv('SITE_URL', configured);
    vi.stubEnv('VERCEL_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    const { POST } = await import('../route');
    const request = new NextRequest(MCP_URL, {
      method: 'POST',
      headers: modernHeaders('tools/list', { host }),
      body: JSON.stringify(jsonRpc(1, 'tools/list', { _meta: modernMeta, pad: MARKER })),
    });
    expect(request.bodyUsed).toBe(false);
    const response = await POST(request);
    expect(response.status).toBe(403);
    expect(request.bodyUsed).toBe(false);
    const raw = await response.text();
    expect(raw).toContain('Host is not allowed.');
    expect(raw).not.toContain(configured);
    expect(raw).not.toContain(MARKER);
    expect(getLastAiIntakeMcpRequestEraForTests()).toBeUndefined();
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(submitAiIntake).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('accepts Host localhost:3000, Origin https://localhost:3000, case-insensitive host, IPv6, and missing Origin', async () => {
    const listed = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list', { host: 'localhost:3000' }),
    ));
    expect(listed.status).toBe(200);

    const originOk = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list', { origin: 'https://localhost:3000' }),
    ));
    expect(originOk.status).toBe(200);

    const caseOk = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list', { host: 'EXAMPLE.TEST' }),
    ));
    expect(caseOk.status).toBe(200);

    const missingOrigin = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list'),
    ));
    expect(missingOrigin.status).toBe(200);

    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', 'localhost,example.test,[::1]');
    const ipv6 = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list', { host: '[::1]:3000', origin: 'https://[::1]:3000' }),
    ));
    expect(ipv6.status).toBe(200);
  });

  it('accepts 32768 UTF-8 bytes and rejects 32769 including a multibyte boundary', async () => {
    const exact = mcpBodyOfSize(AI_INTAKE_MAX_BODY_BYTES);
    expect(encoder.encode(exact).byteLength).toBe(AI_INTAKE_MAX_BODY_BYTES);
    expect(exact).toContain('한');
    const accepted = await parseMcpResponse(await postMcp(
      undefined,
      modernHeaders('tools/list'),
      { raw: exact },
    ));
    expect(accepted.status).toBe(200);
    expect((accepted.payload.result as { resultType?: string }).resultType).toBe('complete');

    const over = mcpBodyOfSize(AI_INTAKE_MAX_BODY_BYTES + 1);
    expect(encoder.encode(over).byteLength).toBe(AI_INTAKE_MAX_BODY_BYTES + 1);
    const rejected = await postMcp(undefined, modernHeaders('tools/list'), { raw: over });
    expect(rejected.status).toBe(413);
    leakScan(await rejected.text());
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejects 413, 415, and malformed JSON before rate-limit or mail', async () => {
    const oversize = await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list'),
      { raw: mcpBodyOfSize(AI_INTAKE_MAX_BODY_BYTES + 1) },
    );
    expect(oversize.status).toBe(413);

    const unsupported = await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list', { 'content-type': 'text/plain' }),
    );
    expect(unsupported.status).toBe(415);

    const malformed = await postMcp(
      undefined,
      modernHeaders('tools/list'),
      { raw: `{"jsonrpc":"2.0","id":1,"method":"tools/list",${MARKER}` },
    );
    expect(malformed.status).toBe(400);
    leakScan(await oversize.text() + await unsupported.text() + await malformed.text());
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('keeps attacker markers out of modern and legacy unknown-key, unknown-tool, and header errors', async () => {
    const extraKey = await modernCall('preview_consultation_email', {
      ...validPreviewBody(),
      [MARKER]: '4111111111111111',
    });
    const extraResult = extraKey.payload.result as {
      isError?: boolean;
      structuredContent: { error: { code: string } };
    };
    expect(extraResult.isError).toBe(true);
    expect(extraResult.structuredContent.error.code).toBe('INVALID_REQUEST');
    leakScan(extraKey.raw);

    const unknownToolModern = await modernCall(`steal_${MARKER}`, { locale: 'en' });
    expect(unknownToolModern.status).toBe(400);
    expect((unknownToolModern.payload.error as { code: number }).code).toBe(-32602);
    leakScan(unknownToolModern.raw);

    const unknownToolLegacy = await legacyCall(`steal_${MARKER}`, { locale: 'en' });
    expect(unknownToolLegacy.status).toBe(400);
    leakScan(unknownToolLegacy.raw);

    const badName = await parseMcpResponse(await postMcp(
      jsonRpc(2, 'tools/call', {
        name: 'preview_consultation_email',
        arguments: validPreviewBody(),
        _meta: modernMeta,
      }),
      modernHeaders('tools/call', { 'mcp-name': MARKER }),
    ));
    expect(badName.status).toBe(400);
    expect((badName.payload.error as { code: number }).code).toBe(-32020);
    leakScan(badName.raw);

    const badMethod = await parseMcpResponse(await postMcp(
      jsonRpc(2, 'tools/call', {
        name: 'preview_consultation_email',
        arguments: validPreviewBody(),
        _meta: modernMeta,
      }),
      modernHeaders(`tools/exfil_${MARKER}`, { 'mcp-name': 'preview_consultation_email' }),
    ));
    expect(badMethod.status).toBe(400);
    expect((badMethod.payload.error as { code: number }).code).toBe(-32020);
    leakScan(badMethod.raw);

    const paramHeader = await parseMcpResponse(await postMcp(
      jsonRpc(2, 'tools/call', {
        name: 'preview_consultation_email',
        arguments: validPreviewBody(),
        _meta: modernMeta,
      }),
      modernHeaders('tools/call', {
        'mcp-name': 'preview_consultation_email',
        [`mcp-param-${MARKER}`]: MARKER,
      }),
    ));
    expect(paramHeader.status).toBe(400);
    leakScan(paramHeader.raw);
    logsClean();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('negotiates modern 2026-07-28 through official server/discover and keeps legacy traffic working', async () => {
    const discovered = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'server/discover', { _meta: modernMeta }),
      modernHeaders('server/discover'),
    ));
    expect(discovered.status).toBe(200);
    expect(discovered.headers.get('content-type')).toContain('application/json');
    const discoverResult = discovered.payload.result as {
      resultType?: string;
      supportedVersions?: string[];
      capabilities?: {
        tools?: { listChanged?: boolean };
        subscriptions?: unknown;
        resources?: unknown;
        prompts?: unknown;
        sampling?: unknown;
      };
    };
    expect(discoverResult.resultType).toBe('complete');
    expect(discoverResult.supportedVersions).toEqual(expect.arrayContaining(['2026-07-28']));
    expect(discoverResult.capabilities?.tools?.listChanged).toBe(false);
    expect(JSON.stringify(discoverResult)).not.toMatch(/"listChanged":true/);
    expect(discoverResult.capabilities).not.toHaveProperty('subscriptions');
    expect(discoverResult.capabilities).not.toHaveProperty('resources');
    expect(discoverResult.capabilities).not.toHaveProperty('prompts');
    expect(discoverResult.capabilities).not.toHaveProperty('sampling');
    expect(getLastAiIntakeMcpRequestEraForTests()).toBe('modern');

    const ping = await parseMcpResponse(await postMcp(
      jsonRpc(3, 'ping', {}),
      mcpAuthHeaders(),
    ));
    expect(ping.status).toBe(200);
    expect(ping.headers.get('content-type')).toContain('text/event-stream');

    const legacyPreview = await legacyCall('preview_consultation_email', validPreviewBody({
      idempotencyKey: 'cccccccc-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    }));
    expect(legacyPreview.status).toBe(200);
    expect(legacyPreview.headers.get('content-type')).toContain('text/event-stream');
    const structured = (legacyPreview.payload.result as {
      structuredContent: { ok: boolean; confirmationToken: string };
    }).structuredContent;
    expect(structured.ok).toBe(true);
    expect(getLastAiIntakeMcpRequestEraForTests()).toBe('legacy');
    expect(sendMail).not.toHaveBeenCalled();

    const initialized = await parseMcpResponse(await postMcp(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'ai-intake-test', version: '1.0.0' },
        },
      },
      mcpAuthHeaders(),
    ));
    expect(initialized.status).toBe(200);

    const legacyHeader = await parseMcpResponse(await postMcp(
      jsonRpc(4, 'tools/list', {}),
      mcpAuthHeaders({ 'mcp-protocol-version': '2025-03-26' }),
    ));
    expect(legacyHeader.status).toBe(200);
    expect(legacyHeader.headers.get('content-type')).toContain('text/event-stream');
    expect(getLastAiIntakeMcpRequestEraForTests()).toBe('legacy');
  });

  it('rejects unsupported protocol versions and claim-less discover without reflection', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const header = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list', { 'mcp-protocol-version': `2029-01-01-${MARKER}` }),
    ));
    expect(header.status).toBe(400);
    expect(header.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });
    leakScan(header.raw);

    const bodyClaim = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', {
        _meta: { ...modernMeta, [PROTOCOL_VERSION_META_KEY]: `2029-01-01-${MARKER}` },
      }),
      modernHeaders('tools/list'),
    ));
    expect(bodyClaim.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });
    leakScan(bodyClaim.raw);

    const mismatch = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      mcpAuthHeaders({
        'mcp-protocol-version': '2025-03-26',
        'mcp-method': 'tools/list',
      }),
    ));
    expect(mismatch.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });
    leakScan(mismatch.raw);

    const nonString = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', {
        _meta: { ...modernMeta, [PROTOCOL_VERSION_META_KEY]: 20260728 },
      }),
      modernHeaders('tools/list'),
    ));
    expect(nonString.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });
    leakScan(nonString.raw);

    const claimlessDiscover = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'server/discover', {}),
      mcpAuthHeaders(),
    ));
    expect(claimlessDiscover.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });
    leakScan(claimlessDiscover.raw);

    const dumped = JSON.stringify([
      errorSpy.mock.calls,
      warnSpy.mock.calls,
      logSpy.mock.calls,
      vi.mocked(appendConsultationLogLine).mock.calls,
    ]);
    expect(dumped).not.toContain(MARKER);
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('returns 405 with security headers for GET and DELETE', async () => {
    const { GET, DELETE } = await import('../route');
    const getResponse = await GET(new NextRequest(MCP_URL, {
      method: 'GET',
      headers: mcpAuthHeaders(),
    }));
    const deleteResponse = await DELETE(new NextRequest(MCP_URL, {
      method: 'DELETE',
      headers: mcpAuthHeaders(),
    }));
    for (const response of [getResponse, deleteResponse]) {
      expect(response.status).toBe(405);
      expect(response.headers.get('cache-control')).toMatch(/no-store/i);
      expect(response.headers.get('x-content-type-options')).toBe('nosniff');
      expect(response.headers.get('allow')).toBe('POST');
      leakScan(await response.text());
    }
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejects missing, false, string, number, and null privacy and approval values', async () => {
    const preview = await modernCall('preview_consultation_email', validPreviewBody({
      idempotencyKey: 'dddddddd-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    }));
    const token = (preview.payload.result as {
      structuredContent: { confirmationToken: string };
    }).structuredContent.confirmationToken;
    const base = {
      ...validPreviewBody({ idempotencyKey: 'dddddddd-bbbb-4ccc-8ddd-eeeeeeeeeeee' }),
      confirmationToken: token,
    };

    for (const privacyConsent of [undefined, false, 'true', 1, null] as const) {
      const body = { ...base, userApprovedExactPreview: true } as Record<string, unknown>;
      if (privacyConsent !== undefined) body.privacyConsent = privacyConsent;
      vi.mocked(submitAiIntake).mockClear();
      const parsed = await modernCall('submit_consultation_email', body);
      const result = parsed.payload.result as {
        isError?: boolean;
        structuredContent: { error: { code: string } };
      };
      expect(result.isError).toBe(true);
      expect(result.structuredContent.error.code).toBe('CONSENT_REQUIRED');
      expect(submitAiIntake).not.toHaveBeenCalled();
      leakScan(parsed.raw);
    }

    for (const userApprovedExactPreview of [undefined, false, 'true', 1, null] as const) {
      const body = { ...base, privacyConsent: true } as Record<string, unknown>;
      if (userApprovedExactPreview !== undefined) body.userApprovedExactPreview = userApprovedExactPreview;
      vi.mocked(submitAiIntake).mockClear();
      const parsed = await modernCall('submit_consultation_email', body);
      const result = parsed.payload.result as {
        isError?: boolean;
        structuredContent: { error: { code: string } };
      };
      expect(result.isError).toBe(true);
      expect(result.structuredContent.error.code).toBe('APPROVAL_REQUIRED');
      expect(submitAiIntake).not.toHaveBeenCalled();
      leakScan(parsed.raw);
    }
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejects a different bearer, token reuse across keys, and input mutation', async () => {
    const secondSha = createHash('sha256').update(SECOND_KEY, 'utf8').digest('hex');
    vi.stubEnv('AI_INTAKE_CLIENTS', JSON.stringify([
      { clientId: 'test-client', keySha256: testClientKeySha256() },
      { clientId: 'second-client', keySha256: secondSha },
    ]));
    resetAiIntakeAuthCacheForTests();

    const preview = await modernCall('preview_consultation_email', validPreviewBody({
      idempotencyKey: 'eeeeeeee-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    }));
    const token = (preview.payload.result as {
      structuredContent: { confirmationToken: string };
    }).structuredContent.confirmationToken;

    const otherBearer = await modernCall('submit_consultation_email', {
      ...validPreviewBody({ idempotencyKey: 'eeeeeeee-bbbb-4ccc-8ddd-eeeeeeeeeeee' }),
      confirmationToken: token,
      privacyConsent: true,
      userApprovedExactPreview: true,
    }, { authorization: `Bearer ${SECOND_KEY}` });
    const otherResult = otherBearer.payload.result as {
      isError?: boolean;
      structuredContent: { error: { code: string } };
    };
    expect(otherResult.isError).toBe(true);
    expect(otherResult.structuredContent.error.code).toBe('TOKEN_INVALID');

    const mutated = await modernCall('submit_consultation_email', {
      ...validPreviewBody({
        idempotencyKey: 'eeeeeeee-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        summary: 'Changed after preview',
      }),
      confirmationToken: token,
      privacyConsent: true,
      userApprovedExactPreview: true,
    });
    const mutatedResult = mutated.payload.result as {
      isError?: boolean;
      structuredContent: { error: { code: string } };
    };
    expect(mutatedResult.isError).toBe(true);
    expect(mutatedResult.structuredContent.error.code).toBe('PREVIEW_MISMATCH');

    const reusedKey = await modernCall('submit_consultation_email', {
      ...validPreviewBody({ idempotencyKey: 'ffffffff-bbbb-4ccc-8ddd-eeeeeeeeeeee' }),
      confirmationToken: token,
      privacyConsent: true,
      userApprovedExactPreview: true,
    });
    const reusedResult = reusedKey.payload.result as {
      isError?: boolean;
      structuredContent: { error: { code: string } };
    };
    expect(reusedResult.isError).toBe(true);
    expect(reusedResult.structuredContent.error.code).toBe('TOKEN_INVALID');
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('sends at most once across modern preview, legacy submit, modern replay, and simultaneous calls', async () => {
    const key = 'aabbccdd-bbbb-4ccc-8ddd-eeeeeeeeeeee';
    const preview = await modernCall('preview_consultation_email', validPreviewBody({
      idempotencyKey: key,
    }));
    const previewed = (preview.payload.result as {
      structuredContent: { confirmationToken: string; subject: string; body: string };
    }).structuredContent;

    const submitBody = {
      ...validPreviewBody({ idempotencyKey: key }),
      confirmationToken: previewed.confirmationToken,
      privacyConsent: true,
      userApprovedExactPreview: true,
    };
    const legacySubmit = await legacyCall('submit_consultation_email', submitBody);
    const first = legacySubmit.payload.result as {
      isError?: boolean;
      structuredContent: { ok: boolean; intakeId: string; duplicate: boolean };
    };
    expect(legacySubmit.headers.get('content-type')).toContain('text/event-stream');
    expect(first.isError).toBeFalsy();
    expect(first.structuredContent.ok).toBe(true);
    expect(sendMail).toHaveBeenCalledTimes(1);

    const replay = await modernCall('submit_consultation_email', submitBody);
    const second = replay.payload.result as {
      structuredContent: { duplicate: boolean; intakeId: string };
    };
    expect(second.structuredContent.duplicate).toBe(true);
    expect(second.structuredContent.intakeId).toBe(first.structuredContent.intakeId);
    expect(sendMail).toHaveBeenCalledTimes(1);

    const simultaneousKey = 'bbccddee-bbbb-4ccc-8ddd-eeeeeeeeeeee';
    const simultaneousPreview = await modernCall('preview_consultation_email', validPreviewBody({
      idempotencyKey: simultaneousKey,
    }));
    const simultaneousToken = (simultaneousPreview.payload.result as {
      structuredContent: { confirmationToken: string };
    }).structuredContent.confirmationToken;
    const simultaneousBody = {
      ...validPreviewBody({ idempotencyKey: simultaneousKey }),
      confirmationToken: simultaneousToken,
      privacyConsent: true,
      userApprovedExactPreview: true,
    };
    sendMail.mockClear();
    const [modernSim, legacySim] = await Promise.all([
      modernCall('submit_consultation_email', simultaneousBody),
      legacyCall('submit_consultation_email', simultaneousBody),
    ]);
    leakScan(modernSim.raw + legacySim.raw);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });
});
