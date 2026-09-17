import { describe, expect, it } from 'vitest';
import {
  CLIENT_CAPABILITIES_META_KEY,
  CLIENT_INFO_META_KEY,
  PROTOCOL_VERSION_META_KEY,
} from '@modelcontextprotocol/server';
import { mcpProtocolContainment } from '../containment';

const MARKER = 'ATTACKER_PII_KEY_9001011234567';
const MCP_URL = 'http://localhost/api/ai/mcp';

const modernMeta = {
  [PROTOCOL_VERSION_META_KEY]: '2026-07-28',
  [CLIENT_INFO_META_KEY]: { name: 'ai-intake-test', version: '1.0.0' },
  [CLIENT_CAPABILITIES_META_KEY]: {},
};

function request(headers: Record<string, string>): Request {
  return new Request(MCP_URL, { method: 'POST', headers });
}

async function readError(response: Response | undefined) {
  expect(response).toBeDefined();
  if (!response) return { status: 0, raw: '', payload: {} as Record<string, unknown> };
  const raw = await response.text();
  expect(raw).not.toContain(MARKER);
  return {
    status: response.status,
    raw,
    payload: JSON.parse(raw) as Record<string, unknown>,
  };
}

describe('mcpProtocolContainment', () => {
  it('rejects unknown tools, methods, and mismatched MCP headers without reflection', async () => {
    const unknownTool = mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2026-07-28',
        'mcp-method': 'tools/call',
        'mcp-name': `steal_${MARKER}`,
      }),
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: { name: `steal_${MARKER}`, arguments: {}, _meta: modernMeta },
      },
    );
    const unknownToolBody = await readError(unknownTool);
    expect(unknownToolBody.status).toBe(400);
    expect((unknownToolBody.payload.error as { code: number }).code).toBe(-32602);

    const badName = mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2026-07-28',
        'mcp-method': 'tools/call',
        'mcp-name': MARKER,
      }),
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'preview_consultation_email',
          arguments: {},
          _meta: modernMeta,
        },
      },
    );
    const badNameBody = await readError(badName);
    expect((badNameBody.payload.error as { code: number }).code).toBe(-32020);

    const badMethod = mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2026-07-28',
        'mcp-method': `tools/exfil_${MARKER}`,
        'mcp-name': 'preview_consultation_email',
      }),
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'preview_consultation_email',
          arguments: {},
          _meta: modernMeta,
        },
      },
    );
    const badMethodBody = await readError(badMethod);
    expect((badMethodBody.payload.error as { code: number }).code).toBe(-32020);

    const unknownMethod = mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2026-07-28',
        'mcp-method': `resources/${MARKER}`,
      }),
      {
        jsonrpc: '2.0',
        id: 2,
        method: `resources/${MARKER}`,
        params: { _meta: modernMeta },
      },
    );
    const unknownMethodBody = await readError(unknownMethod);
    expect((unknownMethodBody.payload.error as { code: number }).code).toBe(-32601);
  });

  it('rejects Mcp-Param headers and allows legitimate list/call envelopes', async () => {
    const param = mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2026-07-28',
        'mcp-method': 'tools/call',
        'mcp-name': 'preview_consultation_email',
        'mcp-param-email': MARKER,
      }),
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'preview_consultation_email',
          arguments: {},
          _meta: modernMeta,
        },
      },
    );
    const paramBody = await readError(param);
    expect((paramBody.payload.error as { code: number }).code).toBe(-32020);

    expect(mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2026-07-28',
        'mcp-method': 'tools/list',
      }),
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: { _meta: modernMeta },
      },
    )).toBeUndefined();

    expect(mcpProtocolContainment(
      request({}),
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26' } },
    )).toBeUndefined();

    expect(mcpProtocolContainment(
      request({}),
      { jsonrpc: '2.0', id: 1, method: 'ping', params: {} },
    )).toBeUndefined();
  });

  it('contains unsupported protocol-version claims without reflection', async () => {
    const header = mcpProtocolContainment(
      request({
        'mcp-protocol-version': `2029-01-01-${MARKER}`,
        'mcp-method': 'tools/list',
      }),
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: { _meta: modernMeta },
      },
    );
    const headerBody = await readError(header);
    expect(headerBody.status).toBe(400);
    expect(headerBody.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });

    const bodyClaim = mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2026-07-28',
        'mcp-method': 'tools/list',
      }),
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {
          _meta: {
            ...modernMeta,
            [PROTOCOL_VERSION_META_KEY]: `2029-01-01-${MARKER}`,
          },
        },
      },
    );
    const bodyClaimError = await readError(bodyClaim);
    expect(bodyClaimError.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });

    const mismatch = mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2025-03-26',
        'mcp-method': 'tools/list',
      }),
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: { _meta: modernMeta },
      },
    );
    const mismatchError = await readError(mismatch);
    expect(mismatchError.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });

    const nonString = mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2026-07-28',
        'mcp-method': 'tools/list',
      }),
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {
          _meta: {
            ...modernMeta,
            [PROTOCOL_VERSION_META_KEY]: { version: MARKER },
          },
        },
      },
    );
    const nonStringError = await readError(nonString);
    expect(nonStringError.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });

    expect(mcpProtocolContainment(
      request({ 'mcp-protocol-version': '2025-03-26' }),
      { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} },
    )).toBeUndefined();
  });

  it('allows genuine modern server/discover and rejects claim-less discover', async () => {
    expect(mcpProtocolContainment(
      request({
        'mcp-protocol-version': '2026-07-28',
        'mcp-method': 'server/discover',
      }),
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'server/discover',
        params: { _meta: modernMeta },
      },
    )).toBeUndefined();

    const claimless = mcpProtocolContainment(
      request({}),
      { jsonrpc: '2.0', id: 1, method: 'server/discover', params: {} },
    );
    const claimlessError = await readError(claimless);
    expect(claimlessError.payload).toEqual({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Request is invalid.' },
      id: null,
    });
  });
});
