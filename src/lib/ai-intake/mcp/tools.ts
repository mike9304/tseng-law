import type { AuthInfo, CallToolResult, McpRequestContext, McpServer } from '@modelcontextprotocol/server';
import type { AiIntakeClient } from '@/lib/ai-intake/auth';
import { buildRequirementsPayload } from '@/lib/ai-intake/copy';
import { clientIpFromRequest } from '@/lib/ai-intake/http';
import {
  AI_INTAKE_MCP_PREVIEW_DESCRIPTION,
  AI_INTAKE_MCP_PREVIEW_RESULT_INSTRUCTION,
  AI_INTAKE_MCP_REQUIREMENTS_DESCRIPTION,
  AI_INTAKE_MCP_SUBMIT_DESCRIPTION,
} from '@/lib/ai-intake/mcp/constants';
import { mcpPassThroughInputSchema } from '@/lib/ai-intake/mcp/pass-through-schema';
import {
  aiIntakeMcpPreviewInputSchema,
  aiIntakeMcpRequirementsInputSchema,
  aiIntakeMcpSubmitInputSchema,
} from '@/lib/ai-intake/mcp/schemas';
import { previewAiIntake } from '@/lib/ai-intake/preview';
import { enforceAiIntakeRateLimit, type AiIntakeRateDecision } from '@/lib/ai-intake/rate-limit';
import {
  aiIntakeRequirementsResponseSchema,
  classifyAiIntakeExternalSubmitAttestation,
  stripAiIntakeExternalSubmitRequest,
  type AiIntakeErrorCode,
  type AiIntakeSensitiveFinding,
} from '@/lib/ai-intake/schemas';
import { submitAiIntake } from '@/lib/ai-intake/submit';

type McpAuthExtra = {
  ip?: string;
  limits?: AiIntakeClient['limits'];
};

const GENERIC_TOOL_ERROR = 'Intake is not available.';

function extraFromAuth(authInfo: AuthInfo | undefined): McpAuthExtra {
  const extra = authInfo?.extra;
  if (!extra || typeof extra !== 'object' || Array.isArray(extra)) return {};
  return extra as McpAuthExtra;
}

function clientFromAuth(authInfo: AuthInfo | undefined): AiIntakeClient | null {
  const clientId = authInfo?.clientId?.trim();
  if (!clientId) return null;
  const extra = extraFromAuth(authInfo);
  return {
    clientId,
    keySha256: '0'.repeat(64),
    limits: extra.limits,
  };
}

function ipFromContext(ctx: McpRequestContext): string {
  const extra = extraFromAuth(ctx.authInfo);
  if (typeof extra.ip === 'string' && extra.ip.length > 0 && extra.ip.length <= 64) {
    return extra.ip;
  }
  if (ctx.requestInfo) return clientIpFromRequest(ctx.requestInfo.headers);
  return 'unknown';
}

function toolError(
  code: AiIntakeErrorCode,
  message: string,
  extra?: {
    findings?: AiIntakeSensitiveFinding[];
    retryAfterSeconds?: number;
    intakeId?: string;
    status?: 'failed_unknown';
    duplicate?: boolean;
  },
): CallToolResult {
  const error: Record<string, unknown> = { code, message };
  if (extra?.findings && extra.findings.length > 0) error.findings = extra.findings;
  if (extra?.retryAfterSeconds) error.retryAfterSeconds = extra.retryAfterSeconds;
  const structuredContent: Record<string, unknown> = { ok: false, error };
  if (extra?.intakeId) structuredContent.intakeId = extra.intakeId;
  if (extra?.status) structuredContent.status = extra.status;
  if (extra?.duplicate !== undefined) structuredContent.duplicate = extra.duplicate;
  return {
    isError: true,
    content: [{ type: 'text', text: message }],
    structuredContent,
  };
}

function rateToolError(rate: Extract<AiIntakeRateDecision, { allowed: false }>): CallToolResult {
  if (rate.kind === 'backend_unavailable') {
    return toolError('BACKEND_UNAVAILABLE', 'Rate-limit storage is not available.');
  }
  return toolError('RATE_LIMITED', 'Request limit reached. Retry later.', {
    retryAfterSeconds: rate.retryAfterSeconds,
  });
}

function unexpectedToolError(): CallToolResult {
  return toolError('BACKEND_UNAVAILABLE', GENERIC_TOOL_ERROR);
}

