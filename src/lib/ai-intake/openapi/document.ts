import { z } from 'zod';
import {
  AI_INTAKE_MCP_REQUIREMENTS_DESCRIPTION,
  AI_INTAKE_MCP_TOOL_NAMES,
} from '@/lib/ai-intake/mcp/constants';
import { getAiIntakePublicOrigin } from '@/lib/ai-intake/mcp/origin';
import { AI_INTAKE_INTAKE_ID_PATTERN } from '@/lib/ai-intake/constants';
import {
  aiIntakeFieldsSchema,
  aiIntakePreviewResponseSchema,
  aiIntakeRequirementsQuerySchema,
  aiIntakeRequirementsResponseSchema,
  aiIntakeSubmitResponseSchema,
  aiIntakeUserApprovedExactPreviewSchema,
  AI_INTAKE_CATEGORIES,
  AI_INTAKE_ERROR_CODES,
  AI_INTAKE_SENSITIVE_KINDS,
} from '@/lib/ai-intake/schemas';
import { siteLocales } from '@/lib/locales';

const SEQUENCE =
  'Required sequence: GET requirements, ask only the bounded questions, POST preview, display the exact returned subject and body, obtain explicit user approval of that exact content and privacy processing, then POST submit. Consumer ChatGPT, Grok, and Gemini are not connected yet.';

const HTTP_PREVIEW_DESCRIPTION =
  'Create a server-owned consultation email preview. Display the exact returned subject and body to the user. Do not submit yet. Delivery is an email to the firm inbox, not a calendar reservation.';

const HTTP_SUBMIT_DESCRIPTION =
  'Send previewed consultation email to the firm inbox. Assert exact preview display and explicit approval (userApprovedExactPreview true; 400 APPROVAL_REQUIRED). Distinct from privacyConsent. Auditable attestation, not cryptographic proof. Consequential; email-only, not a calendar appointment.';

const LOOKAROUND_PATTERN = /\(\?[=!<]/;

const openApiPreviewRequestSchema = aiIntakeFieldsSchema
  .extend({
    idempotencyKey: z.string().trim().uuid(),
  })
  .strict();

const openApiSubmitRequestSchema = aiIntakeFieldsSchema
  .extend({
    idempotencyKey: z.string().trim().uuid(),
    confirmationToken: z.string().min(16).max(2048),
    privacyConsent: z.literal(true).describe(
      'User explicitly consents to privacy processing. Distinct from userApprovedExactPreview. Literal true required; otherwise 400 CONSENT_REQUIRED.',
    ),
    userApprovedExactPreview: aiIntakeUserApprovedExactPreviewSchema,
  })
  .strict();

function sanitizePublicJsonSchema(node: unknown): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const item of node) sanitizePublicJsonSchema(item);
    return;
  }
  const record = node as Record<string, unknown>;
  if (record.format === 'email') {
    delete record.pattern;
    record.type = 'string';
    record.format = 'email';
    record.minLength = 3;
    record.maxLength = 254;
  } else if (typeof record.pattern === 'string' && LOOKAROUND_PATTERN.test(record.pattern)) {
    delete record.pattern;
  }
  for (const value of Object.values(record)) {
    sanitizePublicJsonSchema(value);
  }
}

function jsonSchema(schema: z.ZodType): Record<string, unknown> {
  const converted = z.toJSONSchema(schema) as Record<string, unknown>;
  delete converted.$schema;
  sanitizePublicJsonSchema(converted);
  return converted;
}

const errorBody = {
  type: 'object',
  additionalProperties: false,
  required: ['code', 'message'],
  properties: {
    code: { type: 'string', enum: [...AI_INTAKE_ERROR_CODES] },
    message: { type: 'string', minLength: 1, maxLength: 500 },
    fields: {
      type: 'array',
      maxItems: 16,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'reason'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 64 },
          reason: {
            type: 'string',
            enum: ['required', 'invalid', 'too_short', 'too_long', 'unexpected_field'],
          },
        },
      },
    },
    findings: {
      type: 'array',
      maxItems: 16,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['kind', 'count', 'severity'],
        properties: {
          kind: { type: 'string', enum: [...AI_INTAKE_SENSITIVE_KINDS] },
          count: { type: 'integer', minimum: 1, maximum: 99 },
          severity: { type: 'string', enum: ['reject', 'warning'] },
        },
      },
    },
    retryAfterSeconds: { type: 'integer', minimum: 1, maximum: 86400 },
  },
} as const;

const errorEnvelope = {
  type: 'object',
  additionalProperties: false,
  required: ['ok', 'error'],
  properties: {
    ok: { type: 'boolean', const: false },
    error: errorBody,
  },
} as const;

const deliveryUnknownResponse = {
  type: 'object',
  additionalProperties: false,
  required: ['ok', 'error'],
  properties: {
    ok: { type: 'boolean', const: false },
    error: errorBody,
    intakeId: {
      type: 'string',
      minLength: 11,
      maxLength: 11,
      pattern: AI_INTAKE_INTAKE_ID_PATTERN.source,
    },
    status: { type: 'string', const: 'failed_unknown' },
    duplicate: { type: 'boolean' },
  },
} as const;

