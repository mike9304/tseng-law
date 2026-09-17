import {
  isJsonContentType,
  validateHostHeader,
  validateOriginHeader,
} from '@modelcontextprotocol/server';
import { AI_INTAKE_MAX_BODY_BYTES } from '@/lib/ai-intake/constants';
import { readBoundedJson } from '@/lib/ai-intake/http';

const JSON_RPC_HEADERS = {
  'Content-Type': 'application/json',
} as const;

export function mcpJsonRpcError(
  status: number,
  code: number,
  message: string,
  extraHeaders?: HeadersInit,
): Response {
  return Response.json(
    {
      jsonrpc: '2.0',
      error: { code, message },
      id: null,
    },
    {
      status,
      headers: {
        ...JSON_RPC_HEADERS,
        ...extraHeaders,
      },
    },
  );
}

export function withAiIntakeMcpSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  const cache = headers.get('cache-control');
  if (!cache) {
    headers.set('Cache-Control', 'no-store');
  } else if (!/\bno-store\b/i.test(cache)) {
    headers.set('Cache-Control', `${cache}, no-store`);
  }
  headers.set('X-Content-Type-Options', 'nosniff');
  if (!headers.has('referrer-policy')) {
    headers.set('Referrer-Policy', 'no-referrer');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function mcpUnauthenticatedResponse(): Response {
  return mcpJsonRpcError(401, -32001, 'Authentication is required.', {
    'WWW-Authenticate': 'Bearer',
  });
}

export function mcpConfigUnavailableResponse(): Response {
  return mcpJsonRpcError(503, -32002, 'Service is not configured.');
}

export function mcpMethodNotAllowedResponse(): Response {
  return mcpJsonRpcError(405, -32600, 'Method is not allowed.', {
    Allow: 'POST',
  });
}

function asciiLower(value: string): string {
  let lowered = '';
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    lowered += code >= 65 && code <= 90 ? String.fromCharCode(code + 32) : value[i];
  }
  return lowered;
}

function isNumericPort(value: string): boolean {
  if (!/^[0-9]{1,5}$/.test(value)) return false;
  const port = Number(value);
  return Number.isInteger(port) && port >= 0 && port <= 65_535;
}

function authorityMatchesAllowed(raw: string, allowedHostname: string): boolean {
  const lowered = asciiLower(raw);
  if (lowered === allowedHostname) return true;
  const withPort = `${allowedHostname}:`;
  if (!lowered.startsWith(withPort)) return false;
  return isNumericPort(raw.slice(allowedHostname.length + 1));
}

function isAllowedMcpAuthority(raw: string, allowedHostnames: string[]): boolean {
  if (!raw) return false;
  for (const allowed of allowedHostnames) {
    if (authorityMatchesAllowed(raw, allowed)) return true;
  }
  return false;
}

function isAllowedMcpOrigin(raw: string, allowedHostnames: string[]): boolean {
  const lowered = asciiLower(raw);
  if (lowered.startsWith('https://')) {
    return isAllowedMcpAuthority(raw.slice('https://'.length), allowedHostnames);
  }
  if (lowered.startsWith('http://')) {
    return isAllowedMcpAuthority(raw.slice('http://'.length), allowedHostnames);
  }
  return false;
}

function hostnamesForSdk(allowedHostnames: string[]): string[] {
  const mapped: string[] = [];
  for (const hostname of allowedHostnames) {
    if (!mapped.includes(hostname)) mapped.push(hostname);
    if (hostname.startsWith('[') && hostname.endsWith(']') && hostname.length > 2) {
      const inner = hostname.slice(1, -1);
      if (!mapped.includes(inner)) mapped.push(inner);
    }
  }
  return mapped;
}

/**
 * Closed-world Host/Origin grammar, then official SDK validators.
 * Response bodies never reflect the supplied host or origin values.
 */
export function mcpHostOriginRejection(request: Request, allowedHostnames: string[]): Response | undefined {
  const hostHeader = request.headers.get('host');
  if (hostHeader === null || !isAllowedMcpAuthority(hostHeader, allowedHostnames)) {
    return mcpJsonRpcError(403, -32000, 'Host is not allowed.');
  }

  const originHeader = request.headers.get('origin');
  if (originHeader !== null && originHeader !== '') {
    if (!isAllowedMcpOrigin(originHeader, allowedHostnames)) {
      return mcpJsonRpcError(403, -32000, 'Origin is not allowed.');
    }
  }

  const sdkHostnames = hostnamesForSdk(allowedHostnames);
  const host = validateHostHeader(hostHeader, sdkHostnames);
  if (!host.ok) {
    return mcpJsonRpcError(403, -32000, 'Host is not allowed.');
  }
  const origin = validateOriginHeader(originHeader, sdkHostnames);
  if (!origin.ok) {
    return mcpJsonRpcError(403, -32000, 'Origin is not allowed.');
  }
  return undefined;
}

export async function readMcpJsonRpcBody(request: Request): Promise<
  { ok: true; value: unknown } | { ok: false; response: Response }
> {
  if (!isJsonContentType(request.headers.get('content-type'))) {
    return { ok: false, response: mcpJsonRpcError(415, -32600, 'Unsupported Media Type.') };
  }
  const parsed = await readBoundedJson(request, AI_INTAKE_MAX_BODY_BYTES);
  if (!parsed.ok) {
    if (parsed.reason === 'too_large') {
      return { ok: false, response: mcpJsonRpcError(413, -32600, 'Request is too large.') };
    }
    return { ok: false, response: mcpJsonRpcError(400, -32700, 'Parse error.') };
  }
  return { ok: true, value: parsed.value };
}
