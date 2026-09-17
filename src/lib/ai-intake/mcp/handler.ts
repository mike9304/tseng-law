import {
  createMcpHandler,
  McpServer,
  type AuthInfo,
  type McpRequestContext,
} from '@modelcontextprotocol/server';
import { authenticateAiIntakeRequest, type AiIntakeClient } from '@/lib/ai-intake/auth';
import { clientIpFromRequest } from '@/lib/ai-intake/http';
import {
  AI_INTAKE_MCP_SERVER_NAME,
  AI_INTAKE_MCP_SERVER_VERSION,
} from '@/lib/ai-intake/mcp/constants';
import { mcpProtocolContainment } from '@/lib/ai-intake/mcp/containment';
import {
  mcpConfigUnavailableResponse,
  mcpHostOriginRejection,
  mcpMethodNotAllowedResponse,
  mcpUnauthenticatedResponse,
  readMcpJsonRpcBody,
  withAiIntakeMcpSecurityHeaders,
} from '@/lib/ai-intake/mcp/http';
import { getAiIntakeMcpAllowedHostnames } from '@/lib/ai-intake/mcp/origin';
import { registerAiIntakeMcpTools } from '@/lib/ai-intake/mcp/tools';

let lastRequestEraForTests: McpRequestContext['era'] | undefined;

export function getLastAiIntakeMcpRequestEraForTests(): McpRequestContext['era'] | undefined {
  return lastRequestEraForTests;
}

export function resetLastAiIntakeMcpRequestEraForTests(): void {
  lastRequestEraForTests = undefined;
}

function createAiIntakeMcpServer(ctx: McpRequestContext): McpServer {
  lastRequestEraForTests = ctx.era;
  const server = new McpServer({
    name: AI_INTAKE_MCP_SERVER_NAME,
    version: AI_INTAKE_MCP_SERVER_VERSION,
  });
  server.server.registerCapabilities({ tools: { listChanged: false } });
  registerAiIntakeMcpTools(server, ctx);
  return server;
}

const mcpHandler = createMcpHandler(createAiIntakeMcpServer, {
  legacy: 'stateless',
  onerror: () => undefined,
});

function passThroughAuthInfo(client: AiIntakeClient, ip: string): AuthInfo {
  return {
    token: 'redacted',
    clientId: client.clientId,
    scopes: ['ai-intake'],
    extra: { ip, limits: client.limits },
  };
}

export async function serveAiIntakeMcp(request: Request): Promise<Response> {
  try {
    const allowedHostnames = getAiIntakeMcpAllowedHostnames();
    if (!allowedHostnames) {
      return withAiIntakeMcpSecurityHeaders(mcpConfigUnavailableResponse());
    }

    const hostOrigin = mcpHostOriginRejection(request, allowedHostnames);
    if (hostOrigin) return withAiIntakeMcpSecurityHeaders(hostOrigin);

    const auth = authenticateAiIntakeRequest(request.headers);
    if (!auth.ok) {
      if (auth.reason === 'config') {
        return withAiIntakeMcpSecurityHeaders(mcpConfigUnavailableResponse());
      }
      return withAiIntakeMcpSecurityHeaders(mcpUnauthenticatedResponse());
    }

    if (request.method !== 'POST') {
      return withAiIntakeMcpSecurityHeaders(mcpMethodNotAllowedResponse());
    }

    const ip = clientIpFromRequest(request.headers);
    const authInfo = passThroughAuthInfo(auth.client, ip);

    const body = await readMcpJsonRpcBody(request);
    if (!body.ok) return withAiIntakeMcpSecurityHeaders(body.response);

    const contained = mcpProtocolContainment(request, body.value);
    if (contained) return withAiIntakeMcpSecurityHeaders(contained);

    const response = await mcpHandler.fetch(request, {
      parsedBody: body.value,
      authInfo,
    });
    return withAiIntakeMcpSecurityHeaders(response);
  } catch {
    return withAiIntakeMcpSecurityHeaders(
      Response.json(
        {
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Intake is not available.' },
          id: null,
        },
        { status: 503, headers: { 'Content-Type': 'application/json' } },
      ),
    );
  }
}
