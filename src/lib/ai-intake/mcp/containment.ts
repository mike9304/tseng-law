import {
  CLIENT_CAPABILITIES_META_KEY,
  PROTOCOL_VERSION_META_KEY,
  SUPPORTED_PROTOCOL_VERSIONS,
} from '@modelcontextprotocol/server';
import { AI_INTAKE_MCP_TOOL_NAMES } from '@/lib/ai-intake/mcp/constants';
import { mcpJsonRpcError } from '@/lib/ai-intake/mcp/http';

export const AI_INTAKE_MCP_ALLOWED_JSONRPC_METHODS = [
  'initialize',
  'ping',
  'tools/list',
  'tools/call',
  'notifications/initialized',
  'notifications/cancelled',
  'server/discover',
] as const;

const ALLOWED_METHOD_SET = new Set<string>(AI_INTAKE_MCP_ALLOWED_JSONRPC_METHODS);
const ALLOWED_TOOL_SET = new Set<string>(AI_INTAKE_MCP_TOOL_NAMES);
const ALLOWED_LEGACY_PROTOCOL_VERSIONS = new Set<string>(SUPPORTED_PROTOCOL_VERSIONS);

const MCP_PARAM_PREFIX = 'mcp-param-';
const MODERN_PROTOCOL = '2026-07-28';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function invalidRequest(): Response {
  return mcpJsonRpcError(400, -32600, 'Request is invalid.');
}

function methodNotFound(): Response {
  return mcpJsonRpcError(400, -32601, 'Method not found.');
}

function invalidParams(): Response {
  return mcpJsonRpcError(400, -32602, 'Request is invalid.');
}

function headerMismatch(): Response {
  return mcpJsonRpcError(400, -32020, 'Request is invalid.');
}

function jsonRpcMethod(body: unknown): string | undefined {
  if (!isRecord(body)) return undefined;
  return typeof body.method === 'string' ? body.method : undefined;
}

function jsonRpcToolName(body: unknown): string | undefined {
  if (!isRecord(body) || !isRecord(body.params)) return undefined;
  return typeof body.params.name === 'string' ? body.params.name : undefined;
}

function requestMeta(body: unknown): Record<string, unknown> | undefined {
  if (!isRecord(body) || !isRecord(body.params) || !isRecord(body.params._meta)) return undefined;
  return body.params._meta;
}

function bodyProtocolVersionClaim(body: unknown): { present: boolean; value: unknown } {
  const meta = requestMeta(body);
  if (!meta || !(PROTOCOL_VERSION_META_KEY in meta)) {
    return { present: false, value: undefined };
  }
  return { present: true, value: meta[PROTOCOL_VERSION_META_KEY] };
}

function isModernEnvelope(body: unknown, headers: Headers): boolean {
  if (headers.get('mcp-protocol-version') === MODERN_PROTOCOL) return true;
  const claim = bodyProtocolVersionClaim(body);
  return claim.present && claim.value === MODERN_PROTOCOL;
}

function hasMcpParamHeaders(headers: Headers): boolean {
  for (const [name] of headers) {
    if (name.toLowerCase().startsWith(MCP_PARAM_PREFIX)) return true;
  }
  return false;
}

function protocolVersionContainment(request: Request, body: unknown): Response | undefined {
  const headerVersion = request.headers.get('mcp-protocol-version');
  if (headerVersion !== null) {
    const allowedHeader = headerVersion === MODERN_PROTOCOL || ALLOWED_LEGACY_PROTOCOL_VERSIONS.has(headerVersion);
    if (!allowedHeader) return invalidRequest();
  }

  const claim = bodyProtocolVersionClaim(body);
  if (claim.present) {
    if (typeof claim.value !== 'string' || claim.value !== MODERN_PROTOCOL) {
      return invalidRequest();
    }
  }

  if (headerVersion !== null && claim.present && headerVersion !== claim.value) {
    return invalidRequest();
  }

  if (headerVersion === MODERN_PROTOCOL && !claim.present) {
    return invalidRequest();
  }

  if (claim.present) {
    const meta = requestMeta(body);
    if (!meta || !(CLIENT_CAPABILITIES_META_KEY in meta)) {
      return invalidRequest();
    }
  }

  return undefined;
}

/**
 * Intercept SDK-reflected protocol failures before `mcpHandler.fetch`.
 * Error text never includes supplied method, tool, header, version, or property strings.
 */
export function mcpProtocolContainment(request: Request, body: unknown): Response | undefined {
  if (hasMcpParamHeaders(request.headers)) {
    return headerMismatch();
  }

  if (Array.isArray(body) || !isRecord(body)) {
    return invalidRequest();
  }

  const versionError = protocolVersionContainment(request, body);
  if (versionError) return versionError;

  const method = jsonRpcMethod(body);
  if (!method || !ALLOWED_METHOD_SET.has(method)) {
    return methodNotFound();
  }

  const modern = isModernEnvelope(body, request.headers);
  if (method === 'server/discover' && !modern) {
    return invalidRequest();
  }

  const mcpMethod = request.headers.get('mcp-method');
  if (mcpMethod !== null) {
    if (!ALLOWED_METHOD_SET.has(mcpMethod) || mcpMethod !== method) {
      return headerMismatch();
    }
  } else if (modern) {
    return headerMismatch();
  }

  if (method === 'server/discover') {
    if (
      request.headers.get('mcp-protocol-version') !== MODERN_PROTOCOL
      || bodyProtocolVersionClaim(body).value !== MODERN_PROTOCOL
      || mcpMethod !== 'server/discover'
    ) {
      return invalidRequest();
    }
  }

  const mcpName = request.headers.get('mcp-name');
  const toolName = jsonRpcToolName(body);

  if (method === 'tools/call') {
    if (!toolName || !ALLOWED_TOOL_SET.has(toolName)) {
      return invalidParams();
    }
    if (mcpName !== null) {
      if (!ALLOWED_TOOL_SET.has(mcpName) || mcpName !== toolName) {
        return headerMismatch();
      }
    } else if (modern) {
      return headerMismatch();
    }
  } else if (mcpName !== null && !ALLOWED_TOOL_SET.has(mcpName)) {
    return headerMismatch();
  }

  return undefined;
}