function bearerSecurity() {
  return [{ bearerAuth: [] as string[] }];
}

export function buildAiIntakeOpenApiDocument(): Record<string, unknown> {
  const origin = getAiIntakePublicOrigin();
  return {
    openapi: '3.1.0',
    info: {
      title: 'AI consultation email intake',
      version: '1.0.0',
      description: [
        'Provider-neutral HTTP API for a confirmed consultation email to the firm inbox.',
        SEQUENCE,
        'This is not a calendar or booking API. Endpoints require a server-issued Bearer credential.',
        'Consumer ChatGPT Apps, Grok custom MCP, and Gemini function-calling still require deployment, server configuration, a client credential, provider connection, and where applicable platform review or OAuth. They are not already connected.',
      ].join(' '),
    },
    servers: [{ url: origin }],
    security: bearerSecurity(),
    tags: [{ name: 'ai-intake', description: 'Consultation email intake' }],
    paths: {
      '/api/ai/intake/requirements': {
        get: {
          operationId: AI_INTAKE_MCP_TOOL_NAMES[0],
          tags: ['ai-intake'],
          summary: 'Get consultation intake requirements',
          description: AI_INTAKE_MCP_REQUIREMENTS_DESCRIPTION,
          security: bearerSecurity(),
          'x-openai-isConsequential': false,
          parameters: [
            {
              name: 'locale',
              in: 'query',
              required: true,
              schema: { type: 'string', enum: [...siteLocales] },
            },
            {
              name: 'category',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: [...AI_INTAKE_CATEGORIES] },
            },
          ],
          responses: {
            '200': {
              description: 'Localized intake requirements',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/RequirementsResponse' },
                },
              },
            },
            '400': { $ref: '#/components/responses/Error' },
            '401': { $ref: '#/components/responses/Error' },
            '429': { $ref: '#/components/responses/Error' },
            '503': { $ref: '#/components/responses/Error' },
          },
        },
      },
      '/api/ai/intake/preview': {
        post: {
          operationId: AI_INTAKE_MCP_TOOL_NAMES[1],
          tags: ['ai-intake'],
          summary: 'Preview consultation email',
          description: HTTP_PREVIEW_DESCRIPTION,
          security: bearerSecurity(),
          'x-openai-isConsequential': false,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PreviewRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Canonical preview. Display exact subject and body. Do not submit yet.',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PreviewResponse' },
                },
              },
            },
            '400': { $ref: '#/components/responses/Error' },
            '401': { $ref: '#/components/responses/Error' },
            '422': { $ref: '#/components/responses/Error' },
            '429': { $ref: '#/components/responses/Error' },
            '503': { $ref: '#/components/responses/Error' },
          },
        },
      },
      '/api/ai/intake/submit': {
        post: {
          operationId: AI_INTAKE_MCP_TOOL_NAMES[2],
          tags: ['ai-intake'],
          summary: 'Submit consultation email',
          description: HTTP_SUBMIT_DESCRIPTION,
          security: bearerSecurity(),
          'x-openai-isConsequential': true,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SubmitRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Duplicate acknowledged without a second send',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SubmitResponse' },
                },
              },
            },
            '201': {
              description: 'Email accepted for send',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SubmitResponse' },
                },
              },
            },
            '202': {
              description: 'Send already in flight for this idempotency key',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SubmitResponse' },
                },
              },
            },
            '400': { $ref: '#/components/responses/Error' },
            '401': { $ref: '#/components/responses/Error' },
            '409': { $ref: '#/components/responses/Error' },
            '422': { $ref: '#/components/responses/Error' },
            '429': { $ref: '#/components/responses/Error' },
            '502': { $ref: '#/components/responses/DeliveryUnknown' },
            '503': { $ref: '#/components/responses/Error' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Server-issued client credential. No example secret is published.',
        },
      },
      schemas: {
        RequirementsQuery: jsonSchema(aiIntakeRequirementsQuerySchema),
        RequirementsResponse: jsonSchema(aiIntakeRequirementsResponseSchema),
        PreviewRequest: jsonSchema(openApiPreviewRequestSchema),
        PreviewResponse: jsonSchema(aiIntakePreviewResponseSchema),
        SubmitRequest: jsonSchema(openApiSubmitRequestSchema),
        SubmitResponse: jsonSchema(aiIntakeSubmitResponseSchema),
        ErrorEnvelope: errorEnvelope,
        DeliveryUnknownResponse: deliveryUnknownResponse,
      },
      responses: {
        Error: {
          description: 'Bounded error. Messages never include secrets, stacks, or detected values.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorEnvelope' },
            },
          },
        },
        DeliveryUnknown: {
          description: 'Send outcome is unknown. Replay does not send again.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DeliveryUnknownResponse' },
            },
          },
        },
      },
    },
  };
}

export function serializeAiIntakeOpenApiDocument(): string {
  return `${JSON.stringify(buildAiIntakeOpenApiDocument())}\n`;
}
