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
  validPreviewBody,
} from '@/lib/ai-intake/__tests__/helpers';
import { resetAiIntakeAuthCacheForTests } from '@/lib/ai-intake/auth';
import { AI_INTAKE_MAX_BODY_BYTES } from '@/lib/ai-intake/constants';
import {
  AI_INTAKE_MCP_PREVIEW_DESCRIPTION,
  AI_INTAKE_MCP_PREVIEW_RESULT_INSTRUCTION,
  AI_INTAKE_MCP_SUBMIT_DESCRIPTION,
  AI_INTAKE_MCP_TOOL_NAMES,
} from '@/lib/ai-intake/mcp/constants';
import { resetAiIntakeClaimStoreForTests } from '@/lib/ai-intake/store';
import { submitAiIntake } from '@/lib/ai-intake/submit';
import {
  resetAiIntakeSubmitRateLimiterForTests,
  setAiIntakeSubmitRateLimiterForTests,
} from '@/lib/ai-intake/submit-rate-limit';

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
const encoder = new TextEncoder();

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

function jsonRpc(id: number, method: string, params: Record<string, unknown> = {}) {
  return { jsonrpc: '2.0', id, method, params };
}

async function postMcp(
  body: unknown,
  headers: Headers,
  init?: { duplexBody?: ReadableStream<Uint8Array>; contentLength?: string },
): Promise<Response> {
  const { POST } = await import('../route');
  const requestHeaders = new Headers(headers);
  if (init?.contentLength) requestHeaders.set('content-length', init.contentLength);
  if (init?.duplexBody) {
    return POST(new NextRequest(new Request(MCP_URL, {
      method: 'POST',
      headers: requestHeaders,
      body: init.duplexBody,
      duplex: 'half',
    } as RequestInit)));
  }
  return POST(new NextRequest(MCP_URL, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(body),
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

function leakScan(raw: string): void {
  expect(raw).not.toContain(TEST_AI_INTAKE_CLIENT_KEY);
  expect(raw).not.toMatch(/stack/i);
  expect(raw).not.toContain('smtp.example.test');
  expect(raw).not.toContain('TRACE');
}

describe('POST /api/ai/mcp', () => {
  beforeEach(() => {
    stubMcpEnv();
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: 'test-message-id' });
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 10, retryAfterMs: 0 });
    vi.mocked(appendConsultationLogLine).mockClear();
    vi.mocked(submitAiIntake).mockClear();
    resetAiIntakeClaimStoreForTests();
    resetAiIntakeSubmitRateLimiterForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetAiIntakeAuthCacheForTests();
    resetAiIntakeClaimStoreForTests();
    resetAiIntakeSubmitRateLimiterForTests();
  });

  it('rejects unauthenticated and invalid auth config before tool execution', async () => {
    const { POST } = await import('../route');
    const unauth = await POST(new NextRequest(MCP_URL, {
      method: 'POST',
      headers: {
        host: 'localhost',
        'content-type': 'application/json',
        accept: ACCEPT,
      },
      body: JSON.stringify(jsonRpc(1, 'tools/list', { _meta: modernMeta })),
    }));
    expect(unauth.status).toBe(401);
    expect(unauth.headers.get('www-authenticate')).toBe('Bearer');
    const unauthBody = await unauth.text();
    expect(unauthBody).toContain('Authentication is required.');
    leakScan(unauthBody);
    expect(sendMail).not.toHaveBeenCalled();

    vi.stubEnv('AI_INTAKE_CLIENTS', '');
    resetAiIntakeAuthCacheForTests();
    const config = await POST(new NextRequest(MCP_URL, {
      method: 'POST',
      headers: mcpAuthHeaders(),
      body: JSON.stringify(jsonRpc(1, 'tools/list', { _meta: modernMeta })),
    }));
    expect(config.status).toBe(503);
    leakScan(await config.text());
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejects a wrong Host and a present wrong Origin without reflecting them', async () => {
    const wrongHost = await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list', { host: 'evil.example' }),
    );
    expect(wrongHost.status).toBe(403);
    const hostBody = await wrongHost.text();
    expect(hostBody).toContain('Host is not allowed.');
    expect(hostBody).not.toContain('evil.example');
    leakScan(hostBody);

    const wrongOrigin = await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list', { origin: 'https://evil.example' }),
    );
    expect(wrongOrigin.status).toBe(403);
    const originBody = await wrongOrigin.text();
    expect(originBody).toContain('Origin is not allowed.');
    expect(originBody).not.toContain('evil.example');
    expect(originBody).not.toContain('https://evil.example');
  });

  it('accepts a missing Origin for server-to-server clients', async () => {
    const parsed = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list'),
    ));
    expect(parsed.status).toBe(200);
    const result = parsed.payload.result as { tools: Array<{ name: string }> };
    expect(result.tools.map((tool) => tool.name)).toEqual([...AI_INTAKE_MCP_TOOL_NAMES]);
  });

  it('returns 413 for declared and streaming bodies over 32 KiB before dispatch', async () => {
    const declared = await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list'),
      { contentLength: String(AI_INTAKE_MAX_BODY_BYTES + 1) },
    );
    expect(declared.status).toBe(413);
    const declaredBody = await declared.text();
    expect(declaredBody).toContain('Request is too large.');
    expect(sendMail).not.toHaveBeenCalled();

    const oversize = `{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{"pad":"${'x'.repeat(AI_INTAKE_MAX_BODY_BYTES)}"}}`;
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(oversize));
        controller.close();
      },
    });
    const streaming = await postMcp(undefined, modernHeaders('tools/list'), { duplexBody: stream });
    expect(streaming.status).toBe(413);
    expect(await streaming.text()).toContain('Request is too large.');
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('lists exactly three tools with exact annotations and descriptions', async () => {
    const parsed = await parseMcpResponse(await postMcp(
      jsonRpc(1, 'tools/list', { _meta: modernMeta }),
      modernHeaders('tools/list'),
    ));
    expect(parsed.status).toBe(200);
    expect(parsed.headers.get('cache-control')).toMatch(/no-store/i);
    expect(parsed.headers.get('x-content-type-options')).toBe('nosniff');
    const tools = (parsed.payload.result as {
      tools: Array<{
        name: string;
        description: string;
        annotations: Record<string, boolean>;
        inputSchema: { additionalProperties?: boolean; properties?: Record<string, unknown> };
      }>;
    }).tools;
    expect(tools).toHaveLength(3);
    expect(tools.map((tool) => tool.name)).toEqual([...AI_INTAKE_MCP_TOOL_NAMES]);
    expect(tools[0]?.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
    expect(tools[1]?.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    });
    expect(tools[2]?.annotations).toEqual({
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    });
    expect(tools[1]?.description).toBe(AI_INTAKE_MCP_PREVIEW_DESCRIPTION);
    expect(tools[2]?.description).toBe(AI_INTAKE_MCP_SUBMIT_DESCRIPTION);
    expect(tools[1]?.description).toMatch(/do not submit yet/i);
    expect(tools[2]?.description).toMatch(/explicitly approves that exact subject and body/i);
    expect(tools[0]?.inputSchema.additionalProperties).toBe(false);
    expect(tools[1]?.inputSchema.additionalProperties).toBe(false);
    expect(tools[2]?.inputSchema.additionalProperties).toBe(false);
    expect(tools[2]?.inputSchema.properties).toHaveProperty('userApprovedExactPreview');
    expect(tools[1]?.inputSchema.properties).not.toHaveProperty('userApprovedExactPreview');
  });

  it('returns localized requirements and enforces the requirements rate scope', async () => {
    const ok = await modernCall('get_consultation_intake_requirements', { locale: 'ja', category: 'labor' });
    expect(ok.status).toBe(200);
    const structured = (ok.payload.result as { structuredContent: { locale: string; questions: string[] } }).structuredContent;
    expect(structured.locale).toBe('ja');
    expect(structured.questions.join('\n')).toContain('お名前');
    expect(structured.questions.join('\n')).not.toContain('성함');
    expect(vi.mocked(checkRateLimit).mock.calls.some((call) => String(call[0]).includes('ai-intake:requirements:'))).toBe(true);

    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      retryAfterMs: 4000,
    });
    const throttled = await modernCall('get_consultation_intake_requirements', { locale: 'en' });
    const throttledResult = throttled.payload.result as { isError?: boolean; structuredContent: { error: { code: string } } };
    expect(throttledResult.isError).toBe(true);
    expect(throttledResult.structuredContent.error.code).toBe('RATE_LIMITED');
    leakScan(throttled.raw);
  });

  it('uses the canonical privacy origin and never reflects hostile SITE_URL values', async () => {
    for (const raw of [
      'https://evil-user:leak-pass@hostile.example/secret?q=1#frag',
      'https://@hostile.example',
      'https://2130706433',
      'https:/example.test',
      '//hostile.example',
    ]) {
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', raw);
      vi.stubEnv('SITE_URL', raw);
      const ok = await modernCall('get_consultation_intake_requirements', { locale: 'en' });
      expect(ok.status).toBe(200);
      const structured = (ok.payload.result as { structuredContent: { privacyUrl: string } }).structuredContent;
      expect(structured.privacyUrl).toBe('https://tseng-law.com/en/privacy');
      expect(ok.raw).not.toContain('evil-user');
      expect(ok.raw).not.toContain('leak-pass');
      expect(ok.raw).not.toContain('hostile.example');
      expect(ok.raw).not.toContain('2130706433');
      leakScan(ok.raw);
    }
  });

  it('returns the exact Phase 1 preview and never sends mail', async () => {
    const parsed = await modernCall('preview_consultation_email', validPreviewBody());
    expect(parsed.status).toBe(200);
    const result = parsed.payload.result as {
      isError?: boolean;
      content: Array<{ text: string }>;
      structuredContent: { ok: boolean; subject: string; body: string; confirmationToken: string };
    };
    expect(result.isError).toBeFalsy();
    expect(result.structuredContent.ok).toBe(true);
    expect(result.structuredContent.subject.length).toBeGreaterThan(0);
    expect(result.structuredContent.body).toContain('Jane Doe');
    expect(result.content[0]?.text).toContain(AI_INTAKE_MCP_PREVIEW_RESULT_INSTRUCTION);
    expect(result.content[0]?.text).toContain(result.structuredContent.subject);
    expect(result.content[0]?.text).toContain(result.structuredContent.body);
    expect(sendMail).not.toHaveBeenCalled();
    expect(appendConsultationLogLine).not.toHaveBeenCalled();
  });

  it('rejects absent, false, and string userApprovedExactPreview and non-literal privacy consent', async () => {
    const preview = await modernCall('preview_consultation_email', validPreviewBody());
    const token = (preview.payload.result as { structuredContent: { confirmationToken: string } }).structuredContent.confirmationToken;
    const base = {
      ...validPreviewBody(),
      confirmationToken: token,
      privacyConsent: true,
    };

    for (const userApprovedExactPreview of [undefined, false, 'true', 1, null] as const) {
      const body = { ...base } as Record<string, unknown>;
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

    const stringConsent = await modernCall('submit_consultation_email', {
      ...base,
      userApprovedExactPreview: true,
      privacyConsent: 'true',
    });
    expect((stringConsent.payload.result as { isError?: boolean }).isError).toBe(true);
    expect(
      (stringConsent.payload.result as { structuredContent: { error: { code: string } } }).structuredContent.error.code,
    ).toBe('CONSENT_REQUIRED');
    expect(submitAiIntake).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
    leakScan(stringConsent.raw);
  });

  it('maps consent before approval and strips the attestation before core submit', async () => {
    const preview = await modernCall('preview_consultation_email', validPreviewBody({
      idempotencyKey: 'cccccccc-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    }));
    const token = (preview.payload.result as {
      structuredContent: { confirmationToken: string };
    }).structuredContent.confirmationToken;
    const fields = {
      ...validPreviewBody({ idempotencyKey: 'cccccccc-bbbb-4ccc-8ddd-eeeeeeeeeeee' }),
      confirmationToken: token,
    };

    const consentInvalid = await modernCall('submit_consultation_email', {
      ...fields,
      privacyConsent: false,
      userApprovedExactPreview: true,
    });
    expect(
      (consentInvalid.payload.result as { structuredContent: { error: { code: string } } }).structuredContent.error.code,
    ).toBe('CONSENT_REQUIRED');

    const approvalInvalid = await modernCall('submit_consultation_email', {
      ...fields,
      privacyConsent: true,
      userApprovedExactPreview: 1,
    });
    expect(
      (approvalInvalid.payload.result as { structuredContent: { error: { code: string } } }).structuredContent.error.code,
    ).toBe('APPROVAL_REQUIRED');

    const bothInvalid = await modernCall('submit_consultation_email', fields);
    expect(
      (bothInvalid.payload.result as { structuredContent: { error: { code: string } } }).structuredContent.error.code,
    ).toBe('CONSENT_REQUIRED');
    expect(submitAiIntake).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();

    const bothTrue = await modernCall('submit_consultation_email', {
      ...fields,
      privacyConsent: true,
      userApprovedExactPreview: true,
    });
    expect((bothTrue.payload.result as { isError?: boolean }).isError).toBeFalsy();
    expect(submitAiIntake).toHaveBeenCalledTimes(1);
    const coreRequest = vi.mocked(submitAiIntake).mock.calls[0]?.[0]?.request;
    expect(coreRequest).not.toHaveProperty('userApprovedExactPreview');
    expect(coreRequest?.privacyConsent).toBe(true);
  });

  it('submits once through Phase 1 and never resends on the same key', async () => {
    const preview = await modernCall('preview_consultation_email', validPreviewBody());
    const previewed = (preview.payload.result as {
      structuredContent: { confirmationToken: string; subject: string; body: string };
    }).structuredContent;

    const submitted = await modernCall('submit_consultation_email', {
      ...validPreviewBody(),
      confirmationToken: previewed.confirmationToken,
      privacyConsent: true,
      userApprovedExactPreview: true,
    });
    const first = submitted.payload.result as {
      isError?: boolean;
      structuredContent: { ok: boolean; intakeId: string; duplicate: boolean };
    };
    expect(first.isError).toBeFalsy();
    expect(first.structuredContent.ok).toBe(true);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      subject: previewed.subject,
      text: previewed.body,
    }));

    const replay = await modernCall('submit_consultation_email', {
      ...validPreviewBody(),
      confirmationToken: previewed.confirmationToken,
      privacyConsent: true,
      userApprovedExactPreview: true,
    });
    const second = replay.payload.result as {
      structuredContent: { duplicate: boolean; intakeId: string };
    };
    expect(second.structuredContent.duplicate).toBe(true);
    expect(second.structuredContent.intakeId).toBe(first.structuredContent.intakeId);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it('maps expected Phase 1 errors to bounded isError tool results', async () => {
    const sensitive = await modernCall('preview_consultation_email', validPreviewBody({
      phoneOrMessenger: 'GB82 WEST 1234 5698 7654 32',
    }));
    const sensitiveResult = sensitive.payload.result as {
      isError?: boolean;
      structuredContent: { error: { code: string } };
    };
    expect(sensitiveResult.isError).toBe(true);
    expect(sensitiveResult.structuredContent.error.code).toBe('SENSITIVE_DATA_REJECTED');
    expect(sensitive.raw).not.toContain('GB82');
    expect(sendMail).not.toHaveBeenCalled();

    setAiIntakeSubmitRateLimiterForTests({
      async consume() {
        throw new Error('rate TRACE secret');
      },
    });
    const preview = await modernCall(
      'preview_consultation_email',
      validPreviewBody({ idempotencyKey: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee' }),
    );
    const token = (preview.payload.result as { structuredContent: { confirmationToken: string } }).structuredContent.confirmationToken;
    const failed = await modernCall('submit_consultation_email', {
      ...validPreviewBody({ idempotencyKey: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee' }),
      confirmationToken: token,
      privacyConsent: true,
      userApprovedExactPreview: true,
    });
    const failedResult = failed.payload.result as {
      isError?: boolean;
      structuredContent: { error: { code: string } };
    };
    expect(failedResult.isError).toBe(true);
    expect(failedResult.structuredContent.error.code).toBe('BACKEND_UNAVAILABLE');
    leakScan(failed.raw);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('serves one current 2025 legacy Streamable HTTP path', async () => {
    const response = await postMcp(
      jsonRpc(1, 'tools/list', {}),
      mcpAuthHeaders(),
    );
    const parsed = await parseMcpResponse(response);
    expect(parsed.status).toBe(200);
    expect(parsed.headers.get('content-type')).toContain('text/event-stream');
    const tools = (parsed.payload.result as { tools: Array<{ name: string }> }).tools;
    expect(tools.map((tool) => tool.name)).toEqual([...AI_INTAKE_MCP_TOOL_NAMES]);
  });

  it('fails closed on GET without running tools and keeps security headers', async () => {
    const { GET } = await import('../route');
    const response = await GET(new NextRequest(MCP_URL, {
      method: 'GET',
      headers: mcpAuthHeaders(),
    }));
    expect(response.status).toBe(405);
    expect(response.headers.get('cache-control')).toMatch(/no-store/i);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(sendMail).not.toHaveBeenCalled();
  });
});