export function registerAiIntakeMcpTools(server: McpServer, ctx: McpRequestContext): void {
  const client = clientFromAuth(ctx.authInfo);
  const ip = ipFromContext(ctx);

  server.registerTool(
    'get_consultation_intake_requirements',
    {
      title: 'Get consultation intake requirements',
      description: AI_INTAKE_MCP_REQUIREMENTS_DESCRIPTION,
      inputSchema: mcpPassThroughInputSchema(aiIntakeMcpRequirementsInputSchema),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (args) => {
      try {
        if (!client) return unexpectedToolError();
        const parsed = aiIntakeMcpRequirementsInputSchema.safeParse(args);
        if (!parsed.success) return toolError('INVALID_REQUEST', 'Request is invalid.');
        const rate = await enforceAiIntakeRateLimit({ scope: 'requirements', client, ip });
        if (!rate.allowed) return rateToolError(rate);
        const built = buildRequirementsPayload(parsed.data.locale, parsed.data.category);
        const payload = aiIntakeRequirementsResponseSchema.safeParse(built);
        if (!payload.success) {
          return toolError('BACKEND_UNAVAILABLE', 'Intake requirements are not available.');
        }
        return {
          content: [{
            type: 'text',
            text: `${payload.data.confirmationInstruction}\n\n${payload.data.questions.join('\n')}`,
          }],
          structuredContent: payload.data,
        };
      } catch {
        return unexpectedToolError();
      }
    },
  );

  server.registerTool(
    'preview_consultation_email',
    {
      title: 'Preview consultation email',
      description: AI_INTAKE_MCP_PREVIEW_DESCRIPTION,
      inputSchema: mcpPassThroughInputSchema(aiIntakeMcpPreviewInputSchema),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (args) => {
      try {
        if (!client) return unexpectedToolError();
        const parsed = aiIntakeMcpPreviewInputSchema.safeParse(args);
        if (!parsed.success) return toolError('INVALID_REQUEST', 'Request is invalid.');
        const rate = await enforceAiIntakeRateLimit({ scope: 'preview', client, ip });
        if (!rate.allowed) return rateToolError(rate);
        const result = previewAiIntake({
          request: parsed.data,
          clientId: client.clientId,
        });
        if (!result.ok) {
          return toolError(result.code, result.message, { findings: result.findings });
        }
        return {
          content: [{
            type: 'text',
            text: [
              AI_INTAKE_MCP_PREVIEW_RESULT_INSTRUCTION,
              '',
              `Subject: ${result.response.subject}`,
              '',
              result.response.body,
            ].join('\n'),
          }],
          structuredContent: result.response,
        };
      } catch {
        return unexpectedToolError();
      }
    },
  );

  server.registerTool(
    'submit_consultation_email',
    {
      title: 'Submit consultation email',
      description: AI_INTAKE_MCP_SUBMIT_DESCRIPTION,
      inputSchema: mcpPassThroughInputSchema(aiIntakeMcpSubmitInputSchema),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (args) => {
      try {
        if (!client) return unexpectedToolError();
        const parsed = aiIntakeMcpSubmitInputSchema.safeParse(args);
        if (!parsed.success) {
          const attestation = classifyAiIntakeExternalSubmitAttestation(args);
          if (attestation === 'CONSENT_REQUIRED') {
            return toolError('CONSENT_REQUIRED', 'Privacy consent is required before submission.');
          }
          if (attestation === 'APPROVAL_REQUIRED') {
            return toolError('APPROVAL_REQUIRED', 'Exact preview approval is required before submission.');
          }
          return toolError('INVALID_REQUEST', 'Request is invalid.');
        }
        const rate = await enforceAiIntakeRateLimit({ scope: 'submit', client, ip });
        if (!rate.allowed) return rateToolError(rate);
        const result = await submitAiIntake({
          request: stripAiIntakeExternalSubmitRequest(parsed.data),
          clientId: client.clientId,
        });
        if (!result.ok) {
          return toolError(result.code, result.message, {
            findings: result.findings,
            intakeId: result.intakeId,
            status: result.deliveryStatus,
            duplicate: result.duplicate,
          });
        }
        return {
          content: [{ type: 'text', text: result.response.message }],
          structuredContent: result.response,
        };
      } catch {
        return unexpectedToolError();
      }
    },
  );
}
